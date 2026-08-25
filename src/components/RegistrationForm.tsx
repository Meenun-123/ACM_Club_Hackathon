import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { FormInput, FormTextarea, FormSelect, Checkbox, FormSection } from '@/components/ui/FormFields';
import { INTEREST_AREAS } from '@/lib/constants';
import { supabase } from '@/lib/supabase';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  institution: string;
  department: string;
  year: string;
  studentId: string;
  motivation: string;
  interests: string[];
  confirmAccurate: boolean;
  agreeGuidelines: boolean;
}

type Errors = Partial<Record<keyof FormData, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+]?[\d\s\-()]{7,15}$/;

function genId() {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `HA2026-${n}`;
}

export default function RegistrationForm() {
  const navigate = useNavigate();
  const [data, setData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    institution: '',
    department: '',
    year: '',
    studentId: '',
    motivation: '',
    interests: [],
    confirmAccurate: false,
    agreeGuidelines: false,
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setData((d) => ({ ...d, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const toggleInterest = (area: string) => {
    setData((d) => ({
      ...d,
      interests: d.interests.includes(area)
        ? d.interests.filter((a) => a !== area)
        : [...d.interests, area],
    }));
  };

  const validate = (): Errors => {
    const e: Errors = {};
    if (!data.fullName.trim()) e.fullName = 'Please enter your full name.';
    if (!data.email.trim()) e.email = 'Please enter your email address.';
    else if (!EMAIL_RE.test(data.email)) e.email = 'Please enter a valid email address.';
    if (!data.phone.trim()) e.phone = 'Please enter your phone number.';
    else if (!PHONE_RE.test(data.phone)) e.phone = 'Please enter a valid phone number.';
    if (!data.institution.trim()) e.institution = 'Please enter your college or institution.';
    if (!data.department.trim()) e.department = 'Please enter your department.';
    if (!data.year) e.year = 'Please select your year of study.';
    if (!data.studentId.trim()) e.studentId = 'Please enter your register number or student ID.';
    if (!data.confirmAccurate) e.confirmAccurate = 'Please confirm your information is accurate.';
    if (!data.agreeGuidelines) e.agreeGuidelines = 'Please agree to the event guidelines.';
    return e;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setSubmitError('');
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) {
      // focus first error
      const firstKey = Object.keys(e)[0];
      const el = document.getElementById(firstKey);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setSubmitting(true);
    try {
      const registrationId = genId();
      const { error } = await supabase.from('registrations').insert({
        registration_id: registrationId,
        full_name: data.fullName.trim(),
        email: data.email.trim().toLowerCase(),
        phone: data.phone.trim(),
        institution: data.institution.trim(),
        department: data.department.trim(),
        year: data.year,
        student_id: data.studentId.trim(),
        interests: data.interests,
        motivation: data.motivation.trim() || null,
      });

      if (error) throw error;

      navigate('/register/success', { state: { registrationId } });
    } catch (err) {
      setSubmitError(
        'Something went wrong while submitting your registration. Please try again in a moment.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <FormSection title="Personal Information">
        <FormInput
          id="fullName"
          label="Full Name"
          value={data.fullName}
          onChange={(v) => set('fullName', v)}
          error={errors.fullName}
          required
          placeholder="e.g. Arjun Kumar"
          autoComplete="name"
        />
        <FormInput
          id="email"
          label="Email Address"
          type="email"
          value={data.email}
          onChange={(v) => set('email', v)}
          error={errors.email}
          required
          placeholder="you@example.com"
          autoComplete="email"
        />
        <FormInput
          id="phone"
          label="Phone Number"
          type="tel"
          value={data.phone}
          onChange={(v) => set('phone', v)}
          error={errors.phone}
          required
          placeholder="+91 98765 43210"
          autoComplete="tel"
        />
      </FormSection>

      <FormSection title="Academic Information">
        <FormInput
          id="institution"
          label="College / Institution"
          value={data.institution}
          onChange={(v) => set('institution', v)}
          error={errors.institution}
          required
          placeholder="e.g. Amrita Vishwa Vidyapeetham, Nagercoil"
        />
        <FormInput
          id="department"
          label="Department"
          value={data.department}
          onChange={(v) => set('department', v)}
          error={errors.department}
          required
          placeholder="e.g. Computer Science & Engineering"
        />
        <FormSelect
          id="year"
          label="Year of Study"
          value={data.year}
          onChange={(v) => set('year', v)}
          options={['First Year', 'Second Year', 'Third Year', 'Fourth Year']}
          error={errors.year}
          required
        />
        <FormInput
          id="studentId"
          label="Register Number / Student ID"
          value={data.studentId}
          onChange={(v) => set('studentId', v)}
          error={errors.studentId}
          required
          placeholder="e.g. AMR.23CS0123"
        />
      </FormSection>

      <FormSection title="Additional Information">
        <FormTextarea
          id="motivation"
          label="Why are you interested in Hack Ascension?"
          value={data.motivation}
          onChange={(v) => set('motivation', v)}
          placeholder="Tell us what excites you about technology and this event..."
          rows={4}
        />
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3">
            Areas of Interest <span className="text-slate-500">(select all that apply)</span>
          </label>
          <div className="flex flex-wrap gap-2.5">
            {INTEREST_AREAS.map((area) => {
              const active = data.interests.includes(area);
              return (
                <button
                  key={area}
                  type="button"
                  onClick={() => toggleInterest(area)}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 border ${
                    active
                      ? 'bg-orange-500/20 border-orange-500/50 text-orange-300'
                      : 'bg-navy-800/40 border-electric-500/20 text-slate-400 hover:border-electric-500/40 hover:text-slate-200'
                  }`}
                >
                  {active && <Check className="w-3.5 h-3.5" />}
                  {area}
                </button>
              );
            })}
          </div>
        </div>
      </FormSection>

      <FormSection title="Terms & Confirmation">
        <Checkbox
          id="confirmAccurate"
          label="I confirm that the information provided above is accurate."
          checked={data.confirmAccurate}
          onChange={(v) => set('confirmAccurate', v)}
          error={errors.confirmAccurate}
          required
        />
        <Checkbox
          id="agreeGuidelines"
          label="I agree to the event guidelines and understand that registration is subject to confirmation."
          checked={data.agreeGuidelines}
          onChange={(v) => set('agreeGuidelines', v)}
          error={errors.agreeGuidelines}
          required
        />
      </FormSection>

      {submitError && (
        <div className="glass rounded-xl p-4 border-red-500/30 bg-red-500/5" role="alert">
          <p className="text-sm text-red-300">{submitError}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-display text-lg font-semibold px-8 py-4 rounded-xl hover:from-orange-400 hover:to-orange-500 glow-orange hover:shadow-[0_0_36px_rgba(249,115,22,0.5)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
      >
        {submitting ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Submitting...
          </>
        ) : (
          <>
            COMPLETE REGISTRATION <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>
    </form>
  );
}
