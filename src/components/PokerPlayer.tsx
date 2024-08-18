import { Card } from "../types";

interface Props {
  playerIndex: number;
  playerName: string;
  playerBalance: number;
  playerCards: Card[] | null;
}

const PokerPlayer = ({
  playerIndex,
  playerName,
  playerBalance,
  playerCards,
}: Props) => {
  console.log(
    `/src/assets/card-images/${
      playerCards ? String(playerCards[0]) + String(playerCards[1]) : "null"
    }.png`
  );

  return (
    <div className="poker-player" id={`poker-player-${playerIndex}`}>
      <div>
        <img
          className="poker-card"
          src={`/src/assets/card-images/${
            playerCards
              ? String(playerCards[0].suit) + String(playerCards[0].rank)
              : "null"
          }.png`}
        />
        <img
          className="poker-card"
          src={`/src/assets/card-images/${
            playerCards
              ? String(playerCards[1].suit) + String(playerCards[1].rank)
              : "null"
          }.png`}
        />
      </div>
      <div>{playerName}</div>
      <div>${playerBalance}</div>
    </div>
  );
};

export default PokerPlayer;
