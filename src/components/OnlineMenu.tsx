import { useEffect, useState } from "react";
import { ClientAttributes, PlayerState, Showdown } from "../types";
import LastShowdownInfo from "./LastShowdownInfo";
import ChatLog from "./ChatLog";

interface Props {
  makeInGameChoice: (type: string, data: number) => void;
  playerStates: PlayerState[];
  clientAttributes: ClientAttributes;
  showdownObjects: Showdown[];
}

const OnlineMenu = ({
  makeInGameChoice,
  playerStates,
  clientAttributes,
  showdownObjects,
}: Props) => {
  const localPlayer = playerStates[0][0];
  const { balance, currentBid, isTheirTurn } = localPlayer;
  const bigBlind = clientAttributes.bigBlindPrice ?? 2;
  const smallBlind = bigBlind / 2;

  let maxBid = currentBid;
  playerStates.forEach((playerState) => {
    const player = playerState[0];
    if (player.currentBid > maxBid) {
      maxBid = player.currentBid;
    }
  });

  let callAmount = maxBid - currentBid;
  if (callAmount > balance) {
    callAmount = balance;
  }

  let raiseLowerLimit = maxBid + bigBlind - currentBid;
  let raiseUpperLimit = balance;
  const isDisabledRaise = raiseLowerLimit > raiseUpperLimit;

  const [raiseAmount, setRaiseAmount] = useState(raiseLowerLimit);
  const handleRaiseToChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRaiseAmount(Number(event.target.value));
  };

  useEffect(() => {
    setRaiseAmount(raiseLowerLimit);
  }, [raiseLowerLimit]);

  let isChoiceAlreadyMade = false;
  useEffect(() => {
    let isClientAlone = true;
    for (let i = 1; i < playerStates.length; i++) {
      if (
        playerStates[i][0].status !== "fold" &&
        playerStates[i][0].status !== "inactive"
      ) {
        isClientAlone = false;
        break;
      }
    }

    if (isClientAlone && isTheirTurn) {
      makeInGameChoice("check", 0); // auto check if client stayed alone
      isChoiceAlreadyMade = true;
    }
  }, [playerStates]);

  if (isTheirTurn && balance === 0 && !isChoiceAlreadyMade) {
    makeInGameChoice("check", 0); // auto check if already went all-in
  }

  return (
    <div className="online-menu">
      <input
        disabled={!isTheirTurn || isDisabledRaise}
        id="raise-to-range"
        type="range"
        min={raiseLowerLimit}
        max={raiseUpperLimit}
        step={smallBlind}
        value={raiseAmount}
        onChange={handleRaiseToChange}
      />
      <button
        disabled={!isTheirTurn || isDisabledRaise}
        className={`menu-button ${
          (!isTheirTurn || isDisabledRaise) && "disabled-elem"
        }`}
        onClick={() => makeInGameChoice("raise", raiseAmount)}
      >
        Raise{`${!isTheirTurn || isDisabledRaise ? "" : ` by $${raiseAmount}`}`}
      </button>
      <button
        disabled={!isTheirTurn || !(callAmount > 0)}
        className={`menu-button ${
          (!isTheirTurn || !(callAmount > 0)) && "disabled-elem"
        }`}
        onClick={() => makeInGameChoice("call", callAmount)}
      >
        Call{`${callAmount > 0 ? ` $${callAmount}` : ""}`}
      </button>
      <button
        disabled={!isTheirTurn || callAmount > 0}
        className={`menu-button ${
          (!isTheirTurn || callAmount > 0) && "disabled-elem"
        }`}
        onClick={() => makeInGameChoice("check", 0)}
      >
        Check
      </button>
      <button
        disabled={!isTheirTurn}
        className={`menu-button ${!isTheirTurn && "disabled-elem"}`}
        onClick={() => makeInGameChoice("fold", 0)}
      >
        Fold
      </button>
      <LastShowdownInfo showdownObjects={showdownObjects} />
      <ChatLog />
    </div>
  );
};

export default OnlineMenu;
