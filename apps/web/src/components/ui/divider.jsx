import { createElement } from "@harvest/core";
import { cva } from "class-variance-authority";

const dividerVariants = cva("shrink-0", {
  variants: {
    orientation: {
      horizontal: "w-full h-px my-4",
      vertical: "h-full w-px mx-4",
    },
    margin: {
      none: "!m-0",
    },
    color: {
      dark: "bg-divider-dark",
      light: "bg-divider",
    }
  },
  defaultVariants: {
    orientation: "horizontal",
    color: "light",
  },
});

const Divider = ({
  orientation = "horizontal",
  margin,
  color,
  className,
  ...props
}) => {
  const classes = dividerVariants({ orientation, margin, color });

  return createElement("div", {
    role: "separator",
    "aria-orientation": orientation,
    className: [className, classes].filter(Boolean).join(" "),
    ...props,
  });
};

export default Divider;
