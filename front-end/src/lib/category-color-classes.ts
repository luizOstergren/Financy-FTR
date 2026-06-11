export type CategoryColorClasses = {
  text: string;
  background: string;
};

const DEFAULT_CATEGORY_COLOR_CLASSES: CategoryColorClasses = {
  text: "text-gray-500",
  background: "bg-gray-100",
};

const CATEGORY_COLOR_CLASS_MAP: Record<string, CategoryColorClasses> = {
  green: { text: "text-green-base", background: "bg-green-light" },
  blue: { text: "text-blue-base", background: "bg-blue-light" },
  purple: { text: "text-purple-base", background: "bg-purple-light" },
  pink: { text: "text-pink-base", background: "bg-pink-light" },
  red: { text: "text-red-base", background: "bg-red-light" },
  orange: { text: "text-orange-base", background: "bg-orange-light" },
  yellow: { text: "text-yellow-base", background: "bg-yellow-light" },
};

export function getCategoryColorClasses(color?: string): CategoryColorClasses {
  if (!color) {
    return DEFAULT_CATEGORY_COLOR_CLASSES;
  }

  return CATEGORY_COLOR_CLASS_MAP[color] ?? DEFAULT_CATEGORY_COLOR_CLASSES;
}