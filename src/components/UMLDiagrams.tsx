
import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download } from 'lucide-react';

const UMLDiagrams = () => {
  const diagrams = [
    {
      title: 'Class Diagram',
      content: `+-------------------+        +------------------+        +-------------------+
|    AuthProvider   |        |    RoleGuard    |        |      Crime       |
+-------------------+        +------------------+        +-------------------+
| -user: User       |        | -children: Node |        | -date: string    |
| -isLoading: bool  |        | -roles: string[]|        | -location: string|
+-------------------+        +------------------+        | -status: string  |
| +signOut()        |        | +checkRole()    |        | -caseNumber: str |
| +getSession()     |        +------------------+        +-------------------+
+-------------------+`
    },
    {
      title: 'Use Case Diagram',
      content: `                            Crime Management System
+----------------------------------------------------------------+
|                                                                  |
|    +------------+         +--------------+      +------------+    |
|    |            |         |              |      |            |    |
|    |   Login    |         | Manage Crime |      |  Manage    |    |
|    |            |         |   Records    |      |   Users    |    |
|    +------------+         +--------------+      +------------+    |
|          ^                      ^                    ^           |
|          |                      |                    |           |
|     +---------+            +---------+         +---------+       |
|     |  User   |            | Officer |         |  Admin  |       |
|     +---------+            +---------+         +---------+       |
|                                                                  |
+----------------------------------------------------------------+`
    },
    {
      title: 'Activity Diagram',
      content: `[Start]
   ↓
[Check Authentication]
   ↓
   →[Not Authenticated]→[Redirect to Login]
   ↓
[Authenticated]
   ↓
[Check User Role]
   ↓
   →[Admin]→[Show Admin Dashboard]
   ↓
   →[User]→[Show Limited Dashboard]
   ↓
[Access Crime Data]
   ↓
[End]`
    },
    {
      title: 'Sequence Diagram',
      content: `User        AuthProvider        Supabase        Dashboard
  |              |                |                |
  |─────Login────>                |                |
  |              |────Validate───>|                |
  |              |<───Token──────|                |
  |              |                |                |
  |              |────Session───>|                |
  |              |<───User Data──|                |
  |<───Redirect──|                |                |
  |              |                |                |
  |─────Request─────────────────>|                |
  |              |                |────Data────>|
  |              |                |<───Render───|
  |<────Display─────────────────────────────────|`
    },
    {
      title: 'State Diagram',
      content: `[Initial State]
      ↓
[Not Authenticated]──────┐
      ↓                 ↑
[Login Attempt]         |
      ↓                 |
[Authenticating]───────>|
      ↓                 |
[Authenticated]         |
      ↓                 |
[Session Active]────────┘`
    },
    {
      title: 'Object Diagram',
      content: `:User                           :CrimeRecord
+----------------------+        +----------------------+
| id: "uuid-1"        |        | id: "crime-1"       |
| email: "user@ex.com"|        | type: "Theft"       |
| role: "admin"       |        | status: "Open"      |
+----------------------+        +----------------------+

:UserRole                       :Profile
+----------------------+        +----------------------+
| userId: "uuid-1"     |        | userId: "uuid-1"     |
| role: "admin"        |        | username: "admin1"   |
| createdAt: "date"    |        | avatar: "url"        |
+----------------------+        +----------------------+`
    },
    {
      title: 'Deployment Diagram',
      content: `+----------------+        +----------------+        +----------------+
|   Client Web   |        |   Supabase    |        |  PostgreSQL   |
|   Browser      |------->|   Backend     |------->|  Database     |
+----------------+        +----------------+        +----------------+
        |                        |                        |
        |                        |                        |
+----------------+        +----------------+        +----------------+
|   React App    |        |   Auth API    |        |  Storage      |
+----------------+        +----------------+        +----------------+`
    },
    {
      title: 'Component Diagram',
      content: `+------------------+        +------------------+
|   AuthProvider   |------->|    RoleGuard    |
+------------------+        +------------------+
         |                          |
         ↓                          ↓
+------------------+        +------------------+
|  DashboardLayout |<-------|  CrimeManager   |
+------------------+        +------------------+
         |                          |
         ↓                          ↓
+------------------+        +------------------+
|   DataAnalytics  |        | UserManagement  |
+------------------+        +------------------+`
    }
  ];

  const downloadDiagram = (title: string, content: string) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${title.toLowerCase().replace(' ', '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const downloadAllDiagrams = () => {
    const allContent = diagrams.map(d => `${d.title}\n${'='.repeat(d.title.length)}\n\n${d.content}\n\n`).join('\n');
    const element = document.createElement('a');
    const file = new Blob([allContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'all_uml_diagrams.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">UML Diagrams</h1>
        <Button onClick={downloadAllDiagrams} className="gap-2">
          <Download className="h-4 w-4" />
          Download All
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {diagrams.map((diagram, index) => (
          <Card key={index} className="w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl">{diagram.title}</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadDiagram(diagram.title, diagram.content)}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                <pre className="font-mono text-sm whitespace-pre">{diagram.content}</pre>
              </ScrollArea>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UMLDiagrams;
