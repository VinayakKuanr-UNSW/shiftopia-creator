
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Percent, Users, Clock, AlertCircle, CheckCircle } from 'lucide-react';

interface WeeklyStatsProps {
  department: string;
  color: 'blue' | 'green' | 'red' | 'purple';
  stats: {
    shiftsAssigned: number;
    shiftsFilled: number;
    attendanceRate: number;
    pendingShifts: number;
    noShows: number;
    utilizationRate: number;
  };
}

export const WeeklyStats: React.FC<WeeklyStatsProps> = ({ department, color, stats }) => {
  const getColorClasses = () => {
    switch (color) {
      case 'blue':
        return 'text-blue-400';
      case 'green':
        return 'text-green-400';
      case 'red':
        return 'text-red-400';
      case 'purple':
        return 'text-purple-400';
      default:
        return 'text-gray-400';
    }
  };

  const getBarColor = () => {
    switch (color) {
      case 'blue':
        return '#3b82f6';
      case 'green':
        return '#10b981';
      case 'red':
        return '#ef4444';
      case 'purple':
        return '#8b5cf6';
      default:
        return '#6b7280';
    }
  };

  // Chart data
  const weeklyData = [
    { name: 'Week 1', shifts: 42, attendance: 90 },
    { name: 'Week 2', shifts: 38, attendance: 87 },
    { name: 'Week 3', shifts: 45, attendance: 93 },
    { name: 'Current', shifts: stats.shiftsFilled, attendance: stats.attendanceRate }
  ];
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <Card className="bg-white/5 border border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className={`h-4 w-4 ${getColorClasses()}`} />
              <span>Shift Completion</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div>
                <div className="text-xl font-bold">{stats.shiftsFilled}/{stats.shiftsAssigned}</div>
                <div className="text-xs text-muted-foreground">Shifts Filled</div>
              </div>
              <div>
                <div className="text-xl font-bold">{stats.attendanceRate}%</div>
                <div className="text-xs text-muted-foreground">Attendance Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className={`h-4 w-4 ${getColorClasses()}`} />
              <span>Pending Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div>
                <div className="text-xl font-bold">{stats.pendingShifts}</div>
                <div className="text-xs text-muted-foreground">Pending Shifts</div>
              </div>
              <div>
                <div className="text-xl font-bold">{stats.noShows}</div>
                <div className="text-xs text-muted-foreground">No-Shows</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Percent className={`h-4 w-4 ${getColorClasses()}`} />
              <span>Staff Utilization</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center">
              <div className="text-2xl font-bold">{stats.utilizationRate}%</div>
              <div className="text-xs text-muted-foreground">Utilization Rate</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trend Chart */}
      <Card className="bg-white/5 border border-white/10 p-4">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-sm font-medium">4-Week Trends</CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <div className="h-[180px]">
            <ChartContainer
              config={{
                shifts: {},
                attendance: {},
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="rgba(255,255,255,0.5)" />
                  <YAxis yAxisId="left" orientation="left" stroke="rgba(255,255,255,0.5)" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="right" orientation="right" stroke="rgba(255,255,255,0.5)" tick={{ fontSize: 12 }} domain={[0, 100]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar yAxisId="left" dataKey="shifts" name="Shifts" fill={getBarColor()} radius={[4, 4, 0, 0]} />
                  <Bar yAxisId="right" dataKey="attendance" name="Attendance %" fill={getBarColor() + '80'} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Quick action buttons */}
      <div className="flex flex-wrap gap-2">
        <a 
          href="/rostering/rosters" 
          className={`text-xs bg-${color}-900/40 hover:bg-${color}-800/50 border border-${color}-500/30 px-3 py-1.5 rounded transition-colors inline-flex items-center gap-1.5`}
        >
          <Clock className="h-3.5 w-3.5" />
          Assign Pending Shifts
        </a>
        <a 
          href="/rostering/timesheets" 
          className={`text-xs bg-${color}-900/40 hover:bg-${color}-800/50 border border-${color}-500/30 px-3 py-1.5 rounded transition-colors inline-flex items-center gap-1.5`}
        >
          <CheckCircle className="h-3.5 w-3.5" />
          Review Timesheets
        </a>
        <a 
          href="/management/swaps" 
          className={`text-xs bg-${color}-900/40 hover:bg-${color}-800/50 border border-${color}-500/30 px-3 py-1.5 rounded transition-colors inline-flex items-center gap-1.5`}
        >
          <Users className="h-3.5 w-3.5" />
          Handle Swap Requests
        </a>
      </div>
    </div>
  );
};

// Custom tooltip component for the chart
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border p-2 rounded shadow-md">
        <p className="font-medium text-xs">{payload[0].payload.name}</p>
        {payload.map((entry: any, index: number) => (
          <p key={`item-${index}`} className="text-xs">
            <span style={{ color: entry.color }}>{entry.name}</span>: {entry.value}
            {entry.name === 'Attendance %' ? '%' : ''}
          </p>
        ))}
      </div>
    );
  }
  return null;
};
