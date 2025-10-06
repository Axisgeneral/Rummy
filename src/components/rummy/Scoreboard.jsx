import React from 'react';
import { Trophy, Crown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Scoreboard({ players, currentPlayerIndex }) {
  const sortedPlayers = [...players].sort((a, b) => a.score - b.score);
  const leadingScore = sortedPlayers[0].score;

  return (
    <Card className="bg-white bg-opacity-95 shadow-xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-600" />
          Scoreboard
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {sortedPlayers.map((player, idx) => {
          const isLeading = player.score === leadingScore;
          const isCurrentPlayer = players.findIndex(p => p.name === player.name) === currentPlayerIndex;
          
          return (
            <div
              key={player.name}
              className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                isCurrentPlayer ? 'bg-blue-100 ring-2 ring-blue-500' : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  player.name === 'You' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-purple-600 text-white'
                }`}>
                  {idx + 1}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 flex items-center gap-2">
                    {player.name}
                    {isLeading && <Crown className="w-4 h-4 text-yellow-500" />}
                  </div>
                  <div className="text-xs text-gray-500">
                    {player.hand.length} cards • {player.melds.length} melds
                  </div>
                </div>
              </div>
              <div className={`text-xl font-bold ${
                isLeading ? 'text-green-600' : 'text-gray-700'
              }`}>
                {player.score}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}