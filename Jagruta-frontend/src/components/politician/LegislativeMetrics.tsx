import * as React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { MessageSquare, Gavel, ArrowUpRight } from 'lucide-react';
import { cn } from '../../lib/utils';

interface QuestionsSectionProps {
  count: number;
  topics: string[];
}

export const QuestionsSection = ({ count, topics }: QuestionsSectionProps) => {
  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-green-core/10 text-green-core">
            <MessageSquare size={20} />
          </div>
          <h3 className="text-xl font-display font-bold text-text-primary uppercase tracking-tight">
            Questions Raised
          </h3>
        </div>
        <div className="text-2xl font-mono font-bold text-green-core">{count}</div>
      </div>

      <div className="space-y-4">
        <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Primary Focus Topics</p>
        <div className="flex flex-wrap gap-2">
          {topics.map((topic, i) => (
            <div 
              key={i}
              className="px-3 py-1.5 rounded-lg bg-glass-2 border border-glass-border text-xs text-text-secondary hover:text-text-primary hover:border-glass-border-bright transition-all cursor-default"
            >
              {topic}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

interface BillsVotedSectionProps {
  bills: any[];
}

export const BillsVotedSection = ({ bills }: BillsVotedSectionProps) => {
  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-green-core/10 text-green-core">
            <Gavel size={20} />
          </div>
          <h3 className="text-xl font-display font-bold text-text-primary uppercase tracking-tight">
            Bill Voting Record
          </h3>
        </div>
        <Badge variant="default" className="bg-glass-2">LATEST 5 BILLS</Badge>
      </div>

      <div className="space-y-3">
        {bills.map((bill, i) => (
          <div 
            key={i} 
            className="group flex items-center justify-between p-3 rounded-xl bg-glass-1 border border-glass-border hover:bg-glass-2 transition-all"
          >
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-text-primary line-clamp-1">{bill.title}</h4>
              <p className="text-[10px] font-mono text-text-muted uppercase tracking-widest">{bill.session}</p>
            </div>
            <div className={cn(
              "px-3 py-1 rounded-lg font-mono text-xs font-bold",
              bill.vote === 'YES' ? "bg-status-good/10 text-status-good" : 
              bill.vote === 'NO' ? "bg-status-bad/10 text-status-bad" : 
              "bg-glass-3 text-text-muted"
            )}>
              {bill.vote}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
