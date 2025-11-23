import React from 'react';
import { Upload } from 'lucide-react';

const InputSection = ({ text, setText }) => {
    return (
        <section className="input-section">
            <div className="input-wrapper">
                <textarea
                    className="main-input"
                    placeholder="Paste your study notes, article, or text here..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <div className="upload-hint">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Upload size={14} /> Paste text or upload PDF/URL (Coming Soon)
                    </span>
                </div>
            </div>
        </section>
    );
};

export default InputSection;
