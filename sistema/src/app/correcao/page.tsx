"use client";

import { useState } from "react";
import Papa from "papaparse";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileDown, CheckCircle2 } from "lucide-react";
import { saveAs } from "file-saver";
import { toast } from "sonner";

export default function CorrecaoPage() {
  const [gabaritoFile, setGabaritoFile] = useState<File | null>(null);
  const [respostasFile, setRespostasFile] = useState<File | null>(null);
  const [rigor, setRigor] = useState<"strict" | "partial">("strict");
  
  const [report, setReport] = useState<any[]>([]);

  const handleCorrect = async () => {
    if (!gabaritoFile || !respostasFile) {
      toast.error("Por favor, selecione ambos os arquivos CSV.");
      return;
    }

    try {
      console.log("Iniciando conversão CSV...");
      
      const textGabarito = (await gabaritoFile.text()).trim();
      const textRespostas = (await respostasFile.text()).trim();

      const parseOptions = {
        header: true,
        skipEmptyLines: "greedy" as const,
        transformHeader: (header: string) => header.trim().replace(/^\uFEFF/gm, "").replace(/^\u00BB\u00BF/gm, "")
      };

      console.log("Raw respostas text:", textRespostas);

      // Tenta detectar o delimitador baseando-se no primeiro caractere de quebra
      const isSemicolonG = textGabarito.split('\n')[0].includes(';');
      const isSemicolonR = textRespostas.split('\n')[0].includes(';');

      const gabaritoResults = Papa.parse(textGabarito, {
        ...parseOptions,
        delimiter: isSemicolonG ? ";" : ","
      });
      console.log("Gabaritos parseados:", gabaritoResults.data);

      const respostasResults = Papa.parse(textRespostas, {
        ...parseOptions,
        delimiter: isSemicolonR ? ";" : ","
      });
      console.log("Respostas parseadas:", respostasResults.data);

      if (gabaritoResults.errors.length > 0) console.warn("Erros no gabarito:", gabaritoResults.errors);
      if (respostasResults.errors.length > 0) console.warn("Erros nas respostas:", respostasResults.errors);

      processCorrections(gabaritoResults.data, respostasResults.data);
    } catch (err) {
      console.error("Erro ao ler ou parsear os arquivos", err);
      toast.error("Erro inesperado ao ler os arquivos.");
    }
  };

  const processCorrections = (gabaritoData: any[], respostasData: any[]) => {
    // Map gabarito by Prova number
    const gabaritoMap: Record<string, any> = {};
    for (const row of gabaritoData) {
      const provaIdStr = row.Prova?.toString().trim();
      if (provaIdStr) {
        gabaritoMap[provaIdStr] = row;
      }
    }
    
    console.log("Mapa do Gabarito construído:", Object.keys(gabaritoMap));

    const calculatedReport = [];

    for (const alunoRow of respostasData) {
      const provaNumStr = alunoRow.Prova?.toString().trim();
      console.log("Processando aluno:", alunoRow, "Prova Identificada:", provaNumStr);
      
      if (!provaNumStr) {
         console.warn("Aluno ignorado, sem número de prova.");
         continue;
      }
      if (!gabaritoMap[provaNumStr]) {
         console.warn("Aluno ignorado, gabarito não encontrado para a prova:", provaNumStr);
         continue;
      }

      const gabRow = gabaritoMap[provaNumStr];
      
      let totalQuestions = 0;
      let totalScore = 0;

      // Iterate through keys that start with "Q"
      for (const key of Object.keys(gabRow)) {
        if (key.match(/^Q\d+$/i)) {
          totalQuestions++;
          const gabAns = (gabRow[key] || "").toString().trim();
          const pAns = (alunoRow[key] || "").toString().trim();

          // Calculate correct decisions
          const score = calculateScore(gabAns, pAns, rigor);
          totalScore += score;
        }
      }

      calculatedReport.push({
        Nome: alunoRow.Nome || alunoRow.Aluno || "Desconhecido",
        Prova: provaNumStr,
        Acertos: totalScore.toFixed(2),
        TotalQuestion: totalQuestions,
        Nota: totalQuestions > 0 ? ((totalScore / totalQuestions) * 10).toFixed(2) : 0
      });
    }
    
    console.log("Relatório final gerado:", calculatedReport);
    
    if (calculatedReport.length === 0) {
      toast.error("Nenhuma correção gerada. Verifique se o formato dos arquivos está correto e se compartilham as mesmas provas.");
    } else {
      toast.success("Correção de provas realizada com sucesso!");
    }

    setReport(calculatedReport);
  };

  const parseSum = (val: string) => {
    const num = parseInt(val, 10);
    const set = new Set<number>();
    if (isNaN(num)) return set;
    for (let i = 0; i < 20; i++) {
        if ((num & (1 << i)) !== 0) {
            set.add(i);
        }
    }
    return set;
  };

  const parseLetters = (val: string) => {
    const set = new Set<number>();
    const matches = val.toUpperCase().match(/[A-Z]/g);
    if (!matches) return set;
    for (const char of matches) {
      set.add(char.charCodeAt(0) - 65);
    }
    return set;
  };

  const calculateScore = (gabaritoStr: string, respStr: string, mode: "strict" | "partial") => {
    const isSum = /^\d+$/.test(gabaritoStr);

    let gSet: Set<number>;
    let rSet: Set<number>;

    if (isSum) {
        gSet = parseSum(gabaritoStr);
        rSet = parseSum(respStr);
    } else {
        gSet = parseLetters(gabaritoStr);
        rSet = parseLetters(respStr);
    }

    if (gSet.size === 0) return 0;

    if (mode === "strict") {
        // Must match exactly
        if (gSet.size !== rSet.size) return 0;
        for (const item of gSet) {
           if (!rSet.has(item)) return 0;
        }
        return 1;
    } else {
        // Partial (proportional)
        let correctDecisions = 0;
        let incorrectDecisions = 0;
        for (const ans of rSet) {
            if (gSet.has(ans)) {
                correctDecisions++;
            } else {
                incorrectDecisions++;
            }
        }
        
        // Evitar pontuar quem marcou todas as opções, subtraindo os erros, mas limitado a 0 no mínimo
        const partialScore = (correctDecisions - incorrectDecisions) / gSet.size;
        return Math.max(0, partialScore);
    }
  };

  const downloadReport = () => {
    const csv = Papa.unparse(report);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "Relatorio_Notas.csv");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 pt-8">
      <Link href=".." className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
        <ChevronLeft className="mr-1 h-4 w-4" />
        Voltar para a Prova
      </Link>
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">Correção de Provas</h1>
        <p className="text-xl text-muted-foreground">Envie o gabarito do sistema e as respostas dos alunos para gerar o relatório de notas.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-card p-6 border rounded-xl shadow-sm">
        <div className="space-y-4">
            <div>
              <Label>CSV de Gabaritos (Gerado pelo sistema)</Label>
              <Input type="file" accept=".csv" onChange={(e) => setGabaritoFile(e.target.files?.[0] || null)} className="mt-2" />
            </div>

            <div>
              <Label>CSV de Respostas dos Alunos</Label>
              <Input type="file" accept=".csv" onChange={(e) => setRespostasFile(e.target.files?.[0] || null)} className="mt-2" />
              <span className="text-xs text-muted-foreground">Colunas necessárias: Nome, Prova, Q1, Q2, Q3...</span>
            </div>
        </div>

        <div className="space-y-4">
            <div>
                <Label>Rigor da Correção</Label>
                <select 
                    value={rigor}
                    onChange={(e) => setRigor(e.target.value as any)}
                    className="flex h-10 w-full mt-2 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                    <option value="strict">Mais Rigorosa (Erro zera a questão inteira)</option>
                    <option value="partial">Menos Rigorosa (Nota proporcional aos acertos das alternativas)</option>
                </select>
            </div>

            <Button onClick={handleCorrect} className="w-full mt-4 h-10">
              <CheckCircle2 className="mr-2 h-4 w-4" /> Corrigir Provas
            </Button>
        </div>
      </div>

      {report.length > 0 && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
                <h2 className="text-2xl font-bold tracking-tight">Resultados</h2>
                <Button variant="outline" onClick={downloadReport}>
                    <FileDown className="mr-2 h-4 w-4" /> Baixar Resultados
                </Button>
            </div>
            <div className="border rounded-md overflow-hidden bg-background">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted text-muted-foreground uppercase text-xs">
                  <tr>
                    <th className="py-3 px-4">Aluno</th>
                    <th className="py-3 px-4">Prova Nº</th>
                    <th className="py-3 px-4 text-center">Acertos</th>
                    <th className="py-3 px-4 text-center">Nota (0 - 10)</th>
                  </tr>
                </thead>
                <tbody>
                  {report.map((row, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="py-3 px-4 font-medium">{row.Nome}</td>
                      <td className="py-3 px-4">{row.Prova}</td>
                      <td className="py-3 px-4 text-center">{row.Acertos} / {row.TotalQuestion}</td>
                      <td className="py-3 px-4 text-center font-bold">{row.Nota}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
      )}
    </div>
  );
}