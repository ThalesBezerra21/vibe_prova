"use client";

import { useTransition } from "react";
import { deleteProva } from "../actions";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";

export function DeleteButton({ provaId, provaTitle }: { provaId: number, provaTitle: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    startTransition(async () => {
      await deleteProva(provaId);
      router.refresh();
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <div 
          className="text-muted-foreground hover:text-destructive p-2 rounded-md hover:bg-destructive/10 transition-colors z-10"
          onClick={(e) => e.preventDefault()}
          title="Excluir prova"
          aria-disabled={isPending}
        >
          <Trash2 className="w-4 h-4" />
          <span className="sr-only">Excluir {provaTitle}</span>
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
          <AlertDialogDescription>
            Essa ação não pode ser desfeita. Isso excluirá permanentemente a prova <strong>"{provaTitle}"</strong> e todas as suas questões do banco de dados.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            className="bg-destructive text-white hover:bg-destructive/90 cursor-pointer"
          >
            {isPending ? "Excluindo..." : "Sim, excluir prova"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
