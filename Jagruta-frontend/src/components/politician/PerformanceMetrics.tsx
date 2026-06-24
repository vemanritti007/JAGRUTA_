import * as React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Landmark,
  Scale,
  AlertCircle,
  Calendar,
} from 'lucide-react';
import { Card } from '../ui/Card';

type AssetHistoryItem = {
  year: number;
  assets: number;
  liabilities: number;
  netWorth?: number;
  source?: string;
  note?: string;
};

function toNumber(value: any) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function formatMoney(value: number) {
  if (!value || Number.isNaN(value)) {
    return '₹0';
  }

  const crore = value / 10000000;

  if (Math.abs(crore) >= 1) {
    return `₹${crore.toFixed(2)} Cr`;
  }

  const lakh = value / 100000;

  return `₹${lakh.toFixed(2)} L`;
}

function formatPercent(value: number) {
  if (!Number.isFinite(value)) {
    return '0%';
  }

  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
}

function getGrowthPercent(start: number, end: number) {
  if (!start || start <= 0) return 0;
  return ((end - start) / start) * 100;
}

export const AttendanceBar = ({
  value,
  average,
}: {
  value: number;
  average: number;
}) => {
  const safeValue = Math.max(0, Math.min(100, Number(value || 0)));
  const safeAverage = Math.max(0, Math.min(100, Number(average || 0)));

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
            Assembly Attendance
          </p>

          <h3 className="text-2xl font-display font-bold text-text-primary">
            {safeValue}%
          </h3>
        </div>

        <div className="h-12 w-12 rounded-2xl bg-green-core/10 text-green-core flex items-center justify-center">
          <Calendar size={22} />
        </div>
      </div>

      <div className="space-y-3">
        <div className="h-3 w-full rounded-full bg-bg-inset overflow-hidden">
          <div
            className="h-full rounded-full bg-green-core"
            style={{ width: `${safeValue}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-text-muted">
          <span>Representative</span>
          <span>{safeValue}%</span>
        </div>

        <div className="h-2 w-full rounded-full bg-bg-inset overflow-hidden opacity-70">
          <div
            className="h-full rounded-full bg-text-muted"
            style={{ width: `${safeAverage}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-text-muted">
          <span>Average</span>
          <span>{safeAverage}%</span>
        </div>
      </div>
    </Card>
  );
};

export const AssetGrowthChart = ({ data }: { data: AssetHistoryItem[] }) => {
  const chartData = React.useMemo(() => {
    return (data || [])
      .map((item) => {
        const assets = toNumber(item.assets);
        const liabilities = toNumber(item.liabilities);
        const netWorth = toNumber(item.netWorth ?? assets - liabilities);

        return {
          year: Number(item.year),
          assets,
          liabilities,
          netWorth,
          assetsCr: Number((assets / 10000000).toFixed(2)),
          liabilitiesCr: Number((liabilities / 10000000).toFixed(2)),
          netWorthCr: Number((netWorth / 10000000).toFixed(2)),
          source: item.source || 'Asset-growth dataset',
          note: item.note || '',
        };
      })
      .filter((item) => item.year)
      .sort((a, b) => a.year - b.year);
  }, [data]);

  if (chartData.length === 0) {
    return (
      <Card className="p-8 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-bg-inset flex items-center justify-center text-text-muted">
            <Wallet size={22} />
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
              Asset Growth
            </p>

            <h3 className="text-2xl font-display font-bold text-text-primary">
              No asset history available
            </h3>
          </div>
        </div>

        <p className="text-sm text-text-secondary">
          Import asset-growth.csv to show year-wise assets, liabilities, and net worth.
        </p>
      </Card>
    );
  }

  const first = chartData[0];
  const latest = chartData[chartData.length - 1];

  const assetGrowth = latest.assets - first.assets;
  const liabilityGrowth = latest.liabilities - first.liabilities;
  const netWorthGrowth = latest.netWorth - first.netWorth;
  const assetGrowthPercent = getGrowthPercent(first.assets, latest.assets);

  const isAssetGrowthPositive = assetGrowth >= 0;

  return (
    <Card className="p-8 space-y-8 overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-green-core/10 border border-green-core/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-green-core">
            <Wallet size={12} /> Asset Growth Tracker
          </div>

          <h3 className="text-3xl font-display font-bold text-text-primary">
            Assets from {first.year} to {latest.year}
          </h3>

          <p className="text-sm text-text-secondary max-w-2xl">
            Shows declared asset growth using the imported asset-growth.csv data.
            Demo values should be replaced later with verified ADR/MyNeta affidavit values.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-2xl bg-bg-inset px-4 py-3 border border-border-subtle">
          {isAssetGrowthPositive ? (
            <TrendingUp size={20} className="text-status-warn" />
          ) : (
            <TrendingDown size={20} className="text-status-good" />
          )}

          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-text-muted">
              Asset Growth
            </p>

            <p className="text-xl font-mono font-bold text-text-primary">
              {formatPercent(assetGrowthPercent)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-glass-1 border border-glass-border p-5 space-y-2">
          <div className="flex items-center gap-2 text-text-muted">
            <Wallet size={16} />

            <p className="text-[10px] font-bold uppercase tracking-widest">
              Latest Assets
            </p>
          </div>

          <p className="text-2xl font-mono font-bold text-text-primary">
            {formatMoney(latest.assets)}
          </p>
        </div>

        <div className="rounded-2xl bg-glass-1 border border-glass-border p-5 space-y-2">
          <div className="flex items-center gap-2 text-text-muted">
            <Landmark size={16} />

            <p className="text-[10px] font-bold uppercase tracking-widest">
              Liabilities
            </p>
          </div>

          <p className="text-2xl font-mono font-bold text-text-primary">
            {formatMoney(latest.liabilities)}
          </p>
        </div>

        <div className="rounded-2xl bg-glass-1 border border-glass-border p-5 space-y-2">
          <div className="flex items-center gap-2 text-text-muted">
            <Scale size={16} />

            <p className="text-[10px] font-bold uppercase tracking-widest">
              Net Worth
            </p>
          </div>

          <p className="text-2xl font-mono font-bold text-text-primary">
            {formatMoney(latest.netWorth)}
          </p>
        </div>

        <div className="rounded-2xl bg-glass-1 border border-glass-border p-5 space-y-2">
          <div className="flex items-center gap-2 text-text-muted">
            <TrendingUp size={16} />

            <p className="text-[10px] font-bold uppercase tracking-widest">
              Growth Value
            </p>
          </div>

          <p className="text-2xl font-mono font-bold text-text-primary">
            {formatMoney(assetGrowth)}
          </p>
        </div>
      </div>

      <div className="h-[280px] rounded-3xl bg-bg-inset border border-border-subtle p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.18} />

            <XAxis
              dataKey="year"
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `₹${value}Cr`}
            />

            <Tooltip
              formatter={(value: any, name: any) => [`₹${value} Cr`, name]}
              labelFormatter={(label) => `Year: ${label}`}
              contentStyle={{
                background: '#111827',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '12px',
              }}
            />

            <Line
              type="monotone"
              dataKey="assetsCr"
              name="Assets"
              stroke="#22c55e"
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 7 }}
            />

            <Line
              type="monotone"
              dataKey="liabilitiesCr"
              name="Liabilities"
              stroke="#f97316"
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 7 }}
            />

            <Line
              type="monotone"
              dataKey="netWorthCr"
              name="Net Worth"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border-subtle">
        <table className="w-full text-sm">
          <thead className="bg-bg-inset text-text-muted">
            <tr>
              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest">
                Year
              </th>

              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest">
                Assets
              </th>

              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest">
                Liabilities
              </th>

              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest">
                Net Worth
              </th>

              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest">
                Source
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border-subtle">
            {chartData.map((row) => (
              <tr key={row.year} className="hover:bg-glass-1 transition-colors">
                <td className="px-4 py-3 font-mono font-bold text-text-primary">
                  {row.year}
                </td>

                <td className="px-4 py-3 text-text-secondary">
                  {formatMoney(row.assets)}
                </td>

                <td className="px-4 py-3 text-text-secondary">
                  {formatMoney(row.liabilities)}
                </td>

                <td className="px-4 py-3 text-text-secondary">
                  {formatMoney(row.netWorth)}
                </td>

                <td className="px-4 py-3 text-text-muted">
                  {row.source}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(first.note || latest.note) && (
        <div className="flex items-start gap-3 rounded-2xl bg-status-warn/10 border border-status-warn/20 p-4 text-sm text-text-secondary">
          <AlertCircle size={18} className="text-status-warn shrink-0 mt-0.5" />

          <p>
            {latest.note || first.note}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="rounded-2xl bg-bg-inset border border-border-subtle p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
            Asset Change
          </p>

          <p className="text-lg font-mono font-bold text-text-primary">
            {formatMoney(assetGrowth)}
          </p>
        </div>

        <div className="rounded-2xl bg-bg-inset border border-border-subtle p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
            Liability Change
          </p>

          <p className="text-lg font-mono font-bold text-text-primary">
            {formatMoney(liabilityGrowth)}
          </p>
        </div>

        <div className="rounded-2xl bg-bg-inset border border-border-subtle p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
            Net Worth Change
          </p>

          <p className="text-lg font-mono font-bold text-text-primary">
            {formatMoney(netWorthGrowth)}
          </p>
        </div>
      </div>
    </Card>
  );
};