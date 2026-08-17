import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { Logo } from '../../components/common/Logo';
import { useUser } from '../../context/UserContext';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useUser();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Preencha seu e-mail e senha.');
      return;
    }

    login(email, email.split('@')[0]);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center text-center space-y-3">
          <Logo size="lg" showSubtitle />
          <h2 className="text-xl font-bold text-foreground mt-4">Acesse sua conta</h2>
          <p className="text-xs text-muted-foreground max-w-xs">
            Seus dados e restrições alimentares permanecem seguros no seu dispositivo.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-xs font-medium">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground uppercase tracking-wide">
              E-mail
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="email"
                placeholder="seu.email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-card border border-border/50 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground uppercase tracking-wide">
              Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-card border border-border/50 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-subtle hover:bg-primary/95 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
          >
            <span>Entrar no Sem Risco</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center space-y-3 pt-2">
          <p className="text-xs text-muted-foreground">
            Ainda não configurou suas restrições?{' '}
            <Link to="/onboarding" className="font-semibold text-primary hover:underline">
              Criar perfil seguro
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
