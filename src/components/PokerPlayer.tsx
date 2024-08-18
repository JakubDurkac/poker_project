interface Props {
  playerIndex: number;
  playerName: string;
  playerBalance: number;
}

const PokerPlayer = ({ playerIndex, playerName, playerBalance }: Props) => {
  return (
    <div className="poker-player" id={`poker-player-${playerIndex}`}>
      {playerName}, ${playerBalance}, {playerIndex}
    </div>
  );
};

export default PokerPlayer;
