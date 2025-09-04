import Button from "@/components/ui/button";
import { Link, useLocation } from "@harvest/router";
import Divider from "../ui/divider";

const routes = [
  {
    name: "Dashboard",
    to: "/",
    icon: "fa-solid fa-house",
    component: Link,
    color: "dashboard", // azul
  },
  {
    name: "Clanes",
    to: "/clanes",
    icon: "fa-solid fa-users",
    component: Link,
    color: "clanes", // morado
  },
  {
    name: "Coders",
    to: "/coders",
    icon: "fa-solid fa-person",
    component: Link,
    color: "coder", // rojo
  },
  {
    name: "Desarrollo",
    to: "/desarrollo",
    icon: "fa-solid fa-code",
    component: Link,
    color: "desarrollo", // verde
  },
    {
    name: "HPLV",
    to: "/hplv",
    icon: "fa-solid fa-code",
    component: Link,
    color: "versus", // verde
  },
];

export default function Sidebar() {
  const active = useLocation().pathname;
  return (
    <div className="sticky top-[calc(var(--spacing)*15)] h-[calc(100dvh-(var(--spacing)*15.1))] inline-flex flex-col gap-2 w-(--sidebar-width) bg-branch  border-r-divider p-4">
      <div className="flex flex-1 flex-col gap-6 mt-4 ">
        {routes.map((route) => (
          <Button
            key={route.to}
            align="center"
            fullWidth
            active={active === route.to}
            asChild
            icon={<i className={route.icon}></i>}
            component={route.component}
            to={route.to}
            color={route.color}  // 👈 aquí se pasa el color definido en cada ruta
          >
            {route.name}
          </Button>
        ))}
        <Divider margin="20px" color="dark"/>
        <Button
          align="left"
          fullWidth
          icon={<i className="fa-solid fa-arrow-right-arrow-left"></i>}
          component={Link}
          to="/sede"
          color="desarrollo" 
        >
          Cambiar sede
        </Button>
      </div>
      <Button className="sticky bottom-0" variant="outline">
        Usuario
      </Button>
    </div>
  );
}
