import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQuery } from "@apollo/client/react";
import type { Category } from "@/types/category";
import type { Transaction } from "@/types/transactions";
import { LIST_CATEGORIES_QUERY } from "@/lib/graphql/queries/categories";
import { UPDATE_TRANSACTION_MUTATION } from "@/lib/graphql/mutations/transactions";
import { toast } from "sonner";
import { ArrowDownCircleIcon, ArrowUpCircleIcon } from "lucide-react";
import { formatCurrency } from "@/lib/format-currency";

type UpdateTransactionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction;
  onSuccess?: () => void;
};

export function UpdateTransactionDialog({
  open,
  onOpenChange,
  transaction,
  onSuccess,
}: Readonly<UpdateTransactionDialogProps>) {
    const [amountType, setAmountType] = useState(transaction.amount < 0 ? "negative" : "positive");
    const [amountCents, setAmountCents] = useState(Math.round(Math.abs(transaction.amount) * 100));
    const [description, setDescription] = useState(transaction.description ?? "");
    const [date, setDate] = useState(transaction.date ? new Date(transaction.date) : undefined);
    const [categoryId, setCategoryId] = useState(transaction.category?.id ?? "");
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const dateFieldRef = useRef<HTMLDivElement | null>(null);

  const { data } = useQuery<{
    listCategoriesByUser: Category[];
  }>(LIST_CATEGORIES_QUERY);

  const categories = data?.listCategoriesByUser ?? [];

  const handleAmountChange = (rawValue: string) => {
    const digitsOnly = rawValue.replaceAll(/\D/g, "");
    setAmountCents(digitsOnly ? Number(digitsOnly) : 0);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!dateFieldRef.current) return;
      if (!dateFieldRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsCalendarOpen(false);
      }
    }

    if (isCalendarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isCalendarOpen]);

  const [updateTransaction, { loading }] = useMutation(
    UPDATE_TRANSACTION_MUTATION,
    {
      onCompleted: () => {
        toast.success("Transação atualizada com sucesso!");
        onOpenChange(false);
        onSuccess?.();
      },
      onError: (error) => {
        toast.error("Erro ao atualizar transação: " + error.message);
      },
    },
  );

  const canSubmit =
    description.trim() !== "" &&
    date &&
    amountCents !== 0 &&
    categoryId &&
    !loading;

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (!canSubmit) {
      return;
    }

    void updateTransaction({
      variables: {
        data: {
          id: transaction.id,
          amount: (amountType === "negative" ? -1 : 1) * (amountCents / 100),
          description: description.trim(),
          date: date?.toISOString(),
          categoryId,
        },
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
    <Dialog key={transaction.id} open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent className="border border-gray-200 bg-white">
        <DialogHeader className="mb-6">
          <div className="flex flex-col gap-0.5">
            <DialogTitle className="text-gray-800">
              Editar transação
            </DialogTitle>
            <DialogDescription className="text-gray-600 text-sm">
              Atualize os dados da transação
            </DialogDescription>
          </div>
        </DialogHeader>
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2 border border-gray-200 rounded-md px-4 py-2">
            <div className="grid gap-2">
              <Button
                type="button"
                className={`border px-1 py-6 ${amountType === "negative" ? "border-red-base" : "border-white text-gray-500"}`}
                onClick={() => setAmountType("negative")}
                disabled={loading}
              >
                <ArrowDownCircleIcon
                  className={`w-4 h-4 mr-1 ${amountType === "negative" ? "text-red-base" : "text-gray-400"}`}
                />
                Despesa
              </Button>
            </div>
            <div className="grid gap-2">
              <Button
                type="button"
                className={`border px-1 py-6 ${amountType === "positive" ? "border-green-base" : "border-white text-gray-500"}`}
                onClick={() => setAmountType("positive")}
                disabled={loading}
              >
                <ArrowUpCircleIcon
                  className={`w-4 h-4 mr-1 ${amountType === "positive" ? "text-green-base" : "text-gray-400"}`}
                />
                Receita
              </Button>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description" className="text-gray-600">
              Descrição
            </Label>
            <Input
              id="description"
              type="text"
              placeholder="Ex. Almoço no restaurante"
              className="border-gray-200 px-4 py-6"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="date" className="text-gray-600">
                Data
              </Label>
              <div ref={dateFieldRef} className="relative">
                <Input
                  id="date"
                  type="text"
                  readOnly
                  placeholder="Selecione"
                  className="border-gray-200 px-4 py-6 cursor-pointer"
                  value={date ? format(date, "dd/MM/yyyy") : ""}
                  onClick={() => setIsCalendarOpen((open) => !open)}
                  required
                  disabled={loading}
                />
                {isCalendarOpen && (
                  <div className="absolute z-50 mt-2 rounded-md border border-gray-200 bg-white p-2 shadow-lg">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(selected) => {
                        setDate(selected);
                        setIsCalendarOpen(false);
                      }}
                      autoFocus
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="amount" className="text-gray-600">
                Valor
              </Label>
              <InputGroup className="border-gray-200 py-6">
                <InputGroupAddon className="text-gray-500">R$</InputGroupAddon>
                <InputGroupInput
                  id="amount"
                  type="text"
                  inputMode="decimal"
                  placeholder="0,00"
                  className="px-4 py-6"
                  value={
                    amountCents === 0 ? "" : formatCurrency(amountCents / 100)
                  }
                  onChange={(e) => handleAmountChange(e.target.value)}
                  required
                  disabled={loading}
                />
              </InputGroup>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="category" className="text-gray-600">
              Categoria
            </Label>
            <Select
              value={categoryId}
              onValueChange={setCategoryId}
              disabled={loading}
            >
              <SelectTrigger
                id="category"
                className="w-full border border-gray-200 px-4 py-6 text-left"
              >
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200">
                <SelectGroup>
                  {categories.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id}
                      className="hover:bg-gray-200 cursor-pointer"
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2 mt-4">
            <Button
              type="submit"
              className="w-full bg-brand-base text-white hover:bg-brand-dark p-6"
              disabled={!canSubmit}
            >
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}