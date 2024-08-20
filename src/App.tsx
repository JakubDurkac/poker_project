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

  const [availableTables, setAvailableTables] = useState<Table[]>([
    {
      name: "High Stakes",
      buyIn: 2000,
      bigBlind: 20,
    },
    {
      name: "Casual Play",
      buyIn: 500,
      bigBlind: 5,
    },
    {
      name: "Low Stakes",
      buyIn: 100,
      bigBlind: 2,
    },
  ]);

  useEffect(() => {
    // component states modification tests
    const interval = setInterval(() => {
      playerStates[0][1]((prevPlayer) => {
        return {
          name: prevPlayer.name,
          balance: prevPlayer.balance + 100,
          cards:
            prevPlayer.cards[0] && prevPlayer.cards[0].rank === Rank.TWO
              ? [
                  { suit: Suit.HEARTS, rank: Rank.THREE },
                  { suit: Suit.HEARTS, rank: Rank.TWO },
                ]
              : [
                  { suit: Suit.HEARTS, rank: Rank.TWO },
                  { suit: Suit.HEARTS, rank: Rank.THREE },
                ],
        };
      });
      playerStates[2][1]((prevPlayer) => {
        return {
          name: prevPlayer.name,
          balance: prevPlayer.balance + 200,
          cards: prevPlayer.cards,
        };
      });
      playerStates[4][1]((prevPlayer) => {
        return {
          name: prevPlayer.name,
          balance: prevPlayer.balance + 300,
          cards: prevPlayer.cards,
        };
      });

      communityState[1]((prevCommunity) => {
        return {
          balance: prevCommunity.balance + 100,
          cards:
            prevCommunity.balance % 200 === 0
              ? [
                  prevCommunity.cards[0],
                  prevCommunity.cards[1],
                  prevCommunity.cards[2],
                  prevCommunity.cards[3],
                  prevCommunity.cards[4],
                ]
              : [
                  prevCommunity.cards[2],
                  prevCommunity.cards[1],
                  prevCommunity.cards[0],
                  prevCommunity.cards[3],
                  prevCommunity.cards[4],
                ],
        };
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

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
      };
    });

    newSocket.addEventListener("open", () => {
      setClientIsConnected(true);
      sendInitialMessage(buyInPrice, bigBlindPrice);
    });
    newSocket.addEventListener("message", handleIncomingMessage);
    newSocket.addEventListener("error", () => {
      console.log("Server Error.");
    });
    newSocket.addEventListener("close", () => {
      setClientAttributes(initialClientAttributes);
    });
  };

  const sendInitialMessage = (buyInPrice: number, bigBlindPrice: number) => {
    const { name, socket } = clientAttributes;
    const dataToSend = {
      clientName: name,
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

  const handleIncomingMessage = (event: MessageEvent) => {
    const message = JSON.parse(event.data.toString());

    switch (message.type) {
      default:
        return;
    }
  };

  const joinTable = (tableName: string) => {
    return;
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
        connectToServer={connectToServer}
        joinTable={joinTable}
      />
    </div>
  );
}

export default App;
