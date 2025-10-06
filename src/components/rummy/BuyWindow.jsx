
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, ShoppingCart, X, Sparkles, CheckCircle, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Card from './Card';

export default function BuyWindow({ 
  discardPile,
  playerHand,
  currentBuyerName,
  isPlayerTurn,
  timeLeft, 
  onBuy, 
  onSkip,
  theme,
  showTimer = true,
  isOnTurnBuy = false,
  allowAutoSkip = true
}) {
  console.log('BuyWindow rendered with props:', {
    currentBuyerName,
    isPlayerTurn,
    timeLeft,
    showTimer,
    isOnTurnBuy,
    allowAutoSkip
  });
  const [countdown, setCountdown] = useState(timeLeft);
  const [selectedDiscardIndex, setSelectedDiscardIndex] = useState(null);
  const [selectedTargetCard, setSelectedTargetCard] = useState(null);
  const [selectedHandCards, setSelectedHandCards] = useState([]);
  const [showMeldSelection, setShowMeldSelection] = useState(false);

  useEffect(() => {
    setCountdown(timeLeft);
  }, [timeLeft]);

  useEffect(() => {
    console.log('BuyWindow timer useEffect triggered:', { 
      showTimer, 
      countdown, 
      isPlayerTurn,
      currentBuyerName,
      allowAutoSkip 
    });
    
    // CRITICAL: For human players, NEVER start any timer logic
    if (currentBuyerName === "You" || isPlayerTurn || !allowAutoSkip) {
      console.log('HUMAN PLAYER DETECTED - COMPLETELY DISABLING TIMER LOGIC');
      return;
    }
    
    // Only AI players get timer functionality
    if (!showTimer) {
      console.log('AI player but no timer enabled - skipping timer logic');
      return;
    }
    
    console.log('AI PLAYER - Starting timer logic, countdown:', countdown);
    
    if (countdown <= 0) {
      console.log('AI Timer expired, calling onSkip');
      console.trace('onSkip call from timer expiration');
      onSkip();
      return;
    }
    
    console.log('Starting timer countdown for AI player');
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown, onSkip, showTimer, isPlayerTurn, currentBuyerName, allowAutoSkip]);

  const handleSkipClick = () => {
    console.log('Skip buy button clicked by user');
    console.trace('onSkip call from manual button click');
    onSkip();
  };

  const handleDiscardCardClick = (index, card) => {
    if (!isPlayerTurn) return;
    setSelectedDiscardIndex(index);
    setSelectedTargetCard(card);
    setShowMeldSelection(true);
    setSelectedHandCards([]);
  };

  const toggleHandCard = (index) => {
    if (selectedHandCards.includes(index)) {
      setSelectedHandCards(selectedHandCards.filter(i => i !== index));
    } else {
      setSelectedHandCards([...selectedHandCards, index]);
    }
  };

  const handleConfirmBuy = () => {
    if (selectedDiscardIndex === null || !selectedTargetCard) return;
    onBuy(selectedDiscardIndex, selectedTargetCard, selectedHandCards);
  };

  const cardsFromDiscard = selectedDiscardIndex !== null 
    ? discardPile.slice(selectedDiscardIndex)
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 overflow-y-auto"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-6 space-y-4 my-8">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-blue-600" />
            {isOnTurnBuy ? 'Buy from Discard Pile' : `Buy Opportunity - ${currentBuyerName}`}
          </h3>
          {showTimer && (
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
              countdown <= 3 ? 'bg-red-100' : 'bg-orange-100'
            }`}>
              <Clock className={`w-4 h-4 ${countdown <= 3 ? 'text-red-600' : 'text-orange-600'}`} />
              <span className={`font-bold ${countdown <= 3 ? 'text-red-600' : 'text-orange-600'}`}>
                {countdown}s
              </span>
            </div>
          )}
        </div>

        {!isPlayerTurn ? (
          <div className="text-center py-8">
            <p className="text-lg font-semibold text-gray-700 mb-2">
              {currentBuyerName} is deciding...
            </p>
            <p className="text-sm text-gray-500">AI has 3 seconds to buy</p>
            <div className="flex justify-center mt-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
            </div>
          </div>
        ) : (
          <>
            {!showMeldSelection ? (
              <>
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border-2 border-blue-200">
                  <p className="text-sm font-bold text-gray-800 mb-3">
                    Click any card to buy it (you'll get all cards from that point onwards):
                  </p>
                  <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-2">
                    {discardPile.map((card, index) => (
                      <div
                        key={index}
                        onClick={() => handleDiscardCardClick(index, card)}
                        className="cursor-pointer transition-all hover:scale-105 relative"
                      >
                        <Card rank={card.rank} suit={card.suit} theme={theme} />
                        {index < discardPile.length - 1 && (
                          <div className="text-xs text-center text-blue-600 mt-1 font-bold bg-blue-100 rounded px-1">
                            +{discardPile.length - 1 - index} cards
                          </div>
                        )}
                        {index === discardPile.length - 1 && (
                          <div className="text-xs text-center text-green-600 mt-1 font-bold bg-green-100 rounded px-1">
                            1 card only
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border-2 border-green-200">
                  <p className="text-sm font-bold text-green-900 mb-2 flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Your Current Hand ({playerHand.length} cards)
                  </p>
                  <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-2">
                    {playerHand.map((card, idx) => (
                      <Card 
                        key={idx} 
                        rank={card.rank} 
                        suit={card.suit} 
                        theme={theme}
                      />
                    ))}
                  </div>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded">
                  <p className="text-sm font-bold text-yellow-900 mb-1">
                    <Sparkles className="w-4 h-4 inline mr-1" />
                    Buy Rules:
                  </p>
                  <ul className="text-xs text-yellow-800 space-y-1">
                    <li>• Click any card in the discard pile</li>
                    <li>• You get that card + ALL cards above it</li>
                    <li>• You MUST meld with the specific card you clicked</li>
                    <li>• Select cards from your hand to complete the meld</li>
                    <li>• <strong>Jokers (🃏) are WILD</strong> - they can be any card!</li>
                    <li>• Need 3+ cards total for a valid meld</li>
                    <li>• <strong>SET:</strong> Same rank (3♠ 3♥ 🃏) or (🃏 7♦ 7♣)</li>
                    <li>• <strong>RUN:</strong> Consecutive same suit (5♠ 6♠ 7♠) or (5♠ 🃏 7♠)</li>
                  </ul>
                </div>

                <div className="flex justify-end gap-3">
                  <Button
                    onClick={handleSkipClick}
                    size="lg"
                    className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold px-10 py-6 text-lg shadow-2xl border-4 border-red-800"
                    type="button"
                  >
                    <X className="w-6 h-6" />
                    {isOnTurnBuy ? 'Cancel' : 'Skip Buy'}
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4">
                  <p className="text-sm font-bold text-green-900 mb-2">
                    <CheckCircle className="w-4 h-4 inline mr-1" />
                    Card you clicked (must use in meld):
                  </p>
                  <div className="flex gap-2">
                    <Card rank={selectedTargetCard.rank} suit={selectedTargetCard.suit} theme={theme} />
                    {selectedTargetCard.rank === 'JKR' && (
                      <div className="text-xs text-green-700 self-center">
                        <strong>🃏 WILD JOKER!</strong> Can be any card
                      </div>
                    )}
                  </div>
                  {cardsFromDiscard.length > 1 && (
                    <div className="mt-3">
                      <p className="text-xs text-green-700 mb-2">
                        You'll also receive these {cardsFromDiscard.length - 1} card(s) in your hand:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {cardsFromDiscard.slice(1).map((card, idx) => (
                          <Card 
                            key={idx}
                            rank={card.rank} 
                            suit={card.suit} 
                            theme={theme}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-blue-50 border-2 border-blue-500 rounded-lg p-4">
                  <p className="text-sm font-bold text-blue-900 mb-2">
                    Select cards from your hand to meld with the card above:
                  </p>
                  <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                    {playerHand.map((card, idx) => (
                      <div
                        key={idx}
                        onClick={() => toggleHandCard(idx)}
                        className="cursor-pointer"
                      >
                        <Card 
                          rank={card.rank} 
                          suit={card.suit} 
                          theme={theme}
                          isSelected={selectedHandCards.includes(idx)}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-purple-50 p-3 rounded">
                  <p className="text-sm font-semibold text-purple-900">
                    Total cards in meld: {1 + selectedHandCards.length} (need at least 3)
                  </p>
                  <p className="text-xs text-purple-700 mt-1">
                    <strong>Set:</strong> Same rank, ANY suits (e.g., 7♠ 7♥ 7♦ or 7♠ 🃏 7♦)
                  </p>
                  <p className="text-xs text-purple-700">
                    <strong>Run:</strong> Consecutive ranks, SAME suit (e.g., 5♠ 6♠ 7♠ or 5♠ 🃏 7♠)
                  </p>
                  <p className="text-xs text-purple-700 mt-1">
                    <strong>Only need 1 natural (non-joker) card minimum!</strong> Jokers can fill the rest.
                  </p>
                </div>

                <div className="flex justify-end gap-3">
                  <Button
                    onClick={() => {
                      console.log('Back button clicked');
                      setShowMeldSelection(false);
                      setSelectedDiscardIndex(null);
                      setSelectedTargetCard(null);
                      setSelectedHandCards([]);
                    }}
                    variant="outline"
                    size="lg"
                    className="px-6 py-6"
                    type="button"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleConfirmBuy}
                    disabled={1 + selectedHandCards.length < 3}
                    size="lg"
                    className="bg-green-600 hover:bg-green-500 flex items-center gap-2 disabled:opacity-50 px-8 py-6 text-lg font-bold"
                    type="button"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Buy & Meld ({1 + selectedHandCards.length} cards)
                  </Button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}
