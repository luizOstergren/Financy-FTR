import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRef, useState } from "react";

import { IconButton } from "@/pages/category/components/icon-button";
import { Button } from "@/components/ui/button";
import { useMutation } from "@apollo/client/react";
import { CREATE_CATEGORY_MUTATION } from "@/lib/graphql/mutations/category";
import { toast } from "sonner";
import { CategoriesButton } from "./categories-button";
import { COLOR_OPTIONS } from "./category-form-options";
import { ICON_MAP } from "@/types/icon-options";

type CreateCategoryDialogProps = Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}>;

export function CreateCategoryDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateCategoryDialogProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("");
  const [color, setColor] = useState("");

  const clearForm = () => {
    setName("");
    setDescription("");
    setIcon("");
    setColor("");
  };

  const [createCategory, { loading }] = useMutation(CREATE_CATEGORY_MUTATION, {
    onCompleted: () => {
      clearForm();
      toast.success("Categoria criada com sucesso!");
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error) => {
      toast.error("Erro ao criar categoria: " + error.message);
    },
  });

  const canSubmit =
    name.trim() !== "" && icon !== "" && color !== "" && !loading;

  const handleIconSelect = (selectedIcon: string) => {
    setIcon(selectedIcon);
  };

  const handleColorSelect = (selectedColor: string) => {
    setColor(selectedColor);
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (!canSubmit) {
      return;
    }

    const normalizedName = name.trim();
    const normalizedDescription = description.trim();

    void createCategory({
      variables: {
        data: {
          name: normalizedName,
          description: normalizedDescription,
          icon,
          color,
        },
      },
    });
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    if (!canSubmit) return;
    formRef.current?.requestSubmit();
  };

  const handleDialogOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);

    if (!nextOpen) {
      clearForm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent className="border border-gray-200 bg-white">
        <DialogHeader className="mb-6">
          <div className="flex flex-col gap-0.5">
            <DialogTitle className="text-gray-800">Nova categoria</DialogTitle>
            <DialogDescription className="text-gray-600 text-sm">
              Organize suas transações com categorias
            </DialogDescription>
          </div>
        </DialogHeader>
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="flex flex-col gap-6"
        >
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-gray-600">
              Título
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Ex. Alimentação"
              className="border-gray-200  px-4 py-6"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleInputKeyDown}
              required
              disabled={loading}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description" className="text-gray-600">
              Descrição
            </Label>
            <Input
              id="description"
              type="text"
              placeholder="Descrição da categoria"
              className="border-gray-200  px-4 py-6"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={handleInputKeyDown}
              disabled={loading}
            />
            <span className="text-xs text-gray-500">Opcional</span>
          </div>
          <div className="grid gap-2">
            <Label className="text-gray-600">Ícone</Label>
            <div
              className={`flex flex-wrap gap-3 justify-between ${loading ? "pointer-events-none opacity-50" : ""}`}
            >
              {Object.entries(ICON_MAP).map(([name, Icon]) => (
                <IconButton
                  key={name}
                  icon={<Icon className="w-7 h-7" />}
                  label={`Selecionar ícone ${name}`}
                  onSelectIcon={() => handleIconSelect(name)}
                  active={icon === name}
                  disabled={loading}
                />
              ))}
            </div>
          </div>
          <div className="grid gap-2">
            <Label className="text-gray-600">Cor</Label>
            <div
              className={`grid grid-cols-7 gap-3 ${loading ? "pointer-events-none opacity-50" : ""}`}
            >
              {COLOR_OPTIONS.map(({ value, borderClass, backgroundClass }) => (
                <CategoriesButton
                  key={value}
                  value={value}
                  borderClass={borderClass}
                  backgroundClass={backgroundClass}
                  selectedColor={color}
                  onColorSelect={handleColorSelect}
                  disabled={loading}
                />
              ))}
            </div>
          </div>
          <div className="grid gap-2 mt-4">
            <Button
              type="submit"
              className="w-full bg-brand-base text-white hover:bg-brand-dark p-6"
              disabled={!canSubmit}
            >
              Salvar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}