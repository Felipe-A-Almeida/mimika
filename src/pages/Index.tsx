import { GameProvider, useGame } from '@/context/GameContext';
import PlayerSetup from '@/components/PlayerSetup';
import GameConfig from '@/components/GameConfig';
import GamePlay from '@/components/GamePlay';
import VictoryScreen from '@/components/VictoryScreen';

function GameRouter() {
  const { phase } = useGame();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-8">
      {phase === 'setup' && <PlayerSetup />}
      {phase === 'config' && <GameConfig />}
      {phase === 'playing' && <GamePlay />}
      {phase === 'victory' && <VictoryScreen />}
    </div>
  );
}

export default function Index() {
  return (
    <GameProvider>
      <GameRouter />
    </GameProvider>
  );
}
