import React, { useState } from 'react';
import {
  X,
  Check,
  User,
  Users,
  Building,
  FileCheck,
  Upload,
  Sparkles,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { StudentProfile, ClassName, ClassArm } from '../../types';
import { generateAdmissionNumber } from '../../utils/formatters';

interface AdmissionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveStudent: (newStudent: StudentProfile) => void;
  studentCount: number;
}

export const AdmissionForm: React.FC<AdmissionFormProps> = ({
  isOpen,
  onClose,
  onSaveStudent,
  studentCount,
}) => {
  if (!isOpen) return null;

  const [activeStep, setActiveStep] = useState<number>(1);

  // Form State
  const [admissionNo] = useState<string>(generateAdmissionNumber('SCH', '2026', studentCount));
  const [surname, setSurname] = useState('');
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [dob, setDob] = useState('2012-04-15');
  const [age, setAge] = useState(14);
  const [religion, setReligion] = useState<'Christianity' | 'Islam' | 'Other'>('Christianity');
  const [stateOfOrigin, setStateOfOrigin] = useState('Lagos');
  const [lga, setLga] = useState('Ikeja');
  const [address, setAddress] = useState('12 Allen Avenue, Ikeja, Lagos');
  const [bloodGroup, setBloodGroup] = useState<'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'>('O+');
  const [genotype, setGenotype] = useState<'AA' | 'AS' | 'SS' | 'AC'>('AA');
  const [medicalConditions, setMedicalConditions] = useState('None');
  const [disabilityStatus, setDisabilityStatus] = useState('None');
  const [className, setClassName] = useState<ClassName>('JSS3');
  const [arm, setArm] = useState<ClassArm>('Arm A');
  const [house, setHouse] = useState<'Red House' | 'Blue House' | 'Green House' | 'Yellow House'>('Red House');
  const [passportUrl, setPassportUrl] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80');

  // Parent State
  const [fatherName, setFatherName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [occupation, setOccupation] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');

  // Previous School
  const [prevSchool, setPrevSchool] = useState('');
  const [prevClass, setPrevClass] = useState('');
  const [transferReason, setTransferReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newStudent: StudentProfile = {
      id: `stu-${Date.now()}`,
      personal: {
        admissionNo,
        surname: surname || 'Olamide',
        firstName: firstName || 'Chidera',
        middleName,
        passportUrl,
        gender,
        dateOfBirth: dob,
        age: Number(age),
        religion,
        stateOfOrigin,
        lga,
        nationality: 'Nigerian',
        address,
        bloodGroup,
        genotype,
        medicalConditions,
        disabilityStatus,
        admissionDate: new Date().toISOString().split('T')[0],
        className,
        arm,
        house,
        status: 'active',
      },
      parent: {
        fatherName: fatherName || 'Mr. Olamide',
        motherName: motherName || 'Mrs. Olamide',
        occupation: occupation || 'Civil Servant',
        phone: parentPhone || '+234 803 000 1122',
        email: parentEmail || 'parent@gmail.com',
        address,
        emergencyContact: emergencyContact || '+234 803 000 1133',
        relationship: 'Father',
      },
      previousSchool: prevSchool ? { name: prevSchool, lastClass: prevClass, transferReason } : undefined,
      documents: [
        { id: 'doc-new-1', title: 'Birth Certificate', type: 'Birth Certificate', url: '#', uploadDate: new Date().toISOString().split('T')[0] },
      ],
      currentGpa: 4.0,
      attendanceRate: 100,
      feeBalance: 195000,
    };

    onSaveStudent(newStudent);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#162825] p-6 text-white flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#f5ded7] text-[#162825] px-2.5 py-0.5 rounded-full">
                PRD Module 8 & 9 Compliant
              </span>
              <span className="text-xs font-mono font-bold text-[#f5ded7]">
                Auto Admission No: {admissionNo}
              </span>
            </div>
            <h3 className="font-serif text-xl font-bold mt-1">Student Admission Registration</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Indicator Bar */}
        <div className="bg-stone-50 border-b border-stone-200 px-6 py-3 flex items-center justify-between shrink-0 text-xs font-bold text-stone-600">
          <button
            onClick={() => setActiveStep(1)}
            className={`flex items-center gap-2 cursor-pointer ${
              activeStep === 1 ? 'text-[#162825]' : 'text-stone-400'
            }`}
          >
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
              activeStep === 1 ? 'bg-[#162825] text-white' : 'bg-stone-200 text-stone-600'
            }`}>1</span>
            <span>Personal Information</span>
          </button>

          <button
            onClick={() => setActiveStep(2)}
            className={`flex items-center gap-2 cursor-pointer ${
              activeStep === 2 ? 'text-[#162825]' : 'text-stone-400'
            }`}
          >
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
              activeStep === 2 ? 'bg-[#162825] text-white' : 'bg-stone-200 text-stone-600'
            }`}>2</span>
            <span>Parent / Guardian</span>
          </button>

          <button
            onClick={() => setActiveStep(3)}
            className={`flex items-center gap-2 cursor-pointer ${
              activeStep === 3 ? 'text-[#162825]' : 'text-stone-400'
            }`}
          >
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
              activeStep === 3 ? 'bg-[#162825] text-white' : 'bg-stone-200 text-stone-600'
            }`}>3</span>
            <span>School History & Docs</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-4">
          {activeStep === 1 && (
            <div className="space-y-4 text-xs text-stone-700">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-stone-800 mb-1">Surname *</label>
                  <input
                    type="text"
                    required
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    placeholder="e.g. Chukwuemeka"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#162825]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-800 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="e.g. Daniel"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#162825]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-800 mb-1">Middle Name</label>
                  <input
                    type="text"
                    value={middleName}
                    onChange={(e) => setMiddleName(e.target.value)}
                    placeholder="e.g. Kelechi"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#162825]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-bold text-stone-800 mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-semibold"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-800 mb-1">Genotype *</label>
                  <select
                    value={genotype}
                    onChange={(e) => setGenotype(e.target.value as any)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold text-amber-900"
                  >
                    <option value="AA">AA (Normal)</option>
                    <option value="AS">AS (Carrier)</option>
                    <option value="SS">SS (Sickle Cell)</option>
                    <option value="AC">AC</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-800 mb-1">Blood Group *</label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value as any)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold"
                  >
                    <option value="O+">O+</option>
                    <option value="A+">A+</option>
                    <option value="B+">B+</option>
                    <option value="AB+">AB+</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-800 mb-1">Date of Birth *</label>
                  <input
                    type="date"
                    required
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#162825]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-800 mb-1">Age (Years)</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-bold text-stone-800 mb-1">Assigned Class *</label>
                  <select
                    value={className}
                    onChange={(e) => setClassName(e.target.value as any)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold"
                  >
                    <option value="Creche">Creche</option>
                    <option value="Nursery 1">Nursery 1</option>
                    <option value="Nursery 2">Nursery 2</option>
                    <option value="Primary 1">Primary 1</option>
                    <option value="Primary 2">Primary 2</option>
                    <option value="Primary 3">Primary 3</option>
                    <option value="Primary 4">Primary 4</option>
                    <option value="Primary 5">Primary 5</option>
                    <option value="Primary 6">Primary 6</option>
                    <option value="JSS1">JSS1 (Junior Sec)</option>
                    <option value="JSS2">JSS2 (Junior Sec)</option>
                    <option value="JSS3">JSS3 (Junior Sec)</option>
                    <option value="SSS1">SSS1 (Senior Sec)</option>
                    <option value="SSS2">SSS2 (Senior Sec)</option>
                    <option value="SSS3">SSS3 (Senior Sec)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-800 mb-1">Religion</label>
                  <select
                    value={religion}
                    onChange={(e) => setReligion(e.target.value as any)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-semibold"
                  >
                    <option value="Christianity">Christianity</option>
                    <option value="Islam">Islam</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-800 mb-1">Arm *</label>
                  <select
                    value={arm}
                    onChange={(e) => setArm(e.target.value as any)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-semibold"
                  >
                    <option value="Arm A">Arm A</option>
                    <option value="Arm B">Arm B</option>
                    <option value="Arm C">Arm C</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-800 mb-1">House</label>
                  <select
                    value={house}
                    onChange={(e) => setHouse(e.target.value as any)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-semibold"
                  >
                    <option value="Red House">Red House</option>
                    <option value="Blue House">Blue House</option>
                    <option value="Green House">Green House</option>
                    <option value="Yellow House">Yellow House</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-800 mb-1">State of Origin</label>
                  <input
                    type="text"
                    value={stateOfOrigin}
                    onChange={(e) => setStateOfOrigin(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-800 mb-1">Local Govt Area (LGA)</label>
                  <input
                    type="text"
                    value={lga}
                    onChange={(e) => setLga(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">Residential Address in Nigeria</label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>
            </div>
          )}

          {activeStep === 2 && (
            <div className="space-y-4 text-xs text-stone-700">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-800 mb-1">Father's Name *</label>
                  <input
                    type="text"
                    value={fatherName}
                    onChange={(e) => setFatherName(e.target.value)}
                    placeholder="Chief / Dr. / Mr. Name"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-800 mb-1">Mother's Name *</label>
                  <input
                    type="text"
                    value={motherName}
                    onChange={(e) => setMotherName(e.target.value)}
                    placeholder="Dr. / Mrs. Name"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-stone-800 mb-1">Primary Occupation</label>
                  <input
                    type="text"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    placeholder="e.g. Bank Manager"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-800 mb-1">Parent Phone (+234) *</label>
                  <input
                    type="text"
                    value={parentPhone}
                    onChange={(e) => setParentPhone(e.target.value)}
                    placeholder="+234 803 123 4567"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-800 mb-1">Parent Email *</label>
                  <input
                    type="email"
                    value={parentEmail}
                    onChange={(e) => setParentEmail(e.target.value)}
                    placeholder="parent@domain.com"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">Emergency Contact Phone</label>
                <input
                  type="text"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  placeholder="+234 802 000 9988"
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-mono"
                />
              </div>
            </div>
          )}

          {activeStep === 3 && (
            <div className="space-y-4 text-xs text-stone-700">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-800 mb-1">Previous School Name</label>
                  <input
                    type="text"
                    value={prevSchool}
                    onChange={(e) => setPrevSchool(e.target.value)}
                    placeholder="e.g. Loyola Jesuit College"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-800 mb-1">Last Class Attended</label>
                  <input
                    type="text"
                    value={prevClass}
                    onChange={(e) => setPrevClass(e.target.value)}
                    placeholder="e.g. JSS2"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">Reason for Transfer</label>
                <textarea
                  rows={2}
                  value={transferReason}
                  onChange={(e) => setTransferReason(e.target.value)}
                  placeholder="Relocation of family business to Lagos..."
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-dashed border-stone-300 text-center space-y-2">
                <Upload className="w-6 h-6 text-stone-400 mx-auto" />
                <p className="font-bold text-stone-800">Upload Birth Certificate & Medical Report</p>
                <p className="text-[11px] text-stone-400">PDF, JPG, PNG accepted (Max 5MB)</p>
                <button
                  type="button"
                  className="px-3 py-1.5 bg-stone-200 text-stone-800 font-bold text-[11px] rounded-lg"
                >
                  Select File
                </button>
              </div>
            </div>
          )}

          {/* Footer Controls */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
            {activeStep > 1 ? (
              <button
                type="button"
                onClick={() => setActiveStep(activeStep - 1)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
            ) : <div />}

            {activeStep < 3 ? (
              <button
                type="button"
                onClick={() => setActiveStep(activeStep + 1)}
                className="px-5 py-2.5 bg-[#162825] hover:bg-[#203a36] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                Next Step <ArrowRight className="w-3.5 h-3.5 text-[#f5ded7]" />
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#162825] hover:bg-[#203a36] text-[#f5ded7] font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <Check className="w-4 h-4 text-[#f5ded7]" />
                <span>Complete Admission & Generate ID</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
