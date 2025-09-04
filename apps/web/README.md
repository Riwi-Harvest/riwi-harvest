# 🌐 Web Application (`apps/web`)

This package is the **front-end** of the project, built with a React-like architecture using internal packages [`@harvest/core`](packages/core) and [`@harvest/router`](apps/web/src/router.jsx). The app uses Vite for development ⚡ and TailwindCSS for styling 🎨.

## 🛠️ Technologies Used

- **Vite** ⚡ — Ultra-fast bundler and development server.
 **TailwindCSS** 🎨 — Utility-first CSS framework.
- **Power BI Embedded** 🔗 — Embedded dashboards and interactive reports.
- **@harvest/core** 🏗️ — Custom core components and hooks.
- **@harvest/router** 🧭 — SPA routing system.
- **JavaScript (ES6+)** ✍️ — Main language for the front-end.

## ✨ Main Features

- 🧭 **SPA** with dynamic routing using [`@harvest/router`](apps/web/src/router.jsx).
- 🧩 Reusable components and custom hooks via [`@harvest/core`](packages/core).
- 📊 Data visualization with Chart.js and chartjs-plugin-datalabels.
- 📚 Customizable sidebar and header.
- 🔗 **Power BI integration**: Embedded connection to display dashboards and charts directly on the main page.
- 🗂️ Route support for Dashboard, Clanes, Coders, Desarrollo, English, HPLV, Versus, and Sede.
- 🎨 Modern styling with TailwindCSS.

## 🗂️ Project Structure

```
apps/web/
├── index.html
├── jsconfig.json
├── package.json
├── vite.config.mjs
├── src/
│   ├── components/
│   ├── page/
│   ├── router.jsx
│   └── index.jsx
└── node_modules/
```

## 🛠️ Available Scripts

- `npm run dev` — start the development server 🚀
- `npm run build` — build the app for production 🏗️
- `npm run start` — serve the production build locally 🌍

## ⚙️ Installation & Usage

1. Go to the front-end directory:

   ```bash
   cd apps/web
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start in development mode:

   ```bash
   npm run dev
   ```

4. Access the app at [http://localhost:5173](http://localhost:5173) (or the port shown by Vite).

## 📈 Power BI Integration

The main page includes an iframe that connects to a Power BI dashboard, allowing users to view interactive charts and reports directly from the web app for institutional data analysis.

---

This front-end is MIT licensed and is part of the main
