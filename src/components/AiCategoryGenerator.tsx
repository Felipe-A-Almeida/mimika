import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2, X, Check, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { saveCustomCategory, canGenerateAi, markAiGen, getLastAiGen, CustomCategoryLimitError, type CategoryDef } from '@/data/words';
import { toast } from 'sonner';
import { z } from 'zod';

const promptSchema = z
  .string()
  .trim()
  .min(3, 'Descreva sua categoria com pelo menos 3 caracteres.')
  .max(200, 'Máximo de 200 caracteres.');

type Difficulty = 'facil' | 'medio' | 'dificil';

interface Props {
  onCreated: (cat: CategoryDef) => void;
}

function messageFromInvokeError(error: unknown, fallback: string): string {
  const body = (error as { context?: { body?: string }; message?: string })?.context?.body;
  if (typeof body !== "string" || !body) return (error as Error)?.message ?? fallback;
  try {
    const parsed = JSON.parse(body) as { error?: string };
    return typeof parsed.error === "string" ? parsed.error : fallback;
  } catch {
    return (error as Error)?.message ?? fallback;
  }
}

const difficulties: { id: Difficulty; label: string; activeClass: string }[] = [
  { id: 'facil', label: '😊 Fácil', activeClass: 'bg-game-green text-primary-foreground border-game-green' },
  { id: 'medio', label: '🤔 Médio', activeClass: 'bg-game-orange text-primary-foreground border-game-orange' },
  { id: 'dificil', label: '🔥 Difícil', activeClass: 'bg-destructive text-destructive-foreground border-destructive' },
];

function formatHoursLeft(): string {
  const last = getLastAiGen();
  if (!last) return '';
  const remaining = 24 * 60 * 60 * 1000 - (Date.now() - last);
  if (remaining <= 0) return '';
  const h = Math.ceil(remaining / (60 * 60 * 1000));
  return `Volte em ~${h}h`;
}

export default function AiCategoryGenerator({ onCreated }: Props) {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('medio');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<{ name: string; emoji: string; words: string[] } | null>(null);
  const [excluded, setExcluded] = useState<Set<string>>(new Set());

  const allowedToGenerate = canGenerateAi();

  const handleGenerate = async () => {
    const parsed = promptSchema.safeParse(prompt);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? 'Prompt inválido');
      return;
    }
    if (!allowedToGenerate) {
      toast.error('Você já gerou hoje. ' + formatHoursLeft());
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-category', {
        body: { prompt: parsed.data, difficulty },
      });
      if (error) {
        toast.error(messageFromInvokeError(error, 'Erro ao gerar categoria'));
        if ((error as { status?: number })?.status === 429) markAiGen();
        return;
      }
      if (data?.error) {
        toast.error(data.error);
        if (data.rateLimited) markAiGen();
        return;
      }
      markAiGen();
      setPreview(data);
      setExcluded(new Set());
    } catch (e) {
      console.error(e);
      toast.error('Falha ao gerar categoria');
    } finally {
      setLoading(false);
    }
  };

  const toggleWord = (w: string) => {
    setExcluded((prev) => {
      const next = new Set(prev);
      if (next.has(w)) next.delete(w);
      else next.add(w);
      return next;
    });
  };

  const handleSave = () => {
    if (!preview) return;
    const finalWords = preview.words.filter((w) => !excluded.has(w));
    if (finalWords.length < 5) {
      toast.error('Selecione ao menos 5 palavras');
      return;
    }
    const id = `custom-${Date.now()}`;
    const cat: CategoryDef = {
      id,
      emoji: preview.emoji,
      label: `${preview.emoji} ${preview.name}`,
      words: finalWords,
      custom: true,
    };
    try {
      saveCustomCategory(cat);
    } catch (e) {
      if (e instanceof CustomCategoryLimitError) {
        toast.error(e.message + ' Apague alguma antes de criar nova.');
      } else {
        toast.error('Não foi possível salvar a categoria.');
      }
      return;
    }
    onCreated(cat);
    toast.success(`Categoria "${preview.name}" criada!`);
    setOpen(false);
    setPreview(null);
    setPrompt('');
  };

  const handleClose = () => {
    setOpen(false);
    setPreview(null);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed border-game-purple/50 text-game-purple hover:bg-game-purple/5 font-heading font-bold text-sm transition-colors"
      >
        <Sparkles size={18} /> Criar categoria com IA
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={handleClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card border border-border rounded-2xl p-6 w-full max-w-lg shadow-xl my-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading font-bold text-2xl text-foreground flex items-center gap-2">
                  <Sparkles className="text-game-purple" size={24} /> Categoria por IA
                </h3>
                <button onClick={handleClose} className="text-muted-foreground hover:text-foreground">
                  <X size={20} />
                </button>
              </div>

              {!preview ? (
                <>
                  <p className="text-sm text-muted-foreground font-body mb-2">
                    Descreva o tema e a IA cria 50 palavras mimicáveis.{' '}
                    <span className="font-semibold">Limite: 1 vez por dia.</span>
                  </p>
                  <p className="text-xs text-muted-foreground/80 font-body mb-4">
                    🔒 Seu prompt é salvo de forma anônima por até 7 dias para auditoria de uso indevido.
                  </p>

                  <label className="block font-heading font-bold text-sm mb-2 text-foreground">
                    Sua categoria
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value.slice(0, 200))}
                    placeholder="Ex: comidas típicas brasileiras, personagens de desenho dos anos 90..."
                    rows={3}
                    disabled={loading || !allowedToGenerate}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground font-body text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                  />
                  <p className="text-xs text-muted-foreground text-right mt-1">{prompt.length}/200</p>

                  <label className="block font-heading font-bold text-sm mt-4 mb-2 text-foreground">
                    Dificuldade
                  </label>
                  <div className="flex gap-2">
                    {difficulties.map((d) => (
                      <button
                        key={d.id}
                        onClick={() => setDifficulty(d.id)}
                        disabled={loading}
                        className={`flex-1 py-2 px-3 rounded-lg font-heading font-bold text-sm transition-all border-2 ${
                          difficulty === d.id
                            ? d.activeClass
                            : 'bg-card text-card-foreground border-border hover:border-foreground/30'
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>

                  {!allowedToGenerate && (
                    <div className="mt-4 p-3 rounded-lg bg-muted text-muted-foreground text-sm font-body text-center">
                      ⏳ Você já gerou uma categoria hoje. {formatHoursLeft()}
                    </div>
                  )}

                  <button
                    onClick={handleGenerate}
                    disabled={loading || !allowedToGenerate || !prompt.trim()}
                    className="w-full mt-4 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-game-purple text-primary-foreground font-heading font-bold text-lg disabled:opacity-40 hover:opacity-90 transition-opacity"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin" size={20} /> Gerando...
                      </>
                    ) : (
                      <>
                        <Sparkles size={20} /> Gerar 50 palavras
                      </>
                    )}
                  </button>
                </>
              ) : (
                <>
                  <div className="bg-muted/50 rounded-lg p-3 mb-3">
                    <p className="text-xs text-muted-foreground font-body">Categoria gerada</p>
                    <p className="text-2xl font-heading font-extrabold text-foreground">
                      {preview.emoji} {preview.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {preview.words.length - excluded.size} de {preview.words.length} palavras selecionadas. Toque para remover.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 max-h-64 overflow-y-auto p-1">
                    {preview.words.map((w) => {
                      const isExcluded = excluded.has(w);
                      return (
                        <button
                          key={w}
                          onClick={() => toggleWord(w)}
                          className={`px-2.5 py-1 rounded-full text-xs font-body font-semibold transition-all flex items-center gap-1 ${
                            isExcluded
                              ? 'bg-muted text-muted-foreground line-through'
                              : 'bg-game-green/15 text-game-green border border-game-green/30'
                          }`}
                        >
                          {isExcluded ? <Trash2 size={12} /> : <Check size={12} />}
                          {w}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => setPreview(null)}
                      className="flex-1 py-3 rounded-xl bg-muted text-foreground font-heading font-bold hover:opacity-90 transition-opacity"
                    >
                      Voltar
                    </button>
                    <button
                      onClick={handleSave}
                      className="flex-1 py-3 rounded-xl bg-accent text-accent-foreground font-heading font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                    >
                      <Check size={20} /> Salvar
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
