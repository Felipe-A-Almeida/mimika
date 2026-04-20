import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Check, SkipForward, Timer, RotateCcw, X } from 'lucide-react';
import { useGame } from '@/context/GameContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function GamePlay() {
  const {
    players, currentPlayerIndex, roundTime, guesserScoring, continueUntilTimeout,
    getCurrentWord, scorePoint, skipWord, nextTurn, resetGame,
  } = useGame();

  const [wordVisible, setWordVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(roundTime);
  const [timerActive, setTimerActive] = useState(false);
  const [word, setWord] = useState<string | null>(null);
  const [showGuesserModal, setShowGuesserModal] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [feedback, setFeedback] = useState<string[]>([]);

  const currentPlayer = players[currentPlayerIndex];

  const showFeedback = (messages: string[]) => {
    setFeedback(messages);
    setTimeout(() => setFeedback([]), 2000);
  };

  const handleShowWord = useCallback(() => {
    const w = getCurrentWord();
    setWord(w);
    setWordVisible(true);
    setTimerActive(true);
    setTimeLeft(roundTime);
  }, [getCurrentWord, roundTime]);

  const handleScore = useCallback(() => {
    if (guesserScoring && players.length > 2) {
      setShowGuesserModal(true);
      return;
    }
    // If only 2 players, auto-select the other one
    if (guesserScoring && players.length === 2) {
      const guesserId = players.find((_, i) => i !== currentPlayerIndex)!.id;
      const guesser = players.find(p => p.id === guesserId)!;
      scorePoint(guesserId);
      showFeedback([`+1 para ${currentPlayer.name}`, `+1 para ${guesser.name}`]);
    } else {
      scorePoint();
      showFeedback([`+1 para ${currentPlayer.name}`]);
    }
    if (!continueUntilTimeout) {
      setWordVisible(false);
      setTimerActive(false);
      setWord(null);
      nextTurn();
    } else {
      const w = getCurrentWord();
      setWord(w);
    }
  }, [scorePoint, getCurrentWord, guesserScoring, players, currentPlayerIndex, currentPlayer, continueUntilTimeout, nextTurn]);

  const handleSelectGuesser = useCallback((guesserId: string) => {
    const guesser = players.find(p => p.id === guesserId)!;
    setShowGuesserModal(false);
    scorePoint(guesserId);
    showFeedback([`+1 para ${currentPlayer.name}`, `+1 para ${guesser.name}`]);
    if (!continueUntilTimeout) {
      setWordVisible(false);
      setTimerActive(false);
      setWord(null);
      nextTurn();
    } else {
      const w = getCurrentWord();
      setWord(w);
    }
  }, [scorePoint, getCurrentWord, players, currentPlayer, continueUntilTimeout, nextTurn]);

  const handleSkip = useCallback(() => {
    const w = skipWord();
    setWord(w);
  }, [skipWord]);

  const handleEndTurn = useCallback(() => {
    setWordVisible(false);
    setTimerActive(false);
    setWord(null);
    nextTurn();
  }, [nextTurn]);

  useEffect(() => {
    if (!timerActive || timeLeft <= 0) {
      if (timeLeft <= 0 && timerActive) {
        setTimerActive(false);
      }
      return;
    }
    const interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const timerPercent = (timeLeft / roundTime) * 100;
  const timerColor = timeLeft <= 10 ? 'text-destructive' : timeLeft <= 20 ? 'text-game-orange' : 'text-accent';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center gap-4 w-full max-w-md mx-auto px-4"
    >
      {/* Feedback toast */}
      <AnimatePresence>
        {feedback.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-1"
          >
            {feedback.map((msg, i) => (
              <div key={i} className="bg-game-green text-primary-foreground px-4 py-2 rounded-lg font-heading font-bold text-sm shadow-lg">
                {msg}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Guesser selection modal */}
      <AnimatePresence>
        {showGuesserModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card border border-border rounded-2xl p-6 w-full max-w-sm shadow-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading font-bold text-xl text-foreground">Quem acertou?</h3>
                <button onClick={() => setShowGuesserModal(false)} className="text-muted-foreground hover:text-foreground">
                  <X size={20} />
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {players.filter((_, i) => i !== currentPlayerIndex).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleSelectGuesser(p.id)}
                    className="w-full py-3 px-4 rounded-lg bg-primary/10 hover:bg-primary/20 text-foreground font-heading font-bold text-lg transition-colors border border-border hover:border-primary"
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scoreboard - clicar para pontuar (apenas com timer ativo) */}
      <div className="w-full flex flex-wrap gap-2 justify-center mb-2">
        {players.map((p, i) => {
          const canScore = wordVisible && timerActive && timeLeft > 0;
          return (
            <button
              key={p.id}
              disabled={!canScore}
              onClick={() => {
                if (!canScore) return;
                const isCurrent = p.id === currentPlayer.id;
                if (isCurrent || !guesserScoring) {
                  scorePoint();
                  showFeedback([`+1 para ${currentPlayer.name}`]);
                } else {
                  scorePoint(p.id);
                  showFeedback([`+1 para ${currentPlayer.name}`, `+1 para ${p.name}`]);
                }
                if (!continueUntilTimeout) {
                  setWordVisible(false);
                  setTimerActive(false);
                  setWord(null);
                  nextTurn();
                } else {
                  const w = getCurrentWord();
                  setWord(w);
                }
              }}
              className={`px-3 py-2 rounded-lg font-heading font-bold text-sm transition-all ${
                canScore ? 'hover:scale-105 active:scale-95 cursor-pointer' : 'cursor-not-allowed opacity-70'
              } ${
                i === currentPlayerIndex
                  ? 'bg-primary text-primary-foreground scale-110 shadow-lg'
                  : 'bg-card text-card-foreground border border-border hover:border-primary'
              }`}
            >
              {p.name}: <span className="text-lg">{p.score}</span>
            </button>
          );
        })}
      </div>

      {/* Current player */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPlayer.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="text-center"
        >
          <p className="text-muted-foreground font-body">
            {wordVisible ? 'Vez de' : 'Quem fará a mímica'}
          </p>
          <h2
            onClick={() => {
              if (!wordVisible || !timerActive || timeLeft <= 0) return;
              scorePoint();
              showFeedback([`+1 para ${currentPlayer.name}`]);
              if (!continueUntilTimeout) {
                setWordVisible(false);
                setTimerActive(false);
                setWord(null);
                nextTurn();
              } else {
                const w = getCurrentWord();
                setWord(w);
              }
            }}
            className={`text-4xl font-heading font-extrabold text-primary animate-pulse-scale ${
              wordVisible && timerActive && timeLeft > 0 ? 'cursor-pointer hover:scale-105 active:scale-95 transition-transform' : ''
            }`}
          >
            {currentPlayer.name}
          </h2>
          {!wordVisible && (
            <p className="text-sm text-muted-foreground font-body mt-2">
              Toque em "Mostrar Palavra" para iniciar o tempo
            </p>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Timer */}
      {timerActive && (
        <div className="flex flex-col items-center gap-2 w-full">
          <div className={`flex items-center gap-2 font-heading text-4xl font-extrabold ${timerColor}`}>
            <Timer size={32} />
            {timeLeft}s
          </div>
          <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-accent rounded-full"
              initial={{ width: '100%' }}
              animate={{ width: `${timerPercent}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}

      {/* Word area */}
      {!wordVisible ? (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleShowWord}
          className="w-full py-8 rounded-2xl bg-primary text-primary-foreground font-heading font-bold text-2xl flex items-center justify-center gap-3 shadow-lg hover:opacity-90 transition-opacity"
        >
          <Eye size={32} /> Mostrar Palavra
        </motion.button>
      ) : (
        <motion.div
          initial={{ rotateY: 90 }}
          animate={{ rotateY: 0 }}
          className="w-full"
        >
          {timeLeft > 0 ? (
            <>
              <div className="w-full py-8 rounded-2xl bg-card border-2 border-primary text-center shadow-xl mb-4">
                <p className="text-muted-foreground font-body text-sm mb-1">Palavra secreta</p>
                <p className="text-4xl font-heading font-extrabold text-primary">
                  {word || '—'}
                </p>
              </div>

              <div className="flex gap-3 w-full">
                <button
                  onClick={handleScore}
                  className="flex-1 py-4 rounded-xl bg-game-green text-primary-foreground font-heading font-bold text-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                >
                  <Check size={24} /> Acertaram!
                </button>
                <button
                  onClick={handleSkip}
                  className="flex-1 py-4 rounded-xl bg-game-orange text-primary-foreground font-heading font-bold text-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                >
                  <SkipForward size={24} /> Pular
                </button>
              </div>
            </>
          ) : (
            <div className="text-center">
              <p className="text-2xl font-heading font-bold text-destructive mb-4">⏰ Tempo esgotado!</p>
              <button
                onClick={handleEndTurn}
                className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-heading font-bold text-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                <SkipForward size={24} /> Próximo jogador
              </button>
            </div>
          )}
        </motion.div>
      )}

      {/* Pass turn / Reset */}
      {wordVisible && timeLeft > 0 && (
        <button
          onClick={handleEndTurn}
          className="w-full py-3 rounded-lg bg-muted text-muted-foreground font-body font-semibold hover:bg-muted/80 transition-colors"
        >
          Passar vez →
        </button>
      )}

      <button
        onClick={() => setShowResetConfirm(true)}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mt-4 font-body"
      >
        <RotateCcw size={16} /> Reiniciar jogo
      </button>

      <AlertDialog open={showResetConfirm} onOpenChange={setShowResetConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reiniciar jogo?</AlertDialogTitle>
            <AlertDialogDescription>
              Os jogadores serão mantidos, mas o placar e as configurações serão resetados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={resetGame}>Reiniciar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
