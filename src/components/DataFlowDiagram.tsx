
import React from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const initialNodes = [
  {
    id: 'user',
    data: { label: 'User' },
    position: { x: 250, y: 0 },
    style: { background: '#EADDFF', borderColor: '#6750A4' }
  },
  {
    id: 'authentication',
    data: { label: 'Authentication Module' },
    position: { x: 250, y: 100 },
    style: { background: '#EADDFF', borderColor: '#6750A4' }
  },
  {
    id: 'crime-data',
    data: { label: 'Crime Data Repository' },
    position: { x: 250, y: 200 },
    style: { background: '#D0BCFF', borderColor: '#6750A4' }
  },
  {
    id: 'surveillance',
    data: { label: 'Real-time Surveillance' },
    position: { x: 100, y: 300 },
    style: { background: '#D0BCFF', borderColor: '#6750A4' }
  },
  {
    id: 'ml-engine',
    data: { label: 'ML Detection Engine' },
    position: { x: 400, y: 300 },
    style: { background: '#D0BCFF', borderColor: '#6750A4' }
  },
  {
    id: 'alert-system',
    data: { label: 'Alert Generation System' },
    position: { x: 100, y: 400 },
    style: { background: '#B69DF8', borderColor: '#6750A4' }
  },
  {
    id: 'reporting',
    data: { label: 'Reporting Module' },
    position: { x: 400, y: 400 },
    style: { background: '#B69DF8', borderColor: '#6750A4' }
  },
  {
    id: 'dashboard',
    data: { label: 'Dashboard Interface' },
    position: { x: 250, y: 500 },
    style: { background: '#B69DF8', borderColor: '#6750A4' }
  }
];

const initialEdges = [
  { id: 'e1-2', source: 'user', target: 'authentication', animated: true },
  { id: 'e2-3', source: 'authentication', target: 'crime-data', animated: true },
  { id: 'e3-4', source: 'crime-data', target: 'surveillance' },
  { id: 'e3-5', source: 'crime-data', target: 'ml-engine' },
  { id: 'e4-6', source: 'surveillance', target: 'alert-system' },
  { id: 'e5-7', source: 'ml-engine', target: 'reporting' },
  { id: 'e6-8', source: 'alert-system', target: 'dashboard' },
  { id: 'e7-8', source: 'reporting', target: 'dashboard', animated: true }
];

export function DataFlowDiagram() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-primary">
          System UML Data Flow Diagram
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div style={{ height: 700 }} className="rounded-md border">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            fitView
            attributionPosition="bottom-right"
          >
            <Controls />
            <MiniMap />
            <Background variant="lines" gap={12} size={1} />
          </ReactFlow>
        </div>
        <div className="text-sm text-muted-foreground mt-4">
          <p>UML diagram showing the flow of data through various system components, from user interaction to data processing and visualization.</p>
        </div>
      </CardContent>
    </Card>
  );
}

