# [moodypoker.com](https://moodypoker.com/)
A poker web app that focuses on online gameplay and offers all the essential features for comfortable online poker.
- **frontend** (this) written using **React**, **TypeScript**, **HTML** and **CSS**, deployed using [Vercel](https://vercel.com/)
- for **backend** (management of tables, players, bidding rounds, calculating strength of player's best combination, communication, etc.), look [here](https://github.com/JakubDurkac/poker_project_backend)

## Features

### Poker Table and Menu
- **poker table** for 2-6 players at once, communicating all the necessary game info to the players in real time
- simple **menu** to access all the interactive options at one place

### Game Setup
- on the right side, leave default or choose your preffered Buy-In and Big Blind prices (these shall be used for creating your own table)
- enter your name and press **Play Online** to join the online matchmaking
- at this point, you may choose table with your name (create new game), your table is displayed to others and free to be joined by others
- at the same time, other active tables are displayed (showing current number of players at the table), and you may choose to join any of them
- pressing **SIT** next to a table will make you join with starting balance equal to Buy-In, eligible to make active in-game choices after the start of the next round

<img src="/src/assets/game_setup.png">

### During Game
- thanks to React, offline menu is simply replaced by in-game menu featuring in-game choices, hand showdown results and chat
- in-game choices including **Raise**, **Call**, **Check** and **Fold** are shown to the player
- for each player, their **names**, **balance** and **current bids** are shown and updated in real time
- **community area** including current **pot** and **community cards** is shown and updated in real time
- when 2+ players are present, table becomes active automatically, dealer is chosen, small and big blind is collected, cards are being dealt, players make choices in bidding rounds
- in-game choices are enabled or disabled based on the context, including player's current balance, current bid, highest bid, etc.
- server processes each in-game choice, then progressing the game by choosing who's turn it is now, concluding bidding rounds, revealing community cards (flop, river, turn), concluding hands, etc.
- when a hand ends by revealing cards, **showdown result** is generated, displaying each player's hand ranked by strength, naming player's winning combination type (Pair, Flush, etc.)
- pot amount is distributed between players based on Texas No Limit Hold'Em Poker rules (calculated by server, displayed by client)
- **ChatLog** for chatting with opponents as well as system messages

<img src="/src/assets/during_game.png">

### To run client app locally
- clone the repository
```
git clone https://github.com/JakubDurkac/poker_project.git
```
- in the root directory, install the dependencies for a Node.js project using:
```
npm install
```
- run development server
```
npm run dev
```
