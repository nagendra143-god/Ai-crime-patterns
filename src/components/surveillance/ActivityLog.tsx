
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type ActivityEntry = {
  id: string;
  timestamp: Date;
  activityType: 'person_detected' | 'suspicious_activity' | 'unidentified_object';
  description: string;
  confidence: number;
  location: string;
};

const mockActivities: ActivityEntry[] = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    activityType: 'person_detected',
    description: 'Person detected near entrance',
    confidence: 0.92,
    location: 'Main Entrance'
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    activityType: 'suspicious_activity',
    description: 'Unusual movement detected',
    confidence: 0.78,
    location: 'Back Alley'
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
    activityType: 'person_detected',
    description: 'Multiple people detected',
    confidence: 0.88,
    location: 'Parking Lot'
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
    activityType: 'unidentified_object',
    description: 'Unidentified object left at location',
    confidence: 0.67,
    location: 'Reception Area'
  }
];

export function ActivityLog() {
  const [activities] = useState<ActivityEntry[]>(mockActivities);
  
  const getActivityBadgeColor = (type: string) => {
    switch(type) {
      case 'person_detected':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'suspicious_activity':
        return 'bg-red-500 hover:bg-red-600';
      case 'unidentified_object':
        return 'bg-amber-500 hover:bg-amber-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };
  
  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    
    if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } else {
      const diffHours = Math.round(diffMins / 60);
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    }
  };
  
  return (
    <Card>
      <CardContent className="p-0">
        <div className="space-y-1">
          <h3 className="font-medium p-3">Recent Activity</h3>
          <ul className="divide-y divide-border">
            {activities.map((activity) => (
              <li key={activity.id} className="p-3 hover:bg-muted/50">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{activity.description}</p>
                    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                      <Badge className={getActivityBadgeColor(activity.activityType)}>
                        {activity.activityType.replace('_', ' ')}
                      </Badge>
                      <span>{activity.location}</span>
                      <span>•</span>
                      <span>Confidence: {Math.round(activity.confidence * 100)}%</span>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {formatTimestamp(activity.timestamp)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
