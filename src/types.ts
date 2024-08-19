export interface Player {
    name: string;
    balance: number;
    cards: Array<Card | null>;
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