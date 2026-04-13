"use client";

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { cn } from "@/src/lib/utils";

function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      className={cn(
        "group/tabs flex gap-2 data-horizontal:flex-col",
        className,
      )}
      {...props}
    />
  );
}

function TabsList({ className, ...props }: TabsPrimitive.List.Props) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "flex w-full justify-between rounded-sm border border-amber-50 text-sm leading-4 text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className="flex justify-center text-sm leading-4 rounded-sm px-3 py-1.5 text-muted-foreground aria-selected:bg-primary aria-selected:text-primary-foreground data-[state=disabled]:pointer-events-none data-[state=disabled]:opacity-50 data-[state=disabled]:bg-transparent "
      {...props}
    />
  );
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={
        (cn("flex-1 text-sm outline-none", className),
        "aria-disabled:text-muted-foreground aria-disabled:opacity-50 aria-disabled:bg-transparent")
      }
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
