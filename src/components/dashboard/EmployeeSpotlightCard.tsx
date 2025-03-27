
import React from 'react';
import { Users } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface EmployeeSpotlightCardProps {
  name: string;
  department: string;
  metric: string;
  shifts: number;
}

export const EmployeeSpotlightCard: React.FC<EmployeeSpotlightCardProps> = ({ 
  name, department, metric, shifts 
}) => {
  const getDepartmentClasses = () => {
    switch (department) {
      case 'convention':
        return 'bg-blue-900/30 border-blue-500/30 text-blue-300';
      case 'exhibition':
        return 'bg-green-900/30 border-green-500/30 text-green-300';
      case 'theatre':
        return 'bg-red-900/30 border-red-500/30 text-red-300';
      case 'it':
        return 'bg-purple-900/30 border-purple-500/30 text-purple-300';
      default:
        return 'bg-gray-900/30 border-gray-500/30 text-gray-300';
    }
  };
  
  return (
    <Card className={`${getDepartmentClasses()} border`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Users className="h-4 w-4" />
          {name}
        </CardTitle>
        <div className="text-xs opacity-70 capitalize">{department}</div>
      </CardHeader>
      <CardContent>
        <div className="text-lg font-bold mb-1">{metric}</div>
        <div className="text-xs opacity-70">{shifts} shifts this month</div>
      </CardContent>
    </Card>
  );
};
