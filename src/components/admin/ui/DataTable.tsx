import type { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface DataTableProps<T> {
  data: T[];
  columns: {
    key: string;
    header: string;
    render?: (item: T) => ReactNode;
  }[];
  isLoading: boolean;
  emptyMessage?: string;
}

export function DataTable<T extends { id: string | number }>({
  data,
  columns,
  isLoading,
  emptyMessage = 'No data available',
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="animate-spin text-indigo-500" size={32} />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12 bg-[#050c1a] border border-indigo-500/10 rounded-xl">
        <p className="text-slate-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-indigo-500/10 bg-[#0a1628]">
      <table className="w-full text-left text-sm text-slate-300">
        <thead className="bg-[#050c1a] border-b border-indigo-500/10 text-slate-400 font-medium">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-6 py-4">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-indigo-500/5">
          {data.map((row) => (
            <tr key={row.id} className="hover:bg-white/[0.02] transition-colors">
              {columns.map((col) => (
                <td key={col.key} className="px-6 py-4 whitespace-nowrap">
                  {col.render ? col.render(row) : String((row as any)[col.key] || '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
