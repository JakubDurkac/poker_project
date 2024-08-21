import { useEffect, useState } from "react";
import OfflineMenu from "./components/OfflineMenu";
import PokerTable from "./components/PokerTable";
import {
  Player,
  Suit,
  Rank,
  Community,
  Table,
  ClientAttributes,
} from "./types";

const initialClientAttributes: ClientAttributes = {
  socket: null,
  name: null,
  isConnected: false,
  buyInPrice: null,
  bigBlindPrice: null,
};

function App() {
  const [clientAttributes, setClientAttributes] = useState<ClientAttributes>(
    initialClientAttributes
  );

  const playerStates = [
    useState<Player>({
      name: "Jack",
      balance: 100,
      cards: [
        { suit: Suit.HEARTS, rank: Rank.TWO },
        { suit: Suit.HEARTS, rank: Rank.THREE },
      ],
    }),
    useState<Player>({
      name: "John",
      balance: 100,
      cards: [null, null],
    }),
    useState<Player>({
      name: "George",
      balance: 100,
      cards: [null, null],
    }),
    useState<Player>({
      name: "Jeffrey",
      balance: 100,
      cards: [null, null],
    }),
    useState<Player>({
      name: "Jerry",
      balance: 100,
      cards: [null, null],
    }),
    useState<Player>({
      name: "Gideon",
      balance: 100,
      cards: [null, null],
    }),
  ];

  const communityState = useState<Community>({
    balance: 0,
    cards: [
      { suit: Suit.CLUBS, rank: Rank.ACE },
      { suit: Suit.SPADES, rank: Rank.QUEEN },
      { suit: Suit.DIAMONDS, rank: Rank.SEVEN },
      null,
      null,
    ],
  });

  const [availableTables, setAvailableTables] = useState<Table[]>([]);

  // useEffect(() => {
  //   // component states modification tests
  //   const interval = setInterval(() => {
  //     playerStates[0][1]((prevPlayer) => {
  //       return {
  //         name: prevPlayer.name,
  //         balance: prevPlayer.balance + 100,
  //         cards:
  //           prevPlayer.cards[0] && prevPlayer.cards[0].rank === Rank.TWO
  //             ? [
  //                 { suit: Suit.HEARTS, rank: Rank.THREE },
  //                 { suit: Suit.HEARTS, rank: Rank.TWO },
  //               ]
  //             : [
  //                 { suit: Suit.HEARTS, rank: Rank.TWO },
  //                 { suit: Suit.HEARTS, rank: Rank.THREE },
  //               ],
  //       };
  //     });
  //     playerStates[2][1]((prevPlayer) => {
  //       return {
  //         name: prevPlayer.name,
  //         balance: prevPlayer.balance + 200,
  //         cards: prevPlayer.cards,
  //       };
  //     });
  //     playerStates[4][1]((prevPlayer) => {
  //       return {
  //         name: prevPlayer.name,
  //         balance: prevPlayer.balance + 300,
  //         cards: prevPlayer.cards,
  //       };
  //     });

  //     communityState[1]((prevCommunity) => {
  //       return {
  //         balance: prevCommunity.balance + 100,
  //         cards:
  //           prevCommunity.balance % 200 === 0
  //             ? [
  //                 prevCommunity.cards[0],
  //                 prevCommunity.cards[1],
  //                 prevCommunity.cards[2],
  //                 prevCommunity.cards[3],
  //                 prevCommunity.cards[4],
  //               ]
  //             : [
  //                 prevCommunity.cards[2],
  //                 prevCommunity.cards[1],
  //                 prevCommunity.cards[0],
  //                 prevCommunity.cards[3],
  //                 prevCommunity.cards[4],
  //               ],
  //       };
  //     });
  //   }, 3000);

  //   return () => clearInterval(interval);
  // }, []);

  const connectToServer = (
    playerName: string,
    buyInPrice: number,
    bigBlindPrice: number
  ) => {
    // todo - if (!isValidName(playerName)) {notify user; return;}

    const newSocket = new WebSocket("ws://localhost:3000");
    setClientAttributes((prevAttributes) => {
      return {
        ...prevAttributes,
        name: playerName,
        socket: newSocket,
        buyInPrice: buyInPrice,
        bigBlindPrice: bigBlindPrice,
      };
    });

    newSocket.addEventListener("open", () => {
      setClientIsConnected(true);
      sendInitialMessage(newSocket, playerName, buyInPrice, bigBlindPrice);
    });
    newSocket.addEventListener("message", (event) => {
      handleIncomingMessage(newSocket, playerName, event);
    });
    newSocket.addEventListener("error", () => {
      console.log("Server Error.");
    });
    newSocket.addEventListener("close", () => {
      setClientAttributes(initialClientAttributes);
    });
  };

  const sendInitialMessage = (
    socket: WebSocket,
    playerName: string,
    buyInPrice: number,
    bigBlindPrice: number
  ) => {
    const dataToSend = {
      clientName: playerName,
      buyInPrice: buyInPrice,
      bigBlindPrice: bigBlindPrice,
    };

    const message = {
      type: "initial",
      data: dataToSend,
    };

    if (socket) {
      socket.send(JSON.stringify(message));
    }
  };

  const handleIncomingMessage = (
    socket: WebSocket,
    playerName: string,
    event: MessageEvent
  ) => {
    let message;
    try {
      message = JSON.parse(event.data.toString());
    } catch (error) {
      console.error("JSON parsing failed:", error);
    }

    if (!message || !message.type) {
      console.log("Invalid message structure.");
      return;
    }

    switch (message.type) {
      case "duplicate":
        // todo - name taken, notify player
        socket.close(); // disconnect
        break;

      case "tablesList":
        setAvailableTables(message.data);
        break;

      case "tableUpdate":
        updateLocalTable(message.data, playerName);
        break;

      default:
        break;
    }
  };

  const updateLocalTable = (table: Table, localPlayerName: string) => {
    const { playerNames, playerNamesToData, pot, communityCards } = table;
    const localPlayerNames = reorderNames(playerNames, localPlayerName);

    localPlayerNames.forEach((playerName, index) => {
      const { cards, balance, currentBid } = playerNamesToData[playerName]; // todo - add currentBid property to player and display it, later might add isDealer, isTheirTurn, lastChoice
      const setPlayerState = playerStates[index][1];
      setPlayerState({
        name: playerName,
        balance: balance,
        cards: cards,
      });
    });

    const setCommunityState = communityState[1];
    setCommunityState({
      balance: pot,
      cards: communityCards,
    });
  };

  const reorderNames = (names: string[], targetName: string) => {
    const index = names.indexOf(targetName);
    if (index === -1) {
      return names;
    }

    return [...names.slice(index), ...names.slice(0, index)];
  };

  const joinTable = (tableName: string) => {
    const { name, buyInPrice, bigBlindPrice } = clientAttributes;
    const dataToSend = {
      tableName: tableName,
      playerName: name,
      playerBuyIn: buyInPrice,
      playerBigBlind: bigBlindPrice,
    };

    const message = {
      type: "joinTableRequest",
      data: dataToSend,
    };

    if (clientAttributes.socket) {
      clientAttributes.socket.send(JSON.stringify(message));
    }
  };

  const setClientIsConnected = (value: boolean) => {
    setClientAttributes((prevAttributes) => {
      return { ...prevAttributes, isConnected: value };
    });
  };

  return (
    <div className="app-container">
      <PokerTable playerStates={playerStates} communityState={communityState} />
      <OfflineMenu
        availableTables={availableTables}
        clientAttributes={clientAttributes}
        connectToServer={connectToServer}
        joinTable={joinTable}
      />
    </div>
  );
}

export default App;
