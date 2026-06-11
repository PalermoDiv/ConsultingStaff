import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  type SortingState,
  type ColumnDef,
  flexRender,
} from '@tanstack/react-table'
import { useState } from 'react'
import type { Consultant } from '../../types/completetypes'

interface ConsultantsTableProps {
  data: Consultant[]
  onEdit: (consultant: Consultant) => void
  onDelete: (id: string) => void
}

export function ConsultantsTable({ data, onEdit, onDelete }: ConsultantsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')

  const columns: ColumnDef<Consultant>[] = [
    {
      accessorKey: 'first_name',
      header: 'Name',
      cell: ({ row }) => (
        <div>
          <div className="font-medium text-slate-900">
            {row.original.first_name} {row.original.last_name}
          </div>
          <div className="text-sm text-slate-500">{row.original.email}</div>
        </div>
      ),
    },
    {
      accessorKey: 'position',
      header: 'Position',
      cell: ({ row }) => (
        <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
          {row.original.position}
        </span>
      ),
    },
    {
      accessorKey: 'capacity_hours_per_week',
      header: 'Capacity',
      cell: ({ row }) => (
        <div className="text-sm text-slate-600">
          {row.original.capacity_hours_per_week}h/week
        </div>
      ),
    },
    {
      accessorKey: 'hourly_rate',
      header: 'Rate',
      cell: ({ row }) => (
        <div className="text-sm text-slate-600">
          {row.original.hourly_rate ? `$${row.original.hourly_rate}/hr` : '—'}
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(row.original)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(row.original.consultant_id)}
            className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
          >
            Delete
          </button>
        </div>
      ),
    },
  ]

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex items-center gap-4">
        <input
          type="text"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search consultants..."
          className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-64"
        />
        <span className="text-sm text-slate-500">
          {table.getFilteredRowModel().rows.length} consultant(s)
        </span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-1">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getIsSorted() && (
                        <span className="text-slate-400">
                          {header.column.getIsSorted() === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-slate-200">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
            {table.getRowModel().rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-500">
                  No consultants found. Add your first consultant!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
