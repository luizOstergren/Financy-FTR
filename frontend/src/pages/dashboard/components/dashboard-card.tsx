import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { ReactNode } from "react";

type DashboardCardProps = {
  value: string;
  title: string;
  icon: ReactNode;
};

export function DashboardCard({
  value,
  title,
  icon,
}: Readonly<DashboardCardProps>) {
  return (
    <Card className="border border-gray-200 bg-white shadow-sm pb-4 flex flex-col justify-between">
      <CardHeader>
        <CardTitle className="text-xs flex items-center gap-2 text-gray-500 uppercase font-normal">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-gray-800 font-bold text-2xl">
        R$ {value}
      </CardContent>
    </Card>
  );
}