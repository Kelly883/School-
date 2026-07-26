import React, { useState } from 'react';
import {
  BookOpen,
  Box,
  CheckCircle2,
  Search,
  Plus
} from 'lucide-react';
import { LibraryBook, InventoryItem } from '../../types';

interface LibraryInventoryModuleProps {
  books: LibraryBook[];
  inventory: InventoryItem[];
}

export const LibraryInventoryModule: React.FC<LibraryInventoryModuleProps> = ({
  books,
  inventory,
}) => {
  const [activeTab, setActiveTab] = useState<'library' | 'inventory'>('library');

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-900 border border-emerald-200 px-2.5 py-0.5 rounded-full">
            School Assets & Library Catalog
          </span>
          <h2 className="font-serif text-2xl font-bold text-stone-900 mt-1">
            Library & Inventory Management
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Track textbook lending, library shelves, lab equipment and school furniture assets.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-stone-100 p-1.5 rounded-2xl border border-stone-200 text-xs font-bold">
          <button
            onClick={() => setActiveTab('library')}
            className={`px-4 py-2 rounded-xl cursor-pointer transition-all ${
              activeTab === 'library' ? 'bg-[#162825] text-white shadow-sm' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Library Catalog ({books.length})
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 rounded-xl cursor-pointer transition-all ${
              activeTab === 'inventory' ? 'bg-[#162825] text-white shadow-sm' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Asset Inventory ({inventory.length})
          </button>
        </div>
      </div>

      {activeTab === 'library' ? (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-[#162825] text-white uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Book Title & Author</th>
                <th className="py-3.5 px-4">ISBN</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Copies Available</th>
                <th className="py-3.5 px-4">Shelf Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {books.map((b) => (
                <tr key={b.id}>
                  <td className="py-3.5 px-4 font-bold text-stone-900">
                    <p>{b.title}</p>
                    <p className="text-[10px] text-stone-400 font-normal">{b.author}</p>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-stone-500">{b.isbn}</td>
                  <td className="py-3.5 px-4 font-medium">{b.category}</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-800">{b.copiesAvailable} / {b.totalCopies} Available</td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-stone-700">{b.locationShelf}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-[#162825] text-white uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Asset Name</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Stock Quantity</th>
                <th className="py-3.5 px-4">Condition</th>
                <th className="py-3.5 px-4">Last Inspected</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {inventory.map((inv) => (
                <tr key={inv.id}>
                  <td className="py-3.5 px-4 font-bold text-stone-900">{inv.name}</td>
                  <td className="py-3.5 px-4 font-medium">{inv.category}</td>
                  <td className="py-3.5 px-4 font-bold">{inv.quantity} {inv.unit}</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-800">{inv.condition}</td>
                  <td className="py-3.5 px-4 text-stone-500">{inv.lastChecked}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
