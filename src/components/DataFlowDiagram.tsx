
import React from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const initialNodes = [
  {
    id: 'user-input',
    data: { label: 'User Input' },
    position: { x: 250, y: 0 },
    type: 'input',
    style: { background: '#EADDFF', borderColor: '#6750A4' }
  },
  {
    id: 'auth',
    data: { label: 'Authentication' },
    position: { x: 250, y: 100 },
    style: { background: '#EADDFF', borderColor: '#6750A4' }
  },
  {
    id: 'crime-data',
    data: { label: 'Crime Data Storage' },
    position: { x: 250, y: 200 },
    style: { background: '#D0BCFF', borderColor: '#6750A4' }
  },
  {
    id: 'analytics',
    data: { label: 'Data Analytics' },
    position: { x: 100, y: 300 },
    style: { background: '#D0BCFF', borderColor: '#6750A4' }
  },
  {
    id: 'surveillance',
    data: { label: 'Surveillance System' },
    position: { x: 400, y: 300 },
    style: { background: '#D0BCFF', borderColor: '#6750A4' }
  },
  {
    id: 'map',
    data: { label: 'Crime Map Visualization' },
    position: { x: 100, y: 400 },
    style: { background: '#B69DF8', borderColor: '#6750A4' }
  },
  {
    id: 'alerts',
    data: { label: 'Alert Generation' },
    position: { x: 400, y: 400 },
    style: { background: '#B69DF8', borderColor: '#6750A4' }
  },
  {
    id: 'historical',
    data: { label: 'Historical Data Analysis' },
    position: { x: 250, y: 500 },
    style: { background: '#B69DF8', borderColor: '#6750A4' }
  },
  {
    id: 'detection-output',
    data: { label: 'Pattern Detection Output' },
    position: { x: 250, y: 600 },
    type: 'output',
    style: { background: '#EADDFF', borderColor: '#6750A4' }
  },
];

const initialEdges = [
  { id: 'e1-2', source: 'user-input', target: 'auth', animated: true },
  { id: 'e2-3', source: 'auth', target: 'crime-data', animated: true },
  { id: 'e3-4', source: 'crime-data', target: 'analytics' },
  { id: 'e3-5', source: 'crime-data', target: 'surveillance' },
  { id: 'e4-6', source: 'analytics', target: 'map' },
  { id: 'e5-7', source: 'surveillance', target: 'alerts' },
  { id: 'e6-8', source: 'map', target: 'historical' },
  { id: 'e7-8', source: 'alerts', target: 'historical' },
  { id: 'e8-9', source: 'historical', target: 'detection-output', animated: true },
];

export function DataFlowDiagram() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-primary">
          System Data Flow Diagram
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
            <Background variant="dots" gap={12} size={1} />
            <Panel position="top-center" className="bg-background p-2 rounded-md shadow-sm text-sm">
              Crime Pattern Detection System Data Flow
            </Panel>
          </ReactFlow>
        </div>
        <div className="text-sm text-muted-foreground mt-4">
          <p>This diagram illustrates the flow of data through the Crime Pattern Detection System, from user input through analysis to pattern detection output.</p>
        </div>
      </CardContent>
    </Card>
  );
}
