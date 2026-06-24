import * as React from 'react';
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  Clipboard,
  Copy,
  Dog,
  Droplets,
  Flame,
  Lightbulb,
  MapPin,
  ParkingCircle,
  Phone,
  Recycle,
  Search,
  ShieldAlert,
  Utensils,
  Waves,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAppStore } from '../store/app.store';
import { cn } from '../lib/utils';

type ParsedResult = {
  category: string;
  department: string;
  wardNo: string;
  wardName: string;
  zone: string;
  assembly: string;
  role: string;
  name: string;
  phone: string;
  fulfilled: string;
  ignored: string;
  resolutionScore: string;
  urgency: string;
};

const API_BASE_URL = String(import.meta.env.VITE_API_URL || 'http://localhost:5000/trpc').replace(
  /\/trpc\/?$/,
  ''
);

const EXAMPLES = [
  {
    label: 'Parking',
    icon: ParkingCircle,
    text: 'There is restricted parking issue near Basavanagudi main road',
  },
  {
    label: 'Waste',
    icon: Recycle,
    text: 'Garbage is dumped near Basavanagudi and not collected for many days',
  },
  {
    label: 'Water',
    icon: Droplets,
    text: 'No water supply in Basavanagudi for two days',
  },
  {
    label: 'Food',
    icon: Utensils,
    text: 'Food poisoning from a hotel near Basavanagudi',
  },
  {
    label: 'Drainage',
    icon: Waves,
    text: 'Sewage overflow and blocked drain near Basavanagudi',
  },
  {
    label: 'Streetlight',
    icon: Lightbulb,
    text: 'Streetlight is not working near Basavanagudi',
  },
  {
    label: 'Road',
    icon: Building2,
    text: 'Pothole and broken footpath near Basavanagudi',
  },
  {
    label: 'Animal',
    icon: Dog,
    text: 'Stray dog issue near Basavanagudi',
  },
  {
    label: 'Emergency',
    icon: Flame,
    text: 'Fire emergency near Basavanagudi',
  },
];

function getLineValue(text: string, label: string) {
  const regex = new RegExp(`${label}:\\s*(.*)`, 'i');
  const match = text.match(regex);
  return match?.[1]?.trim() || '';
}

function parseProblemResult(text: string): ParsedResult {
  const categoryMatch = text.match(/classified as (.*?)\./i);
  const departmentMatch = text.match(/responsible department is (.*?)\./i);
  const mappedWardMatch = text.match(/mapped to Ward\s+(.*?)\s+-\s+(.*?)\./i);

  return {
    category: categoryMatch?.[1]?.trim() || 'General Civic Issue',
    department: departmentMatch?.[1]?.trim() || 'BBMP Ward Office',
    wardNo: getLineValue(text, 'Ward No') || mappedWardMatch?.[1]?.trim() || 'Not available',
    wardName: getLineValue(text, 'Ward Name') || mappedWardMatch?.[2]?.trim() || 'Not available',
    zone: getLineValue(text, 'Zone') || 'Not available',
    assembly: getLineValue(text, 'Assembly Constituency') || 'Not available',
    role: getLineValue(text, 'Role') || 'Ward Officer / BBMP Helpdesk',
    name: getLineValue(text, 'Name') || 'Not available',
    phone: getLineValue(text, 'Phone') || '1533',
    fulfilled: getLineValue(text, 'Fulfilled Complaints') || '0',
    ignored: getLineValue(text, 'Ignored / Pending Complaints') || '0',
    resolutionScore: getLineValue(text, 'Resolution Score') || 'Not enough complaint data available',
    urgency: getLineValue(text, 'Urgency Level') || 'LOW',
  };
}

function getCategoryIcon(category: string) {
  const value = category.toLowerCase();

  if (value.includes('parking') || value.includes('traffic')) return ParkingCircle;
  if (value.includes('waste') || value.includes('sanitation')) return Recycle;
  if (value.includes('water supply')) return Droplets;
  if (value.includes('food')) return Utensils;
  if (value.includes('drainage') || value.includes('sewage')) return Waves;
  if (value.includes('streetlight') || value.includes('electrical')) return Lightbulb;
  if (value.includes('animal') || value.includes('dog')) return Dog;
  if (value.includes('emergency') || value.includes('safety')) return ShieldAlert;
  if (value.includes('road') || value.includes('engineering')) return Building2;

  return AlertTriangle;
}

function getUrgencyClass(urgency: string) {
  const value = urgency.toLowerCase();

  if (value.includes('high')) {
    return 'bg-status-bad/10 text-status-bad border-status-bad/30';
  }

  if (value.includes('medium')) {
    return 'bg-gold-core/10 text-gold-core border-gold-core/30';
  }

  return 'bg-green-core/10 text-green-core border-green-core/30';
}

export default function ProblemMapperPage() {
  const { pincode } = useAppStore();

  const [problem, setProblem] = React.useState('');
  const [areaPincode, setAreaPincode] = React.useState(pincode || '');
  const [resultText, setResultText] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const parsedResult = React.useMemo(() => {
    if (!resultText) return null;
    return parseProblemResult(resultText);
  }, [resultText]);

  const CategoryIcon = parsedResult ? getCategoryIcon(parsedResult.category) : Search;

  const handleMapProblem = async () => {
    if (!problem.trim()) {
      setError('Please enter a civic problem first.');
      return;
    }

    setIsLoading(true);
    setError('');
    setResultText('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/problem-mapper`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          problem,
          pincode: areaPincode,
          messages: [
            {
              role: 'user',
              content: problem,
            },
          ],
        }),
      });

      const text = await response.text();

      if (!response.ok) {
        throw new Error(text || 'Failed to map problem.');
      }

      setResultText(text);
    } catch (err: any) {
      setError(err?.message || 'Failed to map problem.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyText = async (text: string, successMessage: string) => {
    await navigator.clipboard.writeText(text);
    alert(successMessage);
  };

  const handleCopyOfficerContact = () => {
    if (!parsedResult) return;

    const contact = `Responsible Contact
Role: ${parsedResult.role}
Name: ${parsedResult.name}
Phone: ${parsedResult.phone}
Department: ${parsedResult.department}
Ward: ${parsedResult.wardNo} - ${parsedResult.wardName}`;

    copyText(contact, 'Officer contact copied!');
  };

  const handleCopyFullReport = () => {
    if (!resultText) return;
    copyText(resultText, 'Problem mapping report copied!');
  };

  return (
    <div className="page-enter mx-auto max-w-6xl py-8 pb-32 space-y-8">
      <section className="glass-elevated p-8 md:p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-green-core/5 to-transparent pointer-events-none" />

        <div className="relative space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-glass-2 border border-glass-border px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-text-muted">
            <MapPin size={12} /> Civic Problem Mapper
          </div>

          <h1 className="text-4xl md:text-6xl font-display font-bold text-text-primary tracking-tight">
            Find the <span className="text-green-core">Right Department</span>
          </h1>

          <p className="max-w-3xl text-text-secondary leading-relaxed">
            Enter a civic problem and the app will classify it into parking, engineering,
            water, food safety, waste, drainage, electrical, animal, public health, or other
            departments.
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8">
        <Card className="p-6 md:p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
              Describe the problem
            </label>

            <textarea
             value={problem}
             onChange={(event) => setProblem(event.target.value)}
             placeholder="Example: There is restricted parking issue near Basavanagudi main road"
             className="relative z-10 min-h-[180px] w-full resize-none rounded-2xl border border-green-core/40 bg-[#0b1115] p-4 text-sm text-white placeholder:text-slate-400 outline-none focus:border-green-core focus:ring-2 focus:ring-green-core/20"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
              Pincode / Area Pincode
            </label>

            <input
             value={areaPincode}
             onChange={(event) => setAreaPincode(event.target.value)}
             placeholder="Example: 560004"
             className="relative z-10 w-full rounded-2xl border border-green-core/40 bg-[#0b1115] p-4 text-sm text-white placeholder:text-slate-400 outline-none focus:border-green-core focus:ring-2 focus:ring-green-core/20"
            />
          </div>

          <div className="space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
              Quick test cases
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {EXAMPLES.map((example) => {
                const Icon = example.icon;

                return (
                  <button
                    key={example.label}
                    onClick={() => setProblem(example.text)}
                    className="flex items-center gap-2 rounded-2xl border border-glass-border bg-glass-1 px-3 py-3 text-left text-xs font-bold text-text-secondary hover:border-green-core/40 hover:text-green-core transition-colors"
                  >
                    <Icon size={16} />
                    {example.label}
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <div className="rounded-2xl border border-status-bad/30 bg-status-bad/10 p-4 text-sm text-status-bad">
              {error}
            </div>
          )}

          <Button
            size="lg"
            className="w-full gap-2"
            onClick={handleMapProblem}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Search size={18} className="animate-pulse" /> Mapping Problem...
              </>
            ) : (
              <>
                <Search size={18} /> Map Responsible Department
              </>
            )}
          </Button>
        </Card>

        <Card className="p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-green-core/10 text-green-core flex items-center justify-center">
              <CategoryIcon size={24} />
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
                Current Mapping
              </p>

              <h2 className="text-xl font-display font-bold text-text-primary">
                {parsedResult?.category || 'No issue mapped yet'}
              </h2>
            </div>
          </div>

          {!parsedResult ? (
            <div className="rounded-2xl border border-dashed border-glass-border p-6 text-sm text-text-secondary leading-relaxed">
              Enter a civic problem and click <strong>Map Responsible Department</strong>.
              The result will show category, department, ward, officer contact, and complaint
              scorecard.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-2xl bg-bg-inset border border-glass-border p-4 space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
                  Responsible Department
                </p>
                <p className="text-base font-bold text-text-primary">
                  {parsedResult.department}
                </p>
              </div>

              <div
                className={cn(
                  'rounded-2xl border p-4 flex items-center justify-between',
                  getUrgencyClass(parsedResult.urgency)
                )}
              >
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  Urgency Level
                </span>

                <span className="text-sm font-bold">
                  {parsedResult.urgency}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-glass-1 border border-glass-border p-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
                    Ward No
                  </p>
                  <p className="text-xl font-mono font-bold text-text-primary">
                    {parsedResult.wardNo}
                  </p>
                </div>

                <div className="rounded-2xl bg-glass-1 border border-glass-border p-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
                    Zone
                  </p>
                  <p className="text-sm font-bold text-text-primary">
                    {parsedResult.zone}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-glass-1 border border-glass-border p-4 space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
                  Ward Details
                </p>
                <p className="font-bold text-text-primary">
                  {parsedResult.wardName}
                </p>
                <p className="text-sm text-text-secondary">
                  Assembly: {parsedResult.assembly}
                </p>
              </div>

              <div className="rounded-2xl bg-glass-1 border border-glass-border p-4 space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
                  Responsible Contact
                </p>

                <div>
                  <p className="text-sm font-bold text-text-primary">
                    {parsedResult.role}
                  </p>
                  <p className="text-sm text-text-secondary">
                    {parsedResult.name}
                  </p>
                  <p className="text-sm text-green-core font-bold">
                    {parsedResult.phone}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="gap-2"
                    onClick={handleCopyOfficerContact}
                  >
                    <Copy size={14} /> Copy Contact
                  </Button>

                  <Button
                    variant="secondary"
                    size="sm"
                    className="gap-2"
                    onClick={() => copyText('1533', 'BBMP helpline copied!')}
                  >
                    <Phone size={14} /> Copy 1533
                  </Button>
                </div>
              </div>

              <div className="rounded-2xl bg-bg-inset border border-glass-border p-4 space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
                  Problem Scorecard
                </p>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-xl font-mono font-bold text-green-core">
                      {parsedResult.fulfilled}
                    </p>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-text-muted">
                      Fulfilled
                    </p>
                  </div>

                  <div>
                    <p className="text-xl font-mono font-bold text-status-bad">
                      {parsedResult.ignored}
                    </p>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-text-muted">
                      Pending
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-mono font-bold text-text-primary">
                      {parsedResult.resolutionScore}
                    </p>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-text-muted">
                      Score
                    </p>
                  </div>
                </div>
              </div>

              <Button
                variant="secondary"
                className="w-full gap-2"
                onClick={handleCopyFullReport}
              >
                <Clipboard size={16} /> Copy Full Report
              </Button>
            </div>
          )}
        </Card>
      </div>

      {resultText && (
        <Card className="p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-green-core" />
            <h3 className="text-xl font-display font-bold text-text-primary">
              Raw AI Mapping Result
            </h3>
          </div>

          <pre className="whitespace-pre-wrap rounded-2xl bg-bg-inset border border-glass-border p-4 text-sm text-text-secondary leading-relaxed overflow-x-auto">
            {resultText}
          </pre>
        </Card>
      )}
    </div>
  );
}