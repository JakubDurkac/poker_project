import { useState } from "react";
import AvailableTablesList from "./AvailableTablesList";
import { ClientAttributes, Table } from "../types";

interface Props {
  availableTables: Table[];
  clientAttributes: ClientAttributes;
  connectToServer: (
    playerName: string,
    buyInPrice: number,
    bigBlindPrice: number
  ) => void;
  joinTable: (tableName: string) => void;
}

const OfflineMenu = ({
  availableTables,
  clientAttributes,
  connectToServer,
  joinTable,
}: Props) => {
  const [inputName, setInputName] = useState("");
  const [buyInPrice, setBuyInPrice] = useState(800);
  const [bigBlindPrice, setBigBlindPrice] = useState(20);

  const handleInputNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInputName(event.target.value);
  };

  const handleBuyInChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBuyInPrice(Number(event.target.value));
  };

  const handleBigBlindChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBigBlindPrice(Number(event.target.value));
  };

  const { isConnected } = clientAttributes;

  return (
    <div className="offline-menu">
      <input
        disabled={isConnected}
        className={`name-input ${isConnected && "disabled-elem"}`}
        type="text"
        placeholder="Your Name"
        onChange={handleInputNameChange}
      ></input>
      <button
        disabled={isConnected}
        className={`menu-button ${isConnected && "disabled-elem"}`}
        onClick={() => connectToServer(inputName, buyInPrice, bigBlindPrice)}
      >
        Play Online
      </button>
      <label htmlFor="buy-in-range">Buy-In Price: ${buyInPrice}</label>
      <input
        disabled={isConnected}
        id="buy-in-range"
        type="range"
        min="100"
        max="2000"
        step="100"
        value={buyInPrice}
        onChange={handleBuyInChange}
      />
      <label htmlFor="big-blind-range">Big Blind Price: ${bigBlindPrice}</label>
      <input
        disabled={isConnected}
        id="big-blind-range"
        type="range"
        min="2"
        max="40"
        step="2"
        value={bigBlindPrice}
        onChange={handleBigBlindChange}
      />
      <AvailableTablesList
        availableTables={availableTables}
        clientAttributes={clientAttributes}
        joinTable={joinTable}
      />
    </div>
  );
};

export default OfflineMenu;
