import React from 'react';
import Card from './Card';

export default function MeldDisplay({ melds, playerName, allowLayoff, onLayoff, theme }) {
  if (!melds || melds.length === 0) return null;

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-semibold text-gray-300">{playerName}'s Melds</h4>
      <div className="space-y-2">
        {melds.map((meld, meldIdx) => (
          <div key={meldIdx} className="flex gap-1 p-2 bg-green-900 bg-opacity-30 rounded">
            {meld.map((card, cardIdx) => (
              <Card
                key={`${card.rank}-${card.suit}-${cardIdx}`}
                rank={card.rank}
                suit={card.suit}
                theme={theme}
              />
            ))}
            {allowLayoff && (
              <button
                onClick={() => onLayoff(meldIdx)}
                className="ml-2 px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs rounded"
              >
                + Lay Off
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}