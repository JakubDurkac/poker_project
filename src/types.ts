export interface ClientAttributes {
    socket: WebSocket | null;
    name: string | null;
    isConnected: boolean;
    isPlaying: boolean;
    buyInPrice: number | null;
    bigBlindPrice: number | null;
}

export interface Player {
    name: string;
    balance: number;
    cards: Array<Card | null>;
    currentBid: number;
    isDealer: boolean;
    isTheirTurn: boolean;
    status: "none" | "smallBlind" | "bigBlind" | "call" | "raise" | "check" | "fold" | "inactive";
    statusData: number; // bid amount in case of call, raise or blinds
}
  
export interface Community {
    balance: number;
    cards: Array<Card | null>;
}

// return type of useState() on Player object
// array [<Player (Object)>, <setPlayerObject (Function)>]
export type PlayerState = [Player, React.Dispatch<React.SetStateAction<Player>>];
export type CommunityState = [Community, React.Dispatch<React.SetStateAction<Community>>];

export enum Suit {
    HEARTS = 'h',
    DIAMONDS = 'd',
    CLUBS = 'c',
    SPADES = 's'
}

export enum Rank {
    TWO = '2',
    THREE = '3',
    FOUR = '4',
    FIVE = '5',
    SIX = '6',
    SEVEN = '7',
    EIGHT = '8',
    NINE = '9',
    TEN = 't',
    JACK = 'j',
    QUEEN = 'q',
    KING = 'k',
    ACE = 'a'
}

export interface Card {
    suit: Suit;
    rank: Rank;
}

interface PlayerData {
    cards: Array<Card | null>;
    balance: number;
    currentBid: number;
    totalBid: number;
    status: "none" | "smallBlind" | "bigBlind" | "call" | "raise" | "check" | "fold" | "inactive";
    statusData: number; // bid amount in case of call, raise or blinds
}

type PlayerNamesToData = {
    [playerName: string]: PlayerData;
};

export interface Table {
    name: string;
    buyIn: number;
    bigBlind: number;
    playerNames: string[];
    pot: number;
    communityCards: Array<Card | null>;
    playerNamesToData: PlayerNamesToData;
    isActive: boolean;
    currentDealerIndex: number;
    currentPlayerIndex: number;
    deck: null;
}

export interface Showdown {
    playerName: string;
    playerCards: Card[];
    overallRating: number;
    handAttributes: {
        rating: number;
        tieBreakers: number[]
    };
}