import { Button } from "@/components/ui/button"
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react"
import type { Column } from "@tanstack/react-table"
import type { Task } from "../types/task.types"

interface SortableHeaderProps {
  column: Column<Task, unknown>
  children: React.ReactNode
}

export function SortableHeader({ column, children }: SortableHeaderProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 p-0 font-medium hover:bg-transparent"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {children}
      {column.getIsSorted() === 'asc' ? (
        <ChevronUp className="ml-2 h-4 w-4" />
      ) : column.getIsSorted() === 'desc' ? (
        <ChevronDown className="ml-2 h-4 w-4" />
      ) : (
        <ChevronsUpDown className="ml-2 h-4 w-4 text-muted-foreground/50" />
      )}
    </Button>
  )
}

