import React, { useState } from 'react';
import {
  ShieldCheck,
  Settings,
  Save,
  CheckCircle2,
  Lock,
  Clock,
  Building
} from 'lucide-react';
import { SchoolSettings, AuditLog } from '../../types';

interface AuditSettingsModuleProps {
  schoolSettings: SchoolSettings;
  auditLogs: AuditLog[];
  onSaveSettings: (settings: SchoolSettings) => void;
}

export const AuditSettingsModule: React.FC<AuditSettingsModuleProps> = ({
  schoolSettings,
  auditLogs,
  onSaveSettings,
}) => {
  const [activeTab, setActiveTab] = useState<'settings' | 'audit'>('settings');
  const [formData, setFormData] = useState<SchoolSettings>(schoolSettings);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-[#162825] text-white px-2.5 py-0.5 rounded-full">
            Super Admin Portal Control
          </span>
          <h2 className="font-serif text-2xl font-bold text-stone-900 mt-1">
            School Settings & Audit Trail
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Configure school profile, session settings & track security audit logs.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-stone-100 p-1.5 rounded-2xl border border-stone-200 text-xs font-bold">
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl cursor-pointer transition-all ${
              activeTab === 'settings' ? 'bg-[#162825] text-white shadow-sm' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            School Configuration
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2 rounded-xl cursor-pointer transition-all ${
              activeTab === 'audit' ? 'bg-[#162825] text-white shadow-sm' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Audit Logs ({auditLogs.length})
          </button>
        </div>
      </div>

      {activeTab === 'settings' ? (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4 text-xs text-stone-800">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-stone-900 mb-1">School Name *</label>
              <input
                type="text"
                required
                value={formData.schoolName}
                onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-900 mb-1">School Motto / Slogan</label>
              <input
                type="text"
                value={formData.motto}
                onChange={(e) => setFormData({ ...formData, motto: e.target.value })}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl italic"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-stone-900 mb-1">Current Academic Session *</label>
              <input
                type="text"
                value={formData.currentSession}
                onChange={(e) => setFormData({ ...formData, currentSession: e.target.value })}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-mono font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-900 mb-1">Current Academic Term *</label>
              <select
                value={formData.currentTerm}
                onChange={(e) => setFormData({ ...formData, currentTerm: e.target.value as any })}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold"
              >
                <option value="First Term">First Term</option>
                <option value="Second Term">Second Term</option>
                <option value="Third Term">Third Term</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-900 mb-1">Currency Symbol</label>
              <input
                type="text"
                value={formData.currencySymbol}
                onChange={(e) => setFormData({ ...formData, currencySymbol: e.target.value })}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-stone-900 mb-1">Principal Name *</label>
              <input
                type="text"
                value={formData.principalName}
                onChange={(e) => setFormData({ ...formData, principalName: e.target.value })}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-900 mb-1">Bursar Name *</label>
              <input
                type="text"
                value={formData.bursarName}
                onChange={(e) => setFormData({ ...formData, bursarName: e.target.value })}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-stone-900 mb-1">Address in Nigeria</label>
            <textarea
              rows={2}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-3 bg-[#162825] hover:bg-[#203a36] text-[#f5ded7] font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-md"
          >
            {isSaved ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4 text-[#f5ded7]" />}
            <span>{isSaved ? 'Settings Updated!' : 'Save System Configuration'}</span>
          </button>
        </form>
      ) : (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-[#162825] text-white uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">User & Role</th>
                <th className="py-3.5 px-4">Action Performed</th>
                <th className="py-3.5 px-4">System Details</th>
                <th className="py-3.5 px-4">IP Address</th>
                <th className="py-3.5 px-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {auditLogs.map((log) => (
                <tr key={log.id}>
                  <td className="py-3.5 px-4 font-bold text-stone-900">
                    <p>{log.userName}</p>
                    <p className="text-[10px] text-stone-400 font-normal uppercase">{log.role}</p>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-emerald-800">{log.action}</td>
                  <td className="py-3.5 px-4 text-stone-600">{log.details}</td>
                  <td className="py-3.5 px-4 font-mono text-stone-500">{log.ipAddress}</td>
                  <td className="py-3.5 px-4 text-stone-400 font-mono">{log.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
