// src/components/Card.jsx
import React from 'react';
import './Card.css';

const Card = ({ card, handleCardClick, isFlipped }) => {
    return (
        <div 
            className={`card ${isFlipped ? 'flipped' : ''}`} 
            onClick={() => handleCardClick(card)}
        >
            <div className="card-inner">
                {/* Kartın ön yüzü (Emoji değeri) */}
                <div className="card-face card-front">
                    {card.value}
                </div>
                {/* Kartın arka yüzü (Gizemli tema ikonu) */}
                <div className="card-face card-back">
                    <div className="mystery-icon">✨</div>
                </div>
            </div>
        </div>
    );
};

export default Card;