const API_URL = 'http://localhost:3000/api/generate';

export const generateResponse = async (promptType, text, constraints = {}) => {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: promptType,
                text,
                constraints
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch from API');
        }

        const data = await response.json();
        return data.content;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

export const fetchHistory = async () => {
    const response = await fetch('http://localhost:3000/api/history');
    return await response.json();
};

export const saveResult = async (type, originalText, content) => {
    const response = await fetch('http://localhost:3000/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, originalText, content })
    });
    return await response.json();
};

export const deleteResult = async (id) => {
    await fetch(`http://localhost:3000/api/history/${id}`, {
        method: 'DELETE'
    });
};
