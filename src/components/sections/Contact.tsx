import { useState, ChangeEvent, FormEvent } from 'react';
import { motion } from 'motion/react';
import { Mail, Send, CheckCircle, AlertCircle, Clock, MapPin } from 'lucide-react';
import { portfolioData } from '../../data/portfolioData';

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export default function Contact() {
  const [formData, setFormData] = useState<FormState>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error when typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Perform frontend validation
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required.";
    } else if (formData.subject.trim().length < 4) {
      newErrors.subject = "Subject must be at least 4 characters.";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required.";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Standard frontend submit flow
    setIsSubmitting(true);
    
    // Simulate slight network delay to show robust UI loader states
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      // Clean form state
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 800);
  };

  return (
    <section 
      id="contact" 
      className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-border-subtle"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* Left Column: Technical Inquiries / Metadata */}
        <motion.div 
          className="lg:col-span-5 space-y-8"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="space-y-2">
            <span className="font-mono text-xs text-accent-primary tracking-widest uppercase block">
              08 // Connection
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-text-primary">
              Get In Touch
            </h2>
          </div>

          <p className="font-sans text-sm md:text-base text-text-secondary leading-relaxed">
            I am currently open to full-time opportunities, internship roles, and technical collaborations. Whether you have a project idea, a position to discuss, or simply want to chat about system architecture, drop a message.
          </p>

          <div className="space-y-4 pt-4 border-t border-border-subtle">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-bg-surface border border-border-subtle text-accent-primary rounded-lg">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="font-mono text-[10px] text-text-tertiary uppercase block">
                  Direct Email
                </span>
                <a 
                  href={`mailto:${portfolioData.socials.email}`} 
                  className="font-sans text-sm font-semibold text-text-primary hover:text-accent-primary transition-colors duration-200"
                >
                  {portfolioData.socials.email}
                </a>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="p-3 bg-bg-surface border border-border-subtle text-accent-primary rounded-lg">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="font-mono text-[10px] text-text-tertiary uppercase block">
                  Primary Location
                </span>
                <span className="font-sans text-sm font-semibold text-text-primary">
                  Tamil Nadu / Bangalore, India
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="p-3 bg-bg-surface border border-border-subtle text-accent-primary rounded-lg">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="font-mono text-[10px] text-text-tertiary uppercase block">
                  Average Response
                </span>
                <span className="font-sans text-sm font-semibold text-text-primary">
                  &lt; 24 Hours
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Contact Form */}
        <motion.div 
          className="lg:col-span-7 bg-bg-surface border border-border-subtle rounded-xl p-6 md:p-8"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          id="contact-form-container"
        >
          {isSubmitted ? (
            <div className="text-center py-12 space-y-4" id="contact-success-banner">
              <div className="w-16 h-16 rounded-full bg-accent-soft border border-accent-primary flex items-center justify-center mx-auto text-accent-primary">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="font-display text-xl font-bold text-text-primary">
                Message Received
              </h3>
              <p className="font-sans text-sm text-text-secondary max-w-md mx-auto leading-relaxed">
                Thank you. Your message schema validated successfully on the client. Database storage API integrations are ready for provisioning in the subsequent CMS phases.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="mt-4 px-4 py-2 border border-border-subtle hover:border-accent-primary text-text-secondary hover:text-accent-primary font-mono text-xs uppercase tracking-wider rounded transition-colors duration-300 cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" id="contact-form" noValidate>
              
              {/* Form Validation Indicator */}
              <div className="flex items-center space-x-2 text-[10px] font-mono text-text-tertiary uppercase tracking-wider pb-2 border-b border-border-subtle">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-primary"></div>
                <span>Phase 1 Form - Live Client Validation</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="block text-xs font-semibold text-text-secondary tracking-wide uppercase">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Chandru Mohan"
                    className={`w-full bg-bg-main border rounded px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary transition-colors focus:outline-none ${
                      errors.name ? 'border-red-500/50 focus:border-red-500' : 'border-border-subtle focus:border-accent-primary'
                    }`}
                  />
                  {errors.name && (
                    <div className="flex items-center space-x-1 text-red-400 font-mono text-[10px] mt-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.name}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="email" className="block text-xs font-semibold text-text-secondary tracking-wide uppercase">
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@gmail.com"
                    className={`w-full bg-bg-main border rounded px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary transition-colors focus:outline-none ${
                      errors.email ? 'border-red-500/50 focus:border-red-500' : 'border-border-subtle focus:border-accent-primary'
                    }`}
                  />
                  {errors.email && (
                    <div className="flex items-center space-x-1 text-red-400 font-mono text-[10px] mt-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.email}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="subject" className="block text-xs font-semibold text-text-secondary tracking-wide uppercase">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Collaborating on System Architecture"
                  className={`w-full bg-bg-main border rounded px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary transition-colors focus:outline-none ${
                    errors.subject ? 'border-red-500/50 focus:border-red-500' : 'border-border-subtle focus:border-accent-primary'
                  }`}
                />
                {errors.subject && (
                  <div className="flex items-center space-x-1 text-red-400 font-mono text-[10px] mt-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.subject}</span>
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="message" className="block text-xs font-semibold text-text-secondary tracking-wide uppercase">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Hi Chandru, let's connect. I saw your OmniQueue scheduler project..."
                  className={`w-full bg-bg-main border rounded px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary transition-colors focus:outline-none resize-none ${
                    errors.message ? 'border-red-500/50 focus:border-red-500' : 'border-border-subtle focus:border-accent-primary'
                  }`}
                />
                {errors.message && (
                  <div className="flex items-center space-x-1 text-red-400 font-mono text-[10px] mt-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.message}</span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center px-6 py-4 bg-accent-primary hover:bg-accent-hover disabled:bg-accent-primary/50 text-bg-main text-xs font-bold uppercase tracking-wider rounded-md transition-all duration-300 gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Validating Data...</span>
                ) : (
                  <>
                    <span>Send Secure Message</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
