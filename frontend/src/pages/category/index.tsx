import { CategoriesCard } from "@/pages/category/components/categories-card";
import { ArrowDownUpIcon, PlusIcon, TagIcon } from "lucide-react";
import { CategoriesItem } from "@/pages/category/components/categories-item";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { useQuery } from "@apollo/client/react";
import { LIST_CATEGORIES_QUERY } from "@/lib/graphql/queries/categories";
import type { Category } from "@/types/category";
import { CreateCategoryDialog } from "@/pages/category/components/create-category-dialog";
import { UpdateCategoryDialog } from "@/pages/category/components/update-category-dialog";
import { DeleteCategoryDialog } from "@/pages/category/components/delete-category-dialog";
import { CategoryIcon } from "@/components/category-icon";

const COLOR_TEXT_CLASS_MAP: Record<string, string> = {
  green: "text-green-base",
  blue: "text-blue-base",
  purple: "text-purple-base",
  pink: "text-pink-base",
  red: "text-red-base",
  orange: "text-orange-base",
  yellow: "text-yellow-base",
};

export function CategoriesPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  const { data, loading, error, refetch } = useQuery<{
    listCategoriesByUser: Category[];
  }>(LIST_CATEGORIES_QUERY, {
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });

  const categories = useMemo(() => data?.listCategoriesByUser ?? [], [data]);

  const totalTransactions = useMemo(
    () =>
      categories.reduce(
        (total, category) => total + category.transactionsCount,
        0,
      ),
    [categories],
  );

  const mostUsedCategory = useMemo(
    () =>
      categories.length > 0
        ? categories.reduce(
            (mostUsed, current) =>
              current.transactionsCount > mostUsed.transactionsCount
                ? current
                : mostUsed,
            categories[0],
          )
        : null,
    [categories],
  );

  const mostUsedColorClass = mostUsedCategory
    ? (COLOR_TEXT_CLASS_MAP[mostUsedCategory.color] ?? "text-gray-500")
    : "text-gray-500";

  const handleOpenCreateDialog = () => {
    setCreateDialogOpen(true);
  };

  const handleOpenEditDialog = (category: Category) => {
    setSelectedCategory(category);
    setEditDialogOpen(true);
  };

  const handleOpenDeleteDialog = (category: Category) => {
    setSelectedCategory(category);
    setDeleteDialogOpen(true);
  };

  const handleEditDialogChange = (open: boolean) => {
    setEditDialogOpen(open);
    if (!open) {
      setSelectedCategory(null);
    }
  };

  const handleDeleteDialogChange = (open: boolean) => {
    setDeleteDialogOpen(open);
    if (!open) {
      setSelectedCategory(null);
    }
  };

  const hasCategories = categories.length > 0;

  return (
    <>
      <main className="flex flex-col gap-6 px-12 pb-12 items-center justify-center w-full">
        <div className="flex flex-col gap-6 items-start justify-center w-full max-w-6xl">
          <div className="pt-6 flex justify-between items-center w-full">
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-bold text-gray-800">Categorias</h1>
              <span className="text-gray-600">
                Organize suas transações por categorias
              </span>
            </div>
            <Button
              className="bg-brand-base text-white hover:bg-brand-dark flex items-center"
              onClick={handleOpenCreateDialog}
            >
              <PlusIcon className="size-4 mr-1" />
              Nova categoria
            </Button>
          </div>

          {error && (
            <div className="w-full rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700 flex items-center justify-between gap-4">
              <span>Não foi possível carregar as categorias.</span>
              <Button
                variant="outline"
                className="border-red-200 hover:bg-red-100"
                onClick={() => void refetch()}
              >
                Tentar novamente
              </Button>
            </div>
          )}

          <main className="w-full max-w-6xl grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-6 lg:col-span-4">
              <CategoriesCard
                title={loading ? "..." : categories.length.toString()}
                description="Total de categorias"
                icon={<TagIcon className="size-6 mt-1" />}
              />
            </div>
            <div className="col-span-12 md:col-span-6 lg:col-span-4">
              <CategoriesCard
                title={loading ? "..." : totalTransactions.toString()}
                description="Total de transações"
                icon={<ArrowDownUpIcon className="size-6 text-purple-base" />}
              />
            </div>
            <div className="col-span-12 md:col-span-6 lg:col-span-4">
              <CategoriesCard
                title={
                  loading
                    ? "Carregando..."
                    : (mostUsedCategory?.name ?? "Sem dados")
                }
                description="Categoria mais utilizada"
                icon={
                  <CategoryIcon
                    icon={mostUsedCategory?.icon || "utensils"}
                    className={`size-6 mt-1 ${mostUsedColorClass}`}
                  />
                }
              />
            </div>

            {!loading && !hasCategories && !error && (
              <div className="col-span-12 rounded-md border border-dashed border-gray-300 bg-white p-8 text-center">
                <h2 className="text-lg font-semibold text-gray-800">
                  Nenhuma categoria encontrada
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  Crie sua primeira categoria para organizar suas transações.
                </p>
                <Button
                  className="mt-4 bg-brand-base text-white hover:bg-brand-dark"
                  onClick={handleOpenCreateDialog}
                >
                  <PlusIcon className="size-4 mr-1" />
                  Criar primeira categoria
                </Button>
              </div>
            )}

            {categories.map((category) => (
              <div
                key={category.id}
                className="col-span-12 md:col-span-6 lg:col-span-3"
              >
                <CategoriesItem
                  category={category}
                  onEdit={handleOpenEditDialog}
                  onDelete={handleOpenDeleteDialog}
                />
              </div>
            ))}
          </main>
        </div>
      </main>

      <CreateCategoryDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={refetch}
      />

      {selectedCategory && (
        <UpdateCategoryDialog
          open={editDialogOpen}
          onOpenChange={handleEditDialogChange}
          category={selectedCategory}
          onSuccess={refetch}
        />
      )}

      {selectedCategory && (
        <DeleteCategoryDialog
          open={deleteDialogOpen}
          onOpenChange={handleDeleteDialogChange}
          category={selectedCategory}
          onSuccess={refetch}
        />
      )}
    </>
  );
}