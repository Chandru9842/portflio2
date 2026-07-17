import { useState, useEffect } from 'react';
import { Mail, Trash2, Check, CheckSquare, Clock } from 'lucide-react';

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function MessagesManager() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      const res = await fetch('/api/contact', { headers });
      const json = await res.json();
      if (json.success) {
        setMessages(json.data || []);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleToggleRead = async (id: string, currentRead: boolean) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/contact/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isRead: !currentRead })
      });
      const json = await res.json();
      if (json.success) {
        fetchMessages();
      }
    } catch (err) {
      console.error('Error toggling read state:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact message?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/contact/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const json = await res.json();
      if (json.success) {
        fetchMessages();
      }
    } catch (err) {
      console.error('Error deleting message:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-12 space-y-4">
        <div className="w-8 h-8 border-2 border-accent-primary/25 border-t-accent-primary rounded-full animate-spin" />
        <p className="text-xs font-mono text-text-secondary">Loading received messages...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      <div className="border-b border-border-subtle pb-4">
        <h2 className="font-display font-bold text-lg text-text-primary">Contact Messages Inbox</h2>
        <p className="text-xs text-text-secondary mt-1">Review contact inquiries, client notes, and platform feedback logs.</p>
      </div>

      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="bg-bg-surface border border-border-subtle rounded-xl py-16 text-center space-y-3 max-w-md mx-auto">
            <Mail className="w-8 h-8 text-text-tertiary mx-auto" />
            <div className="space-y-1">
              <p className="text-xs font-bold text-text-primary">Inbox is entirely empty</p>
              <p className="text-[11px] text-text-secondary">No inquiries have been recorded through the portfolio contact form yet.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {messages.map((msg) => (
              <div 
                key={msg._id} 
                className={`bg-bg-surface border rounded-xl p-5 md:p-6 transition-all space-y-4 ${
                  msg.isRead 
                    ? 'border-border-subtle/50 bg-bg-surface/50' 
                    : 'border-accent-primary/20 bg-accent-soft/5'
                }`}
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 flex-wrap">
                      <span className="text-xs font-bold text-text-primary">{msg.name}</span>
                      <span className="text-text-tertiary text-xs">&middot;</span>
                      <span className="text-[10px] font-mono text-text-secondary">{msg.email}</span>
                      {!msg.isRead && (
                        <span className="text-[8px] font-mono bg-accent-soft text-accent-primary px-1.5 py-0.5 rounded uppercase font-bold animate-pulse">
                          Unread
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs font-bold text-text-primary mt-1">{msg.subject}</h4>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0 self-end md:self-auto">
                    <span className="text-[10px] font-mono text-text-tertiary flex items-center space-x-1 mr-2">
                      <Clock className="w-3.5 h-3.5 text-text-tertiary" />
                      <span>{new Date(msg.createdAt).toLocaleString()}</span>
                    </span>
                    <button
                      onClick={() => handleToggleRead(msg._id, msg.isRead)}
                      className="p-2 hover:bg-bg-elevated rounded text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                      title={msg.isRead ? 'Mark as Unread' : 'Mark as Read'}
                    >
                      {msg.isRead ? (
                        <CheckSquare className="w-4 h-4 text-accent-primary" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(msg._id)}
                      className="p-2 hover:bg-red-500/10 text-text-secondary hover:text-red-400 rounded transition-colors cursor-pointer"
                      title="Delete inquiry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-text-secondary leading-relaxed bg-bg-main/40 p-4 rounded-lg border border-border-subtle/40">
                  {msg.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
