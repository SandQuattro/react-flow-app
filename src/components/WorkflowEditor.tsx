import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
    addEdge,
    Background,
    BackgroundVariant,
    Connection,
    Controls,
    Edge,
    MiniMap,
    Node,
    ReactFlow,
    ReactFlowProvider,
    useEdgesState,
    useNodesState
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import {ComponentPalette} from './ComponentPalette';
import {WorkflowNode} from './nodes/WorkflowNode';
import {ComponentPaletteItem, WorkflowNodeData} from '../types/workflow';
import {Button} from './ui/button';
import {Download, Play, Save, Upload} from 'lucide-react';
import {WorkflowProvider} from '../contexts/WorkflowContext';

const nodeTypes = {
    workflowNode: WorkflowNode,
};

const initialNodes: Node<WorkflowNodeData>[] = [
    {
        id: '1',
        type: 'workflowNode',
        position: { x: 100, y: 240 },
        data: {
            label: 'Start',
            type: 'trigger',
            description: 'Workflow starting point',
            icon: 'Play'
        }
    }
];

const initialEdges: Edge[] = [];

export const WorkflowEditor: React.FC = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const [draggedItem, setDraggedItem] = useState<ComponentPaletteItem | null>(null);

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    const onDragStart = useCallback((event: React.DragEvent, item: ComponentPaletteItem) => {
        setDraggedItem(item);
        event.dataTransfer.effectAllowed = 'move';
    }, []);

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const snapToGrid = (position: { x: number; y: number }) => {
        const gridSize = 20;
        return {
            x: Math.round(position.x / gridSize) * gridSize,
            y: Math.round(position.y / gridSize) * gridSize
        };
    };

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();

            if (!reactFlowWrapper.current || !reactFlowInstance || !draggedItem) {
                return;
            }

            const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
            const rawPosition = reactFlowInstance.screenToFlowPosition({
                x: event.clientX - reactFlowBounds.left,
                y: event.clientY - reactFlowBounds.top,
            });

            const position = snapToGrid(rawPosition);

            const newNode: Node<WorkflowNodeData> = {
                id: `${Date.now()}`,
                type: 'workflowNode',
                position,
                data: {
                    label: draggedItem.label,
                    type: draggedItem.type,
                    description: draggedItem.description,
                    icon: draggedItem.icon
                }
            };

            setNodes((nds) => nds.concat(newNode));
            setDraggedItem(null);
        },
        [reactFlowInstance, draggedItem, setNodes]
    );

    const onSave = useCallback(() => {
        if (reactFlowInstance) {
            const flow = reactFlowInstance.toObject();
            localStorage.setItem('workflow', JSON.stringify(flow));
            console.log('Workflow saved:', flow);
        }
    }, [reactFlowInstance]);

    const onLoad = useCallback(() => {
        const savedFlow = localStorage.getItem('workflow');
        if (savedFlow && reactFlowInstance) {
            const flow = JSON.parse(savedFlow);
            setNodes(flow.nodes || []);
            setEdges(flow.edges || []);
            reactFlowInstance.setViewport(flow.viewport);
        }
    }, [reactFlowInstance, setNodes, setEdges]);

    const onExport = useCallback(() => {
        if (reactFlowInstance) {
            const flow = reactFlowInstance.toObject();
            const dataStr = JSON.stringify(flow, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

            const exportFileDefaultName = 'workflow.json';
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();
        }
    }, [reactFlowInstance]);

    const onRun = useCallback(() => {
        console.log('Running workflow with nodes:', nodes);
        console.log('Running workflow with edges:', edges);
        // Здесь будет логика выполнения workflow
    }, [nodes, edges]);

    const onDeleteNode = useCallback((nodeId: string) => {
        setNodes((nds) => nds.filter((node) => node.id !== nodeId));
        setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
    }, [setNodes, setEdges]);

    const onKeyDown = useCallback((event: KeyboardEvent) => {
        if (event.key === 'Delete' || event.key === 'Backspace') {
            const selectedNodes = nodes.filter((node) => node.selected);
            const selectedEdges = edges.filter((edge) => edge.selected);

            if (selectedNodes.length > 0) {
                const nodeIds = selectedNodes.map((node) => node.id);
                setNodes((nds) => nds.filter((node) => !nodeIds.includes(node.id)));
                setEdges((eds) => eds.filter((edge) =>
                    !nodeIds.includes(edge.source) && !nodeIds.includes(edge.target)
                ));
            }

            if (selectedEdges.length > 0) {
                const edgeIds = selectedEdges.map((edge) => edge.id);
                setEdges((eds) => eds.filter((edge) => !edgeIds.includes(edge.id)));
            }
        }
    }, [nodes, edges, setNodes, setEdges]);

    useEffect(() => {
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [onKeyDown]);

    return (
        <div className="h-screen flex bg-background">
            {/* Component Palette */}
            <ComponentPalette onDragStart={onDragStart} />

            {/* Main Editor Area */}
            <div className="flex-1 flex flex-col">
                {/* Toolbar */}
                <div className="h-14 border-b border-border bg-card px-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <h1 className="text-lg font-semibold">MonkeyJob Workflow Editor</h1>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={onLoad}>
                            <Upload className="w-4 h-4 mr-2" />
                            Load
                        </Button>
                        <Button variant="outline" size="sm" onClick={onSave}>
                            <Save className="w-4 h-4 mr-2" />
                            Save
                        </Button>
                        <Button variant="outline" size="sm" onClick={onExport}>
                            <Download className="w-4 h-4 mr-2" />
                            Export
                        </Button>
                        <Button size="sm" onClick={onRun}>
                            <Play className="w-4 h-4 mr-2" />
                            Run
                        </Button>
                    </div>
                </div>

                {/* React Flow Canvas */}
                <div className="flex-1" ref={reactFlowWrapper}>
                    <WorkflowProvider value={{ onDeleteNode }}>
                        <ReactFlow
                            nodes={nodes}
                            edges={edges}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            onConnect={onConnect}
                            onInit={setReactFlowInstance}
                            onDrop={onDrop}
                            onDragOver={onDragOver}
                            nodeTypes={nodeTypes}
                            fitView
                            attributionPosition="bottom-left"
                            snapToGrid={true}
                            snapGrid={[20, 20]}
                        >
                            <Background
                                color="#e2e8f0"
                                variant={BackgroundVariant.Dots}
                                gap={20}
                                size={1}
                            />
                            <Controls />
                            <MiniMap
                                nodeColor={(node) => {
                                    const nodeData = node.data as WorkflowNodeData;
                                    switch (nodeData.type) {
                                        case 'trigger': return '#10b981';
                                        case 'action': return '#3b82f6';
                                        case 'condition': return '#f59e0b';
                                        case 'timer': return '#8b5cf6';
                                        default: return '#6b7280';
                                    }
                                }}
                                className="bg-background border border-border rounded-lg"
                            />
                        </ReactFlow>
                    </WorkflowProvider>
                </div>
            </div>
        </div>
    );
};

export const WorkflowEditorWithProvider: React.FC = () => {
    return (
        <ReactFlowProvider>
            <WorkflowEditor />
        </ReactFlowProvider>
    );
}; 