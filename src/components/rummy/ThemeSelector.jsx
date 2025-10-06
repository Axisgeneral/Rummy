import React from 'react';
import { Palette } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const THEMES = {
  classic: {
    name: 'Classic Green',
    background: 'from-green-900 via-green-800 to-green-900',
    table: 'from-green-700 to-green-600',
    cardBack: 'from-blue-600 to-blue-800',
    cardBackBorder: 'border-blue-900',
    accent: 'bg-green-800'
  },
  royal: {
    name: 'Royal Purple',
    background: 'from-purple-900 via-purple-800 to-indigo-900',
    table: 'from-purple-700 to-purple-600',
    cardBack: 'from-violet-600 to-purple-800',
    cardBackBorder: 'border-purple-900',
    accent: 'bg-purple-800'
  },
  ocean: {
    name: 'Ocean Blue',
    background: 'from-blue-900 via-cyan-800 to-blue-900',
    table: 'from-cyan-700 to-blue-600',
    cardBack: 'from-cyan-600 to-blue-800',
    cardBackBorder: 'border-blue-900',
    accent: 'bg-cyan-800'
  },
  sunset: {
    name: 'Sunset Orange',
    background: 'from-orange-900 via-red-800 to-orange-900',
    table: 'from-orange-700 to-red-600',
    cardBack: 'from-orange-600 to-red-800',
    cardBackBorder: 'border-red-900',
    accent: 'bg-orange-800'
  },
  midnight: {
    name: 'Midnight Black',
    background: 'from-gray-900 via-slate-800 to-gray-900',
    table: 'from-gray-700 to-slate-600',
    cardBack: 'from-gray-600 to-slate-800',
    cardBackBorder: 'border-slate-900',
    accent: 'bg-gray-800'
  },
  emerald: {
    name: 'Emerald Forest',
    background: 'from-emerald-900 via-teal-800 to-emerald-900',
    table: 'from-emerald-700 to-teal-600',
    cardBack: 'from-emerald-600 to-teal-800',
    cardBackBorder: 'border-teal-900',
    accent: 'bg-emerald-800'
  }
};

export default function ThemeSelector({ currentTheme, onThemeChange }) {
  return (
    <div className="flex items-center gap-2">
      <Palette className="w-4 h-4 text-white" />
      <Select value={currentTheme} onValueChange={onThemeChange}>
        <SelectTrigger className="w-40 bg-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(THEMES).map(([key, theme]) => (
            <SelectItem key={key} value={key}>
              {theme.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}