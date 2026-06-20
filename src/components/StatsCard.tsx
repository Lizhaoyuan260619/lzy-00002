import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  gradient: string;
  subtitle?: string;
  delay?: number;
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  gradient,
  subtitle,
  delay = 0
}: StatsCardProps) {
  return (
    <div
      className="card p-5 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-brown-500 mb-1">{title}</p>
          <p
            className="text-3xl font-bold text-brown-800 font-serif"
            style={{
              background: gradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            {value}
          </p>
          {subtitle && <p className="text-xs text-brown-400 mt-1">{subtitle}</p>}
        </div>
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{
            background: gradient,
            opacity: 0.15
          }}
        >
          <Icon
            className="w-6 h-6"
            style={{
              background: gradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          />
        </div>
      </div>
    </div>
  );
}
