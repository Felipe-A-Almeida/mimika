export type Category = string; // builtin keys ou ids customizados (ex: "custom-xxxx")

export type CategoryDef = {
  id: Category;
  label: string; // já com emoji ex: "🐾 Animais"
  emoji: string;
  words: string[];
  custom?: boolean;
};

const builtins: CategoryDef[] = [
  {
    id: 'animais',
    emoji: '🐾',
    label: '🐾 Animais',
    words: [
      'Cachorro', 'Gato', 'Leão', 'Elefante', 'Tubarão', 'Macaco', 'Cavalo',
      'Girafa', 'Pinguim', 'Cobra', 'Águia', 'Tartaruga', 'Coelho', 'Urso',
      'Papagaio', 'Jacaré', 'Borboleta', 'Polvo', 'Gorila', 'Canguru',
      'Camaleão', 'Flamingo', 'Baleia', 'Formiga', 'Aranha',
    ],
  },
  {
    id: 'filmes',
    emoji: '🎬',
    label: '🎬 Filmes',
    words: [
      'Titanic', 'Avatar', 'Homem-Aranha', 'Vingadores', 'Frozen',
      'Jurassic Park', 'Matrix', 'Rei Leão', 'Harry Potter', 'Star Wars',
      'Toy Story', 'Batman', 'Procurando Nemo', 'Shrek', 'Piratas do Caribe',
      'Rocky', 'ET', 'Indiana Jones', 'Ghostbusters', 'Tubarão',
      'Missão Impossível', 'Kung Fu Panda', 'Moana', 'Encanto', 'Up',
    ],
  },
  {
    id: 'profissoes',
    emoji: '👷',
    label: '👷 Profissões',
    words: [
      'Médico', 'Professor', 'Bombeiro', 'Policial', 'Cozinheiro',
      'Dentista', 'Piloto', 'Astronauta', 'Pintor', 'Fotógrafo',
      'Veterinário', 'Pescador', 'Carteiro', 'Mecânico', 'Padeiro',
      'Jardineiro', 'Cientista', 'Mágico', 'Palhaço', 'Surfista',
      'Cantor', 'Dançarino', 'Mergulhador', 'Carpinteiro', 'Barbeiro',
    ],
  },
  {
    id: 'esportes',
    emoji: '⚽',
    label: '⚽ Esportes',
    words: [
      'Futebol', 'Basquete', 'Vôlei', 'Natação', 'Tênis',
      'Boxe', 'Surf', 'Skate', 'Ciclismo', 'Corrida',
      'Judô', 'Karatê', 'Ginástica', 'Golfe', 'Hóquei',
      'Escalada', 'Arco e Flecha', 'Esgrima', 'Mergulho', 'Handebol',
      'Beisebol', 'Patinação', 'Luta Livre', 'Polo Aquático', 'Remo',
    ],
  },
  {
    id: 'objetos',
    emoji: '📦',
    label: '📦 Objetos',
    words: [
      'Televisão', 'Guitarra', 'Relógio', 'Guarda-chuva', 'Espelho',
      'Telescópio', 'Bicicleta', 'Escada', 'Chave', 'Tesoura',
      'Martelo', 'Violão', 'Câmera', 'Binóculo', 'Microscópio',
      'Ventilador', 'Aspirador', 'Máquina de Lavar', 'Geladeira', 'Fogão',
      'Cadeira de Rodas', 'Skate', 'Patins', 'Trampolim', 'Balanço',
    ],
  },
  {
    id: 'acoes',
    emoji: '🏃',
    label: '🏃 Ações',
    words: [
      'Dormir', 'Correr', 'Dançar', 'Cozinhar', 'Nadar',
      'Voar', 'Pescar', 'Dirigir', 'Escalar', 'Pintar',
      'Cantar', 'Ler', 'Surfar', 'Meditar', 'Fotografar',
      'Patinar', 'Pular corda', 'Jogar futebol', 'Tocar guitarra', 'Andar de bicicleta',
      'Fazer malabarismo', 'Tirar selfie', 'Varrer', 'Passar roupa', 'Lavar louça',
    ],
  },
];

const STORAGE_KEY = 'mimica:custom-categories';
const RATE_KEY = 'mimica:last-ai-gen';
export const MAX_CUSTOM_CATEGORIES = 20;

function safeGetItem(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetItem(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export function loadCustomCategories(): CategoryDef[] {
  try {
    const raw = safeGetItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export class CustomCategoryLimitError extends Error {
  constructor() {
    super(`Limite de ${MAX_CUSTOM_CATEGORIES} categorias customizadas atingido.`);
    this.name = 'CustomCategoryLimitError';
  }
}

export function saveCustomCategory(cat: CategoryDef) {
  const existing = loadCustomCategories();
  const isNew = !existing.some((c) => c.id === cat.id);
  if (isNew && existing.length >= MAX_CUSTOM_CATEGORIES) {
    throw new CustomCategoryLimitError();
  }
  const updated = [...existing.filter((c) => c.id !== cat.id), cat];
  safeSetItem(STORAGE_KEY, JSON.stringify(updated));
}

export function deleteCustomCategory(id: string) {
  const existing = loadCustomCategories().filter((c) => c.id !== id);
  safeSetItem(STORAGE_KEY, JSON.stringify(existing));
}

export function getAllCategories(): CategoryDef[] {
  return [...builtins, ...loadCustomCategories()];
}

export const builtinCategories = builtins;

// localStorage rate limit (UX layer, server enforces real limit)
export function getLastAiGen(): number | null {
  const v = safeGetItem(RATE_KEY);
  return v ? Number(v) : null;
}
export function markAiGen() {
  safeSetItem(RATE_KEY, String(Date.now()));
}
export function canGenerateAi(): boolean {
  const last = getLastAiGen();
  if (!last) return true;
  return Date.now() - last >= 24 * 60 * 60 * 1000;
}

export function getRandomWord(categories: Category[], usedWords: Set<string>): string | null {
  const all = getAllCategories();
  const available = categories
    .flatMap((catId) => all.find((c) => c.id === catId)?.words ?? [])
    .filter((w) => !usedWords.has(w));
  if (available.length === 0) return null;
  return available[Math.floor(Math.random() * available.length)];
}

// Backward-compat para imports antigos
export const categoryLabels: Record<string, string> = Object.fromEntries(
  builtins.map((c) => [c.id, c.label]),
);
export const categoryEmojis: Record<string, string> = Object.fromEntries(
  builtins.map((c) => [c.id, c.emoji]),
);
