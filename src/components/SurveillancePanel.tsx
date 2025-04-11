
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CameraFeed } from "./surveillance/CameraFeed";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ActivityLog } from "./surveillance/ActivityLog";

export function SurveillancePanel() {
  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-primary">
          Surveillance System
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="live" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="live">Live Feed</TabsTrigger>
            <TabsTrigger value="activity">Activity Log</TabsTrigger>
          </TabsList>
          <TabsContent value="live">
            <div className="pt-4">
              <CameraFeed />
            </div>
          </TabsContent>
          <TabsContent value="activity">
            <div className="pt-4">
              <ActivityLog />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
