import { createElement } from "@harvest/core";
import { Link, Outlet, Router } from "../../../packages/router/src";

const AuthLayout = () => {
  return (
    <div>
      <h1>Authentication Layout</h1>
      <main>
        <Outlet />
        <p>Este es el layout de autenticación</p>
      </main>
    </div>
  );
};

const DashboardLayout = ({ children }) =>
  createElement(
    "div",
    { className: "dashboard" },
    createElement(
      "nav",
      null,
      createElement(Link, { to: "/dashboard" }, "Dashboard"),
      createElement(Link, { to: "/dashboard/profile" }, "Profile")
    ),
    createElement("main", null, children || createElement(Outlet))
  );

// 2. Páginas
const Login = () =>
  createElement(
    "div",
    null,
    createElement("h2", null, "Login Page"),
    createElement(
      "button",
      {
        onClick: () => {
          setAuthenticated(true);
          navigate("/dashboard");
        },
      },
      "Login"
    ),
    createElement(Link, { to: "/dashboard" }, "Go to Dashboard")
  );

const Dashboard = () => createElement("div", null, "Dashboard Home");

// 3. Configurar rutas
const routes = [
  {
    path: "/auth",
    element: createElement(AuthLayout),
    children: [
      {
        path: "/login",
        element: createElement(Login),
      },
    ],
  },
  {
    path: "/dashboard",
    element: createElement(DashboardLayout),
    children: [
      {
        path: "/",
        element: createElement(Dashboard),
      },
    ],
  },
];

const AppRouter = () => createElement(Router, { routes });

export default AppRouter;
