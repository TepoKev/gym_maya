import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'dashboard', title: 'Dashboard', href: paths.dashboard.overview, icon: 'chart-pie' },
  { key: 'clientes', title: 'Clientes', href: paths.dashboard.customers, icon: 'users' },
  { key: 'membresias', title: 'Membresías', href: paths.dashboard.membresias, icon: 'users' }
] satisfies NavItemConfig[];
