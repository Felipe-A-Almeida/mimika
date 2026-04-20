import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, ArrowLeft, Trash2 } from 'lucide-react';
import { useGame } from '@/context/GameContext';
import { getAllCategories, deleteCustomCategory, type CategoryDef } from '@/data/words';
import { Switch } from '@/components/ui/switch';
import AiCategoryGenerator from './AiCategoryGenerator';

const scoreOptions = [5, 10, 15, 20];
const timeOptions = [30, 60, 90];

export default function GameConfig() {
  const { categories, setCategories, maxScore, setMaxScore, roundTime, setRoundTime, guesserScoring, setGuesserScoring, continueUntilTimeout, setContinueUntilTimeout, startGame, resetGame } = useGame();
  const [allCats, setAllCats] = useState<CategoryDef[]>(() => getAllCategories());

  const refresh = () => setAllCats(getAllCategories());

  useEffect(() => { refresh(); }, []);

  const toggleCategory = (id: string) => {
    setCategories(
      categories.includes(id)
        ? categories.filter((c) => c !== id)
        : [...categories, id]
    );
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteCustomCategory(id);
    setCategories(categories.filter((c) => c !== id));
    refresh();
  };

  const handleCreated = (cat: CategoryDef) => {
    refresh();
    if (!categories.includes(cat.id)) setCategories([...categories, cat.id]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-6 w-full max-w-md mx-auto px-4 py-6"
    >
      <button onClick={resetGame} className="self-start flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors font-body">
        <ArrowLeft size={18} /> Voltar
      </button>

      <h2 className="text-3xl font-heading font-extrabold text-primary">⚙️ Configurações</h2>

      <div className="w-full">
        <h3 className="font-heading font-bold text-lg mb-3 text-foreground">Categorias</h3>
        <div className="grid grid-cols-2 gap-2 mb-3">
          {allCats.map((cat) => (
            <div key={cat.id} className="relative">
              <button
                onClick={() => toggleCategory(cat.id)}
                className={`w-full px-4 py-3 rounded-lg font-body font-semibold text-sm transition-all border-2 ${
                  categories.includes(cat.id)
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card text-card-foreground border-border hover:border-primary/50'
                } ${cat.custom ? 'pr-8' : ''}`}
              >
                {cat.label}
              </button>
              {cat.custom && (
                <button
                  onClick={(e) => handleDelete(cat.id, e)}
                  className="absolute top-1/2 -translate-y-1/2 right-2 p-1 rounded text-muted-foreground hover:text-destructive transition-colors"
                  title="Excluir categoria"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
        <AiCategoryGenerator onCreated={handleCreated} />
      </div>

      <div className="w-full">
        <h3 className="font-heading font-bold text-lg mb-3 text-foreground">Pontuação máxima</h3>
        <div className="flex gap-2">
          {scoreOptions.map((s) => (
            <button
              key={s}
              onClick={() => setMaxScore(s)}
              className={`flex-1 py-3 rounded-lg font-heading font-bold text-lg transition-all border-2 ${
                maxScore === s
                  ? 'bg-game-purple text-primary-foreground border-game-purple'
                  : 'bg-card text-card-foreground border-border hover:border-game-purple/50'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full">
        <h3 className="font-heading font-bold text-lg mb-3 text-foreground">Tempo por rodada</h3>
        <div className="flex gap-2">
          {timeOptions.map((t) => (
            <button
              key={t}
              onClick={() => setRoundTime(t)}
              className={`flex-1 py-3 rounded-lg font-heading font-bold text-lg transition-all border-2 ${
                roundTime === t
                  ? 'bg-game-orange text-primary-foreground border-game-orange'
                  : 'bg-card text-card-foreground border-border hover:border-game-orange/50'
              }`}
            >
              {t}s
            </button>
          ))}
        </div>
      </div>

      <div className="w-full flex items-center justify-between bg-card border border-border rounded-lg px-4 py-3">
        <div>
          <h3 className="font-heading font-bold text-base text-foreground">Pontuação para quem acerta</h3>
          <p className="text-xs text-muted-foreground font-body">Quem adivinhar também ganha ponto</p>
        </div>
        <Switch checked={guesserScoring} onCheckedChange={setGuesserScoring} />
      </div>

      <div className="w-full flex items-center justify-between bg-card border border-border rounded-lg px-4 py-3">
        <div>
          <h3 className="font-heading font-bold text-base text-foreground">Continuar até o tempo acabar</h3>
          <p className="text-xs text-muted-foreground font-body">
            {continueUntilTimeout ? 'Trocar palavras até o tempo zerar' : 'Passar a vez assim que alguém acertar'}
          </p>
        </div>
        <Switch checked={continueUntilTimeout} onCheckedChange={setContinueUntilTimeout} />
      </div>

      <button
        onClick={startGame}
        disabled={categories.length === 0}
        className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-accent text-accent-foreground font-heading font-bold text-xl disabled:opacity-40 hover:opacity-90 transition-opacity mt-2"
      >
        <Play size={24} /> Iniciar Jogo!
      </button>
      {categories.length === 0 && (
        <p className="text-sm text-muted-foreground -mt-4">Selecione ao menos 1 categoria</p>
      )}
    </motion.div>
  );
}
