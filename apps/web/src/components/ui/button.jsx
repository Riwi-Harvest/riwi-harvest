import { createElement } from "@harvest/core";
import { cva } from "class-variance-authority";

// ✅ Definición de variantes con tus colores
const buttonVariants = cva(
  "inline-flex items-center gap-2 rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      color: {
        dashboard: "bg-[#6366F1] text-white hover:brightness-90", // azul
        clanes: "bg-[#A78BFA] text-white hover:brightness-90 ",   // morado
        coder: "bg-[#F87171] text-white hover:brightness-90 ",   // rojo
        desarrollo: "bg-[#34D399] text-white hover:brightness-90 ", // verde
        english: "bg-[#60A5FA] text-white hover:brightness-90 ", // celeste
        hplv: "bg-[#FACC15] text-black hover:brightness-90",    // amarillo
        versus: "bg-[#F472B6] text-white hover:brightness-90",  // rosa
      },
      size: {
        small: "p-1 text-sm",
        medium: "py-2 px-4",
        large: "p-3 text-lg",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
      align: {
        left: "justify-start",
        center: "justify-center",
        right: "justify-end",
      },
    },
    defaultVariants: {
      color: "dashboard", // por defecto
      size: "medium",
      fullWidth: false,
      align: "center",
    },
  }
);

const Button = ({
  component: Component = "button",
  children,
  className,
  icon,
  active,
  align,
  color,
  size,
  fullWidth,
  ...props
}) => {
  const classes = buttonVariants({
    color,
    size,
    fullWidth,
    align,
  });

  const elementProps = {
    className: [className, classes].filter(Boolean).join(" "),
    ...(active && { "data-active": "true" }),
    ...props,
  };

  const content = (
    <>
      {icon && icon}
      {children}
    </>
  );

  if (Component) {
    return createElement(Component, elementProps, content);
  }

  return createElement("button", elementProps, content);
};

export default Button;
