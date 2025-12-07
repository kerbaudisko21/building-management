# Project Structure

## Overview
Building Management System (Gatau) - Progressive Web App (PWA) untuk mengelola properti, kamar, penyewa, dan utilitas.

## Folder Structure

```
building-management/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout dengan PWA meta tags
│   ├── page.tsx                 # Dashboard page
│   ├── globals.css              # Global styles (CSS variables + Tailwind)
│   └── favicon.ico              # Favicon
│
├── components/                   # Reusable React Components
│   ├── layout/                  # Layout components
│   │   └── Sidebar.tsx          # Navigation sidebar (collapsible)
│   ├── providers/               # Context providers
│   │   └── ThemeProvider.tsx    # Dark/light theme provider & hook
│   ├── ui/                      # UI-specific components
│   │   ├── pwa-install-prompt.tsx
│   │   └── pwa-service-worker-register.tsx
│   └── dashboard/               # Dashboard specific components (future)
│
├── lib/                         # Utility functions & configurations
│   └── utils.ts                 # Helper functions (cn, formatCurrency, formatDate)
│
├── hooks/                       # Custom React hooks (untuk future development)
│   └── .gitkeep
│
├── types/                       # TypeScript type definitions
│   └── index.ts                 # Core types (Property, Room, Bed, Tenant, dll)
│
├── constants/                   # Application constants
│   └── index.ts                 # App constants (routes, theme, status)
│
├── public/                      # Static assets
│   ├── icons-192x192.png        # PWA icon
│   ├── icons-512x512.png        # PWA icon
│   ├── manifest.json            # PWA manifest
│   └── favicon.ico              # App favicon
│
├── .next/                       # Next.js build output (generated)
├── node_modules/                # Dependencies
│
└── Configuration Files
    ├── package.json             # Project metadata & dependencies
    ├── tsconfig.json            # TypeScript configuration
    ├── next.config.ts           # Next.js configuration
    ├── tailwind.config.js       # Tailwind CSS configuration
    ├── postcss.config.js        # PostCSS configuration
    ├── eslint.config.mjs        # ESLint configuration
    └── .gitignore               # Git exclusions
```

## Tech Stack

### Core
- **Next.js 15.0.3** - React framework dengan App Router
- **React 18.3.1** - UI library
- **TypeScript 5** - Type safety

### Styling
- **Tailwind CSS 3.4.18** - Utility-first CSS
- **PostCSS** - CSS processing
- **Lucide React** - Icon library

### PWA
- **next-pwa** - Progressive Web App support
- Custom service worker & install prompts

### Utilities
- **clsx** - Conditional className merging
- **tailwind-merge** - Merge Tailwind classes

## Konvensi Penamaan

### Components
- PascalCase untuk nama komponen: `Sidebar.tsx`, `ThemeProvider.tsx`
- Gunakan `.tsx` untuk file yang mengandung JSX
- Gunakan `.ts` untuk file utility/types tanpa JSX

### Functions & Variables
- camelCase untuk functions dan variables: `toggleTheme`, `formatCurrency`
- PascalCase untuk React components dan types: `ThemeProvider`, `Property`

### Folders
- lowercase dengan dash untuk multi-word: `pwa-install-prompt.tsx`
- Singular untuk folders: `component`, `hook`, `type`, bukan `components`, `hooks`, `types`

## Import Paths

Project menggunakan TypeScript path aliases (`@/`) untuk imports:

```typescript
// Correct
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import Sidebar from '@/components/layout/Sidebar';
import { formatCurrency } from '@/lib/utils';
import { Property } from '@/types';
import { ROUTES } from '@/constants';

// Avoid
import { ThemeProvider } from '../../components/providers/ThemeProvider';
```

## Rencana Pengembangan

### Pages (Route Groups)
- [ ] `/properties` - Property management
- [ ] `/rooms` - Room tracking
- [ ] `/beds` - Bed allocation
- [ ] `/tenants` - Tenant information
- [ ] `/invoices` - Invoice management
- [ ] `/utility-bills` - Utility billing
- [ ] `/complaints` - Complaint handling
- [ ] `/notices` - Announcements
- [ ] `/reports` - Analytics & reports
- [ ] `/account` - Settings & profile

### API Routes
- [ ] `/api/properties` - CRUD untuk properties
- [ ] `/api/tenants` - CRUD untuk tenants
- [ ] `/api/invoices` - CRUD untuk invoices
- [ ] `/api/complaints` - CRUD untuk complaints

### Custom Hooks
- [ ] `useLocalStorage` - Persistent state
- [ ] `useMediaQuery` - Responsive breakpoints
- [ ] `useDebounce` - Debounced values
- [ ] `useFetch` - Data fetching

### Components
- [ ] `<DataTable>` - Reusable table component
- [ ] `<Modal>` - Modal dialog
- [ ] `<Form>` - Form components
- [ ] `<Charts>` - Data visualization

## Scripts

```bash
# Development
npm run dev          # Start development server
npm run pwa:dev      # Generate icons & start dev server

# Production
npm run build        # Build for production
npm start           # Start production server

# Utilities
npm run lint        # Run ESLint
npm run generate-icons  # Generate PWA icons
```

## Notes

- Semua komponen di `app/` dan `components/` harus menggunakan `'use client'` directive jika menggunakan hooks atau interactivity
- PWA manifest dan icons sudah dikonfigurasi di `/public`
- Theme system menggunakan localStorage untuk persistence
- Dark mode otomatis mengikuti system preference saat first load
