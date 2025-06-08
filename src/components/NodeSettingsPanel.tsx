import React from 'react';
import { WorkflowNodeData } from '../types/workflow';
import { Button } from './ui/button';
import { X, Settings } from 'lucide-react';

interface NodeSettingsPanelProps {
    node: WorkflowNodeData | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (nodeData: WorkflowNodeData) => void;
}

export const NodeSettingsPanel: React.FC<NodeSettingsPanelProps> = ({
    node,
    isOpen,
    onClose,
    onSave
}) => {
    if (!isOpen || !node) return null;

    const handleSave = () => {
        onSave(node);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-xl w-96 max-h-[80vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                        <Settings className="w-5 h-5 text-gray-600" />
                        <h2 className="text-lg font-semibold">Node Settings</h2>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="w-8 h-8 p-0"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Label
                        </label>
                        <input
                            type="text"
                            value={node.label}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter node label"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            value={node.description || ''}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter node description"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Type
                        </label>
                        <select
                            value={node.type}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="trigger">Trigger</option>
                            <option value="action">Action</option>
                            <option value="condition">Condition</option>
                            <option value="timer">Timer</option>
                        </select>
                    </div>

                    {/* Type-specific settings */}
                    {node.type === 'trigger' && (
                        <div className="space-y-3">
                            <h3 className="font-medium text-gray-900">Trigger Settings</h3>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Trigger Event
                                </label>
                                <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                                    <option>Manual</option>
                                    <option>Webhook</option>
                                    <option>Schedule</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {node.type === 'action' && (
                        <div className="space-y-3">
                            <h3 className="font-medium text-gray-900">Action Settings</h3>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Action Type
                                </label>
                                <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                                    <option>HTTP Request</option>
                                    <option>Send Email</option>
                                    <option>Database Query</option>
                                    <option>Transform Data</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {node.type === 'condition' && (
                        <div className="space-y-3">
                            <h3 className="font-medium text-gray-900">Condition Settings</h3>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Condition Expression
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    placeholder="e.g., status === 'active'"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-2 p-4 border-t border-gray-200">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave}>
                        Save Changes
                    </Button>
                </div>
            </div>
        </div>
    );
}; 