export interface NavLink {
  href: string;
  label: string;
  badge?: string;
}

// Primary navigation links focused on e-commerce categories and shopping
export const NAV_LINKS: NavLink[] = [
  { href: "/catalogo", label: "Catálogo" },
  { href: "/catalogo?cat=mates", label: "Mates" },
  { href: "/catalogo?cat=yerbas", label: "Yerbas" },
  { href: "/catalogo?cat=termos", label: "Termos" },
  { href: "/catalogo?cat=bombillas", label: "Bombillas" },
  { href: "/catalogo?cat=combos", label: "Combos" },
  { href: "/#el-local", label: "Local" },
];

// Utility and secondary navigation links for mobile drawer and footer
export const UTILITY_LINKS: NavLink[] = [
  { href: "/seguimiento", label: "Seguimiento de Pedido" },
  { href: "/ayuda", label: "Preguntas Frecuentes" },
  { href: "/#nosotros", label: "Sobre Poné La Pava" },
  { href: "/#contacto", label: "Contacto Directo" },
];
