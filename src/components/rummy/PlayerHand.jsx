import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import Card from './Card';

export default function PlayerHand({ cards, selectedCards, lastDrawnCardIndex, onCardClick, onArrangeBySuit, onArrangeByRank, onReorder, theme }) {
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const sourceIndex = result.source.index;
    const destIndex = result.destination.index;
    
    if (sourceIndex === destIndex) return;
    
    onReorder(sourceIndex, destIndex);
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <h3 className="text-sm font-semibold text-gray-200">Your Hand ({cards.length} cards)</h3>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={onArrangeBySuit}
            className="px-3 py-1 bg-green-700 hover:bg-green-600 text-white text-xs font-semibold rounded transition-colors"
          >
            Sort by Suit
          </button>
          <button
            onClick={onArrangeByRank}
            className="px-3 py-1 bg-purple-700 hover:bg-purple-600 text-white text-xs font-semibold rounded transition-colors"
          >
            Sort by Rank
          </button>
          <div className="text-xs text-gray-300 flex items-center">
            <span>💡 Drag to reorder</span>
          </div>
        </div>
      </div>
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="hand" direction="horizontal">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`flex flex-wrap gap-2 p-2 rounded-lg transition-colors min-h-[120px] ${
                snapshot.isDraggingOver ? 'bg-green-900 bg-opacity-30' : ''
              }`}
            >
              {cards.map((card, idx) => (
                <Draggable 
                  key={`${card.rank}-${card.suit}-${idx}`} 
                  draggableId={`card-${idx}`} 
                  index={idx}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        ...provided.draggableProps.style,
                        cursor: snapshot.isDragging ? 'grabbing' : 'grab',
                      }}
                      onClick={() => !snapshot.isDragging && onCardClick(idx)}
                    >
                      <Card
                        rank={card.rank}
                        suit={card.suit}
                        isSelected={selectedCards.includes(idx)}
                        isNewlyDrawn={lastDrawnCardIndex === idx}
                        theme={theme}
                        isDragging={snapshot.isDragging}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}