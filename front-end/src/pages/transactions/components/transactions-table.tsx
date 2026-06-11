import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type { Transaction } from "@/types/transactions";
import {
  CircleArrowDownIcon,
  CircleArrowUpIcon,
  EditIcon,
  TrashIcon,
} from "lucide-react";
import { useMemo } from "react";
import { getCategoryColorClasses } from "@/lib/category-color-classes";
import { formatCurrency } from "@/lib/format-currency";
import { CategoryPill } from "@/components/category-pill";
import { Pagination } from "@/components/pagination";
import { CategoryIcon } from "@/components/category-icon";

type TransactionsTableProps = {
  transactions: Transaction[];
  currentPage: number;
  pageSize: number;
  loading?: boolean;
  onPageChange: (page: number) => void;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
};

export function TransactionsTable({
  transactions,
  currentPage,
  pageSize,
  loading = false,
  onPageChange,
  onEdit,
  onDelete,
}: Readonly<TransactionsTableProps>) {
  const totalPages = Math.max(1, Math.ceil(transactions.length / pageSize));
  const startIndex =
    transactions.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, transactions.length);

  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return transactions.slice(start, start + pageSize);
  }, [transactions, currentPage, pageSize]);

  return (
    <main className="w-full max-w-6xl bg-white rounded-lg shadow border border-gray-200">
      <Table>
        <TableHeader className="[&_tr]:border-gray-200 text-gray-500 uppercase text-xs">
          <TableRow>
            <TableHead className="px-6 py-5">Descrição</TableHead>
            <TableHead className="px-6 py-5 text-center">Data</TableHead>
            <TableHead className="px-6 py-5 text-center">Categoria</TableHead>
            <TableHead className="px-6 py-5 text-center">Tipo</TableHead>
            <TableHead className="px-6 py-5 text-center">Valor</TableHead>
            <TableHead className="px-6 py-5 text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="[&_tr]:border-gray-200 text-gray-600 text-xs">
          {loading && (
            <TableRow>
              <TableCell
                className="px-6 py-8 text-center text-gray-500"
                colSpan={6}
              >
                Carregando transações...
              </TableCell>
            </TableRow>
          )}

          {!loading && paginatedTransactions.length === 0 && (
            <TableRow>
              <TableCell
                className="px-6 py-8 text-center text-gray-500"
                colSpan={6}
              >
                Nenhuma transação encontrada para os filtros selecionados.
              </TableCell>
            </TableRow>
          )}

          {paginatedTransactions.map((transaction) => {
            const categoryClasses = getCategoryColorClasses(
              transaction.category.color,
            );

            return (
              <TableRow className="[&_tr]:border-gray-200" key={transaction.id}>
                <TableCell className="px-6 py-5 text-[1rem] font-medium">
                  <CategoryIcon icon={transaction.category.icon} />
                  {transaction.description}
                </TableCell>
                <TableCell className="px-6 py-5 text-center text-[0.875rem]">
                  {new Date(transaction.date).toLocaleDateString("pt-BR", {
                    timeZone: "UTC",
                  })}
                </TableCell>
                <TableCell className="px-6 py-5 flex justify-center items-center">
                  <CategoryPill
                    textColor={categoryClasses.text}
                    backgroundColor={categoryClasses.background}
                    name={transaction.category.name}
                  />
                </TableCell>
                <TableCell className="px-6 py-5 text-center">
                  {transaction.amount >= 0 ? (
                    <div className="flex items-center justify-center gap-1 text-green-base font-medium">
                      <CircleArrowUpIcon className="w-4 h-4" />
                      Entrada
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-1 text-red-base font-medium">
                      <CircleArrowDownIcon className="w-4 h-4" />
                      Saída
                    </div>
                  )}
                </TableCell>
                <TableCell className="px-6 py-5 text-center font-semibold text-[0.875rem]">
                  {transaction.amount >= 0 ? "+" : "-"}R${" "}
                  {formatCurrency(Math.abs(transaction.amount))}
                </TableCell>
                <TableCell className="px-6 py-5 flex gap-2 justify-end">
                  <Button
                    type="button"
                    aria-label={`Remover transação ${transaction.description ?? "sem descrição"}`}
                    className="w-8 h-8 border border-gray-200 bg-white gap-1 text-red-base hover:bg-red-light hover:text-red-dark"
                    onClick={() => onDelete(transaction)}
                  >
                    <TrashIcon />
                  </Button>
                  <Button
                    type="button"
                    aria-label={`Editar transação ${transaction.description ?? "sem descrição"}`}
                    className="w-8 h-8 border border-gray-200 bg-white gap-1 hover:bg-gray-100 hover:text-gray-700"
                    onClick={() => onEdit(transaction)}
                  >
                    <EditIcon />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
        <span className="text-sm text-gray-500">
          {transactions.length === 0
            ? "0 resultados"
            : `${startIndex} a ${endIndex} | ${transactions.length} resultados`}
        </span>

        <div className="flex items-center gap-2">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      </div>
    </main>
  );
}