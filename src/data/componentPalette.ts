import { ComponentPaletteItem } from '../types/workflow';

export const componentPalette: ComponentPaletteItem[] = [
    // Triggers
    {
        id: 'manual-trigger',
        type: 'trigger',
        label: 'Manual Trigger',
        description: 'Manually start workflow',
        icon: 'Play',
        category: 'Triggers'
    },
    {
        id: 'webhook-trigger',
        type: 'trigger',
        label: 'Webhook',
        description: 'Start workflow on HTTP request',
        icon: 'Webhook',
        category: 'Triggers'
    },
    {
        id: 'timer-trigger',
        type: 'timer',
        label: 'Schedule',
        description: 'Start workflow on schedule',
        icon: 'Clock',
        category: 'Triggers'
    },

    // Actions
    {
        id: 'http-request',
        type: 'action',
        label: 'HTTP Request',
        description: 'Make HTTP API call',
        icon: 'Globe',
        category: 'Actions'
    },
    {
        id: 'send-email',
        type: 'action',
        label: 'Send Email',
        description: 'Send email notification',
        icon: 'Mail',
        category: 'Actions'
    },
    {
        id: 'database-query',
        type: 'action',
        label: 'Database Query',
        description: 'Execute database query',
        icon: 'Database',
        category: 'Actions'
    },
    {
        id: 'transform-data',
        type: 'action',
        label: 'Transform Data',
        description: 'Transform and format data',
        icon: 'RefreshCw',
        category: 'Actions'
    },

    // Conditions
    {
        id: 'if-condition',
        type: 'condition',
        label: 'IF Condition',
        description: 'Branch workflow based on condition',
        icon: 'GitBranch',
        category: 'Logic'
    },
    {
        id: 'filter-condition',
        type: 'condition',
        label: 'Filter',
        description: 'Filter data based on criteria',
        icon: 'Filter',
        category: 'Logic'
    },
    {
        id: 'switch-condition',
        type: 'condition',
        label: 'Switch',
        description: 'Multiple condition branching',
        icon: 'Split',
        category: 'Logic'
    }
];

export const categories = Array.from(new Set(componentPalette.map(item => item.category))); 