import { Player } from "../types";
import { generateCardsHtml, generateStatusMessage } from "./Utils";

interface Props {
  playerIndex: number;
  player: Player;
}

const PokerPlayer = ({ playerIndex, player }: Props) => {
  const {
    name,
    balance,
    cards,
    currentBid,
    isDealer,
    isTheirTurn,
    status,
    statusData,
  } = player;

  const extraClasses = `${status === "inactive" ? "inactive-player" : ""} ${
    isTheirTurn ? "their-turn-player" : ""
  } ${status === "fold" ? "fold-player" : ""}`;

  return (
    <div
      className={`poker-player ${extraClasses}`}
      id={`poker-player-${playerIndex}`}
    >
      {generateStatusMessage(status, statusData)}
      {generateCardsHtml(cards)}
      <div>
        {name}
        {isDealer && (
          <>
            {" "}
            &#8594; <span className="dealer-pin">DEALER</span>
          </>
        )}
      </div>
      <div>
        ${balance}
        {currentBid > 0 && (
          <>
            {" "}
            &#8594; <span className="current-bid">${currentBid}</span>
          </>
        )}
      </div>
    </div>
  );
};

export default PokerPlayer;
