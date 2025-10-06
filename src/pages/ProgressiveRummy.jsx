
// Progressive Rummy Game - Updated for Azure deployment
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card as UICard, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Card from '../components/rummy/Card';
import PlayerHand from '../components/rummy/PlayerHand';
import MeldDisplay from '../components/rummy/MeldDisplay';
import OpponentDisplay from '../components/rummy/OpponentDisplay';
import BuyWindow from '../components/rummy/BuyWindow';
import ThemeSelector, { THEMES } from '../components/rummy/ThemeSelector';
import Scoreboard from '../components/rummy/Scoreboard';
import HelpDialog from '../components/rummy/HelpDialog';
import { AlertCircle, RotateCcw, Play, Trophy, HelpCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AnimatePresence, motion } from 'framer-motion';

const ROUNDS = [
  { num: 1, requirement: '2 Sets of 3' },
  { num: 2, requirement: '1 Set of 3 + 1 Run of 4' },
  { num: 3, requirement: '2 Runs of 4' },
  { num: 4, requirement: '3 Sets of 3' },
  { num: 5, requirement: '2 Sets of 3 + 1 Run of 4' },
  { num: 6, requirement: '1 Set of 3 + 2 Runs of 4' },
  { num: 7, requirement: '3 Runs of 4' }
];

const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const SUITS = ['♠', '♥', '♦', '♣'];

const AI_NAMES = ['Ray', 'Connie', 'Judy', 'Donna', 'Rick', 'Veronica', 'Haylee', 'Terry', 'Dana'];

export default function ProgressiveRummy() {
  const [game, setGame] = useState(null);
  const [selectedCards, setSelectedCards] = useState([]);
  const [message, setMessage] = useState('Welcome! Start a new game to begin.');
  const [showDiscard, setShowDiscard] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [buyWindow, setBuyWindow] = useState(null);
  const [theme, setTheme] = useState('classic');
  const [aiAction, setAiAction] = useState(null);
  const [lastDrawnCardIndex, setLastDrawnCardIndex] = useState(null);
  const [showBuyOnTurn, setShowBuyOnTurn] = useState(false); // New state for buying during player's turn

  useEffect(() => {
    loadGame();
    const savedTheme = localStorage.getItem('rummy_theme');
    if (savedTheme) setTheme(savedTheme);
  }, []);

  const currentTheme = THEMES[theme];

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('rummy_theme', newTheme);
  };

  const loadGame = () => {
    try {
      const savedGame = localStorage.getItem('rummy_game');
      if (savedGame) {
        const gameData = JSON.parse(savedGame);
        setGame(gameData);
        setMessage('Game resumed. Continue playing!');
      }
    } catch (error) {
      // No saved game or error parsing
      console.log('No saved game found');
    }
  };

  const saveGame = (gameData) => {
    try {
      localStorage.setItem('rummy_game', JSON.stringify(gameData));
      localStorage.setItem('rummy_last_played', new Date().toISOString());
    } catch (error) {
      console.error('Error saving game:', error);
    }
  };

  const createDeck = () => {
    const deck = [];
    for (let i = 0; i < 2; i++) {
      for (const suit of SUITS) {
        for (const rank of RANKS) {
          deck.push({ rank, suit });
        }
      }
      deck.push({ rank: 'JKR', suit: '🃏' });
      deck.push({ rank: 'JKR', suit: '🃏' });
    }
    return shuffle(deck);
  };

  const shuffle = (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const getRandomAINames = () => {
    const shuffled = [...AI_NAMES].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  };

  const startNewGame = () => {
    const deck = createDeck();
    const aiNames = getRandomAINames();
    const newGame = {
      round: 1,
      deck: deck.slice(45),
      discard: [deck[44]],
      players: [
        { name: 'You', hand: deck.slice(0, 11), melds: [], score: 0, hasMelded: false },
        { name: aiNames[0], hand: deck.slice(11, 22), melds: [], score: 0, hasMelded: false },
        { name: aiNames[1], hand: deck.slice(22, 33), melds: [], score: 0, hasMelded: false },
        { name: aiNames[2], hand: deck.slice(33, 44), melds: [], score: 0, hasMelded: false }
      ],
      currentPlayer: 0,
      phase: 'draw',
      gameOver: false
    };
    setGame(newGame);
    setSelectedCards([]);
    setLastDrawnCardIndex(null);
    setMessage('Round 1 started! Draw a card from stock or discard pile.');
    saveGame(newGame);
  };

  const drawFromStock = () => {
    if (!game || game.phase !== 'draw' || game.currentPlayer !== 0) return;

    const newGame = { ...game };
    const card = newGame.deck.pop();
    newGame.players[0].hand.push(card);
    newGame.phase = 'play';
    setGame(newGame);
    setLastDrawnCardIndex(newGame.players[0].hand.length - 1);
    setMessage('Card drawn. You can meld, lay off, or discard.');
    saveGame(newGame);
  };

  const drawFromDiscard = () => {
    if (!game || game.phase !== 'draw' || game.currentPlayer !== 0 || game.discard.length === 0) return;

    const newGame = { ...game };
    const card = newGame.discard.pop();
    newGame.players[0].hand.push(card);
    newGame.phase = 'play';
    setGame(newGame);
    setLastDrawnCardIndex(newGame.players[0].hand.length - 1);
    setMessage('Discard card drawn. You can meld, lay off, or discard.');
    saveGame(newGame);
  };

  const isValidSet = (cards) => {
    if (cards.length < 3 || cards.length > 4) return false;
    
    const nonJokers = cards.filter(c => c.rank !== 'JKR');
    const jokers = cards.filter(c => c.rank === 'JKR');
    
    console.log('Validating set:', {
      cards: cards.map(c => `${c.rank}${c.suit}`),
      nonJokers: nonJokers.map(c => `${c.rank}${c.suit}`),
      jokers: jokers.map(c => `${c.rank}${c.suit}`)
    });
    
    // Must have at least 1 natural card to define the rank (jokers can fill the rest)
    if (nonJokers.length === 0) {
      console.log('Set invalid: no natural cards');
      return false;
    }
    
    // All non-jokers must have the same rank
    const firstRank = nonJokers[0].rank;
    if (!nonJokers.every(c => c.rank === firstRank)) {
      console.log('Set invalid: not all same rank');
      return false;
    }
    
    // Check that we don't have more than 4 of the same rank (impossible in 2-deck game)
    // But since we use 2 decks, we can have up to 2 of each suit per rank
    if (nonJokers.length > 4) {
      console.log('Set invalid: too many natural cards');
      return false;
    }
    
    console.log('Set is valid!');
    return true;
  };

  const isValidRun = (cards) => {
    if (cards.length < 3) return false;
    
    const nonJokers = cards.filter(c => c.rank !== 'JKR');
    const jokers = cards.filter(c => c.rank === 'JKR');
    
    console.log('Validating run:', {
      cards: cards.map(c => `${c.rank}${c.suit}`),
      nonJokers: nonJokers.map(c => `${c.rank}${c.suit}`),
      jokersCount: jokers.length
    });
    
    // Must have at least 1 natural card to define suit
    if (nonJokers.length === 0) {
      console.log('Run invalid: no natural cards');
      return false;
    }
    
    // All non-jokers must be same suit
    const suit = nonJokers[0].suit;
    if (!nonJokers.every(c => c.suit === suit)) {
      console.log('Run invalid: mixed suits');
      return false;
    }
    
    // Sort non-jokers by rank
    const sorted = [...nonJokers].sort((a, b) => RANKS.indexOf(a.rank) - RANKS.indexOf(b.rank));
    
    console.log('Sorted natural cards:', sorted.map(c => `${c.rank}${c.suit}`));
    
    // Check for duplicate ranks in natural cards
    for (let i = 0; i < sorted.length - 1; i++) {
      if (sorted[i].rank === sorted[i + 1].rank) {
        console.log('Run invalid: duplicate ranks');
        return false;
      }
    }
    
    // For a single natural card + jokers, it's always valid (jokers can extend in any direction)
    if (sorted.length === 1) {
      console.log('Single natural card + jokers - valid run');
      return true;
    }
    
    // Calculate minimum jokers needed to connect all natural cards
    let jokersNeeded = 0;
    for (let i = 0; i < sorted.length - 1; i++) {
      const currentRank = RANKS.indexOf(sorted[i].rank);
      const nextRank = RANKS.indexOf(sorted[i + 1].rank);
      const gap = nextRank - currentRank - 1;
      if (gap < 0) {
        console.log('Run invalid: cards out of order');
        return false;
      }
      jokersNeeded += gap;
    }
    
    console.log('Jokers needed for gaps:', jokersNeeded, 'Available jokers:', jokers.length);
    
    // Check if we have enough jokers to fill all gaps
    // Extra jokers can extend the run at either end
    if (jokersNeeded > jokers.length) {
      console.log('Run invalid: not enough jokers for gaps');
      return false;
    }
    
    console.log('Run is valid!');
    return true;
  };

  const checkRoundRequirements = (melds, roundNum) => {
    const requirements = {
      1: { sets: 2, runs: 0 },
      2: { sets: 1, runs: 1 },
      3: { sets: 0, runs: 2 },
      4: { sets: 3, runs: 0 },
      5: { sets: 2, runs: 1 },
      6: { sets: 1, runs: 2 },
      7: { sets: 0, runs: 3 }
    };

    const req = requirements[roundNum];
    let actualSets = 0, actualRuns = 0;

    melds.forEach(meld => {
      // To determine type for requirement check, must ensure it's a valid meld first
      if (isValidSet(meld)) {
        actualSets++;
      } else if (isValidRun(meld)) {
        actualRuns++;
      }
    });

    return actualSets >= req.sets && actualRuns >= req.runs;
  };

  // Helper function to find all disjoint melds from a given set of cards
  const findAllMeldsInCards = (cards) => {
    console.log('Starting meld search with cards:', cards.map(c => `${c.rank}${c.suit}`));
    let availableCards = [...cards];
    const foundMelds = [];
    
    const removeSpecificCards = (cardsToRemove) => {
      cardsToRemove.forEach(cardToRemove => {
        const index = availableCards.findIndex(ac => 
          ac.rank === cardToRemove.rank && ac.suit === cardToRemove.suit
        );
        if (index !== -1) {
          availableCards.splice(index, 1);
        }
      });
    };
    
    let meldFoundThisIteration = true;
    while (meldFoundThisIteration && availableCards.length >= 3) {
      meldFoundThisIteration = false;
      console.log('Looking for melds in remaining cards:', availableCards.map(c => `${c.rank}${c.suit}`));
      
      // Try to find a SET (prioritize 3-card then 4-card for better distribution)
      let bestSet = null;
      let cardsInBestSet = [];
      
      // Try 3-card sets first to maximize number of melds
      for (let i = 0; i < availableCards.length && !bestSet; i++) {
        for (let j = i + 1; j < availableCards.length && !bestSet; j++) {
          for (let k = j + 1; k < availableCards.length && !bestSet; k++) {
            const potential = [availableCards[i], availableCards[j], availableCards[k]];
            if (isValidSet(potential)) {
              bestSet = potential;
              cardsInBestSet = potential;
              console.log('Found 3-card set:', potential.map(c => `${c.rank}${c.suit}`));
            }
          }
        }
      }
      
      // Only try 4-card sets if no 3-card set found or if we have many cards left
      if (!bestSet && availableCards.length >= 6) {
        for (let i = 0; i < availableCards.length && !bestSet; i++) {
          for (let j = i + 1; j < availableCards.length && !bestSet; j++) {
            for (let k = j + 1; k < availableCards.length && !bestSet; k++) {
              for (let l = k + 1; l < availableCards.length && !bestSet; l++) {
                const potential = [availableCards[i], availableCards[j], availableCards[k], availableCards[l]];
                if (isValidSet(potential)) {
                  bestSet = potential;
                  cardsInBestSet = potential;
                  console.log('Found 4-card set:', potential.map(c => `${c.rank}${c.suit}`));
                }
              }
            }
          }
        }
      }
      
      if (bestSet) {
        foundMelds.push(bestSet);
        removeSpecificCards(cardsInBestSet);
        meldFoundThisIteration = true;
        console.log('Added set to melds. Remaining cards:', availableCards.map(c => `${c.rank}${c.suit}`));
        continue;
      }
      
      // Try to find a RUN
      const currentNonJokers = availableCards.filter(c => c.rank !== 'JKR');
      const currentJokersInHand = availableCards.filter(c => c.rank === 'JKR');
      
      let bestRun = null;
      let cardsInBestRun = [];
      
      // Group by suit
      const nonJokersBySuit = {};
      currentNonJokers.forEach(card => {
        if (!nonJokersBySuit[card.suit]) nonJokersBySuit[card.suit] = [];
        nonJokersBySuit[card.suit].push(card);
      });
      
      for (const suit of Object.keys(nonJokersBySuit)) {
        const suitCards = nonJokersBySuit[suit].sort((a, b) => 
          RANKS.indexOf(a.rank) - RANKS.indexOf(b.rank)
        );
        
        // Try all possible subsequences
        for (let i = 0; i < suitCards.length; i++) {
          for (let j = i; j < suitCards.length; j++) {
            const subSequence = suitCards.slice(i, j + 1);
            
            // Try adding different numbers of jokers
            for (let numJokers = 0; numJokers <= currentJokersInHand.length; numJokers++) {
              const potentialRun = [...subSequence, ...currentJokersInHand.slice(0, numJokers)];
              
              if (potentialRun.length >= 3 && isValidRun(potentialRun)) {
                if (!bestRun || potentialRun.length > bestRun.length) {
                  bestRun = potentialRun;
                  // Capture the actual cards used from availableCards, including jokers.
                  // For runs, it's the subsequence of non-jokers + the jokers used.
                  cardsInBestRun = [...subSequence, ...currentJokersInHand.slice(0, numJokers)];
                }
              }
            }
          }
        }
      }
      
      if (bestRun) {
        foundMelds.push(bestRun);
        removeSpecificCards(cardsInBestRun);
        meldFoundThisIteration = true;
      }
    }
    
    return foundMelds;
  };

  const meldSelected = () => {
    if (!game || game.phase !== 'play' || selectedCards.length === 0) {
      setMessage('Select at least 3 cards to meld.');
      return;
    }

    const newGame = { ...game };
    const player = newGame.players[0];
    const selectedHandCards = selectedCards.map(idx => player.hand[idx]);

    console.log('Meld attempt:', {
      selectedCards,
      selectedHandCards,
      round: newGame.round,
      requirement: ROUNDS[newGame.round - 1].requirement,
      playerHasMelded: player.hasMelded
    });

    // Determine if the selected cards themselves form a single valid meld
    const isDirectSet = isValidSet(selectedHandCards);
    const isDirectRun = isValidRun(selectedHandCards);

    console.log('Direct meld check:', { isDirectSet, isDirectRun });

    if (!player.hasMelded) {
      // First meld attempt for the player in this round
      
      console.log('First meld attempt, checking direct meld first...');
      
      // If the selected cards form one perfect meld, check that first against requirements.
      if (isDirectSet || isDirectRun) {
        console.log('Cards form a single direct meld');
        const proposedMelds = [...player.melds, selectedHandCards];
        const meetsReqs = checkRoundRequirements(proposedMelds, newGame.round);
        console.log('Single meld meets requirements:', meetsReqs);
        
        if (meetsReqs) {
          player.melds.push(selectedHandCards);
          player.hand = player.hand.filter((_, idx) => !selectedCards.includes(idx));
          player.hasMelded = true;
          setSelectedCards([]);
          setLastDrawnCardIndex(null);

          if (player.hand.length === 0) {
            setMessage('You went out! Round over!');
            endRound(newGame);
            return;
          }

          setGame(newGame);
          setMessage('Successfully melded! You can now lay off cards or discard.');
          saveGame(newGame);
          return; // Crucial: exit if direct single meld succeeded
        } else {
          // Valid single meld, but not enough to meet round requirements
          console.log('Single meld valid but doesnt meet round requirements');
          setMessage(`This meld doesn't meet Round ${newGame.round} requirement: ${ROUNDS[newGame.round - 1].requirement}. Select more cards or combine with existing melds.`);
          return;
        }
      }

      // If selected cards didn't form a single direct meld, or if the direct meld didn't meet requirements,
      // try to find all possible disjoint melds from the selected cards.
      console.log('Finding multiple melds from cards:', selectedHandCards);
      const foundMelds = findAllMeldsInCards(selectedHandCards);
      console.log('Found melds:', foundMelds);

      if (foundMelds.length === 0) {
        setMessage('Cannot form any valid melds from selected cards! A meld is 3-4 same rank (different suits) or 3+ consecutive cards (same suit). Jokers are wild!');
        return;
      }

      // Check if these found melds (potentially multiple), combined with any pre-existing melds, meet round requirements
      const proposedMeldsIncludingNew = [...player.melds, ...foundMelds];
      console.log('Checking requirements:', {
        foundMelds,
        proposedMeldsIncludingNew,
        round: newGame.round,
        requirement: ROUNDS[newGame.round - 1].requirement
      });
      
      const meetsRequirements = checkRoundRequirements(proposedMeldsIncludingNew, newGame.round);
      console.log('Meets requirements:', meetsRequirements);
      
      if (!meetsRequirements) {
        const currentRound = ROUNDS[newGame.round - 1];
        setMessage(`Found ${foundMelds.length} meld(s) from your selection but they don't meet Round ${newGame.round} requirement: ${currentRound.requirement}. Select more cards or combine with existing melds.`);
        return;
      }

      // If requirements met with multiple found melds
      foundMelds.forEach(meld => player.melds.push(meld));
      player.hand = player.hand.filter((_, idx) => !selectedCards.includes(idx));
      player.hasMelded = true;
      setSelectedCards([]);
      setLastDrawnCardIndex(null);

      if (player.hand.length === 0) {
        setMessage('You went out! Round over!');
        endRound(newGame);
        return;
      }

      setGame(newGame);
      setMessage(`Successfully melded ${foundMelds.length} meld(s)! You can now lay off cards or discard.`);
      saveGame(newGame);

    } else {
      // Player has already melded in this round; they can only add single valid melds
      if (!isDirectSet && !isDirectRun) {
        setMessage('Invalid meld! Must be 3-4 cards of same rank (different suits) or 3+ consecutive cards of same suit. Jokers are wild!');
        return;
      }

      // If it is a single valid meld
      player.melds.push(selectedHandCards);
      player.hand = player.hand.filter((_, idx) => !selectedCards.includes(idx));
      setSelectedCards([]);
      setLastDrawnCardIndex(null);

      if (player.hand.length === 0) {
        setMessage('You went out! Round over!');
        endRound(newGame);
        return;
      }

      setGame(newGame);
      setMessage('New meld added successfully! Continue playing or discard to end turn.');
      saveGame(newGame);
    }
  };

  const layOffSelected = () => {
    if (!game || game.phase !== 'play' || selectedCards.length !== 1 || !game.players[0].hasMelded) {
      setMessage('Select exactly 1 card to lay off. You must have melded first.');
      return;
    }
    
    const newGame = { ...game };
    const cardIdx = selectedCards[0];
    const card = newGame.players[0].hand[cardIdx];
    
    let laidOff = false;
    
    // Try to lay off on player's own melds first
    for (let meldIdx = 0; meldIdx < newGame.players[0].melds.length; meldIdx++) {
      const meld = newGame.players[0].melds[meldIdx];
      const proposedMeld = [...meld, card];
      
      // Determine if this meld is a set or run based on existing cards
      const nonJokersInMeld = meld.filter(c => c.rank !== 'JKR');
      let isSet = false;
      let isRun = false;
      
      if (nonJokersInMeld.length > 0) {
        // Check if all natural cards have same rank (SET)
        if (nonJokersInMeld.every(c => c.rank === nonJokersInMeld[0].rank)) {
          isSet = true;
        }
        // Check if all natural cards have same suit (RUN)
        else if (nonJokersInMeld.every(c => c.suit === nonJokersInMeld[0].suit)) {
          isRun = true;
        }
      } else {
        continue;
      }
      
      // Validate the proposed meld based on the original meld's type
      if ((isSet && isValidSet(proposedMeld)) || (isRun && isValidRun(proposedMeld))) {
        newGame.players[0].melds[meldIdx].push(card);
        newGame.players[0].hand.splice(cardIdx, 1);
        laidOff = true;
        setMessage('Card laid off successfully on your meld!');
        break;
      }
    }
    
    if (!laidOff) {
      // Try to lay off on other players' melds
      for (let playerIdx = 1; playerIdx < 4; playerIdx++) {
        const otherPlayer = newGame.players[playerIdx];
        if (!otherPlayer.hasMelded) continue;
        
        for (let meldIdx = 0; meldIdx < otherPlayer.melds.length; meldIdx++) {
          const meld = otherPlayer.melds[meldIdx];
          const proposedMeld = [...meld, card];
          
          const nonJokersInMeld = meld.filter(c => c.rank !== 'JKR');
          let isSet = false;
          let isRun = false;
          
          if (nonJokersInMeld.length > 0) {
            if (nonJokersInMeld.every(c => c.rank === nonJokersInMeld[0].rank)) {
              isSet = true;
            } else if (nonJokersInMeld.every(c => c.suit === nonJokersInMeld[0].suit)) {
              isRun = true;
            }
          } else {
            continue;
          }
          
          if ((isSet && isValidSet(proposedMeld)) || (isRun && isValidRun(proposedMeld))) {
            newGame.players[playerIdx].melds[meldIdx].push(card);
            newGame.players[0].hand.splice(cardIdx, 1);
            laidOff = true;
            setMessage(`Card laid off on ${otherPlayer.name}'s meld!`);
            break;
          }
        }
        if (laidOff) break;
      }
    }
    
    if (!laidOff) {
      setMessage('Cannot lay off this card on any existing meld!');
      return;
    }
    
    setSelectedCards([]);
    setLastDrawnCardIndex(null);
    
    if (newGame.players[0].hand.length === 0) {
      setMessage('You went out! Round over!');
      endRound(newGame);
      return;
    }
    
    setGame(newGame);
    saveGame(newGame);
  };


  const discardCard = () => {
    if (!game || game.phase !== 'play' || selectedCards.length !== 1) {
      setMessage('Select exactly 1 card to discard.');
      return;
    }

    const newGame = { ...game };
    const cardIdx = selectedCards[0];
    const card = newGame.players[0].hand[cardIdx];
    newGame.discard.push(card);
    newGame.lastDiscardedCard = card; // Set the last discarded card for buy window
    newGame.players[0].hand.splice(cardIdx, 1);

    if (newGame.players[0].hand.length === 0) {
      endRound(newGame);
      return;
    }

    setSelectedCards([]);
    setLastDrawnCardIndex(null);
    startBuyWindow(newGame);
  };

  const showAiActionNotification = (action, playerName) => {
    setAiAction({ action, playerName });
    setTimeout(() => setAiAction(null), 3000);
  };

  const simulateAIBuyDecisions = (gameState) => {
    // Simulate AI players considering buy opportunities without actually giving them the chance
    const aiPlayers = [1, 2, 3].filter(index => index !== gameState.currentPlayer);
    
    aiPlayers.forEach((playerIndex, order) => {
      const player = gameState.players[playerIndex];
      
      // Simple AI logic: occasionally "buy" if they can form a basic meld
      const shouldSimulateBuy = Math.random() < 0.15; // 15% chance to simulate buy
      
      if (shouldSimulateBuy) {
        // Show notification that AI "bought" but don't actually change game state
        setTimeout(() => {
          showAiActionNotification('buy', player.name);
          setMessage(`${player.name} considered buying but decided against it.`);
        }, (order + 1) * 2000); // Stagger notifications
      } else {
        setTimeout(() => {
          setMessage(`${player.name} passed on the buy opportunity.`);
        }, (order + 1) * 2000);
      }
    });
  };

  const startBuyWindow = (gameState) => {
    if (!gameState.lastDiscardedCard) return;
    
    console.log('Starting buy window - only human player gets opportunity for:', gameState.lastDiscardedCard);
    console.log('Current player who discarded:', gameState.currentPlayer);
    
    // Only give buy opportunity to human player (index 0) if they didn't discard
    if (gameState.currentPlayer === 0) {
      console.log('Human player is the discarder, no buy opportunity');
      // Still simulate AI decisions for realism
      simulateAIBuyDecisions(gameState);
      advanceToNextPlayer(gameState);
      return;
    }
    
    console.log('Simulating AI buy decisions before human opportunity');
    
    // Simulate AI players considering the buy first (visual effect only)
    simulateAIBuyDecisions(gameState);
    
    // Give human player the actual buy opportunity after AI "decisions"
    setTimeout(() => {
      console.log('Human player gets buy opportunity with unlimited time');
      
      setBuyWindow({
        isOpen: true,
        currentBuyerIndex: 0, // Always human player
        timeLeft: 9999, // Unlimited time for human
        isAI: false,
        originalCurrentPlayer: gameState.currentPlayer
      });
    }, 6000); // Wait for AI simulations to complete (3 AI × 2 seconds each)
  };

  const handlePlayerBuy = (discardIndex, targetCard, handCardIndices) => {
    if (!game || !buyWindow) return;

    const newGame = { ...game };
    const cardsFromDiscard = newGame.discard.slice(discardIndex);
    const cardsFromHand = handCardIndices.map(idx => newGame.players[0].hand[idx]);
    
    // The meld must include the target card (the one clicked) plus selected hand cards
    const meldCards = [targetCard, ...cardsFromHand];

    console.log('Buy attempt:', {
      targetCard,
      cardsFromHand,
      meldCards,
      totalCards: meldCards.length,
      jokers: meldCards.filter(c => c.rank === 'JKR'),
      naturalCards: meldCards.filter(c => c.rank !== 'JKR')
    });

    // Validate the meld - jokers are wild!
    const isSet = isValidSet(meldCards);
    const isRun = isValidRun(meldCards);
    
    console.log('Validation:', { isSet, isRun });
    
    if (!isSet && !isRun) {
      const jokerCount = meldCards.filter(c => c.rank === 'JKR').length;
      const naturalCount = meldCards.filter(c => c.rank !== 'JKR').length;
      const naturalRanks = meldCards.filter(c => c.rank !== 'JKR').map(c => c.rank);
      const naturalSuits = meldCards.filter(c => c.rank !== 'JKR').map(c => c.suit);
      
      console.log('Meld validation failed:', {
        meldCards,
        naturalRanks,
        naturalSuits,
        jokerCount,
        naturalCount
      });
      
      setMessage(`Invalid meld! Cards: ${meldCards.map(c => `${c.rank}${c.suit}`).join(', ')}. Must form SET (same rank) or RUN (consecutive same suit). Need at least 1 natural card. Jokers are WILD!`);
      return;
    }

    // If player hasn't melded yet, check if this meld helps meet round requirements
    if (!newGame.players[0].hasMelded) {
      const proposedMelds = [...newGame.players[0].melds, meldCards];
      if (!checkRoundRequirements(proposedMelds, newGame.round)) {
        setMessage(`Valid meld, but doesn't meet Round ${newGame.round} requirement: ${ROUNDS[newGame.round - 1].requirement}`);
        return;
      }
      newGame.players[0].hasMelded = true;
    }

    // Add the meld
    newGame.players[0].melds.push(meldCards);
    
    // Remove cards used in meld from hand
    newGame.players[0].hand = newGame.players[0].hand.filter((_, idx) => !handCardIndices.includes(idx));
    
    // Add remaining bought cards to hand (not used in the immediate meld)
    const remainingBoughtCards = cardsFromDiscard.filter(c => 
      !(c.rank === targetCard.rank && c.suit === targetCard.suit)
    );
    newGame.players[0].hand.push(...remainingBoughtCards);
    
    // Remove cards from discard
    newGame.discard = newGame.discard.slice(0, discardIndex);

    const cardCount = cardsFromDiscard.length;
    const meldType = isSet ? 'SET' : 'RUN';
    setMessage(`Success! Bought ${cardCount} card(s), melded a ${meldType} with ${meldCards.length} cards, added ${remainingBoughtCards.length} to hand!`);

    // After player buys successfully, end buy window immediately
    console.log('Player bought cards, ending buy window and advancing to next turn');
    setBuyWindow(null);
    
    setLastDrawnCardIndex(null);

    if (newGame.players[0].hand.length === 0) {
      setMessage('You went out! Round over!');
      endRound(newGame);
      return;
    }

    setGame(newGame);
    saveGame(newGame);
    advanceToNextPlayer(newGame);
  };

  const handlePlayerBuyOnTurn = (discardIndex, targetCard, handCardIndices) => {
    if (!game || game.phase !== 'play' || game.currentPlayer !== 0) return;

    const newGame = { ...game };
    const cardsFromDiscard = newGame.discard.slice(discardIndex);
    const cardsFromHand = handCardIndices.map(idx => newGame.players[0].hand[idx]);
    
    // The meld must include the target card (the one clicked) plus selected hand cards
    const meldCards = [targetCard, ...cardsFromHand];

    // Validate the meld - jokers are wild!
    const isValidMeld = isValidSet(meldCards) || isValidRun(meldCards);
    
    if (!isValidMeld) {
      setMessage('Invalid meld! Cards must form a valid set or run. Jokers are WILD and can substitute for any card!');
      return;
    }

    // If player hasn't melded yet, check if this meld helps meet round requirements
    if (!newGame.players[0].hasMelded) {
      const proposedMelds = [...newGame.players[0].melds, meldCards];
      if (!checkRoundRequirements(proposedMelds, newGame.round)) {
        setMessage(`This meld doesn't meet Round ${newGame.round} requirement: ${ROUNDS[newGame.round - 1].requirement}`);
        return;
      }
      newGame.players[0].hasMelded = true;
    }

    // Add the meld
    newGame.players[0].melds.push(meldCards);
    
    // Remove cards used in meld from hand
    newGame.players[0].hand = newGame.players[0].hand.filter((_, idx) => !handCardIndices.includes(idx));
    
    // Add remaining bought cards to hand
    const remainingBoughtCards = cardsFromDiscard.filter(c => 
      !(c.rank === targetCard.rank && c.suit === targetCard.suit)
    );
    newGame.players[0].hand.push(...remainingBoughtCards);
    
    // Remove cards from discard
    newGame.discard = newGame.discard.slice(0, discardIndex);

    const cardCount = cardsFromDiscard.length;
    setMessage(`You took ${cardCount} card(s), melded with ${meldCards.length} cards, and added ${remainingBoughtCards.length} to your hand!`);
    setLastDrawnCardIndex(null);

    if (newGame.players[0].hand.length === 0) {
      setMessage('You went out! Round over!');
      endRound(newGame);
      return;
    }

    setGame(newGame);
    saveGame(newGame);
  };

  const handlePlayerSkipBuy = () => {
    console.log('handlePlayerSkipBuy called', { game: !!game, buyWindow: !!buyWindow });
    
    if (!game || !buyWindow) {
      console.log('Early return: missing game or buyWindow');
      return;
    }
    
    console.log('Human player skipped buy. Advancing to next turn.');
    
    // Human player skipped, close buy window and advance to next turn
    setBuyWindow(null);
    advanceToNextPlayer(game);
  };

  const advanceToNextPlayer = (gameState) => {
    gameState.currentPlayer = (gameState.currentPlayer + 1) % 4;
    gameState.phase = 'draw';
    setGame({ ...gameState });
    setLastDrawnCardIndex(null);
    saveGame(gameState);

    if (gameState.currentPlayer !== 0) {
      setMessage(`${gameState.players[gameState.currentPlayer].name}'s turn.`);
      setTimeout(() => playAITurn(gameState), 1500);
    } else {
      setMessage('Your turn! Draw a card from stock or discard pile.');
    }
  };

  const playAITurn = (gameState) => {
    const newGame = { ...gameState };
    const player = newGame.players[newGame.currentPlayer];

    // AI Draw Phase
    let drawnCard = null;
    const shouldDrawDiscard = Math.random() > 0.7 && newGame.discard.length > 0; // AI prefers stock slightly
    if (shouldDrawDiscard) {
      drawnCard = newGame.discard.pop();
      player.hand.push(drawnCard);
      setMessage(`${player.name} drew from the discard pile.`);
    } else {
      drawnCard = newGame.deck.pop();
      player.hand.push(drawnCard);
      setMessage(`${player.name} drew from the stock pile.`);
    }
    
    showAiActionNotification('draw', player.name);


    // AI Play Phase (Meld / Lay Off)
    // AI Strategy: Try to fulfill round requirement first, then try to lay off, then discard.
    
    // 1. Initial Meld for Round Requirement
    if (!player.hasMelded && player.hand.length >= 3) {
      let tempHandForMeldCheck = [...player.hand];
      let iterationMelds = [];
      let meldFoundThisIteration = true;

      while(meldFoundThisIteration) {
        meldFoundThisIteration = false;
        let bestMeld = null;
        let bestMeldCards = [];

        // Try to find the best possible single meld from remaining cards (sets first, then runs)
        // This is a re-implementation of parts of findAllMeldsInCards for a single iteration
        
        // Find best SET (4-card then 3-card)
        let foundSet = false;
        for (let a = 0; a < tempHandForMeldCheck.length && !foundSet; a++) {
          for (let b = a + 1; b < tempHandForMeldCheck.length && !foundSet; b++) {
            for (let c = b + 1; c < tempHandForMeldCheck.length && !foundSet; c++) {
              let potential3Set = [tempHandForMeldCheck[a], tempHandForMeldCheck[b], tempHandForMeldCheck[c]];
              if (isValidSet(potential3Set)) {
                // Check for 4-card set first if possible
                for (let d = c + 1; d < tempHandForMeldCheck.length; d++) {
                  let potential4Set = [...potential3Set, tempHandForMeldCheck[d]];
                  if (isValidSet(potential4Set)) {
                    bestMeld = potential4Set;
                    bestMeldCards = potential4Set;
                    foundSet = true;
                    break;
                  }
                }
                if (!foundSet) { // If no 4-card set found, use the 3-card
                  bestMeld = potential3Set;
                  bestMeldCards = potential3Set;
                  foundSet = true;
                  break;
                }
              }
            }
          }
        }

        // Find best RUN if no set or if run is better/longer
        const nonJokersInCurrentIterHand = tempHandForMeldCheck.filter(c => c.rank !== 'JKR');
        const currentJokersInCurrentIterHand = tempHandForMeldCheck.filter(c => c.rank === 'JKR');
        const nonJokersBySuit = {};
        nonJokersInCurrentIterHand.forEach(card => {
          if (!nonJokersBySuit[card.suit]) nonJokersBySuit[card.suit] = [];
          nonJokersBySuit[card.suit].push(card);
        });

        let currentBestRun = null;
        let currentBestRunCards = [];

        for (const suit of Object.keys(nonJokersBySuit)) {
          const suitCards = nonJokersBySuit[suit].sort((a, b) => 
            RANKS.indexOf(a.rank) - RANKS.indexOf(b.rank)
          );
          for (let s = 0; s < suitCards.length; s++) {
            for (let e = s; e < suitCards.length; e++) { 
              const subSequence = suitCards.slice(s, e + 1);
              for (let numJokers = 0; numJokers <= currentJokersInCurrentIterHand.length; numJokers++) {
                const potentialRun = [...subSequence, ...currentJokersInCurrentIterHand.slice(0, numJokers)]; // Fixed: used currentJokersInCurrentIterHand
                if (isValidRun(potentialRun)) {
                  if (!currentBestRun || potentialRun.length > currentBestRun.length) {
                    currentBestRun = potentialRun;
                    currentBestRunCards = [...subSequence, ...currentJokersInCurrentIterHand.slice(0, numJokers)]; // Fixed: used currentJokersInCurrentIterHand
                  }
                }
              }
            }
          }
        }
        
        if (currentBestRun && (!bestMeld || currentBestRun.length > bestMeld.length)) {
          bestMeld = currentBestRun;
          bestMeldCards = currentBestRunCards;
        }

        // ROUND REQUIREMENT CHECK: Only use meld types allowed in this round
        if (bestMeld) {
          const requirements = {
            1: { sets: 2, runs: 0 },  // Round 1: Only sets allowed
            2: { sets: 1, runs: 1 },  // Round 2: Sets and runs allowed
            3: { sets: 0, runs: 2 },  // Round 3: Only runs allowed
            4: { sets: 3, runs: 0 },  // Round 4: Only sets allowed
            5: { sets: 2, runs: 1 },  // Round 5: Sets and runs allowed
            6: { sets: 1, runs: 2 },  // Round 6: Sets and runs allowed
            7: { sets: 0, runs: 3 }   // Round 7: Only runs allowed
          };
          
          const roundReq = requirements[newGame.round];
          const meldIsSet = isValidSet(bestMeld);
          const meldIsRun = isValidRun(bestMeld);
          
          // Skip this meld if it's not allowed in the current round
          if ((meldIsSet && roundReq.sets === 0) || (meldIsRun && roundReq.runs === 0)) {
            console.log(`AI skipping ${meldIsSet ? 'SET' : 'RUN'} meld - not allowed in Round ${newGame.round}`);
            bestMeld = null;
            bestMeldCards = [];
          } else if (bestMeld) {
            console.log(`AI creating ${meldIsSet ? 'SET' : 'RUN'} meld for Round ${newGame.round}: ${bestMeld.map(c => c.rank + c.suit).join(', ')}`);
          }
        }

        if (bestMeld) {
          iterationMelds.push(bestMeld);
          // Remove used cards from temp hand
          tempHandForMeldCheck = tempHandForMeldCheck.filter(card => !bestMeldCards.includes(card));
          meldFoundThisIteration = true; // Continue trying to find more melds
        }
      } // End while loop for finding multiple melds

      if (iterationMelds.length > 0) {
        const proposedMelds = [...player.melds, ...iterationMelds];
        if (checkRoundRequirements(proposedMelds, newGame.round)) {
          iterationMelds.forEach(meld => player.melds.push(meld));
          
          // Construct a set of card objects that were used in these melds
          const cardsToRemoveFromHand = new Set(iterationMelds.flat());
          newGame.players[newGame.currentPlayer].hand = newGame.players[newGame.currentPlayer].hand.filter(card => !cardsToRemoveFromHand.has(card));

          player.hasMelded = true;
          setMessage(`${player.name} melded to meet round requirement!`);
          showAiActionNotification('meld', player.name);
        }
      }
    }

    // 2. Lay off cards on existing melds (simplified AI: try to lay off any single card)
    if (player.hasMelded && player.hand.length > 0) {
      let cardToLayOff = null;
      let targetMeld = null;
      let targetPlayer = null;

      // Iterate through AI's own hand to find a card to lay off
      for (const handCard of player.hand) {
        // Try on own melds
        for (let meldIdx = 0; meldIdx < player.melds.length; meldIdx++) {
          const meld = player.melds[meldIdx];
          const proposedMeld = [...meld, handCard];
          const nonJokersInMeld = meld.filter(c => c.rank !== 'JKR');
          let isSet = false;
          let isRun = false;
          if (nonJokersInMeld.length > 0) {
            if (nonJokersInMeld.every(c => c.rank === nonJokersInMeld[0].rank)) isSet = true;
            else if (nonJokersInMeld.every(c => c.suit === nonJokersInMeld[0].suit)) isRun = true;
          } else { continue; } // Skip if meld type cannot be determined
          
          if ((isSet && isValidSet(proposedMeld)) || (isRun && isValidRun(proposedMeld))) {
            cardToLayOff = handCard;
            targetMeld = meld;
            targetPlayer = player;
            break;
          }
        }
        if (cardToLayOff) break;

        // Try on other players' melds
        for (let otherPlayerIdx = 0; otherPlayerIdx < 4; otherPlayerIdx++) {
          if (otherPlayerIdx === newGame.currentPlayer) continue; // Skip self
          const otherPlayer = newGame.players[otherPlayerIdx];
          if (!otherPlayer.hasMelded) continue; // Can only lay off if player has melded

          for (const meld of otherPlayer.melds) {
            const proposedMeld = [...meld, handCard];
            const nonJokersInMeld = meld.filter(c => c.rank !== 'JKR');
            let isSet = false;
            let isRun = false;
            if (nonJokersInMeld.length > 0) {
              if (nonJokersInMeld.every(c => c.rank === nonJokersInMeld[0].rank)) isSet = true;
              else if (nonJokersInMeld.every(c => c.suit === nonJokersInMeld[0].suit)) isRun = true;
            } else { continue; } // Skip if meld type cannot be determined
            
            if ((isSet && isValidSet(proposedMeld)) || (isRun && isValidRun(proposedMeld))) {
              cardToLayOff = handCard;
              targetMeld = meld;
              targetPlayer = otherPlayer;
              break;
            }
          }
          if (cardToLayOff) break;
        }
        if (cardToLayOff) break;
      }

      if (cardToLayOff && targetMeld && targetPlayer) {
        targetMeld.push(cardToLayOff); // Add card to the actual meld object
        newGame.players[newGame.currentPlayer].hand = newGame.players[newGame.currentPlayer].hand.filter(c => c !== cardToLayOff); // Remove from hand
        setMessage(`${player.name} laid off a card.`);
        showAiActionNotification('lay off', player.name);
      }
    }


    // 3. Discard Phase
    // If player went out after melding/laying off
    if (player.hand.length === 0) {
      setMessage(`${player.name} went out! Round over!`);
      endRound(newGame);
      return;
    }

    // AI always discards one card to end turn
    // Simple AI: discard a random card. A better AI would discard high-value cards, or cards not useful for future melds.
    const discardIdx = Math.floor(Math.random() * player.hand.length);
    const discardedCard = player.hand[discardIdx];
    newGame.discard.push(discardedCard);
    newGame.lastDiscardedCard = discardedCard; // Set the last discarded card for buy window
    player.hand.splice(discardIdx, 1);
    setMessage(`${player.name} discarded a card.`);
    showAiActionNotification('discard', player.name);

    // Check if AI went out by discarding its last card
    if (player.hand.length === 0) {
      setMessage(`${player.name} went out! Round over!`);
      endRound(newGame);
      return;
    }

    startBuyWindow(newGame);
  };

  const endRound = (gameState) => {
    const newGame = { ...gameState };

    for (let i = 0; i < 4; i++) {
      const player = newGame.players[i];
      let points = 0;
      player.hand.forEach(card => {
        if (card.rank === 'JKR') points += 50;
        else if (['J', 'Q', 'K'].includes(card.rank)) points += 10;
        else if (card.rank === 'A') points += 15; // Ace is 15 points
        else points += parseInt(card.rank) || 10; // Number cards face value, 10 for 10
      });
      player.score += points;
    }

    if (newGame.round < 7) {
      newGame.round++;
      const deck = createDeck();
      newGame.deck = deck.slice(45);
      newGame.discard = [deck[44]];
      const cardsPerPlayer = 11; // 11 cards dealt per player for progressive rummy
      for (let i = 0; i < 4; i++) {
        newGame.players[i].hand = deck.slice(i * cardsPerPlayer, (i + 1) * cardsPerPlayer);
        newGame.players[i].melds = [];
        newGame.players[i].hasMelded = false;
      }
      newGame.currentPlayer = 0; // Reset to player 1
      newGame.phase = 'draw';
      setMessage(`Round ${newGame.round} started!`);
    } else {
      newGame.gameOver = true;
      const winner = newGame.players.reduce((minPlayer, currentPlayer) =>
        (currentPlayer.score < minPlayer.score) ? currentPlayer : minPlayer
      );
      setMessage(`Game Over! ${winner.name} wins with ${winner.score} points!`);
    }

    setGame(newGame);
    setLastDrawnCardIndex(null);
    saveGame(newGame);
  };

  const arrangeBySuit = () => {
    if (!game) return;
    const newGame = { ...game };
    newGame.players[0].hand.sort((a, b) => {
      const suitOrder = { '♠': 0, '♥': 1, '♦': 2, '♣': 3, '🃏': 4 };
      if (suitOrder[a.suit] !== suitOrder[b.suit]) {
        return suitOrder[a.suit] - suitOrder[b.suit];
      }
      return RANKS.indexOf(a.rank) - RANKS.indexOf(b.rank);
    });
    setGame(newGame);
    setLastDrawnCardIndex(null);
    saveGame(newGame);
  };

  const arrangeByRank = () => {
    if (!game) return;
    const newGame = { ...game };
    newGame.players[0].hand.sort((a, b) => {
      const rankA = a.rank === 'JKR' ? 99 : RANKS.indexOf(a.rank);
      const rankB = b.rank === 'JKR' ? 99 : RANKS.indexOf(b.rank);
      if (rankA !== rankB) {
        return rankA - rankB;
      }
      const suitOrder = { '♠': 0, '♥': 1, '♦': 2, '♣': 3, '🃏': 4 };
      return suitOrder[a.suit] - suitOrder[b.suit];
    });
    setGame(newGame);
    setLastDrawnCardIndex(null);
    saveGame(newGame);
  };

  const reorderHand = (sourceIndex, destIndex) => {
    if (!game) return;
    const newGame = { ...game };
    const hand = [...newGame.players[0].hand];
    const [removed] = hand.splice(sourceIndex, 1);
    hand.splice(destIndex, 0, removed);
    newGame.players[0].hand = hand;
    setSelectedCards([]);
    setLastDrawnCardIndex(null); // Reset last drawn index after manual reorder
    setGame(newGame);
    saveGame(newGame);
  };

  if (!game) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${currentTheme.background} p-4 flex items-center justify-center`}>
        <UICard className="max-w-md bg-white shadow-2xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center flex items-center justify-center gap-2">
              <Trophy className="w-8 h-8 text-yellow-600" />
              Progressive Rummy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-gray-600">
              A classic 4-player card game with 7 progressive rounds
            </p>

            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm font-semibold mb-2 text-gray-700">Choose Your Theme:</p>
              <ThemeSelector currentTheme={theme} onThemeChange={handleThemeChange} />
            </div>

            <Button onClick={startNewGame} className="w-full bg-green-700 hover:bg-green-600 text-lg py-6">
              <Play className="w-5 h-5 mr-2" />
              Start New Game
            </Button>
            <Button onClick={() => setShowRules(true)} variant="outline" className="w-full">
              <HelpCircle className="w-5 h-5 mr-2" />
              How to Play & Scoring
            </Button>
          </CardContent>
        </UICard>

        <HelpDialog open={showRules} onOpenChange={setShowRules} />
      </div>
    );
  }

  const currentRound = ROUNDS[game.round - 1];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentTheme.background} p-2 md:p-4`}>
      <div className="max-w-7xl mx-auto space-y-4">
        <div className={`bg-gradient-to-r ${currentTheme.table} rounded-xl p-4 shadow-2xl`}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
                <Trophy className="w-7 h-7 text-yellow-400" />
                Progressive Rummy
              </h1>
              <div className="flex gap-3 mt-2">
                <Badge className="bg-yellow-500 text-black font-bold">
                  Round {game.round}/7
                </Badge>
                <Badge variant="outline" className="bg-white text-green-800 font-semibold">
                  {currentRound?.requirement}
                </Badge>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-2 items-center">
              <ThemeSelector currentTheme={theme} onThemeChange={handleThemeChange} />
              <Button
                onClick={() => setShowRules(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg"
                size="sm"
              >
                <HelpCircle className="w-5 h-5 mr-2" />
                Rules & Help
              </Button>
              <Button onClick={startNewGame} variant="outline" size="sm" className="bg-white">
                <RotateCcw className="w-4 h-4 mr-2" />
                New Game
              </Button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {aiAction && (
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.9 }}
              className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full shadow-2xl font-bold text-lg flex items-center gap-3"
            >
              <span className="text-2xl">
                {aiAction.action === 'buy' ? '🛒' : aiAction.action === 'meld' ? '🃏' : aiAction.action === 'lay off' ? '➕' : '👇'}
              </span>
              <span>
                {aiAction.playerName} {aiAction.action === 'buy' ? 'bought cards!' : aiAction.action === 'meld' ? 'melded!' : aiAction.action === 'lay off' ? 'laid off a card!' : 'discarded!'}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {game.players.slice(1).map((player, idx) => (
                <OpponentDisplay
                  key={idx + 1}
                  name={player.name}
                  handCount={player.hand.length}
                  score={player.score}
                  melds={player.melds}
                  isActive={game.currentPlayer === idx + 1}
                  theme={currentTheme}
                />
              ))}
            </div>

            <div className={`bg-gradient-to-br ${currentTheme.table} rounded-xl p-4 md:p-6 shadow-2xl`}>
              <div className="flex flex-row justify-center items-start gap-6 md:gap-8">
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <Card isFaceDown theme={currentTheme} />
                  </div>
                  <div className="text-white text-sm mt-2 font-semibold">{game.deck.length} cards</div>
                  <Button
                    onClick={drawFromStock}
                    disabled={game.phase !== 'draw' || game.currentPlayer !== 0}
                    className="mt-2 bg-blue-700 hover:bg-blue-600 disabled:opacity-50 text-sm px-4 py-2 whitespace-nowrap"
                  >
                    Draw Stock
                  </Button>
                </div>

                <div className="flex flex-col items-center">
                  <div className="relative">
                    {game.discard.length > 0 && (
                      <Card rank={game.discard[game.discard.length - 1].rank} suit={game.discard[game.discard.length - 1].suit} theme={currentTheme} />
                    )}
                    <div className="text-white text-sm mt-2 font-semibold">{game.discard.length} cards</div>
                  </div>
                  <Button
                    onClick={drawFromDiscard}
                    disabled={game.phase !== 'draw' || game.currentPlayer !== 0 || game.discard.length === 0}
                    className="mt-2 bg-purple-700 hover:bg-purple-600 disabled:opacity-50 text-sm px-4 py-2 whitespace-nowrap"
                  >
                    Draw Discard
                  </Button>
                  <div className="flex gap-2 mt-2">
                    <Button
                      onClick={() => setShowDiscard(true)}
                      variant="outline"
                      size="sm"
                      className="bg-white text-xs"
                    >
                      View All
                    </Button>
                    {game.phase === 'play' && game.currentPlayer === 0 && game.discard.length > 0 && (
                      <Button
                        onClick={() => setShowBuyOnTurn(true)}
                        size="sm"
                        className="bg-orange-600 hover:bg-orange-500 text-xs whitespace-nowrap"
                      >
                        🛒 Buy & Meld
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className={`bg-gradient-to-br ${currentTheme.table} rounded-xl p-4 shadow-2xl`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  You
                </div>
                <div>
                  <div className="font-bold text-white text-lg">{game.players[0].name}</div>
                  <div className="text-green-200 text-sm">Score: {game.players[0].score}</div>
                </div>
              </div>

              {game.players[0].melds.length > 0 && (
                <div className="mb-4">
                  <MeldDisplay melds={game.players[0].melds} playerName="Your" theme={currentTheme} />
                </div>
              )}

              <PlayerHand
                cards={game.players[0].hand}
                selectedCards={selectedCards}
                lastDrawnCardIndex={lastDrawnCardIndex}
                onCardClick={(idx) => {
                  if (selectedCards.includes(idx)) {
                    setSelectedCards(selectedCards.filter(i => i !== idx));
                  } else {
                    setSelectedCards([...selectedCards, idx]);
                  }
                }}
                onArrangeBySuit={arrangeBySuit}
                onArrangeByRank={arrangeByRank}
                onReorder={reorderHand}
                theme={currentTheme}
              />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
                <Button
                  onClick={meldSelected}
                  disabled={game.phase !== 'play' || selectedCards.length < 3}
                  className="bg-yellow-600 hover:bg-yellow-500 disabled:opacity-50 text-sm"
                >
                  Meld Selected
                </Button>
                <Button
                  onClick={layOffSelected}
                  disabled={game.phase !== 'play' || selectedCards.length !== 1 || !game.players[0].hasMelded}
                  className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-sm"
                >
                  Lay Off Card
                </Button>
                <Button
                  onClick={discardCard}
                  disabled={game.phase !== 'play' || selectedCards.length !== 1}
                  className="bg-red-600 hover:bg-red-500 disabled:opacity-50 text-sm"
                >
                  Discard
                </Button>
                <Button
                  onClick={() => setSelectedCards([])}
                  variant="outline"
                  className="bg-white text-sm"
                >
                  Clear
                </Button>
              </div>

              {/* Moved message here, below player action buttons */}
              <div className="bg-white bg-opacity-95 rounded-lg p-3 shadow-lg mt-4">
                <p className="text-center text-gray-800 font-semibold flex items-center justify-center gap-2">
                  <AlertCircle className="w-5 h-5 text-blue-600" />
                  {message}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <Scoreboard players={game.players} currentPlayerIndex={game.currentPlayer} />
          </div>
        </div>

        <Dialog open={showDiscard} onOpenChange={setShowDiscard}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Discard Pile ({game.discard.length} cards)</DialogTitle>
            </DialogHeader>
            <div className="flex flex-wrap gap-2 max-h-96 overflow-y-auto p-4">
              {game.discard.map((card, idx) => (
                <Card key={idx} rank={card.rank} suit={card.suit} theme={currentTheme} />
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <AnimatePresence>
        {buyWindow && game && game.players && game.players[buyWindow.currentBuyerIndex] && (
          <BuyWindow
            key="buy-window"
            discardPile={game.discard || []}
            playerHand={buyWindow.currentBuyerIndex === 0 ? (game.players[0]?.hand || []) : []}
            currentBuyerName={game.players[buyWindow.currentBuyerIndex]?.name || 'Unknown'}
            isPlayerTurn={buyWindow.currentBuyerIndex === 0}
            timeLeft={buyWindow.timeLeft || 0}
            onBuy={handlePlayerBuy}
            onSkip={handlePlayerSkipBuy}
            theme={currentTheme}
            showTimer={buyWindow.isAI}
          />
        )}
        {showBuyOnTurn && game && game.players && (
          <BuyWindow
            key="buy-on-turn"
            discardPile={game.discard || []}
            playerHand={game.players[0]?.hand || []}
            currentBuyerName="You"
            isPlayerTurn={true}
            timeLeft={9999} // Player gets no timer
            onBuy={handlePlayerBuyOnTurn}
            onSkip={() => setShowBuyOnTurn(false)}
            theme={currentTheme}
            showTimer={false}
            isOnTurnBuy={true}
          />
        )}
      </AnimatePresence>

      <HelpDialog open={showRules} onOpenChange={setShowRules} />
    </div>
  );
}
