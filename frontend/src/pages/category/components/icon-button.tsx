import { Button } from "@/components/ui/button";
import type { ReactNode } from "react";

type IconButtonProps = Readonly<{
  icon: ReactNode;
  onSelectIcon?: () => void;
  active?: boolean;
  label: string;
  disabled?: boolean;
}>;

export function IconButton({
  icon,
  onSelectIcon,
  active = false,
  label,
  disabled = false,
}: IconButtonProps) {
  return (
    <Button
      type="button"
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      className={`text-gray-500 border border-gray-300 flex items-center justify-center w-11 h-11 hover:bg-gray-100 ${active ? "bg-gray-100 border-gray-500 text-gray-700" : ""}`}
      onClick={onSelectIcon}
    >
      {icon}
    </Button>
  );
}