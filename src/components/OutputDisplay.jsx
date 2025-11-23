import React, { useState } from 'react';

const OutputDisplay = ({ type, content, onSave }) => {
    if (!content) return null;

    const renderContent = () => {
        switch (type) {
            case 'flashcards':
                return <FlashcardView content={content} />;
            case 'mcq':
                return <MCQView content={content} />;
            default:
                return <MarkdownView content={content} />;
        }
    };

    return (
        <section className="output-display">
            <div className="output-header">
                <h2 className="output-title">
                    {type === 'short_summary' && 'Summary'}
                    {type === 'key_points' && 'Key Points'}
                    {type === 'flashcards' && 'Flashcards'}
                    {type === 'mcq' && 'Quiz'}
                </h2>
                <button className="action-btn" onClick={onSave} style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
                    Save to History
                </button>
            </div>
            {renderContent()}
        </section>
    );
};

const MarkdownView = ({ content }) => {
    // Simple markdown-like rendering for the prototype
    // In a real app, use react-markdown
    const lines = content.split('\n');
    return (
        <div className="markdown-content">
            {lines.map((line, i) => {
                if (line.startsWith('# ')) return <h1 key={i}>{line.replace('# ', '')}</h1>;
                if (line.startsWith('## ')) return <h2 key={i}>{line.replace('## ', '')}</h2>;
                if (line.startsWith('- ')) return <li key={i}>{line.replace('- ', '')}</li>;
                if (line.trim() === '') return <br key={i} />;
                return <p key={i}>{line}</p>;
            })}
        </div>
    );
};

const FlashcardView = ({ content }) => {
    // Parse Q: ... A: ... format
    const parseFlashcards = (text) => {
        const cards = [];
        const parts = text.split(/Q:/g).filter(p => p.trim());
        parts.forEach(part => {
            const [question, answer] = part.split(/A:/g);
            if (question && answer) {
                cards.push({ q: question.trim(), a: answer.trim() });
            }
        });
        return cards;
    };

    const cards = parseFlashcards(content);
    const [flippedIndices, setFlippedIndices] = useState(new Set());

    const toggleFlip = (index) => {
        const newFlipped = new Set(flippedIndices);
        if (newFlipped.has(index)) {
            newFlipped.delete(index);
        } else {
            newFlipped.add(index);
        }
        setFlippedIndices(newFlipped);
    };

    return (
        <div className="flashcard-container">
            {cards.map((card, idx) => (
                <div
                    key={idx}
                    className={`flashcard ${flippedIndices.has(idx) ? 'flipped' : ''}`}
                    onClick={() => toggleFlip(idx)}
                >
                    <div className="flashcard-inner">
                        <div className="flashcard-front">
                            <div className="flashcard-label">Question</div>
                            <div className="flashcard-text">{card.q}</div>
                            <div className="flashcard-hint">Click to flip</div>
                        </div>
                        <div className="flashcard-back">
                            <div className="flashcard-label" style={{ color: 'var(--success-color)' }}>Answer</div>
                            <div className="flashcard-text">{card.a}</div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const MCQView = ({ content }) => {
    // Simple parser for the mock format
    const questions = content.split(/\n\n+/).map(block => {
        const lines = block.split('\n');
        const question = lines[0];
        const options = lines.filter(l => /^[A-D]\)/.test(l));
        const answerLine = lines.find(l => l.startsWith('Answer:'));
        const correctAnswer = answerLine ? answerLine.split(':')[1].trim() : '';

        return { question, options, correctAnswer };
    });

    const [selectedAnswers, setSelectedAnswers] = useState({});

    const handleSelect = (qIdx, optionLetter) => {
        if (selectedAnswers[qIdx]) return; // Prevent changing answer
        setSelectedAnswers(prev => ({ ...prev, [qIdx]: optionLetter }));
    };

    return (
        <div>
            {questions.map((q, idx) => {
                const isAnswered = selectedAnswers[idx] !== undefined;
                const selected = selectedAnswers[idx];

                return (
                    <div key={idx} className="mcq-item">
                        <div className="mcq-question">{q.question}</div>
                        <div className="mcq-options">
                            {q.options.map((opt, oIdx) => {
                                const letter = opt[0]; // 'A', 'B', etc.
                                const isSelected = selected === letter;
                                const isCorrect = q.correctAnswer === letter;

                                let className = 'mcq-option';
                                if (isAnswered) {
                                    if (isCorrect) className += ' correct';
                                    if (isSelected && !isCorrect) className += ' incorrect';
                                    if (!isSelected && !isCorrect) className += ' disabled';
                                }

                                return (
                                    <div
                                        key={oIdx}
                                        className={className}
                                        onClick={() => handleSelect(idx, letter)}
                                    >
                                        <span className="mcq-letter">{letter}</span>
                                        <span>{opt.substring(3)}</span>
                                        {isAnswered && isCorrect && <span className="mcq-feedback">✓</span>}
                                        {isAnswered && isSelected && !isCorrect && <span className="mcq-feedback">✗</span>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default OutputDisplay;
