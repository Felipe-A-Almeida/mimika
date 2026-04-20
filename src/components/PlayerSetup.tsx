import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Users, ArrowRight } from 'lucide-react';
import { useGame } from '@/context/GameContext';

const playerColors = [
  'bg-primary', 'bg-game-purple', 'bg-game-orange', 'bg-accent',
  'bg-game-blue', 'bg-game-green',
];

export default function PlayerSetup() {
  const { players, addPlayer, removePlayer, goToConfig } = useGame();
  const [name, setName] = useState('');

  const handleAdd = () => {
    const trimmed = name.trim();
    if (trimmed && players.length < 10) {
      addPlayer(trimmed);
      setName('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-8 w-full max-w-md mx-auto px-4"
    >
      <div className="text-center">
        <motion.h1
          className="text-5xl font-heading font-extrabold text-primary mb-2"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          🎭 Mímicas
        </motion.h1>
        <p className="text-muted-foreground font-body text-lg">
          Adicione os jogadores para começar!
        </p>
      </div>

      <div className="flex gap-2 w-full">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Nome do jogador..."
          maxLength={20}
          className="flex-1 px-4 py-3 rounded-lg border-2 border-border bg-card text-card-foreground font-body text-lg focus:outline-none focus:border-primary transition-colors"
        />
        <button
          onClick={handleAdd}
          disabled={!name.trim() || players.length >= 10}
          className="px-4 py-3 rounded-lg bg-primary text-primary-foreground font-bold text-lg disabled:opacity-40 hover:opacity-90 transition-opacity"
        >
          <Plus size={24} />
        </button>
      </div>

      <div className="w-full min-h-[120px]">
        <div className="flex items-center gap-2 mb-3">
          <Users size={20} className="text-muted-foreground" />
          <span className="text-muted-foreground font-body font-semibold">
            Jogadores ({players.length})
          </span>
        </div>
        <AnimatePresence mode="popLayout">
          {players.map((player, i) => (
            <motion.div
              key={player.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, x: -100 }}
              className={`flex items-center justify-between mb-2 px-4 py-3 rounded-lg ${playerColors[i % playerColors.length]} text-primary-foreground`}
            >
              <span className="font-heading font-bold text-lg">{player.name}</span>
              <button
                onClick={() => removePlayer(player.id)}
                className="opacity-70 hover:opacity-100 transition-opacity"
              >
                <X size={20} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        {players.length === 0 && (
          <p className="text-center text-muted-foreground py-8 font-body">
            Nenhum jogador adicionado ainda
          </p>
        )}
      </div>

      <button
        onClick={goToConfig}
        disabled={players.length < 2}
        className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-accent text-accent-foreground font-heading font-bold text-xl disabled:opacity-40 hover:opacity-90 transition-opacity"
      >
        Configurar jogo <ArrowRight size={24} />
      </button>
      {players.length < 2 && players.length > 0 && (
        <p className="text-sm text-muted-foreground -mt-4">Mínimo 2 jogadores</p>
      )}
    </motion.div>
  );
}
