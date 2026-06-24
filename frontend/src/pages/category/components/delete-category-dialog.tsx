import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMutation } from "@apollo/client/react";
import { toast } from "sonner";
import type { Category } from "@/types/category";
import { DELETE_CATEGORY_MUTATION } from "@/lib/graphql/mutations/category";

type DeleteCategoryDialogProps = Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category;
  onSuccess?: () => void;
}>;

export function DeleteCategoryDialog({
  open,
  onOpenChange,
  category,
  onSuccess,
}: DeleteCategoryDialogProps) {
  const [deleteCategory, { loading }] = useMutation(DELETE_CATEGORY_MUTATION, {
    onCompleted: () => {
      toast.success("Categoria removida com sucesso!");
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error) => {
      toast.error("Erro ao remover categoria: " + error.message);
    },
  });

  const handleDelete = () => {
    void deleteCategory({
      variables: {
        deleteCategoryId: category.id,
      },
    });
  };

  const handleDialogOpenChange = (nextOpen: boolean) => {
    if (loading) {
      return;
    }

    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent className="border border-gray-200 bg-white">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-gray-800">Remover categoria</DialogTitle>
          <DialogDescription className="text-gray-600 text-sm">
            Tem certeza que deseja remover a categoria "{category.name}"?
            <br />
            Essa ação não poderá ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={loading}>
              Cancelar
            </Button>
          </DialogClose>
          <Button
            type="button"
            className="bg-red-base text-white hover:bg-red-dark"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Removendo..." : "Remover"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}