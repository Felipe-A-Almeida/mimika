import { GameProvider, useGame } from '@/context/GameContext';
import PlayerSetup from '@/components/PlayerSetup';
import GameConfig from '@/components/GameConfig';
import GamePlay from '@/components/GamePlay';
import VictoryScreen from '@/components/VictoryScreen';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';

function GameRouter() {
  const { phase } = useGame();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO
        title="Mimika - Jogo de Mímica Online Grátis para Jogar com Amigos"
        description="Mimika é o jogo de mímica online grátis para jogar no navegador com amigos e família. Sem download, sem cadastro. Crie categorias com IA e divirta-se!"
        canonicalPath="/"
      />
      <main className="flex-1 flex flex-col items-center justify-center py-8 px-4">
        {phase === 'setup' && (
          <header className="text-center max-w-2xl mb-6">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
              Mimika — Jogo de Mímica Online Grátis
            </h1>
            <p className="text-muted-foreground text-base md:text-lg">
              Jogue mímica online no navegador com amigos e família. Sem download,
              sem cadastro. Crie categorias personalizadas com inteligência artificial
              e divirta-se em festas, reuniões e encontros.
            </p>
          </header>
        )}

        {phase === 'setup' && <PlayerSetup />}
        {phase === 'config' && <GameConfig />}
        {phase === 'playing' && <GamePlay />}
        {phase === 'victory' && <VictoryScreen />}

        {phase === 'setup' && (
          <section className="max-w-3xl mt-12 text-foreground space-y-8 px-2">
            <div>
              <h2 className="text-2xl font-semibold mb-2">
                Como jogar mímica online
              </h2>
              <p className="text-muted-foreground">
                O Mimika é um jogo de mímica online gratuito. Cadastre os jogadores,
                escolha as categorias de palavras, defina o tempo de cada rodada e
                a pontuação para vencer. A cada turno, um jogador faz a mímica
                enquanto os outros tentam adivinhar a palavra. Quem acertar mais,
                vence!
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-2">
                Categorias de mímica com IA
              </h2>
              <p className="text-muted-foreground">
                Além das categorias prontas (filmes, animais, profissões, objetos,
                ações e muito mais), você pode criar suas próprias categorias usando
                inteligência artificial. Digite um tema como "desenhos animados",
                "comidas brasileiras" ou "esportes" e receba uma lista de palavras
                para jogar mímica.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-2">
                Por que jogar mímica?
              </h2>
              <p className="text-muted-foreground">
                A mímica é um dos jogos mais clássicos para festas, reuniões em
                família, salas de aula e atividades em grupo. Estimula a
                criatividade, a comunicação não-verbal e garante muita risada.
                Com o Mimika, você joga online direto do celular, tablet ou
                computador — sem precisar instalar nada.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-2">
                Perguntas frequentes
              </h2>
              <dl className="space-y-4">
                <div>
                  <dt className="font-semibold">O Mimika é grátis?</dt>
                  <dd className="text-muted-foreground">
                    Sim, o jogo é 100% gratuito. Não exige cadastro nem instalação.
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold">
                    Funciona no celular?
                  </dt>
                  <dd className="text-muted-foreground">
                    Sim, o Mimika funciona em qualquer navegador moderno: celular,
                    tablet ou computador.
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold">
                    Quantos jogadores podem participar?
                  </dt>
                  <dd className="text-muted-foreground">
                    Você pode jogar a partir de 2 jogadores, sem limite máximo.
                    Ótimo para festas e reuniões em família.
                  </dd>
                </div>
              </dl>
            </div>
          </section>
        )}
      </main>
      <Footer />
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
