import React from 'react';
import { Bell, CheckCheck, Clock, AlertTriangle, MessageSquare, ShieldCheck, X } from 'lucide-react';

interface NotificationItem {
  id: string;
  title: string;
  time: string;
  type: 'urgent' | 'pr' | 'system' | 'mention';
  read: boolean;
}

interface NotificationPopoverProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationPopover: React.FC<NotificationPopoverProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = React.useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'Real-time WebSocket Gateway milestone is due in 2 hours',
      time: '10m ago',
      type: 'urgent',
      read: false
    },
    {
      id: 'notif-2',
      title: 'Sarah L. requested review on PR #482 (Figma tokens migration)',
      time: '45m ago',
      type: 'pr',
      read: false
    },
    {
      id: 'notif-3',
      title: 'PostgreSQL audit log index migration verified on staging-us-east',
      time: '2h ago',
      type: 'system',
      read: true
    },
    {
      id: 'notif-4',
      title: 'OpenTelemetry Jaeger traces ingested successfully without dropped packets',
      time: '5h ago',
      type: 'system',
      read: true
    }
  ]);

  if (!isOpen) return null;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-[#dce9ff] z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
      <div className="p-3.5 bg-[#eff4ff] border-b border-[#dce9ff] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-primary" />
          <span className="font-semibold text-sm text-[#0b1c30]">Sprint Alerts</span>
          {unreadCount > 0 && (
            <span className="bg-[#ba1a1a] text-white text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button 
              onClick={markAllRead} 
              className="text-xs text-primary hover:underline font-medium flex items-center gap-1"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all</span>
            </button>
          )}
          <button 
            onClick={onClose}
            className="p-1 rounded text-[#777587] hover:bg-[#dce9ff] hover:text-[#0b1c30]"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="divide-y divide-[#e5eeff] max-h-80 overflow-y-auto">
        {notifications.map((item) => (
          <div 
            key={item.id} 
            className={`p-3.5 hover:bg-[#f8f9ff] transition-colors flex items-start gap-3 ${
              !item.read ? 'bg-[#eff4ff]/60' : ''
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {item.type === 'urgent' && <AlertTriangle className="w-4 h-4 text-[#ba1a1a]" />}
              {item.type === 'pr' && <Clock className="w-4 h-4 text-primary" />}
              {item.type === 'system' && <ShieldCheck className="w-4 h-4 text-[#00505f]" />}
              {item.type === 'mention' && <MessageSquare className="w-4 h-4 text-primary" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-xs ${!item.read ? 'font-medium text-[#0b1c30]' : 'text-[#464555]'}`}>
                {item.title}
              </p>
              <span className="text-[10px] text-[#777587] font-mono mt-1 block">
                {item.time}
              </span>
            </div>
            {!item.read && (
              <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1" />
            )}
          </div>
        ))}
      </div>

      <div className="p-2.5 bg-[#f8f9ff] border-t border-[#dce9ff] text-center">
        <span className="text-[11px] text-[#464555]">
          Activity feed updated locally
        </span>
      </div>
    </div>
  );
};
