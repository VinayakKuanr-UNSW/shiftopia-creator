
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface StaffingAlertCardProps {
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  actionText: string;
  actionLink: string;
}

export const StaffingAlertCard: React.FC<StaffingAlertCardProps> = ({ 
  title, description, severity, actionText, actionLink 
}) => {
  const getSeverityClasses = () => {
    switch (severity) {
      case 'high':
        return 'bg-red-900/30 border-red-500/30';
      case 'medium':
        return 'bg-amber-900/30 border-amber-500/30';
      case 'low':
        return 'bg-blue-900/30 border-blue-500/30';
      default:
        return 'bg-gray-900/30 border-gray-500/30';
    }
  };
  
  return (
    <Card className={`${getSeverityClasses()} border`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-3">{description}</p>
        <a 
          href={actionLink} 
          className="text-xs font-medium bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded transition-colors inline-block"
        >
          {actionText}
        </a>
      </CardContent>
    </Card>
  );
};
