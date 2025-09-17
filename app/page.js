"use client";

import { useEffect, useState } from 'react';

const HomePage = () => {
    // ユーザー名とメッセージの状態を管理
    const [user, setUser] = useState('');
    const [message, setMessage] = useState('');
    const [messageColor, setMessageColor] = useState('black');

    useEffect(() => {
        // コンポーネントがマウントされたときにローカルストレージからユーザー名を取得
        const storedUser = localStorage.getItem('notion_user');
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        localStorage.setItem('notion_user', data.user);

        setMessage('保存中...');
        setMessageColor('blue');

        try {
            const response = await fetch('/api/notion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                setMessage('送信完了');
                setMessageColor('green');
                form.reset();
                const storedUserAfterReset = localStorage.getItem('notion_user');
                setUser(storedUserAfterReset || '');
            } else {
                setMessage(`エラー: ${result.error}`);
                setMessageColor('red');
            }
        } catch (error) {
            setMessage(`通信エラー: ${error.message}`);
            setMessageColor('red');
            console.error('Fetch error:', error);
        }
    };

    return (
        <div style={{ 
            fontSize: '1.5rem', 
            padding: '1rem', 
            maxWidth: '600px',
            margin: '0 auto'
        }}>
            <h1>楽曲追加リクエスト</h1>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="song" style={{ display: 'block', marginBottom: '0.5rem' }}>曲名（必須）</label>
                    <input type="text" id="song" name="song" required style={{ width: '100%', padding: '0.5rem', fontSize: '1.2rem' }} />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="url" style={{ display: 'block', marginBottom: '0.5rem' }}>動画URL（必須：見つからなければウェブサイトのURLでもOK）</label>
                    <input type="url" id="url" name="url" required style={{ width: '100%', padding: '0.5rem', fontSize: '1.2rem' }} />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="user" style={{ display: 'block', marginBottom: '0.5rem' }}>ユーザー名（必須）:</label>
                    <input 
                        type="text" 
                        id="user" 
                        name="user" 
                        required 
                        value={user}
                        onChange={(e) => setUser(e.target.value)}
                        style={{ width: '100%', padding: '0.5rem', fontSize: '1.2rem' }} 
                    />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="constant" style={{ display: 'block', marginBottom: '0.5rem' }}>譜面定数（要望でも可）</label>
                    <input type="number" id="constant" name="constant" step="0.1" style={{ width: '100%', padding: '0.5rem', fontSize: '1.2rem' }} />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="description" style={{ display: 'block', marginBottom: '0.5rem' }}>備考やメモなどあれば:</label>
                    <textarea id="description" name="description" rows="4" style={{ width: '100%', padding: '0.5rem', fontSize: '1.2rem' }}></textarea>
                </div>
                <button type="submit" style={{ width: '100%', padding: '1rem', fontSize: '1.5rem', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}>リクエストを送信</button>
            </form>
            <p style={{ marginTop: '1rem', fontSize: '1.2rem', color: messageColor }}>{message}</p>
        </div>
    );
};

export default HomePage;