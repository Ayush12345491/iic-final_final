import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import InputSection from './components/InputSection';
import ControlPanel from './components/ControlPanel';
import OutputDisplay from './components/OutputDisplay';
import { generateResponse, fetchHistory, saveResult, deleteResult } from './utils/api';
import './styles/App.css';
import { History, Trash2, X } from 'lucide-react';

function App() {
    const [inputText, setInputText] = useState('');
    const [outputType, setOutputType] = useState(null);
    const [outputContent, setOutputContent] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [historyItems, setHistoryItems] = useState([]);

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        try {
            const items = await fetchHistory();
            setHistoryItems(items);
        } catch (error) {
            console.error("Failed to load history", error);
        }
    };

    const handleAction = async (type) => {
        if (!inputText.trim()) {
            alert('Please enter some text first.');
            return;
        }

        setIsLoading(true);
        setOutputType(type);
        setOutputContent(null);

        try {
            const response = await generateResponse(type, inputText);
            setOutputContent(response);
        } catch (error) {
            console.error('Error generating response:', error);
            setOutputContent('Error generating response. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (outputType && outputContent) {
            await saveResult(outputType, inputText, outputContent);
            alert('Saved to history!');
            loadHistory();
        }
    };

    const handleLoadItem = (item) => {
        setInputText(item.original_text || '');
        setOutputType(item.type);
        setOutputContent(item.content);
        setShowHistory(false);
    };

    const handleDeleteItem = async (e, id) => {
        e.stopPropagation();
        if (confirm('Delete this item?')) {
            await deleteResult(id);
            loadHistory();
        }
    };

    return (
        <div className="app-container">
            <Header />

            <button
                className="action-btn"
                style={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: 100 }}
                onClick={() => setShowHistory(!showHistory)}
            >
                <History size={18} /> History
            </button>

            {showHistory && (
                <div className="history-sidebar">
                    <div className="history-header">
                        <h3>Saved Items</h3>
                        <button onClick={() => setShowHistory(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-color)' }}>
                            <X size={20} />
                        </button>
                    </div>
                    <div className="history-list">
                        {historyItems.length === 0 && <p style={{ opacity: 0.6, textAlign: 'center' }}>No saved items</p>}
                        {historyItems.map(item => (
                            <div key={item.id} className="history-item" onClick={() => handleLoadItem(item)}>
                                <div className="history-item-header">
                                    <span className="history-type">{item.type.replace('_', ' ')}</span>
                                    <button className="delete-btn" onClick={(e) => handleDeleteItem(e, item.id)}>
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                                <div className="history-preview">
                                    {item.original_text ? item.original_text.substring(0, 40) + '...' : 'No text'}
                                </div>
                                <div className="history-date">
                                    {new Date(item.created_at).toLocaleDateString()}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <main style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <InputSection text={inputText} setText={setInputText} />

                <ControlPanel
                    onAction={handleAction}
                    isLoading={isLoading}
                    activeAction={outputType}
                />

                {isLoading && (
                    <div style={{
                        textAlign: 'center',
                        padding: '2rem',
                        color: 'var(--secondary-color)',
                        animation: 'pulse 1.5s infinite'
                    }}>
                        Processing your text...
                    </div>
                )}

                {!isLoading && outputContent && (
                    <OutputDisplay
                        type={outputType}
                        content={outputContent}
                        onSave={handleSave}
                    />
                )}
            </main>

            <footer style={{
                marginTop: 'auto',
                paddingTop: '2rem',
                textAlign: 'center',
                color: 'var(--surface-hover)',
                fontSize: '0.875rem'
            }}>
                <p>Fast Revision & Summaries &copy; 2025</p>
            </footer>
        </div>
    );
}

export default App;
