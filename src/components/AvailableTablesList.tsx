import { Table } from "../types";

interface Props {
  availableTables: Table[];
}

const AvailableTablesList = ({ availableTables }: Props) => {
  return (
    <div className="available-tables-container">
      <div className="available-tables-header table-to-join">
        <span>Name</span>
        <span>Buy-In</span>
        <span>Big Blind</span>
        <span></span>
      </div>
      {availableTables.map((table) => (
        <div className="table-to-join" key={table.name}>
          <span>{table.name}</span>
          <span>${table.buyIn}</span>
          <span>${table.bigBlind}</span>
          <span></span>
        </div>
      ))}
    </div>
  );
};

export default AvailableTablesList;
