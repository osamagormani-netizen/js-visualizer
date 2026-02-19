"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, BookOpen, Clock, Sparkles, Network } from "lucide-react";
import { categories, type Category } from "@/data/examples";
import { type VisualizerExample } from "@/lib/types";

const iconMap: Record<string, React.ElementType> = {
  BookOpen,
  Clock,
  Sparkles,
  Network,
};

interface ExampleSelectorProps {
  selectedExample: VisualizerExample | null;
  onSelect: (example: VisualizerExample) => void;
}

export function ExampleSelector({ selectedExample, onSelect }: ExampleSelectorProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm bg-card border border-card-border hover:bg-sidebar-hover transition-all cursor-pointer min-w-[200px]"
      >
        <span className="truncate text-left flex-1">
          {selectedExample ? selectedExample.title : "Select an example..."}
        </span>
        <ChevronDown className={`h-3.5 w-3.5 text-muted transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-80 bg-card border border-card-border rounded-lg shadow-xl z-50 max-h-[400px] overflow-y-auto animate-fade-in">
          {categories.map((category: Category) => {
            const Icon = iconMap[category.icon || ''] || BookOpen;
            return (
              <div key={category.id}>
                <div className="px-3 py-2 flex items-center gap-2 text-xs font-semibold text-muted uppercase tracking-wider border-b border-card-border bg-sidebar">
                  <Icon className="h-3.5 w-3.5 text-accent" />
                  {category.name}
                </div>
                {category.examples.map((example) => (
                  <button
                    key={example.id}
                    onClick={() => {
                      onSelect(example);
                      setOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer hover:bg-sidebar-hover ${selectedExample?.id === example.id
                      ? 'bg-sidebar-active text-accent font-medium'
                      : 'text-foreground'
                      }`}
                  >
                    <div className="font-medium text-xs">{example.title}</div>
                    <div className="text-[10px] text-muted mt-0.5 truncate">
                      {example.description}
                    </div>
                  </button>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
