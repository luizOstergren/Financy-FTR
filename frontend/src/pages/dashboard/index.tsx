import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { DashboardCard } from "@/pages/dashboard/components/dashboard-card";
import {
  ChevronRightIcon,
  CircleArrowDownIcon,
  CircleArrowUpIcon,
  PlusIcon,
  Wallet2Icon,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { DashboardTable } from "@/pages/dashboard/components/dashboard-table";
import { useQuery } from "@apollo/client/react";
import { LIST_TRANSACTIONS_QUERY } from "@/lib/graphql/queries/transactions";
import { LIST_CATEGORIES_QUERY } from "@/lib/graphql/queries/categories";
import type { Category } from "@/types/category";
import type { Transaction } from "@/types/transactions";
import { CreateTransactionDialog } from "@/pages/transactions/components/create-transaction-dialog";
import { useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/format-currency";
import { getCategoryColorClasses } from "@/lib/category-color-classes";

export function DashboardPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const {
    data,
    loading: loadingTransactions,
    error: transactionsError,
    refetch,
  } = useQuery<{
    listTransactionsByUser: Transaction[];
  }>(LIST_TRANSACTIONS_QUERY);

  const transactions = useMemo(() => data?.listTransactionsByUser ?? [], [data]);

  const {
    data: categoriesData,
    loading: loadingCategories,
    error: categoriesError,
    refetch: refetchCategories,
  } = useQuery<{
    listCategoriesByUser: Category[];
  }>(LIST_CATEGORIES_QUERY);

  const categories = useMemo(() => categoriesData?.listCategoriesByUser ?? [], [categoriesData]);

  const totalBalance = useMemo(
    () =>
      transactions.reduce(
        (total, transaction) => total + transaction.amount,
        0,
      ),
    [transactions],
  );

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const { incomeThisMonth, expenseThisMonth } = useMemo(
    () =>
      transactions.reduce(
        (acc, transaction) => {
          const date = new Date(transaction.date);
          if (
            date.getMonth() !== currentMonth ||
            date.getFullYear() !== currentYear
          ) {
            return acc;
          }
          if (transaction.amount >= 0) {
            acc.incomeThisMonth += transaction.amount;
          } else {
            acc.expenseThisMonth += Math.abs(transaction.amount);
          }
          return acc;
        },
        { incomeThisMonth: 0, expenseThisMonth: 0 },
      ),
    [transactions, currentMonth, currentYear],
  );

  const categoryStats = useMemo(() => {
    const totalsByCategory = new Map<
      string,
      { count: number; total: number }
    >();

    for (const transaction of transactions) {
      const categoryEntry = totalsByCategory.get(transaction.category.id);
      if (!categoryEntry) {
        totalsByCategory.set(transaction.category.id, {
          count: 1,
          total: transaction.amount,
        });
        continue;
      }

      categoryEntry.count += 1;
      categoryEntry.total += transaction.amount;
    }

    return categories
      .map((category) => {
        const categoryTotals = totalsByCategory.get(category.id);
        return {
          id: category.id,
          name: category.name,
          color: category.color,
          count: categoryTotals?.count ?? 0,
          total: categoryTotals?.total ?? 0,
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
  }, [categories, transactions]);

  const hasDataError = Boolean(transactionsError || categoriesError);

  const handleOpenCreateDialog = () => {
    setCreateDialogOpen(true);
  };

  return (
    <>
      <main className="flex items-center justify-center w-full px-12 pb-12">
        <section className="grid grid-cols-3 gap-6 w-full max-w-6xl">
          <DashboardCard
            value={loadingTransactions ? "..." : formatCurrency(totalBalance)}
            title="Saldo total"
            icon={<Wallet2Icon size={20} className="text-purple-base" />}
          />
          <DashboardCard
            value={
              loadingTransactions ? "..." : formatCurrency(incomeThisMonth)
            }
            title="Receitas do mês"
            icon={<CircleArrowUpIcon size={20} className="text-brand-base" />}
          />
          <DashboardCard
            value={
              loadingTransactions ? "..." : formatCurrency(expenseThisMonth)
            }
            title="Despesas do mês"
            icon={<CircleArrowDownIcon size={20} className="text-red-base" />}
          />

          {hasDataError && (
            <div className="col-span-3 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700 flex items-center justify-between gap-4">
              <span>Não foi possível carregar os dados do dashboard.</span>
              <Button
                type="button"
                variant="outline"
                className="border-red-200 hover:bg-red-100"
                onClick={() => {
                  void refetch();
                  void refetchCategories();
                }}
              >
                Tentar novamente
              </Button>
            </div>
          )}

          <Card className="col-span-2 border border-gray-200 bg-white shadow-sm gap-1">
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="flex items-center justify-between gap-2 pt-4">
                <div className="text-xs font-medium uppercase text-gray-500">
                  Transações recentes
                </div>
                <Link
                  to="/transactions"
                  className="text-xs text-brand-base hover:underline"
                >
                  Ver todas
                  <ChevronRightIcon size={14} className="inline-block" />
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-800 font-bold text-2xl border-b border-gray-200 pb-4 px-1">
              <DashboardTable transactions={transactions} />
            </CardContent>
            <CardFooter className="pt-5">
              <Button
                variant="link"
                onClick={handleOpenCreateDialog}
                className="text-sm text-brand-base w-full"
              >
                <PlusIcon size={14} className="inline-block" />
                Nova transação
              </Button>
            </CardFooter>
          </Card>
          <Card className="col-span-1 border border-gray-200 bg-white shadow-sm gap-1">
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="flex items-center justify-between gap-2 pt-4">
                <div className="text-xs font-medium uppercase text-gray-500">
                  Categorias
                </div>
                <Link
                  to="/categories"
                  className="text-xs text-brand-base hover:underline"
                >
                  Gerenciar
                  <ChevronRightIcon size={14} className="inline-block" />
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-800 px-1">
              <Table>
                <TableBody>
                  {!loadingCategories && categoryStats.length === 0 && (
                    <TableRow className="border-none">
                      <TableCell
                        className="px-4 py-6 text-center text-sm text-gray-500"
                        colSpan={3}
                      >
                        Nenhuma categoria disponível.
                      </TableCell>
                    </TableRow>
                  )}

                  {categoryStats.map((category) => {
                    const categoryClasses = getCategoryColorClasses(
                      category.color,
                    );

                    return (
                      <TableRow key={category.id} className="border-none">
                        <TableCell className="px-4 py-4">
                          <div
                            className={`${categoryClasses.text} ${categoryClasses.background} px-3 py-1 rounded-2xl inline-block font-medium text-xs`}
                          >
                            {category.name}
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-4 text-xs text-gray-500 text-right">
                          {category.count} itens
                        </TableCell>
                        <TableCell className="px-4 py-4 text-right text-sm">
                          <div className="text-sm font-semibold text-gray-800">
                            {category.total >= 0 ? "+" : "-"}R${" "}
                            {formatCurrency(Math.abs(category.total))}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>
      </main>

      <CreateTransactionDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={refetch}
      />
    </>
  );
}