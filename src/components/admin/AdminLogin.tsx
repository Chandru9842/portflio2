import { useState, FormEvent, KeyboardEvent } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Lock, User, Eye, EyeOff, ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';

interface AdminLoginProps {
  onBackToPortfolio: () => void;
  onLoginSuccess: () => void;
}

export default function AdminLogin({ onBackToPortfolio, onLoginSuccess }: AdminLoginProps) {
  const { login, error: authError, clearError } = useAuth();
  
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [fieldErrors, setFieldErrors] = useState<{ usernameOrEmail?: string; password?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const errors: { usernameOrEmail?: string; password?: string } = {};
    
    if (!usernameOrEmail.trim()) {
      errors.usernameOrEmail = 'Username or email is required.';
    }
    
    if (!password) {
      errors.password = 'Password is required.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    const success = await login(usernameOrEmail, password, rememberMe);
    setIsSubmitting(false);
    
    if (success) {
      onLoginSuccess();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="min-h-screen bg-bg-main flex flex-col justify-center items-center px-4 py-12 text-text-primary">
      <div className="w-full max-w-md">
        
        {/* Back Link */}
        <button
          onClick={onBackToPortfolio}
          className="inline-flex items-center space-x-2 text-xs text-text-secondary hover:text-text-primary transition-colors mb-8 group cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-primary rounded px-2 py-1 -ml-2"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Portfolio</span>
        </button>

        {/* Brand / Header */}
        <div className="text-center mb-8 space-y-2">
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-text-primary">
            Chandru M
          </h1>
          <p className="text-sm font-mono text-accent-primary uppercase tracking-wider">
            Portfolio CMS
          </p>
          <p className="text-xs text-text-secondary">
            Sign in to manage your portfolio.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-bg-surface border border-border-subtle rounded-xl p-8 shadow-xl relative overflow-hidden">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Global authentication errors */}
            {(authError || fieldErrors.usernameOrEmail || fieldErrors.password) && (
              <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start space-x-2.5">
                <AlertCircle className="w-4.5 h-4.5 text-red-400 shrink-0 mt-0.5" />
                <div className="text-xs text-red-400 leading-relaxed font-sans">
                  {authError || fieldErrors.usernameOrEmail || fieldErrors.password || 'Authentication failed.'}
                </div>
              </div>
            )}

            {/* Username/Email Input */}
            <div className="space-y-2">
              <label 
                htmlFor="usernameOrEmail" 
                className="block text-xs font-semibold text-text-secondary uppercase tracking-wider"
              >
                Username or Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-tertiary">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="usernameOrEmail"
                  name="usernameOrEmail"
                  type="text"
                  autoComplete="username"
                  required
                  value={usernameOrEmail}
                  onChange={(e) => {
                    setUsernameOrEmail(e.target.value);
                    if (fieldErrors.usernameOrEmail) {
                      setFieldErrors(prev => ({ ...prev, usernameOrEmail: undefined }));
                    }
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter your username or email"
                  className="w-full bg-bg-main border border-border-subtle hover:border-border-active focus:border-accent-primary rounded-lg pl-10 pr-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none transition-colors duration-200"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label 
                htmlFor="password" 
                className="block text-xs font-semibold text-text-secondary uppercase tracking-wider"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-tertiary">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (fieldErrors.password) {
                      setFieldErrors(prev => ({ ...prev, password: undefined }));
                    }
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="••••••••"
                  className="w-full bg-bg-main border border-border-subtle hover:border-border-active focus:border-accent-primary rounded-lg pl-10 pr-12 py-3 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none transition-colors duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-text-tertiary hover:text-text-secondary transition-colors cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 bg-bg-main border-border-subtle checked:bg-accent-primary text-accent-primary rounded focus:ring-accent-primary focus:ring-offset-bg-main focus:ring-2"
                />
                <span className="text-xs text-text-secondary group-hover:text-text-primary transition-colors select-none">
                  Remember me
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center px-4 py-3 bg-accent-primary hover:bg-accent-hover disabled:bg-accent-primary/60 text-bg-main font-bold text-xs uppercase tracking-widest rounded-lg transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent-primary select-none h-11"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>
        </div>

        {/* Footer info text */}
        <p className="text-[10px] text-text-tertiary text-center mt-8 font-mono tracking-wider">
          SECURE PORTAL &copy; 2026 CHANDRU. ALL RIGHTS RESERVED.
        </p>

      </div>
    </div>
  );
}
