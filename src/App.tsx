import { useEffect, useState } from "react";
import OfflineMenu from "./components/OfflineMenu";
import PokerTable from "./components/PokerTable";
import { Player, Suit, Rank, Community } from "./types";

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

  return (
    <div className="app-container">
      <PokerTable playerStates={playerStates} communityState={communityState} />
      <OfflineMenu />
    </div>
  );
}

export default App;
