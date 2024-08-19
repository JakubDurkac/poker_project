import { useState } from "react";
import AvailableTablesList from "./AvailableTablesList";
import { Table } from "../types";

interface Props {
  availableTables: Table[];
}

const OfflineMenu = ({ availableTables }: Props) => {
  const [buyInPrice, setBuyInPrice] = useState(800);
  const [bigBlindPrice, setBigBlindPrice] = useState(20);

  const handleBuyInChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBuyInPrice(Number(event.target.value));
  };

  const handleBigBlindChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBigBlindPrice(Number(event.target.value));
  };

  return (
    <div className="offline-menu">
      <input className="name-input" type="text" placeholder="Your Name"></input>
      <button className="menu-button">Play Online</button>
      <label htmlFor="buy-in-range">Buy-In Price: ${buyInPrice}</label>
      <input
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
        id="big-blind-range"
        type="range"
        min="2"
        max="40"
        step="2"
        value={bigBlindPrice}
        onChange={handleBigBlindChange}
      />
      <AvailableTablesList availableTables={availableTables} />
    </div>
  );
};

export default OfflineMenu;
