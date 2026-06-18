import {
  FiBookOpen,
  FiHeart,
  FiMonitor,
  FiFeather,
  FiUsers,
  FiBriefcase,
  FiAlertTriangle,
  FiSun,
} from "react-icons/fi";
import { Category } from "@/lib/types";

const iconMap: Record<Category, React.ComponentType<{ className?: string }>> = {
  [Category.EDUCATION]: FiBookOpen,
  [Category.HEALTH]: FiHeart,
  [Category.TECHNOLOGY]: FiMonitor,
  [Category.ARTS]: FiFeather,
  [Category.COMMUNITY]: FiUsers,
  [Category.BUSINESS]: FiBriefcase,
  [Category.EMERGENCY]: FiAlertTriangle,
  [Category.ENVIRONMENT]: FiSun,
};

interface CategoryIconProps {
  category: Category;
  className?: string;
}

export function CategoryIcon({ category, className = "size-5" }: CategoryIconProps) {
  const Icon = iconMap[category];
  return <Icon className={className} />;
}
