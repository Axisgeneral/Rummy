import React from 'react';

const SUITS = { '♠': 'black', '♥': 'red', '♦': 'red', '♣': 'black' };

export default function Card({ rank, suit, isFaceDown, isSelected, isNewlyDrawn, onClick, isDragging, style, theme }) {
  const cardBackClass = theme?.cardBack || 'from-blue-600 to-blue-800';
  const cardBackBorder = theme?.cardBackBorder || 'border-blue-900';
  
  if (isFaceDown) {
    return (
      <div
        className={`relative w-16 h-24 bg-gradient-to-br ${cardBackClass} rounded-lg border-2 ${cardBackBorder} shadow-lg flex items-center justify-center cursor-pointer select-none`}
        style={style}
      >
        <div className="absolute inset-2 border-2 border-white border-opacity-30 rounded"></div>
        <div className="text-white text-2xl font-bold opacity-50">♠</div>
      </div>
    );
  }

  const color = SUITS[suit] || 'black';
  const isJoker = rank === 'JKR';
  
  return (
    <div
      onClick={onClick}
      className={`relative w-16 h-24 bg-white rounded-lg shadow-lg cursor-pointer select-none transition-all ${
        isSelected ? 'ring-4 ring-yellow-400 -translate-y-2' : 
        isNewlyDrawn ? 'ring-4 ring-green-400 animate-pulse' :
        'hover:-translate-y-1'
      } ${isDragging ? 'opacity-70 shadow-2xl rotate-3' : ''}`}
      style={style}
    >
      <div className="absolute inset-0 p-1 pointer-events-none">
        <div className={`text-${color === 'red' ? 'red' : 'gray'}-${color === 'red' ? '600' : '800'} font-bold`}>
          <div className="text-xs">{rank}</div>
          <div className="text-lg leading-none">{suit}</div>
        </div>
        <div className={`absolute bottom-1 right-1 text-${color === 'red' ? 'red' : 'gray'}-${color === 'red' ? '600' : '800'} font-bold rotate-180`}>
          <div className="text-xs">{rank}</div>
          <div className="text-lg leading-none">{suit}</div>
        </div>
        {isJoker && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-4xl">🃏</div>
          </div>
        )}
      </div>
      {isNewlyDrawn && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-ping"></div>
      )}
    </div>
  );
}