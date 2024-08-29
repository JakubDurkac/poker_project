import { useState } from "react";
import OfflineMenu from "./components/OfflineMenu";
import OnlineMenu from "./components/OnlineMenu";
import PokerTable from "./components/PokerTable";
import {
  Player,
  Community,
  Table,
  ClientAttributes,
  PlayerState,
  Showdown,
  Suit,
  Rank,
  ChatMessage,
} from "./types";

const initialClientAttributes: ClientAttributes = {
  socket: null,
  name: null,
  isConnected: false,
  isPlaying: false,
  buyInPrice: null,
  bigBlindPrice: null,
};

const emptySeatPlayer: Player = {
  name: "Empty Seat",
  balance: 0,
  cards: [null, null],
  currentBid: 0,
  isDealer: false,
  isTheirTurn: false,
  status: "inactive",
  statusData: 0,
};

const initialCommunityState = {
  balance: 0,
  cards: [
    { suit: Suit.DIAMONDS, rank: Rank.TEN },
    { suit: Suit.DIAMONDS, rank: Rank.JACK },
    { suit: Suit.DIAMONDS, rank: Rank.QUEEN },
    { suit: Suit.DIAMONDS, rank: Rank.KING },
    { suit: Suit.DIAMONDS, rank: Rank.ACE },
  ],
};

const allowedNamePattern = /^[a-zA-Z0-9_-]+$/;

function getPlayerCopy(player: Player) {
  return JSON.parse(JSON.stringify(player));
}

function App() {
  const [clientAttributes, setClientAttributes] = useState<ClientAttributes>(
    initialClientAttributes
  );

  const playerStates: PlayerState[] = [];

  for (let i = 0; i < 6; i++) {
    playerStates.push(useState<Player>(getPlayerCopy(emptySeatPlayer)));
  }

  const communityState = useState<Community>(initialCommunityState);

  const [availableTables, setAvailableTables] = useState<Table[]>([]);
  const [showdownObjects, setShowdownObjects] = useState<Showdown[]>([]);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      author: "system",
      message: "Chat and system messages here!",
    },
  ]);

  const addChatMessage = (author: string, message: string) => {
    const newMessage: ChatMessage = {
      author: author,
      message: message,
    };

    setChatMessages((prevMessages) => [...prevMessages, newMessage]);

    const { name, socket, isPlaying } = clientAttributes;
    if (isPlaying && name && socket) {
      const dataToSend = {
        chatMessage: newMessage,
      };

      const message = {
        type: "chatMessage",
        data: dataToSend,
      };

      if (socket) {
        socket.send(JSON.stringify(message));
      }
    }
  };

  const addChatMessageWithoutSending = (author: string, message: string) => {
    const newMessage: ChatMessage = {
      author: author,
      message: message,
    };

    setChatMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  const isValidName = (playerName: string) => {
    if (playerName === "") {
      addChatMessageWithoutSending("system", "Enter your name.");
      return false;
    }

    if (playerName.length > 11) {
      addChatMessageWithoutSending("system", "Name is too long. (> 10)");
      return false;
    }

    if (!allowedNamePattern.test(playerName)) {
      addChatMessageWithoutSending(
        "system",
        "Invalid name. Use english letters, numbers, underscore and dash."
      );
      return false;
    }

    return true;
  };

  const connectToServer = (
    playerName: string,
    buyInPrice: number,
    bigBlindPrice: number
  ) => {
    if (!isValidName(playerName)) {
      return;
    }

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
      addChatMessageWithoutSending("system", "Connected to server.");
    });
    newSocket.addEventListener("message", (event) => {
      handleIncomingMessage(newSocket, playerName, event);
    });
    newSocket.addEventListener("error", () => {
      addChatMessageWithoutSending("system", "Server Error.");
    });
    newSocket.addEventListener("close", () => {
      setClientAttributes(initialClientAttributes);
      const setCommunityState = communityState[1];
      setCommunityState(initialCommunityState);
      playerStates.forEach((playerState) => {
        const setPlayerState = playerState[1];
        setPlayerState(getPlayerCopy(emptySeatPlayer));
      });
      addChatMessageWithoutSending("system", "Disconnected from server.");
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

      case "bankrupt":
        // notify player in log
        setClientIsPlaying(false);
        break;

      case "showdown":
        setShowdownObjects(message.data);
        break;

      case "chatMessage":
        const { chatAuthor, chatMessage } = message.data;
        addChatMessageWithoutSending(chatAuthor, chatMessage);
        break;

      default:
        break;
    }
  };

  const updateLocalTable = (table: Table, localPlayerName: string) => {
    if (
      !clientAttributes.isPlaying ||
      clientAttributes.buyInPrice !== table.buyIn ||
      clientAttributes.bigBlindPrice !== table.bigBlind
    ) {
      setClientAttributes((prevAttributes) => {
        return {
          ...prevAttributes,
          isPlaying: true,
          isConnected: true,
          buyInPrice: table.buyIn,
          bigBlindPrice: table.bigBlind,
        };
      });
    }

    const {
      playerNames,
      playerNamesToData,
      pot,
      communityCards,
      currentDealerIndex,
      currentPlayerIndex,
    } = table;
    const dealerName = playerNames[currentDealerIndex];
    const theirTurnName = playerNames[currentPlayerIndex];

    const localPlayerNames = reorderNames(playerNames, localPlayerName);

    // positioning players symmetrically
    let seatsIndexes = [0, 1, 2, 3, 4, 5];
    switch (localPlayerNames.length) {
      case 2:
        seatsIndexes = [0, 3, 1, 2, 4, 5];
        break;
      case 3:
        seatsIndexes = [0, 2, 4, 1, 3, 5];
        break;
      case 4:
        seatsIndexes = [0, 2, 3, 4, 1, 5];
        break;
      case 5:
        seatsIndexes = [0, 1, 2, 4, 5, 3];
        break;
      default:
        break;
    }

    seatsIndexes.forEach((seatIndex, playerIndex) => {
      const setPlayerState = playerStates[seatIndex][1];
      if (playerIndex < localPlayerNames.length) {
        const playerName = localPlayerNames[playerIndex];
        const { cards, balance, currentBid, status, statusData } =
          playerNamesToData[playerName];

        setPlayerState({
          name: playerName,
          balance: balance,
          cards: cards,
          currentBid: currentBid,
          isDealer: playerName === dealerName,
          isTheirTurn: playerName === theirTurnName,
          status: status,
          statusData: statusData,
        });
      } else {
        setPlayerState(getPlayerCopy(emptySeatPlayer));
      }
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

  const setClientIsPlaying = (value: boolean) => {
    setClientAttributes((prevAttributes) => {
      return { ...prevAttributes, isPlaying: value };
    });
  };

  const makeInGameChoice = (type: string, data: number) => {
    const { name, socket } = clientAttributes;

    const dataToSend = {
      clientName: name,
      status: type,
      statusData: data,
    };

    const message = {
      type: "inGameChoice",
      data: dataToSend,
    };

    if (socket) {
      socket.send(JSON.stringify(message));
    }
  };

  return (
    <div className="app-container">
      <PokerTable
        playerStates={playerStates}
        communityState={communityState}
        clientAttributes={clientAttributes}
      />
      {clientAttributes.isPlaying ? (
        <OnlineMenu
          makeInGameChoice={makeInGameChoice}
          playerStates={playerStates}
          clientAttributes={clientAttributes}
          showdownObjects={showdownObjects}
          chatMessages={chatMessages}
          addChatMessage={addChatMessage}
        />
      ) : (
        <OfflineMenu
          availableTables={availableTables}
          clientAttributes={clientAttributes}
          connectToServer={connectToServer}
          joinTable={joinTable}
          chatMessages={chatMessages}
          addChatMessage={addChatMessage}
        />
      )}
    </div>
  );
}

export default App;
