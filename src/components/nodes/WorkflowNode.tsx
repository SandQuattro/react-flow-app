import React from 'react';
import {Handle, NodeProps, Position} from '@xyflow/react';
import {
    Clock,
    Database,
    Filter,
    GitBranch,
    Globe,
    Mail,
    Play,
    RefreshCw,
    Settings,
    Split,
    Trash2,
    Webhook
} from 'lucide-react';
import {WorkflowNodeData} from '../../types/workflow';
import {Button} from '../ui/button';
import {useWorkflowContext} from '../../contexts/WorkflowContext';

const iconMap = {
    Play, Globe, Mail, Database, Clock, GitBranch, Filter, RefreshCw, Split, Webhook
};

const getNodeColor = (type: string) => {
    switch (type) {
        case 'trigger':
            return 'bg-green-50 border-green-200 hover:border-green-300';
        case 'action':
            return 'bg-blue-50 border-blue-200 hover:border-blue-300';
        case 'condition':
            return 'bg-orange-50 border-orange-200 hover:border-orange-300';
        case 'timer':
            return 'bg-purple-50 border-purple-200 hover:border-purple-300';
        default:
            return 'bg-gray-50 border-gray-200 hover:border-gray-300';
    }
};

const getIconColor = (type: string) => {
    switch (type) {
        case 'trigger':
            return 'text-green-600';
        case 'action':
            return 'text-blue-600';
        case 'condition':
            return 'text-orange-600';
        case 'timer':
            return 'text-purple-600';
        default:
            return 'text-gray-600';
    }
};

export const WorkflowNode: React.FC<NodeProps> = ({
    data,
    selected,
    id
}) => {
    const nodeData = data as WorkflowNodeData;
    const { onDeleteNode } = useWorkflowContext();
    const IconComponent = iconMap[nodeData.icon as keyof typeof iconMap];
    const nodeColor = getNodeColor(nodeData.type);
    const iconColor = getIconColor(nodeData.type);

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDeleteNode(id);
    };

    return (
        <div
            className={`
        group relative px-4 py-3 border-2 rounded-lg bg-white shadow-sm transition-all duration-200
        ${nodeColor}
        ${selected ? 'ring-2 ring-primary ring-offset-2' : ''}
        min-w-[200px] max-w-[250px]
      `}
        >
            {/* Input Handle */}
            {nodeData.type !== 'trigger' && (
                <Handle
                    type="target"
                    position={Position.Left}
                    className="w-3 h-3 border-2 border-white bg-gray-400 hover:bg-gray-500"
                />
            )}

            {/* Node Content */}
            <div className="flex items-center gap-3">
                <div className={`flex-shrink-0 w-8 h-8 rounded-md bg-white flex items-center justify-center border ${iconColor}`}>
                    {IconComponent && (
                        <IconComponent className={`w-4 h-4 ${iconColor}`} />
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-gray-900 truncate">
                        {nodeData.label}
                    </div>
                    {nodeData.description && (
                        <div className="text-xs text-gray-600 mt-1 text-ellipsis overflow-hidden">
                            {nodeData.description}
                        </div>
                    )}
                </div>
            </div>

            {/* Node Actions (visible on hover) */}
            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex gap-1">
                    <Button
                        size="sm"
                        variant="ghost"
                        className="w-6 h-6 p-0 hover:bg-white/80"
                        onClick={(e) => {
                            e.stopPropagation();
                            // Handle settings click
                        }}
                    >
                        <Settings className="w-3 h-3" />
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        className="w-6 h-6 p-0 hover:bg-red-100 hover:text-red-600"
                        onClick={handleDelete}
                        title="Удалить узел"
                    >
                        <Trash2 className="w-3 h-3" />
                    </Button>
                </div>
            </div>

            {/* Output Handle */}
            {nodeData.type !== 'condition' ? (
                <Handle
                    type="source"
                    position={Position.Right}
                    className="w-3 h-3 border-2 border-white bg-gray-400 hover:bg-gray-500"
                />
            ) : (
                // Condition nodes have multiple outputs
                <>
                    <Handle
                        type="source"
                        position={Position.Right}
                        id="true"
                        style={{ top: '35%' }}
                        className="w-3 h-3 border-2 border-white bg-green-500 hover:bg-green-600"
                    />
                    <Handle
                        type="source"
                        position={Position.Right}
                        id="false"
                        style={{ top: '65%' }}
                        className="w-3 h-3 border-2 border-white bg-red-500 hover:bg-red-600"
                    />
                </>
            )}

            {/* Condition labels */}
            {nodeData.type === 'condition' && (
                <div className="absolute -right-12 top-0 bottom-0 flex flex-col justify-around">
                    <span className="text-xs text-green-600 font-medium">True</span>
                    <span className="text-xs text-red-600 font-medium">False</span>
                </div>
            )}
        </div>
    );
}; 