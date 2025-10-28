import React, { useState, useEffect } from 'react';
import {
  Search,
  Home,
  BarChart3,
  FileText,
  Settings,
  DollarSign,
  ShoppingCart,
  Users,
} from 'lucide-react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';

interface CommandPaletteProps {
  onNavigate?: (page: string) => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ onNavigate }) => {
  const [open, setOpen] = useState(false);

  // Keyboard shortcut: Ctrl+K or Cmd+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleSelect = (value: string) => {
    setOpen(false);
    onNavigate?.(value);
    console.log('Navigate to:', value);
  };

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="hidden lg:flex items-center gap-2 px-3 py-2 text-sm text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
      >
        <Search size={16} />
        <span>Search...</span>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-gray-200 px-1.5 font-mono text-[10px] font-medium opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {/* Command Dialog */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          {/* Navigation */}
          <CommandGroup heading="Navigation">
            <CommandItem onSelect={() => handleSelect('dashboard')}>
              <Home className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </CommandItem>
            <CommandItem onSelect={() => handleSelect('analytics')}>
              <BarChart3 className="mr-2 h-4 w-4" />
              <span>Analytics</span>
            </CommandItem>
            <CommandItem onSelect={() => handleSelect('reports')}>
              <FileText className="mr-2 h-4 w-4" />
              <span>Reports</span>
            </CommandItem>
            <CommandItem onSelect={() => handleSelect('settings')}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          {/* Metrics */}
          <CommandGroup heading="Metrics">
            <CommandItem onSelect={() => handleSelect('revenue')}>
              <DollarSign className="mr-2 h-4 w-4" />
              <span>Total Revenue</span>
            </CommandItem>
            <CommandItem onSelect={() => handleSelect('orders')}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              <span>Total Orders</span>
            </CommandItem>
            <CommandItem onSelect={() => handleSelect('customers')}>
              <Users className="mr-2 h-4 w-4" />
              <span>Total Customers</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          {/* Actions */}
          <CommandGroup heading="Actions">
            <CommandItem onSelect={() => handleSelect('export')}>
              <span className="mr-2">📥</span>
              <span>Export Data</span>
            </CommandItem>
            <CommandItem onSelect={() => handleSelect('refresh')}>
              <span className="mr-2">🔄</span>
              <span>Refresh Dashboard</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default CommandPalette;

/* 
FEATURES:
- Keyboard shortcut: Ctrl+K (Windows) or Cmd+K (Mac)
- Fuzzy search through all commands
- Grouped commands (Navigation, Metrics, Actions)
- Keyboard navigation (arrow keys)
- ESC to close
- Click outside to close

USAGE IN HEADER:
import CommandPalette from '@/components/CommandPalette';

<Header>
  <CommandPalette onNavigate={handleNavigate} />
</Header>

KEYBOARD SHORTCUTS:
- Ctrl/Cmd + K: Open command palette
- Arrow keys: Navigate items
- Enter: Select item
- ESC: Close

INSPIRATION:
- GitHub (Ctrl+K)
- VS Code (Ctrl+Shift+P)
- Linear (Cmd+K)
*/
