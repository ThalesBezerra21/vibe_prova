"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileDown, Loader2 } from "lucide-react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { pdf, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 12,
    lineHeight: 1.5,
  },
  header: {
    marginBottom: 20,
    borderBottomText: 1,
    borderBottomColor: '#000',
    paddingBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  infoField: {
    marginBottom: 5,
  },
  questionContainer: {
    marginBottom: 15,
  },
  enunciado: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  instruction: {
    fontStyle: 'italic',
    fontSize: 10,
    marginBottom: 5,
    color: '#444'
  },
  option: {
    marginLeft: 15,
    marginBottom: 3,
  },
  sumSpace: {
    marginTop: 5,
    marginLeft: 15,
    padding: 5,
    borderWidth: 1,
    borderColor: '#000',
    width: 100,
    textAlign: 'center'
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 10,
    color: 'grey',
  },
  studentInfo: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 20,
  },
  studentField: {
    marginBottom: 10,
  }
});

const shuffleArray = <T,>(array: T[]) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const ProvaPDF = ({
  provaNum,
  questions,
  disciplina,
  professor,
  data,
  titulo
}: any) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>{titulo}</Text>
        <Text style={styles.infoField}>Disciplina: {disciplina}</Text>
        <Text style={styles.infoField}>Professor: {professor}</Text>
        <Text style={styles.infoField}>Data: {data}</Text>
      </View>

      <View style={styles.studentInfo} wrap={false}>
        <Text style={styles.studentField}>Nome: _______________________________________________________</Text>
        <Text style={styles.studentField}>CPF: _________________________________</Text>
      </View>

      {questions.map((q: any, qIdx: number) => {
        let instruction = "Marque uma única alternativa.";
        if (q.type === 'multiple_choice') instruction = "Escreva as letras corretas abaixo.";
        if (q.type === 'sum_choice') instruction = "Insira a soma das alternativas corretas abaixo.";

        return (
          <View key={q.id} style={styles.questionContainer} wrap={false}>
            <Text style={styles.enunciado}>{qIdx + 1}. {q.enunciado}</Text>
            <Text style={styles.instruction}>{instruction}</Text>
            {q.shuffledOptions.map((opt: any, optIdx: number) => {
              const marker = q.type === 'sum_choice' 
                ? `[ ${String(Math.pow(2, optIdx)).padStart(2, '0')} ]` 
                : `( ${String.fromCharCode(65 + optIdx)} )`;
              return (
                <Text key={opt.id} style={styles.option}>
                  {marker} {opt.text}
                </Text>
              )
            })}
            {q.type === 'sum_choice' && <Text style={styles.sumSpace}>SOMA: ______</Text>}
            {q.type === 'multiple_choice' && <Text style={styles.sumSpace}>LETRAS: ______</Text>}
          </View>
        );
      })}

      <Text style={styles.footer} fixed>
        Prova Nº {provaNum} - Página {'\u00A0'}
      </Text>
    </Page>
  </Document>
);

export function PDFGenerator({ provaData }: { provaData: any }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [numProvas, setNumProvas] = useState(1);
  const [disciplina, setDisciplina] = useState("");
  const [professor, setProfessor] = useState("");
  const [dataStr, setDataStr] = useState(new Date().toLocaleDateString("pt-BR"));

  const generate = async () => {
    setLoading(true);
    try {
      const zip = new JSZip();
      let headers = ["Prova", ...provaData.questions.map((_: any, i: number) => "Q" + (i + 1))].join(",");
      let csvLines = [headers];

      for (let i = 1; i <= numProvas; i++) {
        // Shuffle questions
        const shuffledQuestions = shuffleArray(provaData.questions).map( (q: any) => {
          // Shuffle options
          const shuffledOpts = shuffleArray(q.options);
          return {
            ...q,
            shuffledOptions: shuffledOpts
          };
        });

        // Compute gabarito
        let testGabarito = [i.toString()];

        shuffledQuestions.forEach( (q: any, qIdx: number) => {
          let expected = "";
          const correctAnswerIds = q.correctOptionId.split(',');

          if (q.type === 'sum_choice') {
            let sum = 0;
            q.shuffledOptions.forEach( (opt: any, optIdx: number) => {
              if (correctAnswerIds.includes(opt.id)) {
                sum += Math.pow(2, optIdx);
              }
            });
            expected = sum.toString();
          } else {
            const correctLetters: string[] = [];
            q.shuffledOptions.forEach( (opt: any, optIdx: number) => {
              if (correctAnswerIds.includes(opt.id)) {
                correctLetters.push(String.fromCharCode(65 + optIdx));
              }
            });
            expected = correctLetters.join('-');
          }
          testGabarito.push(expected);
        });
        
        csvLines.push(testGabarito.join(','));

        const doc = (
          <ProvaPDF 
            provaNum={i}
            questions={shuffledQuestions}
            disciplina={disciplina}
            professor={professor}
            data={dataStr}
            titulo={provaData.title}
          />
        );

        const blob = await pdf(doc).toBlob();
        zip.file(`Prova_${i}.pdf`, blob);
      }

      zip.file("Gabarito.csv", csvLines.join("\n"));
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `Provas_${provaData.title}.zip`);
      setOpen(false);
    } catch (e) {
      console.error(e);
      alert("Erro ao gerar provas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" />}><FileDown className="mr-2 h-4 w-4" /> Gerar PDFs</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configurar Impressão de Provas</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Número de cópias individuais</Label>
            <Input 
              type="number" 
              min={1} 
              max={100}
              value={numProvas} 
              onChange={(e) => setNumProvas(Number(e.target.value))} 
            />
          </div>
          <div className="space-y-2">
            <Label>Disciplina</Label>
            <Input 
              placeholder="Ex: Matemática" 
              value={disciplina} 
              onChange={(e) => setDisciplina(e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <Label>Professor(a)</Label>
            <Input 
              placeholder="Nome do professor" 
              value={professor} 
              onChange={(e) => setProfessor(e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <Label>Data</Label>
            <Input 
              placeholder="Ex: 22/10/2023" 
              value={dataStr} 
              onChange={(e) => setDataStr(e.target.value)} 
            />
          </div>
          <Button onClick={generate} disabled={loading || !numProvas} className="w-full">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileDown className="mr-2 h-4 w-4" />}
            Gerar {numProvas} PDFs + Gabarito (ZIP)
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
