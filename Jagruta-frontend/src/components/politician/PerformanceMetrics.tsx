import * as React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { motion } from 'framer-motion';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { TrendingUp, Users, Calendar } from 'lucide-react';
import { cn } from '../../lib/utils';

interface AttendanceBarProps {
  value: number;
  average: number;
}

export const AttendanceBar = ({ value, average }: AttendanceBarProps) => {
  return (
    <Card className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-green-core/10 text-green-core">
            <Users size={20} />
          </div>
          <h3 className="text-xl font-display font-bold text-text-primary uppercase tracking-tight">
            Attendance record
          </h3>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-glass-2 border border-glass-border">
          <TrendingUp size={12} className="text-green-core" />
          <span className="text-[10px] font-bold text-text-primary">+{value - average}% ABOVE AVG</span>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <span className="text-[48px] font-mono font-bold text-text-primary leading-none">
              {value}%
            </span>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Sessions Attended</p>
          </div>
          <div className="text-right space-y-1">
            <span className="text-lg font-mono font-bold text-text-secondary">
              {average}%
            </span>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">State Average</p>
          </div>
        </div>

        <div className="relative h-4 w-full bg-glass-1 rounded-full overflow-hidden border border-glass-border">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${value}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute inset-y-0 left-0 bg-green-core shadow-[0_0_20px_rgba(0,255,135,0.4)]"
          />
          <div 
            className="absolute inset-y-0 w-1 bg-text-muted z-10"
            style={{ left: `${average}%` }}
          />
        </div>
      </div>
    </Card>
  );
};

interface AssetGrowthChartProps {
  data: any[];
}

export const AssetGrowthChart = ({ data }: AssetGrowthChartProps) => {
  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gold-core/10 text-gold-core">
            <Calendar size={20} />
          </div>
          <h3 className="text-xl font-display font-bold text-text-primary uppercase tracking-tight">
            Asset Growth
          </h3>
        </div>
        <Badge variant="default" className="bg-gold-core/10 text-gold-core border-gold-core/20">
          +340% SINCE 2014
        </Badge>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorAssets" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FFD700" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#FFD700" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis 
              dataKey="year" 
              stroke="rgba(255,255,255,0.3)" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              fontFamily="var(--font-mono)"
            />
            <YAxis hide />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(10, 13, 20, 0.9)', 
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#fff'
              }}
              itemStyle={{ color: '#FFD700' }}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#FFD700" 
              fillOpacity={1} 
              fill="url(#colorAssets)" 
              strokeWidth={3}
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
