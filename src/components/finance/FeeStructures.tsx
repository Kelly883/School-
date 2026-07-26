import React, { useState } from 'react';
import {
  CreditCard,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  Building,
  Receipt
} from 'lucide-react';
import { FeeStructure, SchoolLevel } from '../../types';
import { formatNaira } from '../../utils/formatters';

interface FeeStructuresProps {
  feeStructures: FeeStructure[];
  onUpdateFeeStructures: (updated: FeeStructure[]) => void;
}

export const FeeStructures: React.FC<FeeStructuresProps> = ({
  feeStructures,
  onUpdateFeeStructures,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<SchoolLevel>('senior_secondary');
  const [localFeeStructures, setLocalFeeStructures] = useState<FeeStructure[]>(feeStructures);
  const [isSaved, setIsSaved] = useState(false);

  const activeStructure = localFeeStructures.find((f) => f.level === selectedLevel) || localFeeStructures[3];

  const handleAddItem = () => {
    const newItem = {
      id: `item-${Date.now()}`,
      title: 'New Fee Category',
      amount: 10000,
      isCompulsory: true,
    };

    const updated = localFeeStructures.map((f) => {
      if (f.level === selectedLevel) {
        const items = [...f.items, newItem];
        const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);
        return { ...f, items, totalAmount };
      }
      return f;
    });

    setLocalFeeStructures(updated);
  };

  const handleRemoveItem = (itemId: string) => {
    const updated = localFeeStructures.map((f) => {
      if (f.level === selectedLevel) {
        const items = f.items.filter((i) => i.id !== itemId);
        const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);
        return { ...f, items, totalAmount };
      }
      return f;
    });

    setLocalFeeStructures(updated);
  };

  const handleItemChange = (itemId: string, field: string, val: any) => {
    const updated = localFeeStructures.map((f) => {
      if (f.level === selectedLevel) {
        const items = f.items.map((i) => {
          if (i.id === itemId) {
            return { ...i, [field]: val };
          }
          return i;
        });
        const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);
        return { ...f, items, totalAmount };
      }
      return f;
    });

    setLocalFeeStructures(updated);
  };

  const handleSave = () => {
    onUpdateFeeStructures(localFeeStructures);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title Header */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-0.5 rounded-full">
            Bursary & Fee Schedule Configuration
          </span>
          <h2 className="font-serif text-2xl font-bold text-stone-900 mt-1">
            School Fee Breakdown Setup
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Set termly tuition, ICT, PTA, and practical levies per academic level in Nigerian Naira (₦).
          </p>
        </div>

        <button
          onClick={handleSave}
          className="bg-[#162825] hover:bg-[#203a36] text-[#f5ded7] font-bold text-xs py-3 px-6 rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-md self-start md:self-auto"
        >
          {isSaved ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4 text-[#f5ded7]" />}
          <span>{isSaved ? 'Fee Schedule Saved!' : 'Save Fee Changes'}</span>
        </button>
      </div>

      {/* Level Selector Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-2 overflow-x-auto text-xs font-bold">
        {[
          { level: 'nursery', label: 'Nursery & Creche' },
          { level: 'primary', label: 'Primary School' },
          { level: 'junior_secondary', label: 'Junior Secondary (JSS)' },
          { level: 'senior_secondary', label: 'Senior Secondary (SSS)' },
        ].map((tab) => (
          <button
            key={tab.level}
            onClick={() => setSelectedLevel(tab.level as SchoolLevel)}
            className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
              selectedLevel === tab.level
                ? 'bg-[#162825] text-white shadow-sm'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Breakdown Items List */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
          <div>
            <h4 className="font-serif text-base sm:text-lg font-bold text-stone-900">
              Fee Schedule Item Breakdown ({activeStructure.term} - {activeStructure.session})
            </h4>
            <p className="text-xs text-stone-500">Items auto-sum into total student billable balance</p>
          </div>
          <div className="text-left sm:text-right bg-stone-50 sm:bg-transparent p-2 sm:p-0 rounded-xl border sm:border-0 border-stone-200">
            <span className="text-[11px] text-stone-500 font-medium">Total Payable per Student:</span>
            <p className="text-lg sm:text-xl font-extrabold text-[#162825]">{formatNaira(activeStructure.totalAmount)}</p>
          </div>
        </div>

        <div className="space-y-3">
          {activeStructure.items.map((item) => (
            <div key={item.id} className="p-3 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
              <input
                type="text"
                value={item.title}
                onChange={(e) => handleItemChange(item.id, 'title', e.target.value)}
                className="flex-1 min-w-0 bg-white border border-stone-200 rounded-xl p-2 text-xs font-bold text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#162825]"
              />

              <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
                <div className="flex items-center gap-1.5 bg-white border border-stone-200 rounded-xl px-2.5 py-1.5">
                  <span className="text-xs font-bold text-stone-500">₦</span>
                  <input
                    type="number"
                    value={item.amount}
                    onChange={(e) => handleItemChange(item.id, 'amount', Number(e.target.value))}
                    className="w-24 sm:w-28 bg-transparent text-xs font-extrabold text-stone-900 focus:outline-none"
                  />
                </div>

                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer shrink-0"
                  title="Remove Fee Item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleAddItem}
          className="mt-2 w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs rounded-xl border border-dashed border-stone-300 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add New Fee Levy
        </button>
      </div>
    </div>
  );
};
