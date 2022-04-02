<template>
  <div class="page_wrapper">
    <div class="heading">
      <h1>
        Solitaire Game
      </h1>
    </div>
    <div class="menu_wrapper">
        <div class="option" @click="ClickCreateRoom">
          <img src="../assets/2.jpg" alt="" srcset=""/>
          <p>Create Room</p>
        </div>
        <div class="option" @click="ClickJoin">
          <img src="../assets/1.jpg" alt="" srcset=""/>
          <p>Join Room</p>
        </div>
        <div class="option" @click="ClickSolo">
          <img src="../assets/2.jpg" alt="" srcset=""/>
          <p>Play Solo</p>
        </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Menu",
  methods:{
    async ClickCreateRoom(){
      // await this.axios.get("/test").then((resp) => {
      //   console.log(resp)
      // })
      let serverStatus = -1
      await this.axios.get("/solitaireApi/info").then((resp) => {
        if (resp.data["status"] !== 1){
          alert("Sever status error")
        }
        else{
          serverStatus = 1
        }
      }).catch(e => {
        console.log(e)
      })
      if (serverStatus === 1){
        await this.$router.replace({name:"spider", params:{roomUUID: "", gameMode:"1", PlayerName: "DefaultPlayerName"}})
      }
    },
    ClickSolo(){
      this.$router.replace({name: 'spider', params: {gameMode: 'Solo'}})
    },
    ClickJoin(){
      this.$router.replace("/select")
    }
  }
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Pacifico");

a {
  text-decoration: none;
}

h1 {
  margin: 0 0 0 0;
  color: rgb(131, 198, 90);
  font-weight: 400;
  font-family: "Pacifico", cursive;
  font-size: 4vw;
  text-shadow: 3px 2px 4px rgba(0, 0, 0, 0.548);
}

.page_wrapper {
  text-align: center;
  background: transparent;
  height: 90%;
  overflow: hidden;
  position: absolute;
  top: 10%;
  width: 100%;
  opacity: 0.8;
}

.menu_wrapper {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
}

.option img {
  transition: all 0.3s;
  width: 100%;
  border: 2px solid lightblue;
  border-radius: 10px;
  height: 12vw;
}

.option p {
  color: rgb(220, 104, 248);
  text-align: center;
  font: 2vw Georgia, Times New Roman, serif;
}

.option {
  position: relative;
  top: 10vh;
  background: rgb(34, 34, 32);
  border-radius: 10px;
  width: 16vw;
  height: 16vw;
  -webkit-box-shadow: 3px 3px 7px rgba(0, 0, 0, 0.3);
  box-shadow: 3px 3px 7px rgba(0, 0, 0, 0.3);
  padding: 2vw;
  align-self: center;
}

.larger {
  transform: scale(1.05, 1.05);
}

.option:hover {
  transition: all 0.2s;
  transform: scale(1.1, 1.1);
  border: 3px solid firebrick;
  box-shadow: 10px 10px 10px rgba(0, 0, 0, 0.8);
}

.option:hover p {
  color: #dc68f8;
}

.option:hover img {
  padding: 2%;
  border: 5px solid lightblue;
  border-radius: 10px;
}

@media screen and (max-width: 400px) {
  h1 {
    font-size: 20px;
  }

  .option img {
    height: 7vh;
  }

  .option {
    background: rgb(34, 34, 32);
    padding: 4%;
    height: 15vh;
    position: relative;
    top: 10vh;
    text-align: center;
  }

  .option p {
    font-size: 10px;
    color: red;
  }
}
</style>
