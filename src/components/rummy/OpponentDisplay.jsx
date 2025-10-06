import React from 'react';
import Card from './Card';
import MeldDisplay from './MeldDisplay';

export default function OpponentDisplay({ name, handCount, score, melds, isActive, theme }) {
  return (
    <div className={`p-4 rounded-lg ${isActive ? 'bg-yellow-900 bg-opacity-20 ring-2 ring-yellow-500' : 'bg-green-900 bg-opacity-20'}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
          AI
        </div>
        <div className="flex-1">
          <div className="font-semibold text-white">{name}</div>
          <div className="text-xs text-gray-300">{handCount} cards • Score: {score}</div>
        </div>
      </div>
      <div className="flex gap-1 mb-3">
        {Array(Math.min(handCount, 10)).fill(0).map((_, i) => (
          <Card key={i} isFaceDown theme={theme} />
        ))}
        {handCount > 10 && <div className="text-gray-400 text-sm self-center ml-2">+{handCount - 10}</div>}
      </div>
      <MeldDisplay melds={melds} playerName={name} theme={theme} />
    </div>
  );
}