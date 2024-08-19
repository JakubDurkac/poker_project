import { Card } from "../types";

export function generateCardsHtml(cards: Array<Card | null>) {
  return (
    <div className="poker-cards-box">
      {cards.map((card, index) => {
        return (
          <img
            key={index}
            className={card ? "poker-card" : "poker-card poker-card-backside"}
            src={`/src/assets/card-images/${
              card ? String(card.suit) + String(card.rank) : "backside"
            }.png`}
          />
        );
      })}
    </div>
  );
}
