// src/components/GameBoard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import Card from './Card';
import './GameBoard.css';

// Oyunun zorluk seviyelerine göre kart değerleri (daha fazla seçenek için uzatıldı)
const initialCardValues = [
    '🐱', '🐶', '🦊', '🐻', '🐼', '🐨', 
    '🐰', '🦁', '🐯', '🐵', '🐸', '🐧',
    '🐘', '🦒', '🦓', '🐴', '🐷', '🐮'
];

const GameBoard = () => {
    const [cardCount, setCardCount] = useState(6); // Başlangıçta 6 çift kart
    const [cards, setCards] = useState([]);
    const [flippedCards, setFlippedCards] = useState([]);
    const [score, setScore] = useState(0);
    const [moves, setMoves] = useState(0);
    const [timer, setTimer] = useState(30);
    const [lockBoard, setLockBoard] = useState(false);
    const [isGameFinished, setIsGameFinished] = useState(false);
    const [winStatus, setWinStatus] = useState(null);
    const [isGameStarted, setIsGameStarted] = useState(false);

    const MAX_MOVES = cardCount * 2 + 2; // Kart sayısına göre hamle limiti belirle

    const startNewGame = useCallback(() => {
        const selectedCards = initialCardValues.slice(0, cardCount);
        const initialCards = [...selectedCards, ...selectedCards];

        const shuffledCards = initialCards
            .map((cardValue, index) => ({
                id: index,
                value: cardValue,
                matched: false,
            }))
            .sort(() => Math.random() - 0.5);

        setCards(shuffledCards);
        setFlippedCards([]);
        setScore(0);
        setMoves(0);
        setTimer(30);
        setLockBoard(false);
        setIsGameFinished(false);
        setWinStatus(null);
        setIsGameStarted(false);
    }, [cardCount]);

    useEffect(() => {
        startNewGame();
    }, [startNewGame]);

    useEffect(() => {
        let interval;
        if (isGameStarted && !isGameFinished && timer > 0) {
            interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        } else if (timer === 0 && !isGameFinished) {
            setIsGameFinished(true);
            setLockBoard(true);
            setWinStatus('timeout');
        }
        return () => clearInterval(interval);
    }, [isGameStarted, isGameFinished, timer]);

    const handleCardClick = useCallback(
        (clickedCard) => {
            if (lockBoard || clickedCard.matched || flippedCards.includes(clickedCard) || isGameFinished) {
                return;
            }
            
            if (!isGameStarted) {
                setIsGameStarted(true);
            }

            setMoves((prevMoves) => prevMoves + 1);
            
            if (moves + 1 >= MAX_MOVES) {
                setTimeout(() => {
                    if (cards.some(card => !card.matched)) {
                        setIsGameFinished(true);
                        setLockBoard(true);
                        setWinStatus('moves_out');
                    }
                }, 1000);
            }

            setFlippedCards((prev) => [...prev, clickedCard]);
        },
        [flippedCards, lockBoard, isGameFinished, moves, cards, isGameStarted, MAX_MOVES]
    );

    useEffect(() => {
        if (flippedCards.length === 2) {
            setLockBoard(true);
            const [firstCard, secondCard] = flippedCards;

            if (firstCard.value === secondCard.value) {
                setCards((prevCards) =>
                    prevCards.map((card) =>
                        card.value === firstCard.value ? { ...card, matched: true } : card
                    )
                );
                setScore((prevScore) => prevScore + 1);
                setFlippedCards([]);
                setLockBoard(false);
            } else {
                setTimeout(() => {
                    setFlippedCards([]);
                    setLockBoard(false);
                }, 1000);
            }
        }
    }, [flippedCards]);

    useEffect(() => {
        if (cards.length > 0 && cards.every((card) => card.matched)) {
            setTimeout(() => {
                setIsGameFinished(true);
                setWinStatus('win');
            }, 500);
        }
    }, [cards]);

    return (
        <div className="game-board">
            <h1>Hafıza Oyunu</h1>
            <div className="game-controls">
                <label htmlFor="card-selector">Kart Sayısı:</label>
                <select 
                    id="card-selector" 
                    value={cardCount} 
                    onChange={(e) => setCardCount(Number(e.target.value))}
                >
                    <option value={4}>8 Kart (4 Çift)</option>
                    <option value={6}>12 Kart (6 Çift)</option>
                    <option value={8}>16 Kart (8 Çift)</option>
                    <option value={10}>20 Kart (10 Çift)</option>
                    <option value={12}>24 Kart (12 Çift)</option>
                </select>
                <button onClick={startNewGame}>Yeni Oyun</button>
            </div>
            
            <div className="stats-container">
                <p>Hamle: {moves} / {MAX_MOVES}</p>
                <p>Skor: {score}</p>
                <p>Süre: {timer} sn</p>
            </div>

            <div className="cards-container">
                {cards.map((card) => (
                    <Card
                        key={card.id}
                        card={card}
                        handleCardClick={handleCardClick}
                        isFlipped={flippedCards.includes(card) || card.matched}
                    />
                ))}
            </div>

            {isGameFinished && (
                <div className="game-finished-modal">
                    {winStatus === 'win' && <h2>Tebrikler!</h2>}
                    {winStatus === 'timeout' && <h2>Süre Doldu!</h2>}
                    {winStatus === 'moves_out' && <h2>Hamle Hakkınız Bitti!</h2>}
                    
                    {winStatus === 'win' && (
                        <p>Oyunu **{moves}** hamlede, **{30 - timer}** saniyede ve **{score}** eşleşme ile tamamladınız!</p>
                    )}
                    {(winStatus === 'timeout' || winStatus === 'moves_out') && (
                        <p>Bir dahaki sefere daha iyi şanslar!</p>
                    )}
                    
                    <button onClick={startNewGame}>Yeni Oyun</button>
                </div>
            )}
        </div>
    );
};

export default GameBoard;