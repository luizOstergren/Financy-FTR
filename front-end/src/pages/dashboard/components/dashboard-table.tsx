import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import type { Transaction } from "@/types/transactions";
import { ArrowDownCircleIcon, ArrowUpCircleIcon } from "lucide-react";
import { formatCurrency } from "@/lib/format-currency";
import { getCategoryColorClasses } from "@/lib/category-color-classes";
import { useMemo } from "react";
import { ICON_MAP } from "@/types/icon-options";

type DashboardTableProps = {
  transactions: Transaction[];
};

export function DashboardTable({
  transactions,
}: Readonly<DashboardTableProps>) {
  const recentTransactions = useMemo(
    () =>
      [...transactions]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5),
    [transactions],
  );

  return (
    <Table>
      <TableBody className="[&_tr]:border-gray-200 text-gray-600 text-xs">
        {recentTransactions.length === 0 && (
          <TableRow>
            <TableCell
              colSpan={3}
              className="px-4 py-8 text-center text-gray-500 text-sm font-normal"
            >
              Adicione uma transação
            </TableCell>
          </TableRow>
        )}

        {recentTransactions.map((transaction) => {
          const Icon = ICON_MAP[transaction.category.icon] ?? null;

          const categoryClasses = getCategoryColorClasses(
            transaction.category.color,
          );

          return (
            <TableRow key={transaction.id}>
              <TableCell className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`size-8 flex items-center justify-center rounded-md ${categoryClasses.text} ${categoryClasses.background}`}
                  >
                    {Icon && <Icon className="size-4" />}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-800">
                      {transaction.description ?? "Sem descrição"}
                    </span>
                    <span className="text-sm text-gray-600 font-normal">
                      {new Date(transaction.date).toLocaleDateString("pt-BR", {
                        timeZone: "UTC",
                      })}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="px-4 py-4 text-sm text-center">
                <div
                  className={`${categoryClasses.text} ${categoryClasses.background} px-3 py-1 rounded-2xl inline-block font-medium text-xs`}
                >
                  {transaction.category.name}
                </div>
              </TableCell>
              <TableCell className="px-4 py-4 text-right text-sm">
                <span className="text-sm font-semibold text-gray-800">
                  {transaction.amount >= 0 ? "+" : "-"}R${" "}
                  {formatCurrency(Math.abs(transaction.amount))}
                  {transaction.amount >= 0 ? (
                    <ArrowUpCircleIcon
                      size={14}
                      className="inline-block text-green-base ml-1"
                    />
                  ) : (
                    <ArrowDownCircleIcon
                      size={14}
                      className="inline-block text-red-base ml-1"
                    />
                  )}
                </span>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}