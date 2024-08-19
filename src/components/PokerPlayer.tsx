import { Card } from "../types";
import { generateCardsHtml } from "./Utils";

interface Props {
  playerIndex: number;
  playerName: string;
  playerBalance: number;
  playerCards: Array<Card | null>;
}

const PokerPlayer = ({
  playerIndex,
  playerName,
  playerBalance,
  playerCards,
}: Props) => {
  return (
    <div className="poker-player" id={`poker-player-${playerIndex}`}>
      {generateCardsHtml(playerCards)}
      <div>{playerName}</div>
      <div>${playerBalance}</div>
    </div>
  );
};

export default PokerPlayer;
