import { Card, Table } from "../types";

export function generateCardsHtml(cards: Array<Card | null>) {
  return (
    <div className="poker-cards-box">
      {cards.map((card, index) => {
        return (
          <img
            key={index}
            className={card ? "poker-card" : "poker-card poker-card-backside"}
            src={`/src/assets/card-images/${
              card ? String(card.suit) + String(card.rank) : "backside"
            }.png`}
          />
        );
      })}
    </div>
  );
}

export function generateStatusMessage(status: string, statusData: number) {
  let message = "";

  switch (status) {
    case "smallBlind":
      message = `Small Blind $${statusData}.`;
      break;
    case "bigBlind":
      message = `Big Blind $${statusData}.`;
      break;
    case "call":
      message = `Call $${statusData}.`;
      break;
    case "raise":
      message = `Raise by $${statusData}.`;
      break;
    case "check":
      message = `Check.`;
      break;
    case "fold":
      message = `Fold.`;
      break;
    default:
      break;
  }

  return (
    <div>
      {message === "" ? (
        ""
      ) : (
        <span className="player-status-message">{message}</span>
      )}
    </div>
  );
}

export function generateTablesHtml(
  tables: Table[],
  joinTable: (name: string) => void
) {
  return tables.map((table) => {
    return generateTableHtml(table, joinTable, false);
  });
}

export function generateTableHtml(
  table: Table,
  joinTable: (name: string) => void,
  isCreateNew: boolean
) {
  return (
    <div className="table-to-join" key={table.name}>
      <span>{table.name}</span>
      <span>${table.buyIn}</span>
      <span>${table.bigBlind}</span>
      <button
        className="join-table-button"
        onClick={() => joinTable(isCreateNew ? "#newTable" : table.name)}
      >
        {`SIT (${table.playerNames.length}/6)`}
      </button>
    </div>
  );
}
