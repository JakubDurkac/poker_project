import PokerPlayer from "./PokerPlayer";

interface Player {
  name: string;
  balance: number;
}

// return type of useState() on Player object
// array [<Player (Object)>, <setPlayerObject (Function)>]
type PlayerState = [Player, React.Dispatch<React.SetStateAction<Player>>];

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
