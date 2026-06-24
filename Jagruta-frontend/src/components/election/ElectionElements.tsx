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

export const VoteShareDonut = ({ candidates }: { candidates: any[] }) => {
  const partyTotals = candidates.reduce((acc: Record<string, number>, candidate: any) => {
    const party = candidate.party || 'Others';
    acc[party] = (acc[party] || 0) + Number(candidate.votePercentage || 0);
    return acc;
  }, {});

  const sortedParties = Object.entries(partyTotals)
    .map(([party, value]) => ({
      party,
      value: Number(value.toFixed(2)),
    }))
    .sort((a, b) => b.value - a.value);

  const topParties = sortedParties.slice(0, 5);
  const otherTotal = sortedParties
    .slice(5)
    .reduce((sum, item) => sum + item.value, 0);

  const chartData =
    otherTotal > 0
      ? [...topParties, { party: 'Others', value: Number(otherTotal.toFixed(2)) }]
      : topParties;

  const colors = [
    '#22c55e',
    '#3b82f6',
    '#f97316',
    '#ef4444',
    '#a855f7',
    '#64748b',
  ];

  return (
    <div className="w-full space-y-6">
      <div className="h-[240px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="party"
              innerRadius={60}
              outerRadius={95}
              paddingAngle={3}
              stroke="none"
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>

            <Tooltip
              formatter={(value: any, name: any) => [`${value}%`, name]}
              contentStyle={{
                background: '#111827',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '12px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {chartData.map((item, index) => (
          <div key={item.party} className="flex items-center gap-2 min-w-0">
            <span
              className="h-3 w-3 rounded-full shrink-0"
              style={{ backgroundColor: colors[index % colors.length] }}
            />
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-text-primary">
                {item.party}
              </p>
              <p className="text-[10px] text-text-muted">
                {item.value}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};