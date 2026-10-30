"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  LogOut,
  Search,
  Volume2,
  VolumeX,
  Menu,
  X,
  HelpCircle,
} from "lucide-react";
import { useAdminUser } from "@/context/AdminUserContext";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import { playOrderChime } from "@/lib/audioAlert";
import PendingOrdersBadge from "@/components/admin/PendingOrdersBadge";
import AdminCommandPalette from "@/components/admin/AdminCommandPalette";
import AdminShortcutsModal from "@/components/admin/AdminShortcutsModal";
import {
  type AdminNavItem,
  ADMIN_NAV_GROUPS,
  ADMIN_NAV_ITEMS,
  getVisibleNavGroups,
} from "@/lib/admin-nav";
import { getAdminHeaderScheduleBadge } from "@/lib/hours";
import type { SiteSettings } from "@/lib/settings";
import { BrandCircle } from "@/components/ui/BrandMark";

export type { AdminNavItem };

interface AdminShellProps {
  children: React.ReactNode;
  navItems?: AdminNavItem[];
}

const SIDEBAR_COLLAPSED_KEY = "pava-admin-sidebar-collapsed";
const SOUND_ENABLED_KEY = "pava-admin-sound-enabled";

export default function AdminShell({
  children,
  navItems = ADMIN_NAV_ITEMS,
}: AdminShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [clockTime, setClockTime] = useState<string | null>(null);
  const [scheduleStatus, setScheduleStatus] = useState<{
    isOpen: boolean;
    label: string;
  }>({
    isOpen: true,
    label: "Local en línea",
  });

  const prevCountRef = useRef<number | null>(null);
  const { email, role, isOwner, isStaff } = useAdminUser();
  const visibleNavGroups = getVisibleNavGroups(role);
  const pathname = usePathname();

  const activeItem =
    navItems.find((item) =>
      item.href === "/admin/dashboard"
        ? pathname === "/admin/dashboard" || pathname === "/admin"
        : pathname?.startsWith(item.href)
    ) ?? navItems[0];

  useEffect(() => {
    try {
      const saved = localStorage.getItem(SOUND_ENABLED_KEY);
      if (saved !== null) {
        setSoundEnabled(saved === "true");
      }
      if (localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "true") {
        setCollapsed(true);
      }
    } catch {
      // ignore
    }
  }, []);

  function toggleSound() {
    setSoundEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(SOUND_ENABLED_KEY, String(next));
      } catch {
        // ignore
      }
      if (next) {
        playOrderChime();
      }
      return next;
    });
  }

  // Poll for store schedule status
  useEffect(() => {
    let mounted = true;
    async function updateSchedule() {
      try {
        const res = await fetch("/api/admin/settings");
        if (!res.ok) return;
        const data = await res.json();
        const settings = data.settings as SiteSettings | undefined;
        if (mounted && settings) {
          const badge = getAdminHeaderScheduleBadge({
            openingHours: settings.openingHours,
            closedDates: settings.closedDates,
            hoursWeekday: settings.hoursWeekday,
            hoursSaturday: settings.hoursSaturday,
          });
          setScheduleStatus(badge);
        }
      } catch {
        // keep fallback
      }
    }

    updateSchedule();
    const id = setInterval(updateSchedule, 60_000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  // Poll for incoming orders
  useEffect(() => {
    let mounted = true;
    async function checkPendingOrders() {
      try {
        const res = await fetch("/api/admin/orders/pending-count");
        if (!res.ok) return;
        const data = await res.json();
        const currentCount = Number(data.count ?? 0);

        if (prevCountRef.current !== null && currentCount > prevCountRef.current) {
          if (soundEnabled) {
            playOrderChime();
          }
        }
        if (mounted) {
          prevCountRef.current = currentCount;
        }
      } catch {
        // ignore
      }
    }

    checkPendingOrders();
    const interval = setInterval(checkPendingOrders, 20_000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [soundEnabled]);

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      const isInput = ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      } else if (e.key === "?" && !isInput && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setShortcutsOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Clock
  useEffect(() => {
    function tick() {
      setClockTime(
        new Date().toLocaleTimeString("es-AR", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    }
    tick();
    const id = setInterval(tick, 10_000);
    return () => clearInterval(id);
  }, []);

  async function handleLogout() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const sidebarWidth = collapsed ? "64px" : "240px";

  // Mobile bottom bar items
  const mobileMainItems = [
    navItems.find((i) => i.href === "/admin/dashboard"),
    navItems.find((i) => i.href === "/admin/pedidos"),
    navItems.find((i) => i.href === "/admin/clientes"),
    navItems.find((i) => i.href === "/admin/productos"),
  ].filter((i): i is AdminNavItem => Boolean(i));

  return (
    <div
      className="pava-admin flex"
      style={{ "--admin-sidebar-w": sidebarWidth } as React.CSSProperties}
    >
      {/* ── MOBILE TOP BAR ── */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-[var(--dash-surface)] border-b-2 border-[#1f3a2b] z-40 flex items-center justify-between px-3 shadow-[0_3px_0_rgba(31,58,43,0.12)]">
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
            className="w-10 h-10 flex items-center justify-center text-[var(--dash-text)] rounded-xl hover:bg-[var(--dash-surface-2)] active:scale-95 transition-all shrink-0"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="flex items-center gap-1.5 min-w-0">
            <BrandCircle size={30} className="size-[30px] shrink-0 -rotate-6" />
            <span className="admin-display text-[17px] uppercase text-[var(--dash-text)] truncate max-w-[130px]">
              {activeItem.label}
            </span>
            {isOwner && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[var(--dash-accent-bg)] text-[var(--dash-accent)] border border-[var(--dash-accent-border)] shrink-0">
                👑 Dueño
              </span>
            )}
          </div>
        </div>

        {/* Center/Right Store Status & Quick Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Store status pill */}
          <div
            className={`hidden sm:flex items-center gap-1.5 px-2 py-0.8 rounded-full text-[11px] font-semibold border ${
              scheduleStatus.isOpen
                ? "bg-[var(--dash-success-bg)] text-[var(--dash-success)] border-[var(--dash-success-border)]"
                : "bg-[var(--dash-warning-bg)] text-[var(--dash-warning)] border-[var(--dash-warning-border)]"
            }`}
          >
            <span
              className={`admin-live-dot ${
                scheduleStatus.isOpen
                  ? "admin-live-dot--success"
                  : "admin-live-dot--warning"
              } w-1.5 h-1.5`}
            />
            <span>{scheduleStatus.isOpen ? "Abierto" : "Cerrado"}</span>
          </div>

          <button
            onClick={toggleSound}
            aria-label={soundEnabled ? "Silenciar timbre" : "Activar timbre"}
            className="w-9 h-9 flex items-center justify-center text-[var(--dash-muted)] hover:text-[var(--dash-text)] rounded-lg active:scale-95 transition-all"
          >
            {soundEnabled ? (
              <Volume2 size={17} className="text-[var(--dash-accent)]" />
            ) : (
              <VolumeX size={17} />
            )}
          </button>
          <button
            onClick={() => setPaletteOpen(true)}
            aria-label="Buscar"
            className="w-9 h-9 flex items-center justify-center text-[var(--dash-text)] rounded-lg hover:bg-[var(--dash-surface-2)] active:scale-95 transition-all"
          >
            <Search size={17} />
          </button>
        </div>
      </header>

      {/* ── MOBILE DRAWER / SHEET MENU ── */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-[#1f3a2b]/45 backdrop-blur-[3px] flex flex-col justify-end"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="w-full max-h-[85vh] bg-[var(--dash-surface)] border-t-2 border-[#1f3a2b] rounded-t-2xl p-5 overflow-y-auto space-y-5 shadow-2xl animate-sheet-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* User Profile & Store Status Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-[var(--dash-border)]">
              <div className="flex items-center gap-3 min-w-0">
                <BrandCircle size={44} className="size-11 shrink-0 -rotate-6" />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-serif text-xl uppercase text-[var(--dash-text)]">
                      Poné La Pava
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-extrabold uppercase bg-[var(--dash-accent-bg)] text-[var(--dash-accent)] border border-[var(--dash-accent-border)]">
                      {isOwner ? "Dueño" : "Staff"}
                    </span>
                  </div>
                  <span className="block text-xs text-[var(--dash-muted)] truncate max-w-[210px]">
                    {email || "Administrador"}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="admin-icon-btn shrink-0"
                aria-label="Cerrar menú"
              >
                <X size={18} />
              </button>
            </div>

            {/* Store Schedule Card */}
            <div className="p-3 rounded-xl bg-[var(--dash-surface-2)] border border-[var(--dash-border)] flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs">
                <span
                  className={`admin-live-dot ${
                    scheduleStatus.isOpen ? "admin-live-dot--success" : "admin-live-dot--warning"
                  } w-2 h-2`}
                />
                <span className="font-semibold text-[var(--dash-text)]">
                  Local Catriel:
                </span>
                <span className={scheduleStatus.isOpen ? "text-[var(--dash-success)] font-medium" : "text-[var(--dash-warning)] font-medium"}>
                  {scheduleStatus.label}
                </span>
              </div>
              <Link
                href="/admin/configuracion"
                onClick={() => setMobileOpen(false)}
                className="text-xs text-[var(--dash-accent)] hover:underline"
              >
                Ajustar
              </Link>
            </div>

            <div className="space-y-4">
              {visibleNavGroups.map((group) => (
                <div key={group.name} className="space-y-1">
                  <h4 className="font-script text-base text-[var(--dash-accent)] px-3">
                    {group.name}
                  </h4>
                  {group.items.map((item) => {
                    const isActive = item.href === activeItem.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        aria-current={isActive ? "page" : undefined}
                        className={`admin-nav-item py-2.5 px-3 rounded-xl flex items-center justify-between text-sm transition-all ${
                          isActive
                            ? "bg-[var(--dash-accent-bg)] text-[var(--dash-accent)] border border-[var(--dash-accent-border)] font-semibold shadow-xs"
                            : "text-[var(--dash-muted)] hover:text-[var(--dash-text)] hover:bg-[var(--dash-surface-2)]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon size={18} />
                          <span>{item.label}</span>
                        </div>
                        {item.href === "/admin/pedidos" && <PendingOrdersBadge />}
                      </Link>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[var(--dash-border)] space-y-2">
              <Link
                href="/"
                target="_blank"
                className="flex items-center gap-2.5 py-2.5 px-3 rounded-xl text-sm text-[var(--dash-muted)] hover:text-[var(--dash-text)] hover:bg-[var(--dash-surface-2)]"
              >
                <ExternalLink size={16} />
                <span>Ver Tienda Online</span>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 py-2.5 px-3 rounded-xl text-sm text-[var(--dash-danger)] hover:bg-[var(--dash-danger-bg)] text-left"
              >
                <LogOut size={16} />
                <span>Cerrar sesión</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MOBILE BOTTOM NAVIGATION BAR ── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 h-16 bg-[var(--dash-surface)] border-t-2 border-[#1f3a2b] flex items-center justify-around px-2 pb-[max(env(safe-area-inset-bottom),0.25rem)] shadow-[0_-3px_0_rgba(31,58,43,0.1)]">
        {mobileMainItems.map((item) => {
          const isActive = item.href === activeItem.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`flex-1 min-h-[48px] flex flex-col items-center justify-center gap-0.5 transition-all rounded-xl py-1 ${
                isActive
                  ? "text-[var(--dash-on-accent)] bg-[var(--dash-accent)] font-semibold -rotate-1 shadow-[2px_3px_0_#1f3a2b]"
                  : "text-[var(--dash-muted)] hover:text-[var(--dash-text)]"
              }`}
            >
              <span className="relative inline-flex items-center justify-center">
                <item.icon size={19} strokeWidth={isActive ? 2.4 : 1.8} />
                {item.href === "/admin/pedidos" && <PendingOrdersBadge collapsed />}
              </span>
              <span className="text-[11px] font-medium tracking-tight">
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* 5th Button: Más */}
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className={`flex-1 min-h-[48px] flex flex-col items-center justify-center gap-0.5 text-[var(--dash-muted)] hover:text-[var(--dash-text)] transition-colors rounded-xl py-1`}
          aria-label="Más secciones"
        >
          <Menu size={19} />
          <span className="text-[11px] font-medium tracking-tight">Más</span>
        </button>
      </nav>

      {/* ── DESKTOP GROUPED SIDEBAR ── */}
      <aside
        className={`hidden lg:flex lg:flex-col admin-ink fixed top-0 left-0 bottom-0 z-40 border-r-2 border-[#1f3a2b] shadow-[3px_0_0_rgba(31,58,43,0.15)] transition-all duration-200 overflow-hidden ${
          collapsed ? "w-16" : "w-60"
        }`}
      >
        {/* Brand header */}
        <div className="h-20 px-4 flex items-center justify-between border-b border-dashed border-[var(--dash-border)] shrink-0">
          {!collapsed && (
            <div className="flex items-center gap-2.5 min-w-0">
              <BrandCircle size={46} className="size-[46px] shrink-0 -rotate-6" />
              <div className="min-w-0">
                <span className="block font-serif text-[22px] uppercase text-[var(--dash-text)] leading-none">
                  Poné La Pava
                </span>
                <span className="font-script block text-[15px] leading-tight text-[var(--dash-accent)] -rotate-1">
                  {clockTime ? `panel · ${clockTime}` : "panel del local"}
                </span>
              </div>
            </div>
          )}
          <button
            onClick={() => {
              const next = !collapsed;
              setCollapsed(next);
              localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(next));
            }}
            aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
            className="p-1.5 text-[var(--dash-muted)] hover:text-[var(--dash-text)] rounded-md hover:bg-[var(--dash-surface-2)] transition-colors mx-auto lg:mx-0"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Search trigger */}
        <div className="p-3 shrink-0">
          <button
            type="button"
            onClick={() => setPaletteOpen(true)}
            title={collapsed ? "Buscar (Ctrl+K)" : undefined}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg bg-[var(--dash-surface-2)] border border-[var(--dash-border)] text-xs text-[var(--dash-muted)] hover:text-[var(--dash-text)] hover:border-[var(--dash-accent)] transition-all ${
              collapsed ? "justify-center" : "justify-between"
            }`}
          >
            <div className="flex items-center gap-2">
              <Search size={14} className="shrink-0" />
              {!collapsed && <span>Buscar...</span>}
            </div>
            {!collapsed && (
              <kbd className="px-1.5 py-0.5 rounded bg-[var(--dash-surface-3)] border border-[var(--dash-border)] text-xs font-mono">
                ⌘K
              </kbd>
            )}
          </button>
        </div>

        {/* Grouped Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-4">
          {visibleNavGroups.map((group) => (
            <div key={group.name} className="space-y-1">
              {!collapsed && (
                <h4 className="font-script text-[15px] normal-case text-[var(--dash-accent)] px-3 pt-1">
                  {group.name}
                </h4>
              )}
              {group.items.map((item) => {
                const isActive =
                  item.href === "/admin/dashboard"
                    ? pathname === "/admin/dashboard" || pathname === "/admin"
                    : pathname?.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                    aria-current={isActive ? "page" : undefined}
                    className={`admin-nav-item flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      collapsed ? "justify-center px-0" : ""
                    } ${
                      isActive
                        ? "bg-[var(--dash-accent-bg)] text-[var(--dash-accent)] border border-[var(--dash-accent-border)] font-semibold shadow-xs"
                        : "text-[var(--dash-muted)] hover:text-[var(--dash-text)] hover:bg-[var(--dash-surface-2)]"
                    }`}
                  >
                    <item.icon size={17} className="shrink-0" />
                    {!collapsed && (
                      <span className="flex-1 truncate">{item.label}</span>
                    )}
                    {item.href === "/admin/pedidos" && (
                      <PendingOrdersBadge collapsed={collapsed} />
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Bottom User & System Controls */}
        <div className="p-3 border-t border-[var(--dash-border)] shrink-0 space-y-1">
          {!collapsed && email && (
            <div className="px-3 py-1 mb-1">
              <div
                className="text-xs font-medium text-[var(--dash-text)] truncate"
                title={email}
              >
                {email}
              </div>
              <div className="mt-0.5">
                <span
                  className={`inline-block px-1.5 py-0.5 rounded text-xs font-semibold uppercase tracking-wider ${
                    isOwner
                      ? "bg-[var(--dash-accent-subtle)] text-[var(--dash-accent)]"
                      : "bg-[var(--dash-surface-3)] text-[var(--dash-muted)]"
                  }`}
                >
                  {isOwner ? "Dueño" : "Staff"}
                </span>
              </div>
            </div>
          )}
          <Link
            href="/"
            target="_blank"
            title={collapsed ? "Ver Tienda" : undefined}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-[var(--dash-muted)] hover:text-[var(--dash-text)] hover:bg-[var(--dash-surface-2)] transition-colors ${
              collapsed ? "justify-center px-0" : ""
            }`}
          >
            <ExternalLink size={15} className="shrink-0" />
            {!collapsed && <span>Ver Tienda</span>}
          </Link>

          <button
            onClick={handleLogout}
            title={collapsed ? "Cerrar sesión" : undefined}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-[var(--dash-danger)] hover:bg-[var(--dash-danger-bg)] transition-colors ${
              collapsed ? "justify-center px-0" : ""
            }`}
          >
            <LogOut size={15} className="shrink-0" />
            {!collapsed && <span>Cerrar sesión</span>}
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT AREA ── */}
      <main className="flex-1 min-w-0 min-h-screen pt-16 pb-24 px-3 sm:px-6 lg:pt-6 lg:pb-12 lg:px-8">
        {/* Desktop Sticky Header Bar */}
        <header className="hidden lg:flex items-center justify-between sticky top-4 z-30 mb-8 px-5 py-3 rounded-xl bg-[var(--dash-surface)] border-2 border-[#1f3a2b] shadow-[3px_4px_0_rgba(31,58,43,0.18)]">
          {/* Breadcrumb + Status Badge */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-[var(--dash-muted)]">
              <span>Admin</span>
              <span>/</span>
              <span className="admin-display flex items-center gap-1.5 text-[17px] uppercase text-[var(--dash-text)]">
                <activeItem.icon size={15} className="text-[var(--dash-accent)]" />
                {activeItem.label}
              </span>
            </div>

            {/* Local Open/Closed Status Badge */}
            <span
              className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                scheduleStatus.isOpen
                  ? "bg-[var(--dash-success-bg)] text-[var(--dash-success)] border-[var(--dash-success-border)]"
                  : "bg-[var(--dash-warning-bg)] text-[var(--dash-warning)] border-[var(--dash-warning-border)]"
              }`}
            >
              <span
                className={`admin-live-dot ${
                  scheduleStatus.isOpen
                    ? "admin-live-dot--success"
                    : "admin-live-dot--warning"
                } w-2 h-2`}
              />
              {scheduleStatus.label}
            </span>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              className="admin-btn admin-btn--secondary admin-btn--sm"
            >
              <Search size={14} />
              <span>Buscar...</span>
              <kbd className="px-1 py-0.5 rounded bg-[var(--dash-surface-3)] border border-[var(--dash-border)] text-xs font-mono">
                ⌘K
              </kbd>
            </button>

            <button
              type="button"
              onClick={toggleSound}
              className="admin-btn admin-btn--secondary admin-btn--sm"
              title={soundEnabled ? "Silenciar timbre de pedidos" : "Activar timbre"}
            >
              {soundEnabled ? (
                <Volume2 size={14} className="text-[var(--dash-accent)]" />
              ) : (
                <VolumeX size={14} />
              )}
              <span className="hidden xl:inline">
                {soundEnabled ? "Alertas ON" : "Silenciado"}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setShortcutsOpen(true)}
              className="admin-icon-btn"
              title="Atajos de teclado (?)"
              aria-label="Atajos de teclado"
            >
              <HelpCircle size={15} />
            </button>

            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="admin-btn admin-btn--primary admin-btn--sm"
            >
              <ExternalLink size={13} />
              <span>Ver Tienda</span>
            </Link>
          </div>
        </header>

        {/* Page Container */}
        <div key={pathname} className="admin-section-in">
          {children}
        </div>
      </main>

      {/* Global Command Palette */}
      <AdminCommandPalette
        isOpen={paletteOpen}
        onClose={() => setPaletteOpen(false)}
      />

      {/* Global Shortcuts Modal */}
      <AdminShortcutsModal
        isOpen={shortcutsOpen}
        onClose={() => setShortcutsOpen(false)}
      />
    </div>
  );
}
