"use client"

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  filterColumn?: string
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filterColumn,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [globalFilter, setGlobalFilter] = React.useState<string>("")

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(), // 同时处理全局和列过滤
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: "includesString",
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
  })

    const firstFilterCol = filterColumn ?? table.getAllColumns()[0].id

  return (
    <div>
      {/* --- Toolbar --- */}
      <div className="flex items-center py-4 gap-4">
        <Input
          placeholder="搜索…"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              列显示
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((col) => col.getCanHide())
              .map((col) => {
                const headerDef = col.columnDef.header
                const title =
                  typeof headerDef === "string"
                    ? headerDef
                    : (headerDef as () => React.ReactNode)()

                return (
                  <DropdownMenuCheckboxItem
                    key={col.id}
                    checked={col.getIsVisible()}
                    onCheckedChange={() => col.toggleVisibility()}
                    className="capitalize"
                  >
                    {title}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* --- Table --- */}
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => (
                  <TableHead key={header.id} className="whitespace-nowrap">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  暂无数据
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* --- 分页控件 --- */}
      <div className="flex justify-end py-4">
        <Pagination>
          <PaginationContent>
            {/* 上一页 */}
            <PaginationPrevious
              onClick={() => table.previousPage()}
              href="#"
              aria-disabled={!table.getCanPreviousPage()}
              tabIndex={!table.getCanPreviousPage() ? -1 : undefined}
              className={!table.getCanPreviousPage() ? "pointer-events-none opacity-50" : undefined}
            />

            {/* 中间页码 */}
            {Array.from({ length: table.getPageCount() }).map((_, idx) => (
              <PaginationItem key={idx}>
                <PaginationLink
                  onClick={() => table.setPageIndex(idx)}
                  href="#"
                  isActive={table.getState().pagination.pageIndex === idx}
                >
                  {idx + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            {/* 下一页 */}
            <PaginationNext
              onClick={() => table.nextPage()}
              href="#"
              aria-disabled={!table.getCanNextPage()}
              tabIndex={!table.getCanNextPage() ? -1 : undefined}
              className={!table.getCanNextPage() ? "pointer-events-none opacity-50" : undefined}
            />
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
