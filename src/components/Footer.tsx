import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background/80 py-6 px-4 mt-auto">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Mimika</p>
        <nav className="flex flex-wrap justify-center gap-4">
          <Link to="/about" className="hover:text-foreground transition-colors">
            Sobre
          </Link>
          <Link to="/privacy-policy" className="hover:text-foreground transition-colors">
            Política de Privacidade
          </Link>
          <Link to="/terms-of-service" className="hover:text-foreground transition-colors">
            Termos de Serviço
          </Link>
          <Link to="/contact" className="hover:text-foreground transition-colors">
            Contato
          </Link>
        </nav>
      </div>
    </footer>
  );
}
