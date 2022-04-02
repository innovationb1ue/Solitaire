import { shuffle, chunk } from "lodash";
import {ranks_num} from "@/assets/CardInitInfo";


// this file initiate two deck of cards and shuffle then into 11 groups, where the last group is the card pile.

export const normalInit = function() {
  let initDeck = [];  // Deck array for 104 cards
  this.ranks.forEach(rank => {
    this.suits.forEach(suit => {
      initDeck.push(
          // Single card object representation
          // 2 decks of cards so 2 cards initiated
        { rank: rank, isDown: true, suit: suit, deck: 1 , rank_num:ranks_num[this.ranks.indexOf(rank)]},
        { rank: rank, isDown: true, suit: suit, deck: 2 , rank_num:ranks_num[this.ranks.indexOf(rank)]}
      );
    });
  });
  let shuffledDeck = shuffle(initDeck);
  // split first 50 cards into 10 piles
  this.decks = chunk(shuffledDeck.slice(0, 50), 5);
  // decks[10] is the undistributed card pile
  this.decks[10] = shuffledDeck.slice(50, shuffledDeck.length);
  // set last card of first 10 piles viewable
  this.decks.forEach((deck, index) => {
    if (index !== 10) deck[deck.length - 1].isDown = false;
  });
};
