import * as React from "react"
import { cn } from "@nexsoft-admin/utils"

export type GridProps = {
  children: React.ReactNode
  className?: string
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
  mdCols?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
  lgCols?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
  gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16
  rowGap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16
  colGap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16
  flow?: "row" | "col" | "dense" | "row-dense" | "col-dense"
  rows?: number
  autoRows?: "auto" | "min" | "max" | "fr"
  autoCols?: "auto" | "min" | "max" | "fr"
  justify?: "start" | "end" | "center" | "between" | "around" | "evenly"
  items?: "start" | "end" | "center" | "baseline" | "stretch"
  as?: React.ElementType
}

const colsMap: Record<NonNullable<GridProps["cols"]>, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
  7: "grid-cols-7",
  8: "grid-cols-8",
  9: "grid-cols-9",
  10: "grid-cols-10",
  11: "grid-cols-11",
  12: "grid-cols-12",
}

const mdColsMap: Record<NonNullable<GridProps["mdCols"]>, string> = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
  5: "md:grid-cols-5",
  6: "md:grid-cols-6",
  7: "md:grid-cols-7",
  8: "md:grid-cols-8",
  9: "md:grid-cols-9",
  10: "md:grid-cols-10",
  11: "md:grid-cols-11",
  12: "md:grid-cols-12",
}

const lgColsMap: Record<NonNullable<GridProps["lgCols"]>, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
  6: "lg:grid-cols-6",
  7: "lg:grid-cols-7",
  8: "lg:grid-cols-8",
  9: "lg:grid-cols-9",
  10: "lg:grid-cols-10",
  11: "lg:grid-cols-11",
  12: "lg:grid-cols-12",
}

const gapMap: Record<NonNullable<GridProps["gap"]>, string> = {
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

const rowGapMap: Record<NonNullable<GridProps["rowGap"]>, string> = {
  0: "gap-y-0",
  1: "gap-y-1",
  2: "gap-y-2",
  3: "gap-y-3",
  4: "gap-y-4",
  5: "gap-y-5",
  6: "gap-y-6",
  8: "gap-y-8",
  10: "gap-y-10",
  12: "gap-y-12",
  16: "gap-y-16",
}

const colGapMap: Record<NonNullable<GridProps["colGap"]>, string> = {
  0: "gap-x-0",
  1: "gap-x-1",
  2: "gap-x-2",
  3: "gap-x-3",
  4: "gap-x-4",
  5: "gap-x-5",
  6: "gap-x-6",
  8: "gap-x-8",
  10: "gap-x-10",
  12: "gap-x-12",
  16: "gap-x-16",
}

const flowMap: Record<NonNullable<GridProps["flow"]>, string> = {
  row: "grid-flow-row",
  col: "grid-flow-col",
  dense: "grid-flow-dense",
  "row-dense": "grid-flow-row-dense",
  "col-dense": "grid-flow-col-dense",
}

const justifyMap: Record<NonNullable<GridProps["justify"]>, string> = {
  start: "justify-start",
  end: "justify-end",
  center: "justify-center",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly",
}

const itemsMap: Record<NonNullable<GridProps["items"]>, string> = {
  start: "items-start",
  end: "items-end",
  center: "items-center",
  baseline: "items-baseline",
  stretch: "items-stretch",
}

export const Grid = React.forwardRef<
  HTMLElement,
  GridProps & React.ComponentPropsWithoutRef<"div">
>(
  (
    {
      children,
      className,
      cols = 1,
      mdCols,
      lgCols,
      gap = 4,
      rowGap,
      colGap,
      flow,
      rows,
      autoRows,
      autoCols,
      justify,
      items,
      as: Component = "div",
      ...props
    },
    ref
  ) => {
    const gridClasses = cn(
      "grid",
      cols && colsMap[cols],
      mdCols && mdColsMap[mdCols],
      lgCols && lgColsMap[lgCols],
      gap !== undefined && gapMap[gap],
      rowGap !== undefined && rowGapMap[rowGap],
      colGap !== undefined && colGapMap[colGap],
      flow && flowMap[flow],
      rows && `grid-rows-${rows}`,
      autoRows && `auto-rows-${autoRows}`,
      autoCols && `auto-cols-${autoCols}`,
      justify && justifyMap[justify],
      items && itemsMap[items],
      className
    )

    return (
      <Component ref={ref as any} className={gridClasses} {...props}>
        {children}
      </Component>
    )
  }
)

Grid.displayName = "Grid"

