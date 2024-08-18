import { useEffect, useState } from "react";
import OfflineMenu from "./components/OfflineMenu";
import PokerTable from "./components/PokerTable";

function App() {
  const playerStates = [
    useState({
      name: "Jack",
      balance: 100,
    }),
    useState({
      name: "John",
      balance: 100,
    }),
    useState({
      name: "George",
      balance: 100,
    }),
    useState({
      name: "Jeffrey",
      balance: 100,
    }),
    useState({
      name: "Jerry",
      balance: 100,
    }),
    useState({
      name: "Gideon",
      balance: 100,
    }),
  ];

  useEffect(() => {
    // simulation of player states modification (for debugging purposes)
    const interval = setInterval(() => {
      playerStates[0][1]((prevPlayer) => {
        return { name: prevPlayer.name, balance: prevPlayer.balance + 100 };
      });
      playerStates[2][1]((prevPlayer) => {
        return { name: prevPlayer.name, balance: prevPlayer.balance + 200 };
      });
      playerStates[4][1]((prevPlayer) => {
        return { name: prevPlayer.name, balance: prevPlayer.balance + 300 };
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
