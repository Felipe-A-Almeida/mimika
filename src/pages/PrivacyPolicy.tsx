import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO
        title="Política de Privacidade - Mimika"
        description="Política de privacidade do Mimika, jogo de mímica online gratuito. Saiba como tratamos seus dados."
      />
      <article className="max-w-3xl w-full mx-auto prose prose-invert flex-1 py-12 px-4">
        <h1 className="text-4xl font-bold mb-2 text-foreground">Política de Privacidade</h1>
        <p className="text-muted-foreground mb-8">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>

        <section className="space-y-4 text-foreground">
          <h2 className="text-2xl font-semibold">1. Informações que coletamos</h2>
          <p>
            Este aplicativo de mímica é executado inteiramente no seu navegador. Não coletamos
            dados pessoais identificáveis de forma direta. Os nomes dos jogadores e
            configurações da partida são armazenados apenas localmente no seu dispositivo
            durante a sessão.
          </p>

          <h2 className="text-2xl font-semibold">2. Geração de categorias por IA</h2>
          <p>
            Ao usar a funcionalidade de geração de categorias por IA, o tema digitado é enviado
            ao nosso provedor de IA apenas para gerar palavras relacionadas.
          </p>
          <p>
            Registramos temporariamente o endereço IP para fins de controle de uso dessa
            funcionalidade (limite de 1 geração a cada 24h por IP), com o objetivo de evitar
            abusos. Esses dados não são utilizados para identificação pessoal e não são
            compartilhados com terceiros. A base legal para esse tratamento, conforme a LGPD,
            é o legítimo interesse do controlador em garantir a segurança e disponibilidade do
            serviço.
          </p>

          <h2 className="text-2xl font-semibold">3. Cookies próprios</h2>
          <p>
            Não utilizamos cookies próprios para rastreamento ou análise de comportamento.
          </p>

          <h2 className="text-2xl font-semibold">4. Publicidade e cookies de terceiros</h2>
          <p>
            Este site pode exibir anúncios fornecidos por terceiros, como o Google AdSense.
            Esses provedores podem utilizar cookies ou tecnologias semelhantes para exibir
            anúncios relevantes com base em suas visitas a este e a outros sites.
          </p>
          <p>
            Você pode desativar a personalização de anúncios a qualquer momento nas
            configurações do Google em{' '}
            <a
              href="https://www.google.com/settings/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              google.com/settings/ads
            </a>
            . Para mais informações sobre como o Google utiliza dados,
            acesse{' '}
            <a
              href="https://policies.google.com/technologies/partner-sites"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              policies.google.com/technologies/partner-sites
            </a>
            .
          </p>

          <h2 className="text-2xl font-semibold">5. Armazenamento e retenção de dados</h2>
          <p>
            As informações são armazenadas apenas pelo tempo necessário para cumprir as
            finalidades descritas nesta política. Os registros de IP utilizados para limite
            de uso são mantidos por até 24 horas. Dados locais (nomes dos jogadores e
            configurações) permanecem apenas no seu dispositivo e podem ser removidos a
            qualquer momento ao limpar o armazenamento do navegador.
          </p>

          <h2 className="text-2xl font-semibold">6. Direitos do usuário (LGPD)</h2>
          <p>
            Conforme a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você tem o
            direito de solicitar acesso, correção, anonimização ou exclusão de dados a seu
            respeito. Para exercer seus direitos, entre em contato pelos canais indicados
            abaixo.
          </p>

          <h2 className="text-2xl font-semibold">7. Contato</h2>
          <p>
            Para dúvidas sobre esta política, acesse nossa página de{' '}
            <Link to="/contact" className="text-primary underline">contato</Link> ou envie
            um e-mail para <strong>mimika_suporte@outlook.com</strong>.
          </p>

          <h2 className="text-2xl font-semibold">8. Alterações nesta política</h2>
          <p>
            Esta política pode ser atualizada periodicamente. A data da última atualização
            está indicada no topo desta página.
          </p>

          <hr className="my-8 border-border" />

          <p className="text-sm text-muted-foreground">
            <strong>Responsável pelo site:</strong> Mimika<br />
            <strong>País:</strong> Brasil<br />
            <strong>Contato:</strong> mimika_suporte@outlook.com
          </p>
        </section>

        <div className="mt-10">
          <Button asChild variant="outline">
            <Link to="/">← Voltar ao jogo</Link>
          </Button>
        </div>
      </article>
      <Footer />
    </div>
  );
}
