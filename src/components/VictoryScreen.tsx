import { motion } from 'framer-motion';
import { RotateCcw, Settings, Home } from 'lucide-react';
import { useGame } from '@/context/GameContext';

export default function VictoryScreen() {
  const { winner, players, resetGame, playAgain, changeRules } = useGame();

  const sorted = [...players].sort((a, b) => b.score - a.score);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-6 w-full max-w-md mx-auto px-4 text-center"
    >
      <motion.div
        animate={{ rotate: [0, -10, 10, -10, 0] }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-7xl"
      >
        🏆
      </motion.div>

      <h1 className="text-4xl font-heading font-extrabold text-primary">
        {winner?.name} venceu!
      </h1>

      <p className="text-muted-foreground font-body text-lg">
        Com {winner?.score} pontos!
      </p>

      <div className="w-full space-y-2 mt-4">
        <h3 className="font-heading font-bold text-lg text-foreground">Placar final</h3>
        {sorted.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`flex items-center justify-between px-4 py-3 rounded-lg font-body ${
              i === 0
                ? 'bg-secondary text-secondary-foreground font-bold'
                : 'bg-card text-card-foreground border border-border'
            }`}
          >
            <span>
              {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`} {p.name}
            </span>
            <span className="font-heading font-bold text-lg">{p.score}</span>
          </motion.div>
        ))}
      </div>

      <div className="w-full flex flex-col gap-3 mt-4">
        <button
          onClick={playAgain}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-primary text-primary-foreground font-heading font-bold text-xl hover:opacity-90 transition-opacity"
        >
          <RotateCcw size={24} /> Jogar novamente
        </button>

        <button
          onClick={changeRules}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-secondary text-secondary-foreground font-heading font-bold text-lg hover:opacity-90 transition-opacity"
        >
          <Settings size={20} /> Mudar regras
        </button>

        <button
          onClick={resetGame}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-muted text-muted-foreground font-body font-semibold hover:bg-muted/80 transition-colors"
        >
          <Home size={18} /> Tela inicial
        </button>
      </div>
    </motion.div>
  );
}
