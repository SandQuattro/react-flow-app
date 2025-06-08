import React, { useState } from 'react';
import {
    Play,
    Globe,
    Mail,
    Database,
    Clock,
    GitBranch,
    Filter,
    RefreshCw,
    Split,
    Webhook,
    Search,
    ChevronDown,
    ChevronRight
} from 'lucide-react';
import { componentPalette, categories } from '../data/componentPalette';
import { ComponentPaletteItem } from '../types/workflow';
import { Button } from './ui/button';

const iconMap = {
    Play, Globe, Mail, Database, Clock, GitBranch, Filter, RefreshCw, Split, Webhook
};

interface ComponentPaletteProps {
    onDragStart: (event: React.DragEvent, item: ComponentPaletteItem) => void;
}

export const ComponentPalette: React.FC<ComponentPaletteProps> = ({ onDragStart }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
        new Set(categories)
    );

    const filteredComponents = componentPalette.filter(item =>
        item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleCategory = (category: string) => {
        const newExpanded = new Set(expandedCategories);
        if (newExpanded.has(category)) {
            newExpanded.delete(category);
        } else {
            newExpanded.add(category);
        }
        setExpandedCategories(newExpanded);
    };

    const groupedComponents = categories.reduce((acc, category) => {
        acc[category] = filteredComponents.filter(item => item.category === category);
        return acc;
    }, {} as Record<string, ComponentPaletteItem[]>);

    return (
        <div className="w-80 bg-card border-r border-border h-full flex flex-col">
            <div className="p-4 border-b border-border">
                <h2 className="text-lg font-semibold mb-3">Components</h2>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search components..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
                {categories.map(category => {
                    const categoryComponents = groupedComponents[category];
                    const isExpanded = expandedCategories.has(category);

                    if (categoryComponents.length === 0) return null;

                    return (
                        <div key={category} className="mb-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start p-2 h-auto"
                                onClick={() => toggleCategory(category)}
                            >
                                {isExpanded ? (
                                    <ChevronDown className="w-4 h-4 mr-2" />
                                ) : (
                                    <ChevronRight className="w-4 h-4 mr-2" />
                                )}
                                <span className="font-medium">{category}</span>
                                <span className="ml-auto text-muted-foreground text-xs">
                                    {categoryComponents.length}
                                </span>
                            </Button>

                            {isExpanded && (
                                <div className="ml-2 space-y-1">
                                    {categoryComponents.map(item => {
                                        const IconComponent = iconMap[item.icon as keyof typeof iconMap];

                                        return (
                                            <div
                                                key={item.id}
                                                draggable
                                                onDragStart={(e) => onDragStart(e, item)}
                                                className="group cursor-move p-3 border border-border rounded-lg bg-background hover:bg-accent hover:border-accent-foreground/20 transition-colors"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className="flex-shrink-0 w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                                        {IconComponent && (
                                                            <IconComponent className="w-4 h-4 text-primary" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-medium text-sm text-foreground">
                                                            {item.label}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground mt-1 text-ellipsis overflow-hidden">
                                                            {item.description}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}; 