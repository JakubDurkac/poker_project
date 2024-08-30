import { ClientAttributes, CommunityState, PlayerState } from "../types";
import PokerPlayer from "./PokerPlayer";
import { generateCardsHtml } from "./Utils";

interface Props {
  playerStates: PlayerState[];
  communityState: CommunityState;
  clientAttributes: ClientAttributes;
}

const PokerTable = ({
  playerStates,
  communityState,
  clientAttributes,
}: Props) => {
  const pokerPlayerComponents = playerStates.map((playerState, index) => {
    return (
      <PokerPlayer key={index} playerIndex={index} player={playerState[0]} />
    );
  });

  const { socket, isConnected } = clientAttributes;

  const handleDisconnect = () => {
    if (socket) {
      socket.close();
    }
  };

  return (
    <div className="poker-table-container">
      <div className="poker-table">
        <div className="poker-community-area">
          {generateCardsHtml(communityState[0].cards)}
          {isConnected ? (
            <div>${communityState[0].balance}</div>
          ) : (
            <div className="welcome-message">
              <span className="message-word">Texas</span>{" "}
              <span className="message-word">Hold'Em</span>{" "}
              <span className="message-word">Poker</span>
            </div>
          )}
        </div>
        {pokerPlayerComponents}
        {isConnected && (
          <button className="disconnect-button" onClick={handleDisconnect}>
            <img className="icon" src="/public/disconnect_icon.png" />
          </button>
        )}
      </div>
    </div>
  );
};

export default PokerTable;
