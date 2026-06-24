import { ICON_MAP } from "@/types/icon-options";
import { UtensilsIcon } from "lucide-react";

interface Props extends React.ComponentPropsWithoutRef<"svg"> {
  icon?: string;
}
export const CategoryIcon = ({ icon, ...props }: Props) => {
  const Icon = icon ? ICON_MAP[icon] : UtensilsIcon;

  return <Icon {...props} />;
};