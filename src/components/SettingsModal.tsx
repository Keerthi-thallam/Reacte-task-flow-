import React from 'react';
import { X, RotateCcw, Download, Users, Settings, Check } from 'lucide-react';
import { TEAM_MEMBERS } from '../data';
import { Task } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetData: () => void;
  tasks: Task[];
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onResetData,
  tasks,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(tasks, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `taskflow-export-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-[#dce9ff] max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#eff4ff] border-b border-[#dce9ff] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary text-white rounded-lg">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#0b1c30]">Workspace Settings</h3>
              <p className="text-[11px] text-[#464555]">TaskFlow sprint execution and data controls</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-[#777587] hover:bg-[#dce9ff] hover:text-[#0b1c30]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex flex-col gap-5">
          {/* Active Contributors */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#0b1c30] flex items-center gap-1.5">
                <Users className="w-4 h-4 text-primary" />
                <span>Sprint Alpha Core Team</span>
              </span>
              <span className="text-[11px] text-[#777587] font-mono">{TEAM_MEMBERS.length} members</span>
            </div>
            <div className="flex flex-col gap-1.5 bg-[#eff4ff]/60 p-2.5 rounded-xl border border-[#dce9ff]">
              {TEAM_MEMBERS.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-1.5 hover:bg-white rounded-lg transition-colors">
                  <div className="flex items-center gap-2.5">
                    {member.avatarUrl ? (
                      <img src={member.avatarUrl} alt={member.name} className="w-7 h-7 rounded-full object-cover" />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-[#565e74] text-white flex items-center justify-center font-bold text-xs">
                        {member.initials}
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-semibold text-[#0b1c30]">{member.name}</p>
                      <p className="text-[10px] text-[#777587]">{member.role}</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-white px-2 py-0.5 rounded text-primary font-mono border border-[#dce9ff]">
                    Active
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Backup & Export */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-[#0b1c30] flex items-center gap-1.5">
              <Download className="w-4 h-4 text-primary" />
              <span>Data Export &amp; Backup</span>
            </span>
            <div className="bg-[#eff4ff]/60 p-3 rounded-xl border border-[#dce9ff] flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-[#0b1c30]">Export Backlog JSON</p>
                <p className="text-[11px] text-[#777587]">Save all current sprint tasks &amp; subtasks locally</p>
              </div>
              <button
                type="button"
                onClick={handleExportData}
                className="px-3 py-1.5 bg-white hover:bg-[#dce9ff] text-primary border border-[#dce9ff] text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#10b981]" /> : <Download className="w-3.5 h-3.5" />}
                <span>{copied ? 'Downloaded' : 'Export'}</span>
              </button>
            </div>
          </div>

          {/* Factory Reset */}
          <div className="flex flex-col gap-2 pt-2 border-t border-[#e5eeff]">
            <span className="text-xs font-semibold text-[#ba1a1a] flex items-center gap-1.5">
              <RotateCcw className="w-4 h-4 text-[#ba1a1a]" />
              <span>Reset Demo Dataset</span>
            </span>
            <div className="bg-[#ffdad6]/30 p-3 rounded-xl border border-[#ffdad6] flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-[#93000a]">Restore Initial Tasks</p>
                <p className="text-[11px] text-[#93000a]/80">Reset execution matrix back to pristine demo state</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onResetData();
                  onClose();
                }}
                className="px-3 py-1.5 bg-[#ba1a1a] hover:bg-[#93000a] text-white text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
