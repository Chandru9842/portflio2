import { useState, useEffect, KeyboardEvent, FormEvent } from 'react';
import { motion } from 'motion/react';
import { X, Lock, User, AlertCircle, ShieldAlert } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminLoginModal({ isOpen, onClose }: AdminLoginModalProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Close on Escape keypress
  useEffect(() => {
    const handleKeyDown = (e: any) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    const newErrors: { username?: string; password?: string } = {};

    if (!username.trim()) {
      newErrors.username = "Username or email is required.";
    }
    if (!password.trim()) {
      newErrors.password = "Password is required.";
    } else if (password.trim().length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    // Simulate standard security checking latency
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMsg("Credential parameters validated. Auth integration (Mongoose + bcrypt + JWT) will be provisioned in Phase 2.");
    }, 1200);
  };

  const handleBackdropClick = () => {
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-main/80 backdrop-blur-md"
      onClick={handleBackdropClick}
      id="admin-login-backdrop"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking modal content
        className="relative w-full max-w-md bg-bg-surface border border-border-subtle rounded-xl p-6 md:p-8 shadow-2xl"
        id="admin-login-modal"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-text-secondary hover:text-text-primary rounded-md border border-transparent hover:border-border-subtle transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center space-x-2 text-accent-primary">
            <ShieldAlert className="w-5 h-5" />
            <span className="font-mono text-xs tracking-wider uppercase">Administrative Portal</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-text-primary">
            CMS Admin Login
          </h2>
          <p className="font-sans text-xs text-text-secondary leading-relaxed">
            Authorized access only. Use this interface to authenticate and manage portfolio credentials.
          </p>
        </div>

        {/* Main Interface Content */}
        {successMsg ? (
          <div className="space-y-4 py-4 text-center">
            <div className="p-3 bg-accent-soft border border-accent-primary/20 rounded-lg text-left">
              <span className="font-mono text-[10px] text-accent-primary uppercase tracking-wider block mb-1 font-bold">CLIENT VALIDATION COMPLETED</span>
              <p className="font-sans text-xs text-text-secondary leading-relaxed">
                {successMsg}
              </p>
            </div>
            <button
              onClick={() => {
                setSuccessMsg('');
                setUsername('');
                setPassword('');
              }}
              className="px-4 py-2 bg-bg-main hover:bg-bg-surface border border-border-subtle text-text-secondary hover:text-text-primary font-mono text-[10px] uppercase tracking-wider rounded transition-colors duration-200 cursor-pointer"
            >
              Reset Login State
            </button>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* Username Input */}
            <div className="space-y-1.5">
              <label htmlFor="admin-username" className="block text-[11px] font-bold text-text-secondary uppercase tracking-wider">
                Username / Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-tertiary">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  id="admin-username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (errors.username) setErrors(prev => ({ ...prev, username: undefined }));
                  }}
                  placeholder="admin_chandru"
                  className={`w-full bg-bg-main border rounded pl-10 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none transition-colors ${
                    errors.username ? 'border-red-500/50 focus:border-red-500' : 'border-border-subtle focus:border-accent-primary'
                  }`}
                />
              </div>
              {errors.username && (
                <div className="flex items-center space-x-1 text-red-400 font-mono text-[9px] mt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.username}</span>
                </div>
              )}
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label htmlFor="admin-password" className="block text-[11px] font-bold text-text-secondary uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-tertiary">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  id="admin-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors(prev => ({ ...prev, password: undefined }));
                  }}
                  placeholder="••••••••"
                  className={`w-full bg-bg-main border rounded pl-10 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none transition-colors ${
                    errors.password ? 'border-red-500/50 focus:border-red-500' : 'border-border-subtle focus:border-accent-primary'
                  }`}
                />
              </div>
              {errors.password && (
                <div className="flex items-center space-x-1 text-red-400 font-mono text-[9px] mt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.password}</span>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center px-4 py-3 bg-accent-primary hover:bg-accent-hover disabled:bg-accent-primary/50 text-bg-main text-xs font-bold uppercase tracking-wider rounded transition-all duration-300 gap-2 cursor-pointer mt-2"
            >
              {isLoading ? (
                <span>Verifying Parameters...</span>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Authenticate Session</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Footer Notes (No Cyperpunk term) */}
        <div className="border-t border-border-subtle mt-6 pt-4 text-center font-mono text-[9px] text-text-tertiary">
          <span>DEVELOPMENT BUILD 1.0.0 (PHASE 1)</span>
        </div>
      </motion.div>
    </div>
  );
}
