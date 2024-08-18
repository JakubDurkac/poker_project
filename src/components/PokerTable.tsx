import { PlayerState } from "../types";
import PokerPlayer from "./PokerPlayer";

interface Props {
  playerStates: PlayerState[];
}

const PokerTable = ({ playerStates }: Props) => {
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
        <div className="poker-community-area">Pot and Cards.</div>
        {pokerPlayerComponents}
      </div>
    </div>
  );
};

export default PokerTable;
