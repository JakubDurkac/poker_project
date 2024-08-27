import { Card, Showdown, Table } from "../types";

const ratingToHand = [
  "None",
  "High Card",
  "Pair",
  "Two Pair",
  "Three Of A Kind",
  "Straight",
  "Flush",
  "Full House",
  "Four Of A kind",
  "Straight Flush",
];

const rankValueToWord = [
  "",
  "",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
  "A",
];

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

export function generateShowdownHtml(showdownObjects: Showdown[]) {
  let currentRank = 1;
  let previousRating = showdownObjects[0].overallRating;

  return showdownObjects.map((obj) => {
    if (obj.overallRating !== previousRating) {
      currentRank++;
      previousRating = obj.overallRating;
    }

    return (
      <>
        <div className="showdown-line" key={obj.playerName}>
          <div className="showdown-name">
            <div>{obj.playerName}</div>
            <div>
              <span
                className="showdown-place"
                id={`showdown-place-${currentRank}`}
              >
                {currentRank}.
              </span>
            </div>
          </div>
          <div className="showdown-hand">
            <div>{generateCardsIconsHtml(obj.playerCards)}</div>
            <div>{`${
              ratingToHand[obj.handAttributes.rating]
            } (${formatTieBreakers(obj.handAttributes)})`}</div>
          </div>
        </div>
      </>
    );
  });
}

function formatTieBreakers(handAttributes: {
  rating: number;
  tieBreakers: number[];
}) {
  const { rating, tieBreakers } = handAttributes;
  const handName = ratingToHand[rating];
  const tieBreaker1 = rankValueToWord[tieBreakers[0]];
  const tieBreaker2 = rankValueToWord[tieBreakers[1]];
  if (handName === "High Card") {
    return tieBreaker1;
  } else if (
    handName === "Pair" ||
    handName === "Three Of A Kind" ||
    handName === "Four Of A Kind"
  ) {
    return `${tieBreaker1}s`;
  } else if (handName === "Two Pair") {
    return `${tieBreaker1}s, ${tieBreaker2}s`;
  } else if (handName === "Full House") {
    return `${tieBreaker1}s over ${tieBreaker2}s`;
  } else if (handName === "Straight" || handName === "Straight Flush") {
    const tieBreakersCopy = [];
    for (let i = 0; i < 5; i++) {
      tieBreakersCopy.push(rankValueToWord[tieBreakers[0] - i]);
    }
    return tieBreakersCopy.join(", ");
  } else if (handName === "Flush") {
    return tieBreakers
      .map((tieBreaker) => {
        return rankValueToWord[tieBreaker];
      })
      .join(", ");
  }

  return "";
}

function generateCardsIconsHtml(cards: Card[]) {
  return (
    <div className="poker-cards-icons-box">
      {cards.map((card, index) => {
        return (
          <img
            key={index}
            className="poker-card-icon"
            src={`/src/assets/card-images/${
              String(card.suit) + String(card.rank)
            }.png`}
          />
        );
      })}
    </div>
  );
}
