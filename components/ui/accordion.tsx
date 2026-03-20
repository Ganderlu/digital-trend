"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";

interface AccordionProps {
  children: React.ReactNode;
  className?: string;
}

interface AccordionItemProps {
  children: React.ReactNode;
  className?: string;
  value: string;
}

interface AccordionTriggerProps {
  children: React.ReactNode;
  className?: string;
}

interface AccordionContentProps {
  children: React.ReactNode;
  className?: string;
}

const AccordionContext = React.createContext<{
  openItem: string | null;
  toggleItem: (value: string) => void;
} | null>(null);

export function Accordion({ children, className }: AccordionProps) {
  const [openItem, setOpenItem] = React.useState<string | null>(null);

  const toggleItem = (value: string) => {
    setOpenItem(openItem === value ? null : value);
  };

  return (
    <AccordionContext.Provider value={{ openItem, toggleItem }}>
      <div className={className}>{children}</div>
    </AccordionContext.Provider>
  );
}

export function AccordionItem({ children, className, value }: AccordionItemProps) {
  return (
    <div className={`border-b border-slate-200 ${className}`} data-state={value}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, { value });
        }
        return child;
      })}
    </div>
  );
}

export function AccordionTrigger({ children, className, value }: AccordionTriggerProps & { value?: string }) {
  const context = React.useContext(AccordionContext);
  if (!context) throw new Error("AccordionTrigger must be used within Accordion");

  const isOpen = context.openItem === value;

  return (
    <button
      type="button"
      onClick={() => value && context.toggleItem(value)}
      className={`flex w-full items-center justify-between py-4 text-left font-medium transition-all hover:text-emerald-600 ${className}`}
    >
      {children}
      <ChevronDown
        className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
          isOpen ? "rotate-180" : ""
        }`}
      />
    </button>
  );
}

export function AccordionContent({ children, className, value }: AccordionContentProps & { value?: string }) {
  const context = React.useContext(AccordionContext);
  if (!context) throw new Error("AccordionContent must be used within Accordion");

  const isOpen = context.openItem === value;

  return (
    <div
      className={`overflow-hidden text-sm transition-all duration-300 ${
        isOpen ? "max-h-96 pb-4" : "max-h-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}
