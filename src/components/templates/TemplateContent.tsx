
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import RosterGroup from '@/components/roster/RosterGroup';
import { Template, Group } from '@/api/models/types';

interface TemplateContentProps {
  template: Template;
  onUpdateGroup: (groupId: number, updates: Partial<Group>) => void;
  onDeleteGroup: (groupId: number) => void;
  onCloneGroup: (groupId: number) => void;
  onAddSubGroup: (groupId: number, name: string) => void;
}

const TemplateContent: React.FC<TemplateContentProps> = ({
  template,
  onUpdateGroup,
  onDeleteGroup,
  onCloneGroup,
  onAddSubGroup
}) => {
  return (
    <div className="mb-6">
      <Card>
        <CardHeader>
          <CardTitle>{template.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {template.groups.map(group => (
              <RosterGroup
                key={group.id}
                group={group}
                templateId={template.id}
                onUpdateGroup={onUpdateGroup}
                onDeleteGroup={onDeleteGroup}
                onCloneGroup={onCloneGroup}
                onAddSubGroup={onAddSubGroup}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TemplateContent;
