import { Node, Edge } from '@xyflow/react';

export type WorkflowNodeType = 'trigger' | 'action' | 'condition' | 'timer';

export interface WorkflowNodeData extends Record<string, any> {
    label: string;
    type: WorkflowNodeType;
    description?: string;
    icon?: string;
    settings?: Record<string, any>;
}

export type WorkflowNode = Node<WorkflowNodeData>;
export type WorkflowEdge = Edge;

export interface ComponentPaletteItem {
    id: string;
    type: WorkflowNodeType;
    label: string;
    description: string;
    icon: string;
    category: string;
} 