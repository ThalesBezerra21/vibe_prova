"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getQuestions } from "@/app/actions";
import { CheckCircle2, BookmarkPlus } from "lucide-react";

export function QuestionPicker({ onSelect }: { onSelect: (q: any) => void }) {
  const [open, setOpen] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);

  useEffect(() => {
    if (open) {
      getQuestions().then((data) => setQuestions(data));
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
         <button type="button" className="inline-flex flex-1 items-center justify-center rounded-md border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 text-sm font-medium transition-colors">
            <BookmarkPlus className="w-4 h-4 mr-2" />
            Adicionar do Banco
         </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Selecione a Questão</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {questions.length === 0 ? (
            <p className="text-muted-foreground text-center">Nenhuma questão salva encontrada.</p>
          ) : (
            questions.map(q => (
               <div key={q.id} className="p-4 border rounded-xl hover:border-primary cursor-pointer transition-colors" onClick={() => {
                   // Adapt the question payload to fit ProvaForm array
                   onSelect({
                       id: q.id,
                       enunciado: q.enunciado,
                       correctOptionId: q.correctOptionId,
                       options: q.options.map((o: any) => ({ uid: o.id, text: o.text }))
                   });
                   setOpen(false);
               }}>
                  <h4 className="font-medium mb-2">{q.enunciado}</h4>
                  <div className="text-sm text-muted-foreground">
                      {q.options.length} alternativas
                  </div>
               </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
