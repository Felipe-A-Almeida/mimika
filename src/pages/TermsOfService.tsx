import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO
        title="Termos de Serviço - Mimika"
        description="Termos de serviço do Mimika, jogo de mímica online gratuito. Conheça as regras de uso."
      />
      <article className="max-w-3xl w-full mx-auto prose prose-invert flex-1 py-12 px-4">
        <h1 className="text-4xl font-bold mb-2 text-foreground">Termos de Serviço</h1>
        <p className="text-muted-foreground mb-8">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>

        <section className="space-y-4 text-foreground">
          <h2 className="text-2xl font-semibold">1. Aceitação dos termos</h2>
          <p>
            Ao acessar e utilizar este aplicativo de mímica, você concorda com os termos
            descritos nesta página. Se não concordar, por favor não utilize o serviço.
          </p>

          <h2 className="text-2xl font-semibold">2. Uso do serviço</h2>
          <p>
            O aplicativo é fornecido gratuitamente para fins de entretenimento. Você
            concorda em não utilizá-lo para qualquer finalidade ilegal ou que viole direitos
            de terceiros.
          </p>

          <h2 className="text-2xl font-semibold">3. Conteúdo gerado por IA</h2>
          <p>
            As palavras e categorias geradas por IA são fornecidas "como estão". Não
            garantimos precisão, adequação ou ausência de conteúdo inesperado. Recomenda-se
            supervisão de um adulto ao utilizar o jogo com crianças. O uso é por sua conta
            e risco.
          </p>

          <h2 className="text-2xl font-semibold">4. Publicidade</h2>
          <p>
            Este site pode exibir anúncios de terceiros (como Google AdSense). Não nos
            responsabilizamos pelo conteúdo dos anúncios exibidos nem pelas práticas dos
            anunciantes. O tratamento de dados por essas plataformas é regido pelas
            políticas próprias dos respectivos provedores.
          </p>

          <h2 className="text-2xl font-semibold">5. Propriedade intelectual</h2>
          <p>
            Todo o conteúdo, marca e código deste aplicativo pertencem aos seus
            respectivos criadores. É proibida a reprodução total ou parcial sem
            autorização prévia.
          </p>

          <h2 className="text-2xl font-semibold">6. Limitação de responsabilidade</h2>
          <p>
            Não nos responsabilizamos por quaisquer danos diretos, indiretos, incidentais
            ou consequentes decorrentes do uso ou da impossibilidade de uso do aplicativo,
            incluindo perda de dados ou interrupções de serviço.
          </p>

          <h2 className="text-2xl font-semibold">7. Disponibilidade</h2>
          <p>
            Reservamo-nos o direito de modificar, suspender ou descontinuar o serviço, no
            todo ou em parte, a qualquer momento, sem aviso prévio.
          </p>

          <h2 className="text-2xl font-semibold">8. Alterações nos termos</h2>
          <p>
            Podemos modificar estes termos a qualquer momento. O uso contínuo do serviço
            após alterações implica aceitação dos novos termos.
          </p>

          <h2 className="text-2xl font-semibold">9. Legislação aplicável</h2>
          <p>
            Estes termos são regidos pelas leis da República Federativa do Brasil. Fica
            eleito o foro da comarca do responsável pelo site para dirimir quaisquer
            controvérsias.
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
