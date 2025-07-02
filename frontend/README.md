# Task Manager Frontend

A modern, responsive task management application built with React, TypeScript, and Tailwind CSS. Features a comprehensive dashboard with analytics, drag-and-drop task management, and full mobile responsiveness.

## 🌐 Live Demo

**🚀 [View Live Application](https://develop.d6kzfjr24jspp.amplifyapp.com)**

> **Deployed on AWS Amplify** - Experience the full-featured task management application with real-time updates and mobile responsiveness.

---

![Task Manager](https://img.shields.io/badge/React-18.3.1-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-blue.svg)
![Vite](https://img.shields.io/badge/Vite-7.0.0-646CFF.svg)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.0.0-06B6D4.svg)
![AWS Amplify](https://img.shields.io/badge/AWS%20Amplify-Deployed-FF9900.svg)

## 🚀 Features

### Core Functionality
- **Task Management**: Create, edit, delete, and organize tasks
- **Priority System**: High, Medium, Low priority levels with color coding
- **Due Date Tracking**: Date picker with overdue detection
- **Task Status**: Mark tasks as complete/incomplete
- **Drag & Drop**: Reorder tasks with intuitive drag-and-drop interface

### Analytics Dashboard
- **Overview Cards**: Total, completed, pending, and overdue task counts
- **Completion Rate**: Visual progress tracking
- **Priority Breakdown**: Detailed statistics by priority level
- **Interactive Charts**: Pie charts, bar charts, and progress visualizations
- **Real-time Updates**: Charts update automatically when task data changes

### User Experience
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Dark/Light Theme**: System-aware theme with manual toggle
- **Smooth Animations**: Polished transitions and micro-interactions
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- **Touch-Friendly**: Optimized touch targets for mobile devices

## 📱 Mobile Responsiveness

The application is fully optimized for mobile devices with:

- **Adaptive Navigation**: Compact icon-only navigation on mobile
- **Responsive Layouts**: Stacked components on small screens
- **Touch Optimization**: Proper touch targets (44px minimum)
- **Mobile-First Cards**: Card-based layout for tasks on mobile
- **Responsive Typography**: Scalable text sizes across devices
- **Safe Area Support**: Handles device notches and safe areas
- **Gesture Support**: Touch-friendly interactions and feedback

## 🛠️ Tech Stack

### Core Technologies
- **React 18** - UI library with hooks and functional components
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework

### State Management
- **Zustand** - Lightweight state management
- **Local Storage** - Persistent data storage

### UI Components
- **Radix UI** - Headless, accessible components
- **Lucide React** - Beautiful icon library
- **Recharts** - Responsive chart library
- **@dnd-kit** - Modern drag-and-drop toolkit

### Development Tools
- **ESLint** - Code linting and quality
- **TypeScript Compiler** - Type checking
- **PostCSS** - CSS processing
- **date-fns** - Date utility library

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components (shadcn/ui)
│   └── ui/             # Base UI components
├── modules/            # Feature-based modules
│   ├── dashboard/      # Analytics and overview
│   │   ├── components/ # Dashboard-specific components
│   │   ├── containers/ # Dashboard container logic
│   │   └── index.ts   # Module exports
│   └── tasks/         # Task management
│       ├── components/ # Task-specific components
│       ├── containers/ # Task container logic
│       ├── hooks/     # Task-related hooks
│       ├── types/     # Task type definitions
│       └── constants/ # Task constants
├── pages/             # Page components
├── shared/            # Shared utilities and components
│   ├── components/    # Shared components
│   ├── hooks/        # Shared hooks
│   ├── types/        # Global type definitions
│   └── utils/        # Utility functions
├── store/            # Zustand stores
├── utils/            # General utilities
├── App.tsx           # Main app component
├── main.tsx          # Application entry point
└── index.css         # Global styles
```

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ (required for Vite 7)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd task-manager/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Theming

The application supports three theme modes:

- **Light Mode**: Clean, bright interface
- **Dark Mode**: Easy on the eyes for low-light usage
- **System Mode**: Automatically follows system preference

Theme persistence is handled through localStorage with immediate application on page load to prevent theme flashing.

### Theme Implementation
- CSS custom properties for theme values
- Tailwind CSS dark mode variants
- Zustand store for theme state management
- Early theme initialization script in HTML

## 📱 Mobile Optimizations

### Responsive Design Patterns
- **Breakpoints**: `sm:640px`, `md:768px`, `lg:1024px`, `xl:1280px`
- **Mobile-First**: Default styles for mobile, enhanced for larger screens
- **Touch Targets**: Minimum 44px for buttons and interactive elements
- **Typography**: Responsive text sizing with `text-sm sm:text-base` patterns

### Mobile-Specific Features
- Card-based task layout on mobile
- Always-visible action buttons (no hover dependency)
- Simplified navigation with icon-only buttons
- Stacked filter controls
- Optimized chart sizing

## 🔧 Configuration Files

- `vite.config.ts` - Vite configuration with path aliases
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `components.json` - shadcn/ui configuration

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deployment Options

1. **AWS Amplify**
   - Ensure Node.js 20+ runtime
   - Configure build settings for Vite 7

### Build Requirements
- Node.js 20+ (for Vite 7 compatibility)
- Build command: `npm run build`
- Output directory: `dist`

## 🔍 Performance

- **Bundle Size**: ~1MB (gzipped: ~314KB)
- **Build Time**: ~3 seconds
- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices)
- **Core Web Vitals**: Optimized for mobile and desktop

