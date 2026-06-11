import { Link, NavLink } from "react-router-dom";
import logo from "@/assets/logo.svg";
import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/get-initials";
import { useAuthStore } from "@/stores/auth";

export function Header() {
  const { user } = useAuthStore();
  const initials = getInitials(user?.name || "");
  return (
    <header className="bg-white w-full flex justify-between items-center px-12 py-4 shadow-sm border-b border-gray-200 mb-12">
      <NavLink to="/">
        <img src={logo} alt="Financy Logo" className="h-6" />
      </NavLink>
      <nav>
        <ul className="flex justify-center gap-5 text-sm text-gray-600">
          <li className="h-9">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                cn(
                  "h-full flex items-center hover:text-brand-base hover:font-semibold",
                  isActive && "text-brand-base font-semibold",
                )
              }
            >
              Dashboard
            </NavLink>
          </li>
          <li className="h-9">
            <NavLink
              to="/transactions"
              className={({ isActive }) =>
                cn(
                  "h-full flex items-center hover:text-brand-base hover:font-semibold",
                  isActive && "text-brand-base font-semibold",
                )
              }
            >
              Transações
            </NavLink>
          </li>
          <li className="h-9">
            <NavLink
              to="/categories"
              className={({ isActive }) =>
                cn(
                  "h-full flex items-center hover:text-brand-base hover:font-semibold",
                  isActive && "text-brand-base font-semibold",
                )
              }
            >
              Categorias
            </NavLink>
          </li>
        </ul>
      </nav>
      <Link
        to="/profile"
        className="hover:text-brand-base bg-gray-300 text-gray-800 text-sm uppercase flex justify-center items-center rounded-full w-9 h-9"
      >
        {initials}
      </Link>
    </header>
  );
}