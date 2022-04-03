<template>
  <div id="game_container">
    <!--  buttons  -->
    <el-row class="button_layer">
      <el-col :span="12">
        <el-button class="goback" @click="ClickMenu">Menu
        </el-button>
      </el-col>
      <el-col :span="12">
        <el-button class="goback" @click="Regret">Regret</el-button>
      </el-col>
    </el-row>
    <div class="green_table">
      <!--   10 column of cards   -->
      <div
          v-for="deck in decks.slice(0, 10)"
          id="1"
          :key="decks.indexOf(deck) || 'null'"
          class="card card_holder"
      >
        <!--空牌堆Holder-->
        <Holder
            v-if="deck.length === 0"
            @click="selectCard('', deck, true)"
            @dragenter="dragEnter($event, '', deck)"
        ></Holder>
        <transition-group name="list" tag="div">
          <div
              v-for="card in deck"
              :key="card.rank + card.deck + card.suit"
              :ref="card.rank + card.deck + card.suit"
              class="card_wrapper"
              @drag="dragCards($event, card)"
              @dragend="drop($event, card)"
              @dragenter="
                dragEnter($event, card, deck);
            "
              @dragstart="dragInit($event, card, deck)"
          >
            <Card
                :card="card"
                :isSelected="card.isSelected"
                @click="selectCard(card, deck)"
            ></Card>
          </div>
        </transition-group>
      </div>
      <!--   card pile, click to deal to each column  -->
      <div
          v-if="decks[10].length !== 0"
          :class="decks[10].length !== 0 ? 'down' : 'card'"
          class="pile card"
          @click="dealCards()"
      ></div>
    </div>
    <div class="card_left_tag"><p>{{ this.$data.room_uuid }}</p></div>
    <div class="opponent_table">
      <div
          v-for="deck in OpponentDeck.slice(0, 10)"
          id="2"
          :key="OpponentDeck.indexOf(deck) || 'null'"
          class="card card_holder"
      >
        <!--空牌堆Holder-->
        <Holder
            v-if="deck.length === 0"
        ></Holder>
        <transition-group name="list" tag="div">
          <div
              v-for="card in deck"
              :key="card.rank + card.deck + card.suit"
              :ref="card.rank + card.deck + card.suit"
              class="card_wrapper"
          >
            <Card
                :card="card"
                :isSelected="card.isSelected"
            ></Card>
          </div>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script>
import Card from "../components/Card.vue";
import Holder from "../components/Holder.vue";
import {ranks, suits, symbols} from "../assets/CardInitInfo";
import {checkMoveSpider, checkPile, isMovable, moveCards, processRank, spiderInit} from "../assets/js/spiderSolitaire";
import {normalInit} from "../assets/js/normalSolitaire";
import flipSound from "../assets/audio/flip2.wav";
import shuffleSound from "../assets/audio/shuffle3.wav";

export default {
  name: "Spider",
  components: {Card, Holder},
  props: {gameMode: String, roomUUID: String, PlayerName: String},
  data: function () {
    return {
      ranks,
      suits,
      symbols,
      decks: [],  // basically store all the game state information
      selectedCard: "",
      selectedDeck: "",
      selectedArray: [],
      completedHands: 0,
      flipSound,
      shuffleSound,
      origin,
      socket: undefined,
      player_id: "",
      otherPlayerCardCount: 0,
      OpponentDeck: [],
      history: [], // for player move history
      room_uuid: ""
    };
  },
  methods: {
    normalInit,
    spiderInit,
    checkPile,
    processRank,
    checkMoveSpider,
    isMovable,
    moveCards,
    dragInit: function (e, card, deck) {
      console.log("drag card", card)
      this.origin = {
        x: e.pageX,
        y: e.pageY
      };
      e.dataTransfer.setData("text", "silentlad");
      e.dataTransfer.setDragImage(new Image("0", "0"), -10, -10);
      this.removeSelection();
      this.selectCard(card, deck);
    },
    dragCards: function (e) {
      this.selectedArray.forEach(card => {
        let card_ref = `${card.rank + card.deck + card.suit}`;
        let c = this.$refs[card_ref][0];
        let x = e.pageX - this.origin.x;
        let y = e.pageY - this.origin.y;
        let css;
        if (e.pageX === 0) {
          css = "z-index:9999;transform:translate(0px,0px);display:none;";
        } else {
          css =
              "z-index:9999;pointer-events: none; transform: scale(1.05, 1.05) rotate(0deg) translate(" +
              x +
              "px, " +
              y +
              "px);";
        }
        c.style.cssText = css;
      });
    },
    drop: function () {
      // move to empty space
      if (this.highlightedCard === "") {
          if (isMovable(this.selectedCard, this.selectedDeck)) {
            // append history
            this.$data.history.push(JSON.parse(JSON.stringify(this.decks)))
            this.moveCards(
                this.highlightedDeck,
                this.selectedDeck,
                this.selectedCard
            );
            this.isCompleteHand(this.highlightedDeck);
            this.removeSelection();
            this.playSound();
          } else {
            this.removeSelection();
          }
      }
      // move a series of cards
      if (
          checkMoveSpider(
              this.highlightedCard,
              this.highlightedDeck,
              this.selectedCard
          )
      ) {
        if (isMovable(this.selectedCard, this.selectedDeck)) {
          this.selectedArray.forEach(card => {
            let c = this.$refs[`${card.rank + card.deck + card.suit}`]
                [0];
            c.style.cssText = "z-index:0;pointer-events:auto;display:none;";
          });
          // append history
          this.$data.history.push(JSON.parse(JSON.stringify(this.decks)))
          this.moveCards(
              this.highlightedDeck,
              this.selectedDeck,
              this.selectedCard
          );
          this.isCompleteHand(this.highlightedDeck);
          this.removeSelection();
          this.playSound();
        } else {
          this.selectedArray.forEach(card => {
            let c = this.$refs[`${card.rank + card.deck + card.suit}`]
                [0];
            c.style.cssText = "z-index:0;pointer-events:auto;";
          });
          this.removeSelection();
        }
      } else {
        this.selectedArray.forEach(card => {
          let c = this.$refs[`${card.rank + card.deck + card.suit}`]
              [0];
          c.style.cssText = "z-index:0;pointer-events:auto;";
        });
        this.removeSelection();
      }
    },
    dragEnter: function (e, card, deck) {
      if (card.isDown) return;
      this.highlightedCard = card;
      this.highlightedDeck = deck;
    },
    gameOver: function () {
      console.log("GameOver");
      if (confirm("Congrats,You Won the Game.Do you want to continue?")) {
        this.spiderInit();
      }
    },
    handComplete: function () {
      let completeGameFlag = true
      this.decks.forEach(deck => {
        if (deck.length !== 0) {
          completeGameFlag = false
        }
      })
      if(completeGameFlag){
        this.gameOver()
      }
    },
    removeSelection: function () {
      this.decks.forEach(deck => {
        deck.forEach(card => {
          card.isSelected = false;
        })
      })
      this.selectedArray = [];
      this.selectedCard = "";
      this.selectedDeck = "";
      this.highlightedCard = "";
      this.highlightedDeck = "";
      this.$forceUpdate();
    },
    dealCards: function () {
      if (this.decks[10].length !== 0) {
        this.playSound(true);
        this.decks.forEach(deck => {
          if (this.decks[10].length > 0) {
            let newCard = this.decks[10].pop();
            newCard.isDown = false;
            deck.push(newCard);
          }
        });
        this.decks.forEach(deck => {
          this.isCompleteHand(deck);
        });
        this.$forceUpdate();
      }
    },
    isCompleteHand: function (deck) {
      if (!deck)return;
      // 如果不能消则直接返回
      if (!this.checkPile(deck)) return;
      // 作消除卡牌操作
      deck.splice(-13);
      this.playSound();
      this.handComplete();
      // 把消除牌列上的一张牌翻开
      if (deck.length !== 0) deck[deck.length - 1].isDown = false;
      this.SyncCardCount()
    },
    // click single card handler function
    selectCard: function (cardSelected, deck, holder) {
      this.playSound();
      if (cardSelected.isDown) {
        return;
      }
      // move to empty space
      if (holder && this.selectedCard) {
        if (isMovable(this.selectedCard, this.selectedDeck)) {
          // append history
          this.$data.history.push(JSON.parse(JSON.stringify(this.decks)))
          this.moveCards(deck, this.selectedDeck, this.selectedCard);
          this.isCompleteHand(deck);
          this.removeSelection();
        } else {
          this.removeSelection();
        }
      }
      // select single card
      if (this.selectedCard === "") {
        try {
          this.selectedCard = cardSelected;
          this.selectedDeck = deck;
          if (isMovable(this.selectedCard, this.selectedDeck)) {
            // 取出点选的以及后接卡牌
            this.selectedArray = this.selectedDeck.slice(
                this.selectedDeck.indexOf(this.selectedCard)
            );
            this.selectedArray.forEach(element => {
              element.isSelected = true;
            });
            this.isCompleteHand(this.selectedDeck)
          }
          this.$forceUpdate();
        } catch (e) {
          console.log(e);
        }
      }
      else
      // move a series of cards
      {
        if (checkMoveSpider(cardSelected, deck, this.selectedCard)) {
          if (isMovable(this.selectedCard, this.selectedDeck)) {
            // append history
            this.$data.history.push(JSON.parse(JSON.stringify(this.decks)))
            this.moveCards(deck, this.selectedDeck, this.selectedCard);
            this.isCompleteHand(deck);
            this.removeSelection();
          } else {
            this.removeSelection();
          }
        } else {
          this.removeSelection();
        }
      }
    },
    // play card select sound
    playSound(shuffle) {
      if (shuffle) {
        let audio = new Audio(this.shuffleSound);
        audio
            .play()
            .then(_ => {
              console.log(_);
            })
            .catch(error => {
              console.log(error.message);
            });
      } else {
        let audio = new Audio(this.flipSound);
        audio.play();
      }
    },
    // first enter game process
    async PreProcess(name) {
      // print room UUID
      console.log("Spider receive roomUUID=", this.$route.params.roomUUID)
      console.log(name)
      // create player
      if (!name){
        name = "DefaultPlayerName"
      }
      // post create player
      await this.axios.post(`/solitaireApi/player/create`, {"player_name": name}).then(
          (resp) => {
            console.log(resp)
            this.$data.player_id = resp.data.player_id
          }
      ).catch((e) => {
        console.log("No backend")
        throw e
      })
      // check create player status
      if (!this.$data.player_id) return;
      // set room id or create room
      if (this.$route.params.roomUUID) {
        this.$data.room_uuid = this.$route.params.roomUUID
      } else {
        await this.axios.post(`/solitaireApi/room/create`, {}).then((resp) => {
          this.$data.room_uuid = resp.data.room_uuid
        })
      }
      // copy room id to clipboard
      alert(`Your room id has been copied to clipboard \n ${this.$data.room_uuid}`)
      await (async () => {
        try{
          await navigator.clipboard.writeText(this.$data.room_uuid)
        }
        catch (e){
        console.log()
        }
      })()
      // join room req
      await this.axios.post('/solitaireApi/player/join_room', {
        "player_id": this.$data.player_id,
        "room_id": this.$data.room_uuid
      }).then(
          (resp) => {
            let status = resp.data.status
            if (status !== 0) {
              throw Error("fail to join room")
            }
          }
      ).catch(e => {
        throw e
      })
      // create websocket for game synchronize
      this.$data.socket = new WebSocket(`ws://${location.hostname}:9123/player/socket?player_id=${this.$data.player_id}`)
      this.$data.socket.onmessage = (e) => {
        let data = JSON.parse(e.data)
        console.log(data)
        switch (data["action"]) {
          case "Heartbeat":
            this.$data.socket.send(JSON.stringify({"action": "Heartbeat"}));
            break
          case "SyncCardCount":
            this.$data.otherPlayerCardCount = data.card_left;
            break
          case "SyncDeck":
            this.$data.OpponentDeck = data.Deck
            break
          case "InitDeck":
            this.$data.decks = JSON.parse(data.Deck)
        }
      }
      // receive initial deck from server
      this.socket.onopen = () => {
        this.RequireDeckFromServer()
      }
      // register report services
      this.intervals = []
      this.intervals.push(setInterval(this.SyncCardCount, 5000))
      this.intervals.push(setInterval(this.SyncDeck, 5000))
    },
    // call to send the number of left card to server through socket
    SyncCardCount() {
      if (!this.$data.socket) return;
      let count = 0
      this.$data.decks.forEach((deck) => {
        count += deck.length
      })
      this.$data.socket.send(JSON.stringify({"action": "SyncCardCount", "card_left": count}))
    },
    SyncDeck() {
      if (!this.$data.socket) return;
      this.$data.socket.send(JSON.stringify({"action": "SyncDeck", "Deck": this.$data.decks}))
    }
    ,
    // step back
    Regret() {
      if (this.$data.history.length === 0) {
        console.log("no history")
        return;
      }
      this.removeSelection();
      console.log(this.decks)
      console.log(this.$data.decks)
      console.log(this.$data.decks === this.decks)
      this.decks = this.history.pop()
      this.removeSelection();
      this.$forceUpdate();
      this.removeSelection()
    },
    RequireDeckFromServer() {
      if (!this.$data.socket) return;
      this.$data.socket.send(JSON.stringify({action: "InitDeck"}))
    },
    ClickMenu() {
      this.Unload()
      this.$router.replace('/')
      if (this.intervals){
        this.intervals.forEach((i) => {
          clearInterval(i)
        })
      }
    },
    Unload(){
      if (this.$data.socket) {
        this.$data.socket.close()
      }
      this.$data.player_id = undefined
    }
  },
  created() {
    if (this.$route.params.gameMode === 'Solo'){
      console.log("Solo Player Mode")
    }
    else{
      this.PreProcess(this.$route.params.PlayerName)
    }
    if (this.gameMode === "1") {
      this.spiderInit.bind(this);
      this.spiderInit();
    } else {
      // 4 suit
      this.normalInit.bind(this);
      this.normalInit();
      this.SyncCardCount()
    }
    // register unload function
    window.onbeforeunload = () => {
      this.Unload()
    }
  }
};
</script>
<style>

#game_container {
  display: flex;
  position: absolute;
  top: 0;
}

body {
  background-image: radial-gradient(
      rgba(57, 172, 57, 0.726),
      rgb(0, 116, 0),
      darkgreen
  );
  margin: 0 !important;
}

.green_table {
  display: flex;
  border: none;
  justify-content: space-evenly;
  height: 100vh;
  width: 100vw;
  padding: 0;
  background-image: radial-gradient(
      rgba(57, 172, 57, 0.726),
      rgb(0, 116, 0),
      darkgreen
  );
}

.card_holder {
  margin: 5% 0;
  list-style: none;
  background: rgba(0, 0, 0, 0.3);
}

.pile {
  position: absolute;
  top: 75vh;
  left: 89.4vw;
}


@media screen and (max-width: 100px) {
  body {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: absolute;
    top: 0;
    left: 0;
  }
}

@media screen and (orientation: portrait) {
  .green_table {
    display: none;
  }
}

.goback {
  cursor: pointer;
  position: relative;
  text-shadow: 3px 2px 4px rgb(255, 255, 255);
  color: rgba(225, 237, 240, 0.73);
  top: 1vh;
  left: 2vw;
  border: none;
  background: none;
  font-family: "Pacifico", cursive;
  font-size: 2vw;
}

.button_layer {
  position: absolute;
}

.card_left_tag {
  position: absolute;
  bottom: 3vh;
  left: 1vw;
}

.opponent_table {
  position: absolute;
  display: flex;
  height: 5vw;
  width: 5vw;
  margin-left: auto;
  margin-right: auto;
  bottom: 5vw;
  left: 30vw;
  transform: scale(0.3, 0.3);
}
</style>
