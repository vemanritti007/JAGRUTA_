import * as React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Candidate } from '../../types/election';
import { User, Crown } from 'lucide-react';
import { cn } from '../../lib/utils';

export const WinnerCard = ({ candidate }: { candidate: Candidate }) => {
  return (
    <Card className="relative overflow-hidden p-6 border-l-4 border-party-bjp">
      <div className="absolute top-4 right-4 text-accent-gold">
        <Crown size={24} />
      </div>
      
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 overflow-hidden rounded-full bg-bg-elevated border border-border-default">
           <div className="flex h-full w-full items-center justify-center text-text-muted">
            <User size={32} />
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-accent-gold">Winner</span>
            <Badge party={candidate.party as any} variant="party">{candidate.party}</Badge>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">{candidate.name}</h2>
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase text-text-muted">Votes</span>
              <span className="font-mono text-sm font-medium">{candidate.votes.toLocaleString()}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase text-text-muted">Vote %</span>
              <span className="font-mono text-sm font-medium">{candidate.votePercentage}%</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export const ResultsTable = ({ candidates }: { candidates: Candidate[] }) => {
  return (
    <Card className="overflow-hidden bg-bg-surface">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border-default bg-bg-elevated/50 text-text-muted font-bold uppercase tracking-wider text-[10px]">
            <th className="py-3 px-4">Candidate</th>
            <th className="py-3 px-4">Party</th>
            <th className="py-3 px-4 text-right">Votes</th>
            <th className="py-3 px-4 text-right">Vote %</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-subtle">
          {candidates.map((c) => (
            <tr key={c.id} className={cn("group hover:bg-bg-elevated/30", c.status === 'WINNER' && "bg-accent-green-subtle/10")}>
              <td className="py-3 px-4 font-medium">{c.name}</td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: `var(--party-${c.party.toLowerCase().replace(/[()]/g, '')})` }} />
                  {c.party}
                </div>
              </td>
              <td className="py-3 px-4 text-right font-mono">{c.votes.toLocaleString()}</td>
              <td className="py-3 px-4 text-right font-mono">{c.votePercentage}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
};

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export const VoteShareDonut = ({ candidates }: { candidates: Candidate[] }) => {
  const data = candidates.map(c => ({
    name: c.party,
    value: c.votes,
    color: `var(--party-${c.party.toLowerCase().replace(/[()]/g, '')})`
  }));

  return (
    <Card className="p-6 h-[300px]">
      <h3 className="text-center font-bold uppercase tracking-widest text-[11px] text-text-muted mb-4">Vote Share</h3>
      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie
            data={data}
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
            ))}
          </Pie>
          <Tooltip 
             contentStyle={{ backgroundColor: 'var(--bg-elevated)', border: 'none', borderRadius: '8px' }}
          />
          <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase' }} />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
};
