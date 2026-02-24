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
        className="flex items-center gap-3 px-4 py-1.5 rounded-xl text-xs font-semibold bg-white/50 dark:bg-card/50 backdrop-blur-sm border border-card-border hover:bg-white dark:hover:bg-card hover:shadow-md transition-all cursor-pointer min-w-0 sm:min-w-[210px] group"
      >
        <BookOpen className="h-3.5 w-3.5 text-accent opacity-70 group-hover:opacity-100 transition-opacity" />
        <span className="truncate text-left flex-1 text-foreground/80 group-hover:text-foreground">
          {selectedExample ? selectedExample.title : "Select Example"}
        </span>
        <ChevronDown className={`h-3 w-3 text-muted transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 w-[calc(100vw-2rem)] xs:w-80 liquid-glass rounded-2xl shadow-2xl z-50 max-h-[450px] overflow-hidden animate-fade-in border border-card-border/50">
          <div className="overflow-y-auto max-h-[450px] no-scrollbar">
            {categories.map((category: Category) => {
              const Icon = iconMap[category.icon || ''] || BookOpen;
              return (
                <div key={category.id} className="border-b border-card-border/30 last:border-0 pb-1">
                  <div className="px-4 py-3 pb-1 flex items-center gap-2 text-[10px] font-bold text-muted/60 uppercase tracking-widest">
                    <Icon className="h-3 w-3" />
                    {category.name}
                  </div>
                  <div className="px-2 pb-2">
                    {category.examples.map((example) => (
                      <button
                        key={example.id}
                        onClick={() => {
                          onSelect(example);
                          setOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2.5 rounded-xl transition-all cursor-pointer group/item ${selectedExample?.id === example.id
                          ? 'bg-accent shadow-lg shadow-accent/20'
                          : 'hover:bg-accent/5'
                          }`}
                      >
                        <div className={`text-[11px] font-bold transition-colors ${selectedExample?.id === example.id
                          ? 'text-white'
                          : 'text-foreground/90 group-hover/item:text-accent'
                          }`}>
                          {example.title}
                        </div>
                        <div className={`text-[9.5px] mt-1 leading-snug transition-colors ${selectedExample?.id === example.id
                          ? 'text-white/80'
                          : 'text-muted group-hover/item:text-accent/70'
                          }`}>
                          {example.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
