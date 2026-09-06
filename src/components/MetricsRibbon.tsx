import React from 'react';
import { Zap, ArrowDown, AlertCircle } from 'lucide-react';
import { Task } from '../types';

interface MetricsRibbonProps {
  tasks: Task[];
}

export const MetricsRibbon: React.FC<MetricsRibbonProps> = ({ tasks }) => {
  const totalTasks = tasks.length;
  const resolvedTasks = tasks.filter((t) => t.status === 'completed').length;
  const inFlightTasks = tasks.filter((t) => t.status === 'in-progress').length;
  const urgentTasks = tasks.filter((t) => t.priority === 'Urgent' && t.status !== 'completed').length;

  const completionPercentage = totalTasks > 0 ? Math.round((resolvedTasks / totalTasks) * 100) : 0;
  
  // SVG Gauge calculations
  const radius = 40;
  const circumference = 2 * Math.PI * radius; // 251.327
  const strokeDashoffset = circumference - (completionPercentage / 100) * circumference;

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* Executive Sprint Progress & Velocity */}
      <div className="lg:col-span-8 bg-white p-5 sm:p-6 rounded-xl shadow-xs border border-[#e5eeff] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex flex-col gap-2 z-10 max-w-lg">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-primary font-semibold tracking-wider uppercase">
              Sprint Pulse • Active Milestone
            </span>
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          </div>

          <h2 className="font-bold text-2xl text-[#0b1c30] tracking-tight">
            Active Execution Matrix
          </h2>

          <p className="text-sm text-[#464555] leading-relaxed">
            {completionPercentage}% of core objectives accomplished for this release cycle.{' '}
            {urgentTasks > 0 ? (
              <span className="font-medium text-[#ba1a1a]">
                {urgentTasks} high-priority {urgentTasks === 1 ? 'dependency requires' : 'dependencies require'} attention before sprint cutoff.
              </span>
            ) : (
              <span className="text-[#00505f] font-medium">
                All critical sprint blockers are resolved.
              </span>
            )}
          </p>

          {/* Monospace Status Quick Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <div className="flex items-center gap-1.5 bg-[#eff4ff] px-2.5 py-1 rounded-full border border-[#dce9ff]">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-xs text-[#0b1c30]">
                Total: <strong className="font-mono font-semibold">{totalTasks} Tasks</strong>
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-[#eff4ff] px-2.5 py-1 rounded-full border border-[#dce9ff]">
              <span className="w-2 h-2 rounded-full bg-[#00505f]" />
              <span className="text-xs text-[#0b1c30]">
                In Flight: <strong className="font-mono font-semibold">{inFlightTasks}</strong>
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-[#eff4ff] px-2.5 py-1 rounded-full border border-[#dce9ff]">
              <span className="w-2 h-2 rounded-full bg-[#ba1a1a]" />
              <span className="text-xs text-[#ba1a1a]">
                Overdue: <strong className="font-mono font-semibold text-[#ba1a1a]">{urgentTasks}</strong>
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-[#eff4ff] px-2.5 py-1 rounded-full border border-[#dce9ff]">
              <span className="w-2 h-2 rounded-full bg-[#777587]" />
              <span className="text-xs text-[#0b1c30]">
                Resolved: <strong className="font-mono font-semibold">{resolvedTasks}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Precision SVG Circular Gauge Metric */}
        <div className="flex items-center gap-5 z-10 shrink-0 self-center md:self-auto">
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                className="text-[#dce9ff] fill-transparent"
                cx="50"
                cy="50"
                r={radius}
                stroke="currentColor"
                strokeWidth="8"
              />
              <circle
                className="text-primary fill-transparent transition-all duration-700 ease-out"
                cx="50"
                cy="50"
                r={radius}
                stroke="currentColor"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                strokeWidth="8"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="font-bold text-2xl text-[#0b1c30] leading-none">
                {completionPercentage}
                <span className="text-primary text-sm font-mono">%</span>
              </span>
              <span className="text-[10px] text-[#464555] uppercase font-semibold mt-1 tracking-wider">
                Velocity
              </span>
            </div>
          </div>

          <div className="hidden sm:flex flex-col gap-1.5">
            <span className="text-xs text-[#464555] font-medium">Daily Momentum</span>
            <span className="font-mono text-xs text-[#0b1c30] font-semibold">
              +{completionPercentage > 0 ? (completionPercentage * 0.44).toFixed(1) : '18.4'}% vs last cycle
            </span>
            <div className="w-24 h-1.5 bg-[#dce9ff] rounded-full overflow-hidden">
              <div 
                className="bg-primary h-full rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, completionPercentage + 15)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Background Ambient Indigo Wash */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Right Highlight Stat Tile: Velocity & Lead Time */}
      <div className="lg:col-span-4 bg-white p-5 sm:p-6 rounded-xl shadow-xs border border-[#e5eeff] flex flex-col justify-between relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#eff4ff] text-primary border border-[#dce9ff]">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-[#0b1c30]">Throughput Pace</h3>
              <span className="text-[11px] text-[#464555]">Real-time team throughput</span>
            </div>
          </div>
          <span className="font-mono text-[11px] bg-[#e2dfff] text-[#0f0069] px-2.5 py-0.5 rounded-full font-semibold">
            SLA: 98.2%
          </span>
        </div>

        {/* Monospace Metric Grid */}
        <div className="grid grid-cols-2 gap-3 my-3">
          <div className="bg-[#eff4ff] p-3 rounded-lg flex flex-col border border-[#dce9ff]">
            <span className="text-[11px] text-[#464555]">Est. Completion</span>
            <span className="font-bold text-lg text-[#0b1c30] mt-0.5">
              2.4 <span className="text-xs text-[#464555] font-normal">days</span>
            </span>
            <span className="text-[11px] text-[#00505f] flex items-center gap-1 mt-0.5 font-medium">
              <ArrowDown className="w-3 h-3" /> On Track
            </span>
          </div>

          <div className="bg-[#eff4ff] p-3 rounded-lg flex flex-col border border-[#dce9ff]">
            <span className="text-[11px] text-[#464555]">PR Reviews Pending</span>
            <span className="font-bold text-lg text-[#0b1c30] mt-0.5">
              3 <span className="text-xs text-[#464555] font-normal">queues</span>
            </span>
            <span className="text-[11px] text-[#ba1a1a] flex items-center gap-1 mt-0.5 font-medium">
              <AlertCircle className="w-3 h-3" /> 1 Urgent
            </span>
          </div>
        </div>

        {/* Contributor Avatars */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex -space-x-2 overflow-hidden">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#dce9ff] text-[9px] font-bold text-[#0b1c30] ring-2 ring-white">SL</span>
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#dce9ff] text-[9px] font-bold text-[#0b1c30] ring-2 ring-white">MN</span>
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#dce9ff] text-[9px] font-bold text-[#0b1c30] ring-2 ring-white">DK</span>
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#dce9ff] text-[9px] font-bold text-[#0b1c30] ring-2 ring-white">AC</span>
          </div>
          <span className="text-xs text-[#464555]">4 active contributors</span>
        </div>
      </div>
    </section>
  );
};
