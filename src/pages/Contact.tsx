import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import Footer from '@/components/Footer';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Contato de ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:mimika_suporte@outlook.com?subject=${subject}&body=${body}`;
    toast({ title: 'Abrindo seu cliente de e-mail...' });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="max-w-xl w-full mx-auto flex-1 py-12 px-4">
        <h1 className="text-4xl font-bold mb-2 text-foreground">Contato</h1>
        <p className="text-muted-foreground mb-8">
          Tem dúvidas, sugestões ou encontrou um bug? Envie sua mensagem.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome</Label>
            <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="message">Mensagem</Label>
            <Textarea id="message" required rows={6} value={message} onChange={(e) => setMessage(e.target.value)} />
          </div>
          <div className="flex gap-3">
            <Button type="submit">Enviar</Button>
            <Button asChild variant="outline">
              <Link to="/">Voltar</Link>
            </Button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}
