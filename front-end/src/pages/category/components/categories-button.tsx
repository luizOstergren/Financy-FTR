import { Button } from "@/components/ui/button";

type CategoriesButtonProps = Readonly<{
  value: string;
  borderClass: string;
  backgroundClass: string;
  selectedColor: string;
  onColorSelect: (color: string) => void;
  disabled?: boolean;
}>;

export function CategoriesButton({
  value,
  borderClass,
  backgroundClass,
  selectedColor,
  onColorSelect,
  disabled = false,
}: CategoriesButtonProps) {
  const isSelected = selectedColor === value;

  return (
    <Button
      type="button"
      aria-pressed={isSelected}
      aria-label={`Selecionar cor ${value}`}
      disabled={disabled}
      className={`w-full px-1 py-4 border border-gray-200 rounded-md ${
        isSelected && borderClass
      }`}
      onClick={() => onColorSelect(value)}
    >
      <div className={`h-6 w-full ${backgroundClass} rounded-md`} />
    </Button>
  );
}