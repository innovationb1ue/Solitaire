import { shuffle, chunk } from "lodash";

// get int number of card rank
export const processRank = function(rank) {
  if (rank === "K" || rank === "Q" || rank === "J" || rank === "A") {
    switch (rank) {
      case "K":
        return 13;
      case "Q":
        return 12;
      case "J":
        return 11;
      case "A":
        return 1;
    }
  } else {
    return parseInt(rank);
  }
};

export const spiderInit = function() {
  let initDeck = [];
  this.ranks.forEach(rank => {
    // this.suits.forEach(suit => {
    var suit = "spades";
    initDeck.push(
      { rank, isDown: true, suit, deck: 1 },
      { rank, isDown: true, suit, deck: 2 },
      { rank, isDown: true, suit, deck: 3 },
      { rank, isDown: true, suit, deck: 4 },
      { rank, isDown: true, suit, deck: 5 },
      { rank, isDown: true, suit, deck: 6 },
      { rank, isDown: true, suit, deck: 7 },
      { rank, isDown: true, suit, deck: 8 }
    );
    // });
  });
  let shuffledDeck = shuffle(initDeck);
  this.decks = chunk(shuffledDeck.slice(0, 50), 5);
  this.decks[10] = shuffledDeck.slice(50);
  this.decks.forEach((deck, index) => {
    if (index !== 10) deck[deck.length - 1].isDown = false;
  });
};

// check availability of moving a series to new deck
export const checkMoveSpider = function(dropTarget, deck, selectedCard) {
  return processRank(dropTarget.rank) - processRank(selectedCard.rank) === 1 && deck[deck.length - 1] === dropTarget;
};

// check whether card is movable. whether the card to move to select deck
export const isMovable = function(card, deck) {
  // select card series till the end of deck
  let movingCards = deck.slice(deck.indexOf(card));
  for (let index = 0; index < movingCards.length - 1; index++) {
    if (movingCards[index].rank_num - movingCards[index+1].rank_num !== 1 || movingCards[index].suit !== movingCards[index+1].suit){
      return false
    }
  }
  return true;
};

// 消除凑齐的牌列
export const checkPile = function(pile) {
  let ranks = pile.map(card => {
    return processRank(card.rank);
  });
  let suits = pile.map(card => {
    return card.suit
  })
  const checkArray = [13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
  if (checkArray.toString() !== ranks.slice(-13).toString()) {
    return false
  }
  for (let i = 0;i<suits.length-1;i++){
    if (suits[i] !== suits[i+1]){
      return false
    }
  }
  return true;
};

export const moveCards = function(toDeck, fromDeck, fromCard) {
  let movedCards = fromDeck.splice(fromDeck.indexOf(fromCard));
  movedCards.forEach(newCard => {
    toDeck.push(newCard);
  });
  try {
    if (fromDeck[fromDeck.length - 1].isDown === true) {
      fromDeck[fromDeck.length - 1].isDown = false;
    }
  } catch (e) {
    console.log(e);
  }
};
