import { CommunityState, PlayerState } from "../types";
import PokerPlayer from "./PokerPlayer";
import { generateCardsHtml } from "./Utils";

interface Props {
  playerStates: PlayerState[];
  communityState: CommunityState;
}

const PokerTable = ({ playerStates, communityState }: Props) => {
  const pokerPlayerComponents = playerStates.map((playerState, index) => {
    return (
      <PokerPlayer
        key={index}
        playerIndex={index}
        playerName={playerState[0].name}
        playerBalance={playerState[0].balance}
        playerCards={playerState[0].cards}
      />
    );
  });

  return (
    <div className="poker-table-container">
      <div className="poker-table">
        <div className="poker-community-area">
          {generateCardsHtml(communityState[0].cards)}
          <div>${communityState[0].balance}</div>
        </div>
        {pokerPlayerComponents}
      </div>
    </div>
  );
};

export default PokerTable;
