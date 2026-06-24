import { Card, CardContent } from "@/components/ui/card";
import type { ReactNode } from "react";

type CategoriesCardProps = Readonly<{
  title: string;
  description: string;
  icon: ReactNode;
}>;

export function CategoriesCard({
  title,
  description,
  icon,
}: CategoriesCardProps) {
  return (
    <Card className="w-full border border-gray-200 bg-white gap-1">
      <CardContent className="text-gray-800 font-bold text-2xl p-6">
        <div className="flex gap-4 items-start justify-start">
          <div aria-hidden>{icon}</div>
          <div className="flex flex-col gap-2">
            <strong className="text-[1.75rem] font-bold leading-none wrap-break-word capitalize">
              {title}
            </strong>
            <span className="text-xs flex items-center gap-1 text-gray-500 uppercase font-normal">
              {description}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}