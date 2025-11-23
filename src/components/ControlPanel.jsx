import React from 'react';
import { getUiLabels } from '../utils/promptEngine';
import { FileText, List, Layers, CheckSquare, RefreshCw, HelpCircle, Search } from 'lucide-react';

const ControlPanel = ({ onAction, isLoading, activeAction }) => {
    const labels = getUiLabels();

    const buttons = [
        { id: 'short_summary', label: labels.summarize_button, icon: FileText },
        { id: 'key_points', label: labels.keypoints_button, icon: List },
        { id: 'flashcards', label: labels.flashcards_button, icon: Layers },
        { id: 'mcq', label: labels.mcq_button, icon: CheckSquare },
    ];

    return (
        <section className="control-panel">
            {buttons.map((btn) => {
                const Icon = btn.icon;
                return (
                    <button
                        key={btn.id}
                        className={`action-btn ${activeAction === btn.id ? 'active' : ''}`}
                        onClick={() => onAction(btn.id)}
                        disabled={isLoading}
                        style={{ opacity: isLoading ? 0.7 : 1 }}
                    >
                        <Icon size={18} />
                        {btn.label}
                    </button>
                );
            })}

            {/* Secondary actions could go here or be contextual */}
        </section>
    );
};

export default ControlPanel;
