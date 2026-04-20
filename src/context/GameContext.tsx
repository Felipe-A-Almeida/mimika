import React, { createContext, useContext, useState, useCallback } from 'react';
import { Category, getRandomWord } from '@/data/words';

export type Player = { id: string; name: string; score: number };
export type GamePhase = 'setup' | 'config' | 'playing' | 'victory';

interface GameState {
  players: Player[];
  categories: Category[];
  maxScore: number;
  roundTime: number;
  currentPlayerIndex: number;
  phase: GamePhase;
  usedWords: Set<string>;
  winner: Player | null;
  guesserScoring: boolean;
  continueUntilTimeout: boolean;
}

interface GameContextType extends GameState {
  addPlayer: (name: string) => void;
  removePlayer: (id: string) => void;
  setCategories: (cats: Category[]) => void;
  setMaxScore: (score: number) => void;
  setRoundTime: (time: number) => void;
  setGuesserScoring: (val: boolean) => void;
  setContinueUntilTimeout: (val: boolean) => void;
  startGame: () => void;
  scorePoint: (guesserId?: string) => string | null;
  skipWord: () => string | null;
  nextTurn: () => void;
  getCurrentWord: () => string | null;
  resetGame: () => void;
  playAgain: () => void;
  changeRules: () => void;
  goToConfig: () => void;
}

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [categories, setCategoriesState] = useState<Category[]>([]);
  const [maxScore, setMaxScoreState] = useState(10);
  const [roundTime, setRoundTimeState] = useState(60);
  const [guesserScoring, setGuesserScoringState] = useState(true);
  const [continueUntilTimeout, setContinueUntilTimeoutState] = useState(true);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [phase, setPhase] = useState<GamePhase>('setup');
  const [usedWords, setUsedWords] = useState<Set<string>>(new Set());
  const [winner, setWinner] = useState<Player | null>(null);
  const [currentWord, setCurrentWord] = useState<string | null>(null);

  const addPlayer = useCallback((name: string) => {
    setPlayers((prev) => [...prev, { id: crypto.randomUUID(), name, score: 0 }]);
  }, []);

  const removePlayer = useCallback((id: string) => {
    setPlayers((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const startGame = useCallback(() => {
    setCurrentPlayerIndex(0);
    setUsedWords(new Set());
    setWinner(null);
    setCurrentWord(null);
    setPlayers((prev) => prev.map((p) => ({ ...p, score: 0 })));
    setPhase('playing');
  }, []);

  const getCurrentWord = useCallback(() => {
    if (currentWord) return currentWord;
    const word = getRandomWord(categories, usedWords);
    if (word) {
      setCurrentWord(word);
      setUsedWords((prev) => new Set(prev).add(word));
    }
    return word;
  }, [categories, usedWords, currentWord]);

  const scorePoint = useCallback((guesserId?: string) => {
    setPlayers((prev) => {
      const updated = prev.map((p, i) => {
        if (i === currentPlayerIndex) return { ...p, score: p.score + 1 };
        if (guesserScoring && guesserId && p.id === guesserId) return { ...p, score: p.score + 1 };
        return p;
      });
      const scored = updated[currentPlayerIndex];
      if (scored.score >= maxScore) {
        setWinner(scored);
        setPhase('victory');
      }
      // Also check if guesser won
      if (guesserScoring && guesserId) {
        const guesser = updated.find(p => p.id === guesserId);
        if (guesser && guesser.score >= maxScore && !winner) {
          setWinner(guesser);
          setPhase('victory');
        }
      }
      return updated;
    });
    const newWord = getRandomWord(categories, usedWords);
    if (newWord) {
      setCurrentWord(newWord);
      setUsedWords((prev) => new Set(prev).add(newWord));
    }
    return newWord;
  }, [currentPlayerIndex, maxScore, categories, usedWords, guesserScoring, winner]);

  const skipWord = useCallback(() => {
    const newWord = getRandomWord(categories, usedWords);
    if (newWord) {
      setCurrentWord(newWord);
      setUsedWords((prev) => new Set(prev).add(newWord));
    }
    return newWord;
  }, [categories, usedWords]);

  const nextTurn = useCallback(() => {
    setCurrentPlayerIndex((prev) => (prev + 1) % players.length);
    setCurrentWord(null);
  }, [players.length]);

  const resetGame = useCallback(() => {
    setCategoriesState([]);
    setMaxScoreState(10);
    setRoundTimeState(60);
    setGuesserScoringState(true);
    setCurrentPlayerIndex(0);
    setPhase('setup');
    setUsedWords(new Set());
    setWinner(null);
    setCurrentWord(null);
    setPlayers((prev) => prev.map((p) => ({ ...p, score: 0 })));
  }, []);

  const playAgain = useCallback(() => {
    setCurrentPlayerIndex(0);
    setUsedWords(new Set());
    setWinner(null);
    setCurrentWord(null);
    setPlayers((prev) => prev.map((p) => ({ ...p, score: 0 })));
    setPhase('playing');
  }, []);

  const changeRules = useCallback(() => {
    setCurrentPlayerIndex(0);
    setUsedWords(new Set());
    setWinner(null);
    setCurrentWord(null);
    setPlayers((prev) => prev.map((p) => ({ ...p, score: 0 })));
    setPhase('config');
  }, []);

  const goToConfig = useCallback(() => {
    setPhase('config');
  }, []);

  return (
    <GameContext.Provider
      value={{
        players,
        categories,
        maxScore,
        roundTime,
        currentPlayerIndex,
        phase,
        usedWords,
        winner,
        guesserScoring,
        continueUntilTimeout,
        addPlayer,
        removePlayer,
        setCategories: setCategoriesState,
        setMaxScore: setMaxScoreState,
        setRoundTime: setRoundTimeState,
        setGuesserScoring: setGuesserScoringState,
        setContinueUntilTimeout: setContinueUntilTimeoutState,
        startGame,
        scorePoint,
        skipWord,
        nextTurn,
        getCurrentWord,
        resetGame,
        playAgain,
        changeRules,
        goToConfig,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
