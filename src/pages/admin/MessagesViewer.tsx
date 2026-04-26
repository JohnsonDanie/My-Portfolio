import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { messagesService } from '../../services/messagesService';
import { DataTable } from '../../components/admin/ui/DataTable';
import { Modal } from '../../components/admin/ui/Modal';
import { Trash2, CheckCircle, Mail, MailOpen } from 'lucide-react';
import type { ContactMessage } from '../../types/database';

export default function MessagesViewer() {
  const queryClient = useQueryClient();

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['messages'],
    queryFn: messagesService.getAll,
  });

  const { mutate: markAsRead } = useMutation({
    mutationFn: messagesService.markAsRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['messages'] }),
  });

  const { mutate: deleteMessage, isPending: isDeleting } = useMutation({
    mutationFn: messagesService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      closeModal();
    },
  });

  const [viewingMsg, setViewingMsg] = useState<ContactMessage | null>(null);

  const openModal = (msg: ContactMessage) => {
    setViewingMsg(msg);
    if (!msg.read) {
      markAsRead(msg.id);
    }
  };

  const closeModal = () => {
    setViewingMsg(null);
  };

  const handleDelete = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (window.confirm('Are you sure you want to delete this message?')) {
      deleteMessage(id);
    }
  };

  const columns = [
    {
      key: 'status',
      header: '',
      render: (m: ContactMessage) => (
        <div className="flex items-center justify-center text-slate-400">
          {m.read ? <MailOpen size={18} className="text-slate-500" /> : <Mail size={18} className="text-indigo-400 fill-indigo-500/20" />}
        </div>
      ),
    },
    {
      key: 'sender',
      header: 'Sender',
      render: (m: ContactMessage) => (
        <div>
          <div className={`font-medium ${m.read ? 'text-slate-300' : 'text-white'}`}>{m.name}</div>
          <div className="text-xs text-slate-500">{m.email}</div>
        </div>
      ),
    },
    {
      key: 'subject',
      header: 'Subject & Message',
      render: (m: ContactMessage) => (
        <div className="max-w-md">
          <div className={`font-medium truncate ${m.read ? 'text-slate-300' : 'text-white'}`}>{m.subject}</div>
          <div className="text-sm text-slate-500 truncate">{m.message}</div>
        </div>
      ),
    },
    {
      key: 'date',
      header: 'Date',
      render: (m: ContactMessage) => (
        <span className="text-sm text-slate-400">
          {new Date(m.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (m: ContactMessage) => (
        <div className="flex items-center justify-end gap-2">
          {!m.read && (
            <button 
              onClick={(e) => { e.stopPropagation(); markAsRead(m.id); }} 
              className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-md transition-colors"
              title="Mark as read"
            >
              <CheckCircle size={16} />
            </button>
          )}
          <button 
            onClick={(e) => handleDelete(m.id, e)} 
            disabled={isDeleting} 
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Messages Inbox</h1>
          <p className="text-slate-400">View and manage messages from your public contact form.</p>
        </div>
        <div className="bg-[#0a1628] border border-indigo-500/10 px-4 py-2 rounded-lg flex items-center gap-3">
          <span className="text-sm font-medium text-slate-400">Unread</span>
          <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold">
            {messages.filter(m => !m.read).length}
          </span>
        </div>
      </div>

      <div className="bg-[#0a1628] border border-indigo-500/10 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-500">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="p-12 text-center">
            <MailOpen size={48} className="mx-auto text-slate-600 mb-4 opacity-50" />
            <p className="text-slate-400">Your inbox is empty.</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <tbody className="divide-y divide-indigo-500/5">
              {messages.map((msg) => (
                <tr 
                  key={msg.id} 
                  onClick={() => openModal(msg)}
                  className={`group cursor-pointer transition-colors ${msg.read ? 'hover:bg-white/[0.02]' : 'bg-indigo-500/[0.02] hover:bg-indigo-500/[0.05]'}`}
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-4 whitespace-nowrap">
                      {col.render(msg)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal isOpen={!!viewingMsg} onClose={closeModal} title="Message Details">
        {viewingMsg && (
          <div className="space-y-6">
            <div className="flex items-start justify-between pb-6 border-b border-indigo-500/10">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">{viewingMsg.subject}</h3>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium text-indigo-400">{viewingMsg.name}</span>
                  <span className="text-slate-500">&lt;{viewingMsg.email}&gt;</span>
                </div>
              </div>
              <div className="text-sm text-slate-500">
                {new Date(viewingMsg.created_at).toLocaleString()}
              </div>
            </div>

            <div className="bg-[#050c1a] border border-indigo-500/10 rounded-xl p-6 whitespace-pre-wrap text-slate-300 leading-relaxed min-h-[150px]">
              {viewingMsg.message}
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button onClick={() => handleDelete(viewingMsg.id)} className="flex items-center gap-2 px-4 py-2 text-rose-400 hover:bg-rose-500/10 rounded-lg font-medium transition-colors">
                <Trash2 size={18} />
                Delete Message
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
