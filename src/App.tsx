import { useEffect, useState } from "react";
import OfflineMenu from "./components/OfflineMenu";
import PokerTable from "./components/PokerTable";
import { Player, Suit, Rank } from "./types";

function App() {
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

  useEffect(() => {
    // simulation of player states modification (for debugging purposes)
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
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app-container">
      <PokerTable playerStates={playerStates} />
      <OfflineMenu />
    </div>
  );
}

export default App;
