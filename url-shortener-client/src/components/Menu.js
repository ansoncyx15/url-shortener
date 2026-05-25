"use client";

import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import cn from "@/lib/cn";

function Menu(props) {
  return <MenuPrimitive.Root {...props} />;
}

function MenuTrigger({ className, ...props }) {
  return (
    <MenuPrimitive.Trigger
      data-slot="menu-trigger"
      className={cn(
        "inline-flex cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-gray-400",
        className,
      )}
      {...props}
    />
  );
}

function MenuContent({ className, side = "bottom", align = "end", sideOffset = 5, ...props }) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner side={side} align={align} sideOffset={sideOffset} className="z-50">
        <MenuPrimitive.Popup
          data-slot="menu-content"
          className={cn(
            "min-w-44 origin-top-right rounded-lg border border-[#e6e2d4] bg-[#f5f3ec] p-1 text-sm shadow-lg outline-none",
            "transition duration-100 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0",
            className,
          )}
          {...props}
        />
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  );
}

function MenuItem({ className, ...props }) {
  return (
    <MenuPrimitive.Item
      data-slot="menu-item"
      className={cn(
        "flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 outline-none select-none",
        "data-disabled:cursor-not-allowed data-disabled:opacity-50 data-highlighted:bg-[#e6e2d4]",
        className,
      )}
      {...props}
    />
  );
}

function MenuLabel({ className, ...props }) {
  return (
    <div
      data-slot="menu-label"
      className={cn("px-2 py-1.5 text-xs text-muted-foreground", className)}
      {...props}
    />
  );
}

function MenuSeparator({ className, ...props }) {
  return (
    <MenuPrimitive.Separator
      data-slot="menu-separator"
      className={cn("-mx-1 my-1 h-px bg-[#e6e2d4]", className)}
      {...props}
    />
  );
}

export { Menu, MenuTrigger, MenuContent, MenuItem, MenuLabel, MenuSeparator };
