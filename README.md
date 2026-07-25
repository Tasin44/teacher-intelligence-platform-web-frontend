# 🧠 EduPulse AI - Teacher Intelligence Platform

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)

**EduPulse AI** is a cutting-edge web application designed to empower educators through artificial intelligence. By seamlessly bridging the gap between student diagnostics and actionable teaching strategies, EduPulse AI provides real-time, personalized lesson modifications, progress tracking, and automated parent communication—all in one sleek, modern dashboard.

---

## ✨ Key Features

- **🤖 AI-Driven Lesson Modifications** 
  Instantly adapt standard curriculum plans based on class diagnostic averages. Generates targeted scaffolding strategies for struggling students and enrichment tasks for advanced learners.
- **📊 Interactive Progress Tracking** 
  Visualize student scores over time with dynamic SVG charts. Track reading levels, attendance rates, and risk statuses across multiple subjects simultaneously.
- **🎯 Targeted Interventions & Groupings**
  Group students based on performance metrics and assign tailored interventions (e.g., extra tutoring, behavioral support). Maintain an archived log of all applied modifications.
- **💬 Automated Parent Communication**
  Generate customized, professional progress reports and updates to easily send to parents via email.
- **📱 Modern & Responsive UI/UX**
  A beautifully designed interface built with Tailwind CSS, featuring glassmorphism elements, micro-animations, and intuitive user flows.

## 🛠️ Technology Stack

**Frontend Architecture:**
- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **State Management & Data Fetching:** React Hooks, Custom API Client
- **Charts:** Custom-built interactive SVG charting

**Backend Integration:**
- Consumes a robust Django REST API backend (secure token-based authentication).

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Tasin44/teacher-intelligence-platform-web-frontend.git
   cd teacher-intelligence-platform-web-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up Environment Variables:**
   Create a `.env.local` file in the root directory and configure the backend API URL:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## 📂 Project Structure

```text
src/
├── app/                  # Next.js App Router (Pages, Layouts, Routing)
├── components/           # Reusable UI Components
│   ├── app/              # Feature-specific components (Lesson Plans, Progress, etc.)
│   ├── auth/             # Authentication components
│   ├── modal/            # Popups and Dialogs
│   ├── shared/           # Generic UI components (Buttons, Cards, Inputs)
│   └── ui/               # Base UI elements
├── lib/                  # Utilities and Services
│   └── api/              # Axios API client and type definitions
├── types/                # Global TypeScript definitions
└── redux/                # Global State Management (Auth, User Settings)
```

## 💡 Why This Project Stands Out

EduPulse AI demonstrates a strong understanding of modern web development principles:
- **Clean Architecture:** Strict separation of concerns between UI components and API fetching logic.
- **Type Safety:** Comprehensive TypeScript interfaces for robust, error-free development.
- **Complex UI Handling:** Custom interactive data visualizations without relying heavily on bloated 3rd-party charting libraries.
- **Robust Error Handling:** Beautiful fallback UIs and graceful API error management.
- **AI Integration:** Practical application of generative AI to solve real-world educational challenges.

---

*Designed and engineered with a passion for educational technology.*
