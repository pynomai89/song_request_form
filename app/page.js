"use client";

import { useEffect, useState } from 'react';

const HomePage = () => {
    const [user, setUser] = useState('');
    const [message, setMessage] = useState('');
    const [messageColor, setMessageColor] = useState('black');
    const [showLink, setShowNotionLink] = useState(false);
    const [constant, setConstant] = useState('0.0');
    const [intPart, setIntPart] = useState('');
    const [decimalPart, setDecimalPart] = useState('');

    const inputStyle = {
        width: '100%',
        padding: '0.5rem',
        fontSize: '1.2rem',
        border: '2px solid #ccc',
        borderRadius: '6px',
        outline: 'none',
        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
    };

    { /*譜面定数処理*/ }
    const handleIntChange = (e) => setIntPart(e.target.value);
    const handleDecimalChange = (e) => setDecimalPart(e.target.value);
    const constantValue =
        intPart !== '' && decimalPart !== ''
            ? Number(intPart) + Number(decimalPart) / 10
            : '';

    { /*ユーザー名を取得*/ }
    useEffect(() => {
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

        setConstant(constantValue);

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
                setShowNotionLink(true);
                form.reset();
                setIntPart('');
                setDecimalPart('');
                setConstant('0.0');
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
            <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>楽曲追加リクエスト</h1>
            <div style={{ marginBottom: '2.5rem' }}></div>

            { /*autocomplete：自動補完機能に情報を記憶させない*/ }
            <form onSubmit={handleSubmit} autoComplete="off">

                <div style={{ marginBottom: '2.5rem' }}>
                    <label htmlFor="song" style={{ display: 'block', marginBottom: '0.5rem' }}>曲名<span style={{ color: 'red' }}>*（必須）</span> </label>
                    <input type="text" id="song" name="song" required style={ inputStyle } />
                </div>

                <div style={{ marginBottom: '2.5rem' }}>
                    <label htmlFor="url" style={{ display: 'block', marginBottom: '0.5rem' }}>動画URL<span style={{ color: 'red' }}>*（必須）</span><span style={{fontSize: '1.0rem'}}>（見つからなければウェブサイトのURLでもOK）</span> </label>
                    <input type="url" id="url" name="url" required style={ inputStyle } />
                </div>
                
                <div style={{ marginBottom: '2.5rem' }}>
                    <label htmlFor="user" style={{ display: 'block', marginBottom: '0.5rem' }}>ユーザー名<span style={{ color: 'red' }}>*（必須）</span> </label>
                    <input 
                        type="text" 
                        id="user" 
                        name="user" 
                        required 
                        value={user}
                        onChange={(e) => setUser(e.target.value)}
                        style={ inputStyle } 
                    />
                </div>

                <div style={{ marginBottom: '2.5rem' }}>
                    <label htmlFor="junre" style={{ display: 'block', marginBottom: '0.5rem' }}>
                        ジャンル<span style={{fontSize: '1.0rem'}}>（追加してほしいジャンルは備考欄へ）</span>
                    </label>
                    <select id="junre" name="junre" style={ inputStyle }>
                        <option value="">選択してください</option>
                        <option value="LUNATIC">LUNATIC</option>
                        <option value="ボーナストラック">ボーナストラック</option>
                        <option value="チュウマイ">チュウマイ</option>
                        <option value="VARIETY">VARIETY</option>
                        <option value="東方Project">東方Project</option>
                        <option value="niconico">niconico</option>
                        <option value="POPS ＆ ANIME">POPS ＆ ANIME</option>
                        <option value="オンゲキ">オンゲキ</option>
                    </select>
                    </div>

                <div style={{ marginBottom: '2.5rem' }}>
                    <label htmlFor="constant" style={{ display: 'block', marginBottom: '0.5rem' }}>譜面定数（要望でも可）</label>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ flex: '1' }}>
                            <select
                            id="intPart"
                            name="intPart"
                            value={intPart}
                            onChange={handleIntChange}
                            required
                            style={{
                                width: '100%',
                                padding: '0.5rem',
                                fontSize: '1.2rem',
                                border: '2px solid #ccc',
                                borderRadius: '6px',
                                backgroundColor: '#fff',
                                color: '#000',
                            }}
                            >
                            <option value="">難易度</option>
                            <option value="0">0</option>
                            <option value="13">11</option>
                            <option value="13">12</option>
                            <option value="13">13</option>
                            <option value="14">14</option>
                            <option value="15">15</option>
                            </select>
                        </div>

                        <div style={{ flex: '1' }}>
                            <select
                            id="decimalPart"
                            name="decimalPart"
                            value={decimalPart}
                            onChange={handleDecimalChange}
                            required
                            style={{
                                width: '100%',
                                padding: '0.5rem',
                                fontSize: '1.2rem',
                                border: '2px solid #ccc',
                                borderRadius: '6px',
                                backgroundColor: '#fff',
                                color: '#000',
                            }}
                            >
                            <option value="">定数値</option>
                            {[...Array(10).keys()].map((n) => (
                                <option key={n} value={n}>{n}</option>
                            ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div style={{ marginBottom: '2.5rem' }}>
                    <label htmlFor="description" style={{ display: 'block', marginBottom: '0.5rem' }}>備考やメモなどあれば:</label>
                    <textarea id="description" name="description" rows="4" style={ inputStyle }></textarea>
                </div>
                <button type="submit" style={{ width: '100%', padding: '1rem', fontSize: '1.5rem', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}>リクエストを送信</button>
            </form>

            <p style={{ marginTop: '1rem', marginBottom: '4.0rem', fontSize: '1.2rem', color: messageColor }}>{message}</p>

            <button
                type="button"
                onClick={() => {
                    const confirmed = window.confirm('入力をすべて削除しますか？この操作は元に戻せません。');
                    if (!confirmed) return;

                    const form = document.querySelector('form');
                    form.reset();
                    setIntPart('');
                    setDecimalPart('');
                    setConstant('0.0');
                    setMessage('入力内容をクリアしました');
                    setMessageColor('gray');
                }}
                style={{ width: '40%', padding: '1rem', fontSize: '1.0rem', backgroundColor: '#f44336', color: 'white',
                    border: 'none', marginTop: '1rem', cursor: 'pointer', borderRadius: '6px', }}
            >
                入力をすべてクリア
            </button>

            {showLink && (
                <div style={{ marginTop: '1.0rem' }}>
                    <a
                    href="https://www.notion.so/2714b8ff2dd18098aaacdd09bb6fdafc?v=2714b8ff2dd18005b721000c2c9ea72b"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        color: '#2196F3',
                        textDecoration: 'underline',
                        fontSize: '1rem',
                    }}
                    >
                    Notionを開いてリクエストを確認
                    </a>
                </div>
            )}

        </div>
    );
};

export default HomePage;