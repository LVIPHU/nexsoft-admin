import * as React from "react"
import { cn } from "@nexsoft-admin/utils"

export type FlexProps = {
  children: React.ReactNode
  className?: string
  direction?: "row" | "col" | "row-reverse" | "col-reverse"
  wrap?: "nowrap" | "wrap" | "wrap-reverse"
  justify?: "start" | "end" | "center" | "between" | "around" | "evenly"
  items?: "start" | "end" | "center" | "baseline" | "stretch"
  gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16
  grow?: boolean
  shrink?: boolean
  basis?: "auto" | "0" | "1" | "full"
  as?: React.ElementType
}

const directionMap: Record<NonNullable<FlexProps["direction"]>, string> = {
  row: "flex-row",
  col: "flex-col",
  "row-reverse": "flex-row-reverse",
  "col-reverse": "flex-col-reverse",
}

const wrapMap: Record<NonNullable<FlexProps["wrap"]>, string> = {
  nowrap: "flex-nowrap",
  wrap: "flex-wrap",
  "wrap-reverse": "flex-wrap-reverse",
}

const justifyMap: Record<NonNullable<FlexProps["justify"]>, string> = {
  start: "justify-start",
  end: "justify-end",
  center: "justify-center",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly",
}

const itemsMap: Record<NonNullable<FlexProps["items"]>, string> = {
  start: "items-start",
  end: "items-end",
  center: "items-center",
  baseline: "items-baseline",
  stretch: "items-stretch",
}

const basisMap: Record<NonNullable<FlexProps["basis"]>, string> = {
  auto: "basis-auto",
  "0": "basis-0",
  "1": "basis-1",
  full: "basis-full",
}

const gapMap: Record<NonNullable<FlexProps["gap"]>, string> = {
  0: "gap-0",
  1: "gap-1",
  2: "gap-2",
  3: "gap-3",
  4: "gap-4",
  5: "gap-5",
  6: "gap-6",
  8: "gap-8",
  10: "gap-10",
  12: "gap-12",
  16: "gap-16",
}

export const Flex = React.forwardRef<
  HTMLElement,
  FlexProps & React.ComponentPropsWithoutRef<"div">
>(
  (
    {
      children,
      className,
      direction = "row",
      wrap = "nowrap",
      justify = "start",
      items = "start",
      gap = 0,
      grow = false,
      shrink = false,
      basis,
      as: Component = "div",
      ...props
    },
    ref
  ) => {
    const flexClasses = cn(
      "flex",
      directionMap[direction],
      wrapMap[wrap],
      justifyMap[justify],
      itemsMap[items],
      gap !== undefined && gapMap[gap],
      grow && "grow",
      shrink && "shrink",
      basis && basisMap[basis],
      className
    )

    return (
      <Component ref={ref as any} className={flexClasses} {...props}>
        {children}
      </Component>
    )
  }
)

Flex.displayName = "Flex"

