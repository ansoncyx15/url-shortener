"use client";

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import cn from "@/lib/cn";

function Tabs({ className, ...props }) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

function TabsList({ className, children, ...props }) {
  const listClassName = cn(
    "relative z-0 flex w-fit items-center justify-center gap-x-0.5 rounded-full bg-[#e6e2d4] p-0.5",
    className,
  );

  const indicatorClassName = cn(
    "absolute bottom-0 left-0 -z-1 h-(--active-tab-height) w-(--active-tab-width) rounded-full bg-white shadow-sm",
    "translate-x-(--active-tab-left) -translate-y-(--active-tab-bottom) transition-[width,translate] duration-200 ease-in-out",
  );

  return (
    <TabsPrimitive.List data-slot="tabs-list" className={listClassName} {...props}>
      {children}
      <TabsPrimitive.Indicator data-slot="tab-indicator" className={indicatorClassName} />
    </TabsPrimitive.List>
  );
}

function TabsTab({ className, ...props }) {
  const tabClassName = cn(
    "flex shrink-0 grow cursor-pointer items-center justify-center rounded-md px-2 py-1 whitespace-nowrap outline-none",
    "transition-[color,background-color,box-shadow]",
    className,
  );

  return <TabsPrimitive.Tab data-slot="tabs-tab" className={tabClassName} {...props} />;
}

export { Tabs, TabsList, TabsTab };
