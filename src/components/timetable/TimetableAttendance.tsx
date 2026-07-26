import React, { useState } from 'react';
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  UserCheck,
  Calendar,
  Save,
  Filter
} from 'lucide-react';
import { AttendanceEntry, TimetableSlot, StudentProfile, ClassStructure } from '../../types';

interface TimetableAttendanceProps {
  students: StudentProfile[];
  classes: ClassStructure[];
  timetable: TimetableSlot[];
  attendance: AttendanceEntry[];
  onSaveAttendance: (newEntries: AttendanceEntry[]) => void;
}

export const TimetableAttendance: React.FC<TimetableAttendanceProps> = ({
  students,
  classes,
  timetable,
  attendance,
  onSaveAttendance,
}) => {
  const [activeTab, setActiveTab] = useState<'rollcall' | 'timetable'>('rollcall');
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[4]?.id || classes[0].id); // SSS2
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const activeClass = classes.find((c) => c.id === selectedClassId) || classes[0];
  const classStudents = students.filter((s) => s.personal.className === activeClass.name) || students;

  // Local attendance state
  const [rollCallState, setRollCallState] = useState<Record<string, 'Present' | 'Absent' | 'Late' | 'Excused'>>({
    'stu-1': 'Present',
    'stu-3': 'Present',
    'stu-2': 'Present',
    'stu-4': 'Late',
  });

  const handleStatusChange = (studentId: string, status: 'Present' | 'Absent' | 'Late' | 'Excused') => {
    setRollCallState((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleSave = () => {
    const newEntries: AttendanceEntry[] = classStudents.map((stu) => ({
      id: `att-${Date.now()}-${stu.id}`,
      studentId: stu.id,
      studentName: `${stu.personal.surname} ${stu.personal.firstName}`,
      admissionNo: stu.personal.admissionNo,
      date: selectedDate,
      className: activeClass.name,
      arm: activeClass.arm,
      status: rollCallState[stu.id] || 'Present',
    }));

    onSaveAttendance(newEntries);
    alert('Daily Class Attendance Roll Call Saved Successfully!');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title Header */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-900 border border-purple-200 px-2.5 py-0.5 rounded-full">
            Daily Roll Call & Weekly Period Timetable
          </span>
          <h2 className="font-serif text-2xl font-bold text-stone-900 mt-1">
            Attendance & Class Schedule
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Record morning roll call attendance and view interactive period schedules.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 bg-stone-100 p-1.5 rounded-2xl border border-stone-200 text-xs font-bold">
          <button
            onClick={() => setActiveTab('rollcall')}
            className={`px-4 py-2 rounded-xl cursor-pointer transition-all ${
              activeTab === 'rollcall' ? 'bg-[#162825] text-white shadow-sm' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Daily Roll Call
          </button>
          <button
            onClick={() => setActiveTab('timetable')}
            className={`px-4 py-2 rounded-xl cursor-pointer transition-all ${
              activeTab === 'timetable' ? 'bg-[#162825] text-white shadow-sm' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Weekly Timetable
          </button>
        </div>
      </div>

      {activeTab === 'rollcall' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-stone-700">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span>Select Class:</span>
                <select
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  className="bg-stone-50 border border-stone-200 rounded-xl py-2 px-3 text-xs font-bold text-stone-800"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.arm})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span>Date:</span>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-stone-50 border border-stone-200 rounded-xl py-2 px-3 text-xs font-bold text-stone-800"
                />
              </div>
            </div>

            <button
              onClick={handleSave}
              className="bg-[#162825] hover:bg-[#203a36] text-[#f5ded7] font-bold text-xs py-2.5 px-5 rounded-xl flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Save className="w-4 h-4 text-[#f5ded7]" /> Save Daily Roll Call
            </button>
          </div>

          {/* Roll Call Table */}
          <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-[#162825] text-white uppercase font-bold text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Student Name</th>
                    <th className="py-3.5 px-4">Admission No</th>
                    <th className="py-3.5 px-4 text-center">Attendance Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {classStudents.map((stu) => {
                    const currentStatus = rollCallState[stu.id] || 'Present';

                    return (
                      <tr key={stu.id} className="hover:bg-stone-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-stone-900 flex items-center gap-2.5">
                          <img
                            src={stu.personal.passportUrl}
                            alt={stu.personal.firstName}
                            className="w-7 h-7 rounded-full object-cover"
                          />
                          <span>{stu.personal.surname}, {stu.personal.firstName}</span>
                        </td>

                        <td className="py-3.5 px-4 font-mono font-semibold text-stone-500">{stu.personal.admissionNo}</td>

                        <td className="py-3.5 px-4">
                          <div className="flex items-center justify-center gap-2">
                            {['Present', 'Late', 'Absent', 'Excused'].map((st) => (
                              <button
                                key={st}
                                type="button"
                                onClick={() => handleStatusChange(stu.id, st as any)}
                                className={`px-3 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                                  currentStatus === st
                                    ? st === 'Present'
                                      ? 'bg-emerald-800 text-white shadow-sm'
                                      : st === 'Late'
                                      ? 'bg-amber-600 text-white shadow-sm'
                                      : st === 'Absent'
                                      ? 'bg-rose-700 text-white shadow-sm'
                                      : 'bg-blue-700 text-white shadow-sm'
                                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                                }`}
                              >
                                {st}
                              </button>
                            ))}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'timetable' && (
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
          <h4 className="font-serif text-lg font-bold text-stone-900">Weekly Subject Period Schedule ({activeClass.name})</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {timetable.map((slot) => (
              <div key={slot.id} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <span className="text-[10px] font-bold uppercase bg-[#f5ded7] text-[#162825] px-2 py-0.5 rounded">
                  {slot.day} • {slot.startTime} - {slot.endTime}
                </span>
                <h5 className="font-serif text-base font-bold text-stone-900 mt-1">{slot.subjectName}</h5>
                <p className="text-xs text-stone-600">{slot.teacherName}</p>
                <p className="text-[10px] font-mono text-stone-400">Venue: {slot.room}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
