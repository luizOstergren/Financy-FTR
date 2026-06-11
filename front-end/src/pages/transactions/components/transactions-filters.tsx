import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LIST_CATEGORIES_QUERY } from "@/lib/graphql/queries/categories";
import type { Category } from "@/types/category";
import { useQuery } from "@apollo/client/react";
import { Label } from "@/components/ui/label";
import { SearchIcon } from "lucide-react";
import { useMemo } from "react";

type TransactionFiltersProps = Readonly<{
  categoryId: string;
  onCategoryChange: (categoryId: string) => void;
  search: string;
  onSearchChange: (search: string) => void;
  type: "all" | "negative" | "positive";
  onTypeChange: (type: "all" | "negative" | "positive") => void;
  period: string;
  onPeriodChange: (period: string) => void;
  periodStart: Date;
  periodEnd: Date;
}>;

export function TransactionFilters({
  categoryId,
  onCategoryChange,
  search,
  onSearchChange,
  type,
  onTypeChange,
  period,
  onPeriodChange,
  periodStart,
  periodEnd,
}: TransactionFiltersProps) {
  const { data } = useQuery<{
    listCategoriesByUser: Category[];
  }>(LIST_CATEGORIES_QUERY);

  const categories = data?.listCategoriesByUser ?? [];
  const formatMonthYear = (date: Date) =>
    date.toLocaleDateString("pt-BR", {
      month: "long",
      year: "numeric",
    });

  const buildPeriodOptions = (start: Date, end: Date) => {
    const startMonth = new Date(start.getFullYear(), start.getMonth(), 1);
    const endMonth = new Date(end.getFullYear(), end.getMonth(), 1);
    const options: { value: string; label: string }[] = [];
    const cursor = new Date(startMonth);

    while (cursor <= endMonth) {
      const value = `${cursor.getFullYear()}-${String(
        cursor.getMonth() + 1,
      ).padStart(2, "0")}`;
      const label =
        formatMonthYear(cursor).charAt(0).toUpperCase() +
        formatMonthYear(cursor).slice(1);
      options.push({ value, label });
      cursor.setMonth(cursor.getMonth() + 1);
    }

    return options;
  };

  const periodOptions = useMemo(
    () => buildPeriodOptions(periodStart, periodEnd),
    [periodStart, periodEnd],
  );

  return (
    <div className="w-full max-w-6xl bg-white rounded-lg shadow border border-gray-200">
      <form className="grid grid-cols-4 gap-6 p-6">
        <div className="grid gap-2">
          <Label className="text-gray-600 text-sm">Buscar</Label>
          <InputGroup className="border-gray-300 py-5 has-[[data-slot=input-group-control]:focus-visible]:ring-0 has-[[data-slot=input-group-control]:focus-visible]:border-gray-300">
            <InputGroupInput
              type="text"
              placeholder="Buscar por descrição"
              className="border-gray-200  px-4 py-5"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            <InputGroupAddon align="inline-start">
              <SearchIcon className="text-muted-foreground" />
            </InputGroupAddon>
          </InputGroup>
        </div>
        <div className="grid gap-2">
          <Label className="text-gray-600 text-sm">Tipo</Label>
          <Select value={type} onValueChange={onTypeChange}>
            <SelectTrigger className="w-full border border-gray-200 px-4 py-5 text-left">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200">
              <SelectGroup>
                <SelectItem
                  value="all"
                  className="hover:bg-gray-200 cursor-pointer"
                >
                  Todos
                </SelectItem>
                <SelectItem
                  value="negative"
                  className="hover:bg-gray-200 cursor-pointer"
                >
                  Despesas
                </SelectItem>
                <SelectItem
                  value="positive"
                  className="hover:bg-gray-200 cursor-pointer"
                >
                  Receitas
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="category" className="text-gray-600 text-sm">
            Categoria
          </Label>
          <Select value={categoryId} onValueChange={onCategoryChange}>
            <SelectTrigger
              id="category"
              className="w-full border border-gray-200 px-4 py-5 text-left"
            >
              <SelectValue placeholder="Selecione a categoria" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200">
              <SelectGroup>
                <SelectItem
                  value="all"
                  className="hover:bg-gray-200 cursor-pointer"
                >
                  Todas
                </SelectItem>
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
        <div className="grid gap-2">
          <Label htmlFor="period" className="text-gray-600 text-sm">
            Período
          </Label>
          <Select value={period} onValueChange={onPeriodChange}>
            <SelectTrigger
              id="period"
              className="w-full border border-gray-200 px-4 py-5 text-left"
            >
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200">
              <SelectGroup>
                <SelectItem
                  value="all"
                  className="hover:bg-gray-200 cursor-pointer"
                >
                  Todos
                </SelectItem>
                {periodOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="hover:bg-gray-200 cursor-pointer"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </form>
    </div>
  );
}