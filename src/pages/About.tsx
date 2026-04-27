import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Footer from '@/components/Footer';

export default function About() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <article className="max-w-3xl w-full mx-auto flex-1 py-12 px-4">
        <h1 className="text-4xl font-bold mb-2 text-foreground">Sobre o Mimika</h1>
        <p className="text-muted-foreground mb-8">
          Conheça o projeto, como ele funciona e quem está por trás dele.
        </p>

        <section className="space-y-6 text-foreground">
          <div>
            <h2 className="text-2xl font-semibold mb-2">O que é o Mimika?</h2>
            <p>
              O Mimika é um aplicativo web gratuito para jogar o clássico jogo de mímica
              com seus amigos e família. Sem necessidade de cadastro, sem download e sem
              instalação — basta abrir no navegador e começar a jogar.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-2">Como funciona?</h2>
            <ol className="list-decimal list-inside space-y-2">
              <li>Cadastre os jogadores que vão participar da partida.</li>
              <li>Configure o tempo por rodada, pontuação para vencer e categorias.</li>
              <li>
                A cada rodada, um jogador faz a mímica enquanto os outros tentam adivinhar
                a palavra.
              </li>
              <li>
                Ao acertar, basta clicar no nome de quem acertou ou no nome do jogador da
                vez para somar pontos.
              </li>
              <li>
                O primeiro a atingir a pontuação alvo vence! Você pode jogar várias
                rodadas.
              </li>
            </ol>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-2">Categorias com IA</h2>
            <p>
              Além das categorias prontas, você pode criar suas próprias categorias usando
              inteligência artificial. Basta digitar um tema (ex: "filmes dos anos 90",
              "animais marinhos", "comidas brasileiras") e a IA gera uma lista de palavras
              relacionadas para você jogar.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-2">Privacidade</h2>
            <p>
              O jogo roda inteiramente no seu navegador. Não exigimos cadastro nem
              coletamos dados pessoais identificáveis. Saiba mais na nossa{' '}
              <Link to="/privacy-policy" className="text-primary underline">
                Política de Privacidade
              </Link>
              .
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-2">Quem criou?</h2>
            <p>
              O Mimika é um projeto independente, criado com o objetivo de oferecer uma
              forma simples e divertida de reunir as pessoas em momentos de lazer. Para
              dúvidas, sugestões ou parcerias, entre em contato pela página de{' '}
              <Link to="/contact" className="text-primary underline">contato</Link>.
            </p>
          </div>

          <hr className="my-8 border-border" />

          <p className="text-sm text-muted-foreground">
            <strong>Responsável pelo site:</strong> Mimika<br />
            <strong>País:</strong> Brasil<br />
            <strong>Contato:</strong> mimika_suporte@outlook.com
          </p>
        </section>

        <div className="mt-10">
          <Button asChild>
            <Link to="/">Começar a jogar</Link>
          </Button>
        </div>
      </article>
      <Footer />
    </div>
  );
}
