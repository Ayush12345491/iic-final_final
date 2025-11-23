import React from 'react';
import { Sparkles } from 'lucide-react';

const Header = () => {
    return (
        <header className="header">
            <div className="logo-container" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Sparkles size={28} color="var(--primary-color)" />
                <h1>Fast Revision & Summaries</h1>
            </div>
            <div className="user-status">
                <span style={{ fontSize: '0.875rem', color: 'var(--border-color)' }}>v1.0</span>
            </div>
        </header>
    );
};

export default Header;
