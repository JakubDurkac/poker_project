import { ClientAttributes, Table } from "../types";
import { generateTableHtml, generateTablesHtml } from "./Utils";

interface Props {
  availableTables: Table[];
  clientAttributes: ClientAttributes;
  joinTable: (tableName: string) => void;
}

const AvailableTablesList = ({
  availableTables,
  clientAttributes,
  joinTable,
}: Props) => {
  const { name, isConnected, buyInPrice, bigBlindPrice } = clientAttributes;
  const areNonNullAttributes =
    name !== null && buyInPrice !== null && bigBlindPrice !== null;
  const hasTableAlready = availableTables.find((table) => {
    return table.name === name;
  });

  return (
    <div className="available-tables-container">
      <div className="available-tables-header table-to-join">
        <span>Name</span>
        <span>Buy-In</span>
        <span>Big Blind</span>
        <span></span>
      </div>

      {isConnected ? (
        <div className="tables-list">
          {areNonNullAttributes &&
            !hasTableAlready &&
            generateTableHtml(
              {
                name: name,
                buyIn: buyInPrice,
                bigBlind: bigBlindPrice,
                playerNames: [],
                pot: 0,
                communityCards: [null, null, null, null, null],
                playerNamesToData: {},
                isActive: false,
                currentDealerIndex: 0,
                currentPlayerIndex: 0,
                deck: null,
              },
              joinTable,
              true // create own table
            )}

          {generateTablesHtml(availableTables, joinTable)}
        </div>
      ) : (
        <div className="available-tables-message">
          Press Play Online to see tables.
        </div>
      )}
    </div>
  );
};

export default AvailableTablesList;
