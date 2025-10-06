
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Trophy, Target, DollarSign, ShoppingCart, Layers, Zap, Mail, User } from 'lucide-react';

const ROUNDS = [
  { num: 1, requirement: '2 Sets of 3' },
  { num: 2, requirement: '1 Set of 3 + 1 Run of 4' },
  { num: 3, requirement: '2 Runs of 4' },
  { num: 4, requirement: '3 Sets of 3' },
  { num: 5, requirement: '2 Sets of 3 + 1 Run of 4' },
  { num: 6, requirement: '1 Set of 3 + 2 Runs of 4' },
  { num: 7, requirement: '3 Runs of 4' }
];

export default function HelpDialog({ open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-600" />
            Progressive Rummy Rules & Scoring
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 text-sm">
          {/* Creator Info */}
          <section className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border-l-4 border-indigo-600">
            <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-indigo-900">
              <User className="w-5 h-5 text-indigo-600" />
              Created By
            </h3>
            <div className="space-y-2">
              <p className="text-gray-700 font-semibold">Thomas Morales</p>
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="w-4 h-4 text-indigo-600" />
                <a 
                  href="mailto:Omegaman1972@outlook.com" 
                  className="text-indigo-700 hover:text-indigo-900 underline"
                >
                  Omegaman1972@outlook.com
                </a>
              </div>
              <p className="text-xs text-gray-500 italic mt-2">
                Built with ❤️ using base44 platform
              </p>
            </div>
          </section>

          {/* Objective */}
          <section className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border-l-4 border-green-600">
            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
              <Target className="w-5 h-5 text-green-600" />
              Objective
            </h3>
            <p className="text-gray-700">
              Complete all 7 rounds with progressively harder meld requirements. 
              The player with the <strong>LOWEST total score</strong> at the end wins!
              Lower scores are better - try to go out first each round.
            </p>
          </section>

          {/* Round Requirements */}
          <section>
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600" />
              Round Requirements
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {ROUNDS.map(r => (
                <div key={r.num} className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <span className="font-bold text-blue-900">Round {r.num}:</span>
                  <span className="text-blue-700 ml-2">{r.requirement}</span>
                </div>
              ))}
            </div>
          </section>

          {/* How to Play */}
          <section>
            <h3 className="font-bold text-lg mb-3">How to Play</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>
                <strong>Draw Phase:</strong> Choose to draw 1 card from either the stock pile or the top card from the discard pile
              </li>
              <li>
                <strong>Meld Phase:</strong> Once per round, you can lay down your required melds to meet the round requirement
              </li>
              <li>
                <strong>Lay Off:</strong> After melding, you can add cards to your existing melds or other players' melds
              </li>
              <li>
                <strong>Discard Phase:</strong> End your turn by discarding 1 card face-up to the discard pile
              </li>
              <li>
                <strong>Going Out:</strong> First player to empty their hand ends the round!
              </li>
            </ol>
          </section>

          {/* Card Management */}
          <section className="bg-cyan-50 p-4 rounded-lg border border-cyan-200">
            <h3 className="font-bold text-lg mb-3 text-cyan-900">Card Management</h3>
            <div className="space-y-2 text-gray-700">
              <p>
                <strong>Auto Sort:</strong> Click the "Auto Sort" button to automatically organize your cards by suit and rank
              </p>
              <p>
                <strong>Drag to Reorder:</strong> Click and drag any card to manually arrange your hand in any order you prefer
              </p>
              <p>
                <strong>Select Cards:</strong> Click cards to select/deselect them for melding or discarding
              </p>
            </div>
          </section>

          {/* Valid Melds */}
          <section className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h3 className="font-bold text-lg mb-3 text-purple-900">Valid Melds</h3>
            <div className="space-y-3">
              <div>
                <p className="font-semibold text-purple-800">Set (Book):</p>
                <p className="text-gray-700">3 or 4 cards of the <strong>same rank</strong> - suits can be ANY (same or different)</p>
                <p className="text-sm text-purple-600 mt-1">Example: 7♠ 7♥ 7♦ or K♣ K♠ K♥ K♦ or even 7♠ 7♠ 7♥ (suits don't matter!)</p>
                <p className="text-sm text-purple-600 mt-1">With Jokers: 7♠ 🃏 7♦ (2 natural + 1 joker) or 7♠ 7♥ 🃏 (3 natural + 1 joker)</p>
              </div>
              <div>
                <p className="font-semibold text-purple-800">Run (Sequence):</p>
                <p className="text-gray-700">3 or more <strong>consecutive cards</strong> of the <strong>same suit</strong></p>
                <p className="text-sm text-purple-600 mt-1">Example: 5♠ 6♠ 7♠ 8♠ or 10♥ J♥ Q♥ K♥</p>
                <p className="text-sm text-purple-600 mt-1">With Jokers: 5♠ 🃏 7♠ (joker fills the 6♠ gap)</p>
              </div>
              <div>
                <p className="font-semibold text-purple-800">Jokers:</p>
                <p className="text-gray-700">🃏 Jokers are WILD and can substitute for any card!</p>
                <p className="text-sm text-purple-600 mt-1">Need at least 2 natural cards in any meld</p>
              </div>
            </div>
          </section>

          {/* Buy System */}
          <section className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-orange-600" />
              <Zap className="w-5 h-5 text-yellow-500" />
              Buy System (Out of Turn)
            </h3>
            <p className="text-gray-700 mb-3 font-semibold">
              When ANY player discards, the NEXT player gets a chance to buy cards from the discard pile!
            </p>
            
            <div className="space-y-3">
              <div className="bg-white p-3 rounded-lg border-2 border-orange-300">
                <p className="font-bold text-orange-900 mb-2">How It Works:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Select ANY card from the discard pile (not just the top card)</li>
                  <li>You receive the selected card <strong>+ ALL cards above it</strong></li>
                  <li>Example: If you select the 3rd card from top, you get cards 1, 2, and 3</li>
                </ul>
              </div>

              <div className="bg-white p-3 rounded-lg border-2 border-red-300">
                <p className="font-bold text-red-900 mb-2">Important Rule:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li><strong>Must form an immediate meld</strong> with at least one of the bought cards</li>
                  <li>Combine bought cards with your hand cards</li>
                  <li>Must create a valid set (3-4 same rank) or run (3+ consecutive)</li>
                  <li>Cannot buy if you can't form a valid meld</li>
                </ul>
              </div>

              <div className="bg-white p-3 rounded-lg border-2 border-blue-300">
                <p className="font-bold text-blue-900 mb-2">Timing:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                  <li><strong>You get 30 seconds</strong> to decide to buy (can skip anytime)</li>
                  <li><strong>AI players get 3 seconds</strong> to decide</li>
                  <li>Only the NEXT player gets a buy opportunity per discard</li>
                  <li>After buy decision, play continues normally</li>
                </ul>
              </div>

              <div className="bg-white p-3 rounded-lg border-2 border-green-300">
                <p className="font-bold text-green-900 mb-2">No Penalty Cards!</p>
                <p className="text-sm text-gray-700">
                  Unlike traditional rummy, there's no penalty card from the stock. 
                  However, you might get multiple cards from the discard pile!
                </p>
              </div>
            </div>

            <div className="mt-3 bg-orange-100 p-3 rounded">
              <p className="font-bold text-orange-900 mb-1">Strategy Tips:</p>
              <ul className="list-disc list-inside text-sm text-orange-800 space-y-1">
                <li>Buy cards that complete multiple melds at once</li>
                <li>Be careful - getting multiple cards means more points if you don't go out</li>
                <li>Plan your meld before buying</li>
                <li>Watch what others discard to predict their hands</li>
              </ul>
            </div>
          </section>

          {/* Scoring */}
          <section className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-red-600" />
              Scoring System
            </h3>
            <p className="text-gray-700 mb-3">
              At the end of each round, players score <strong>penalty points</strong> for cards remaining in their hand:
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded border border-red-200">
                <p className="font-bold text-red-900">Jokers</p>
                <p className="text-2xl font-bold text-red-600">50 points</p>
              </div>
              <div className="bg-white p-3 rounded border border-red-200">
                <p className="font-bold text-red-900">Aces</p>
                <p className="text-2xl font-bold text-red-600">15 points</p>
              </div>
              <div className="bg-white p-3 rounded border border-red-200">
                <p className="font-bold text-red-900">Face Cards (J, Q, K)</p>
                <p className="text-2xl font-bold text-red-600">10 points</p>
              </div>
              <div className="bg-white p-3 rounded border border-red-200">
                <p className="font-bold text-red-900">Number Cards (2-10)</p>
                <p className="text-2xl font-bold text-red-600">Face Value</p>
              </div>
            </div>
            <div className="mt-4 bg-red-100 p-3 rounded">
              <p className="font-semibold text-red-900">Remember:</p>
              <ul className="list-disc list-inside text-sm text-red-800 mt-1">
                <li>Going out first = 0 points that round!</li>
                <li>Lowest total score after 7 rounds wins</li>
                <li>Cards in your melds don't count against you</li>
              </ul>
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
