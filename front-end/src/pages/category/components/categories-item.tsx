import { CategoryIcon } from "@/components/category-icon";
import { CategoryPill } from "@/components/category-pill";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Category } from "@/types/category";
import { EditIcon, TrashIcon } from "lucide-react";
import { useState } from "react";

type CategoriesItemProps = Readonly<{
  category: Category;
  onEdit?: (category: Category) => void;
  onDelete?: (category: Category) => void;
}>;

const COLOR_CLASS_MAP: Record<string, { text: string; background: string }> = {
  green: { text: "text-green-base", background: "bg-green-light" },
  blue: { text: "text-blue-base", background: "bg-blue-light" },
  purple: { text: "text-purple-base", background: "bg-purple-light" },
  pink: { text: "text-pink-base", background: "bg-pink-light" },
  red: { text: "text-red-base", background: "bg-red-light" },
  orange: { text: "text-orange-base", background: "bg-orange-light" },
  yellow: { text: "text-yellow-base", background: "bg-yellow-light" },
};

const ACTION_BUTTON_CLASS =
  "size-8 border border-gray-200 bg-white gap-1 transition-colors";

export function CategoriesItem({
  category,
  onEdit,
  onDelete,
}: CategoriesItemProps) {
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const colorClasses = COLOR_CLASS_MAP[category.color] ?? {
    text: "text-gray-500",
    background: "bg-gray-100",
  };

  const canRemove = category.transactionsCount === 0;

  return (
    <Card className="w-full border border-gray-200 bg-white gap-1 pb-6">
      <CardHeader className="mb-6">
        <div className="flex justify-between mb-6">
          <div
            className={`size-8 flex justify-center items-center rounded-md gap-1 ${colorClasses.text} ${colorClasses.background}`}
          >
            <CategoryIcon icon={category.icon} className="size-4" />
          </div>
          <div className="flex justify-center gap-3">
            {canRemove ? (
              <Button
                type="button"
                aria-label={`Remover categoria ${category.name}`}
                className={`${ACTION_BUTTON_CLASS} text-red-base hover:bg-red-light hover:text-red-dark`}
                onClick={() => onDelete?.(category)}
              >
                <TrashIcon />
              </Button>
            ) : (
              <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen}>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    aria-label={`Não é possível remover ${category.name}`}
                    aria-disabled
                    className={`${ACTION_BUTTON_CLASS} text-red-base hover:bg-red-light hover:text-red-dark`}
                    onClick={(event) => {
                      event.preventDefault();
                      setTooltipOpen(true);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setTooltipOpen(true);
                      }
                    }}
                  >
                    <TrashIcon />
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  sideOffset={6}
                  className="text-center bg-danger"
                >
                  Não é possível remover uma <br /> categoria que possui
                  transações
                </TooltipContent>
              </Tooltip>
            )}
            <Button
              type="button"
              aria-label={`Editar categoria ${category.name}`}
              className={`${ACTION_BUTTON_CLASS} hover:bg-gray-100 hover:text-gray-700`}
              onClick={() => onEdit?.(category)}
            >
              <EditIcon />
            </Button>
          </div>
        </div>
        <CardTitle className="text-gray-800 font-bold capitalize">
          {category.name}
        </CardTitle>
        <CardDescription className="text-xs flex items-center gap-1 text-gray-500 font-normal capitalize">
          {category.description || "Categoria sem descrição"}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-xs flex items-center justify-between text-gray-500 font-normal capitalize">
        <CategoryPill
          textColor={colorClasses.text}
          backgroundColor={colorClasses.background}
          name={category.name}
        />
        <div>
          {category.transactionsCount}{" "}
          {category.transactionsCount === 1 ? "item" : "itens"}
        </div>
      </CardContent>
    </Card>
  );
}