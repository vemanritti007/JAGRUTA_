import * as React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, BarChart3, FileText, Calendar, Search } from 'lucide-react';
import { Card } from '../components/ui/Card';

export default function MorePage() {
  const links = [
    { icon: AlertCircle, label: 'Problem Mapper', path: '/problem-mapper', desc: 'Identify authorities' },
    { icon: BarChart3, label: 'Election Results', path: '/elections', desc: 'Historical data' },
    { icon: FileText, label: 'Manifesto Tracker', path: '/manifesto', desc: 'Party promises' },
    { icon: Calendar, label: 'Calendar', path: '/calendar', desc: 'Upcoming elections' },
    { icon: Search, label: 'Report Card', path: '/report', desc: 'Constituency grading' },
  ];

  return (
    <div className="page-enter mx-auto max-w-md space-y-8 py-4 px-2">
      <div className="space-y-2">
        <h1 className="text-4xl font-display font-bold text-text-primary tracking-tight">
          Explore <span className="text-green-core">More</span>
        </h1>
        <p className="text-text-secondary">Access all tracking and analytics features.</p>
      </div>
      
      <div className="grid gap-4">
        {links.map((item) => (
          <Link key={item.path} to={item.path}>
            <Card className="glass-interactive p-4 flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-glass-2 text-green-core shadow-inner">
                <item.icon size={24} />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-text-primary text-lg">{item.label}</span>
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{item.desc}</span>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
