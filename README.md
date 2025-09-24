# Robyn - Personal Emotional Support AI

A modern, production-ready Next.js application with a beautiful sidebar and top bar navigation system. Built with TypeScript, Tailwind CSS, and Framer Motion for smooth animations.

## 🎨 Design Features

- **Beautiful Theme Colors**: Extracted from the provided image with blues, purples, and soft yellows
- **Responsive Layout**: Collapsible sidebar with mobile-friendly navigation
- **Smooth Animations**: Framer Motion powered transitions and hover effects
- **Modern UI**: Clean, professional design with subtle gradients and shadows
- **Production Ready**: Modular architecture with TypeScript support

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles with custom theme
│   ├── layout.tsx         # Root layout with Layout component
│   └── page.tsx           # Home page with Hello World content
├── components/
│   ├── layout/            # Layout components
│   │   ├── Layout.tsx     # Main layout wrapper
│   │   ├── Sidebar.tsx    # Collapsible sidebar navigation
│   │   └── TopBar.tsx     # Top navigation bar
│   └── ui/                # Reusable UI components (ready for expansion)
├── lib/
│   └── utils.ts           # Utility functions (cn, debounce, etc.)
├── types/
│   └── index.ts           # TypeScript type definitions
└── hooks/                 # Custom React hooks (ready for expansion)
```

## 🎨 Theme Colors

The application uses a carefully crafted color palette extracted from your image:

- **Primary**: Beautiful blues (#0ea5e9 and variants)
- **Secondary**: Rich purples (#a855f7 and variants)
- **Accent**: Warm yellows (#eab308 and variants)
- **Neutral**: Clean grays for text and backgrounds

## ✨ Key Features

### Sidebar Navigation

- Collapsible design with smooth animations
- Hover tooltips in collapsed state
- Badge support for notifications
- Responsive mobile overlay

### Top Bar

- Search functionality
- User profile section
- Notification indicators
- Theme toggle ready
- Breadcrumb navigation

### Animations

- Framer Motion powered transitions
- Hover effects on interactive elements
- Smooth page transitions
- Loading states and micro-interactions

## 🛠 Technologies

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety and better DX
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Lucide React** - Beautiful icon library

## 📱 Responsive Design

The application is fully responsive with:

- Mobile-first approach
- Collapsible sidebar on desktop
- Mobile overlay navigation
- Adaptive layouts for all screen sizes

## 🎯 Ready for Interview

This setup provides:

- ✅ Modern Next.js architecture
- ✅ TypeScript configuration
- ✅ Beautiful, professional UI
- ✅ Smooth animations and interactions
- ✅ Modular component structure
- ✅ Production-ready code quality
- ✅ Responsive design
- ✅ Clean folder organization

Perfect foundation to build upon during your interview! 🚀
