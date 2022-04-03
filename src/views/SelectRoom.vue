<template>
  <div>
    <el-button class="goback" @click="ClickMenu">Menu
    </el-button>
    <div class="select-room-container">
      <RoomForm class="Form"></RoomForm>
    </div>
  </div>
</template>

<script >
import RoomForm from "../components/RoomForm.vue";

export default {
  name: "SelectRoom",
  components:{
    RoomForm
  },
  data(){
    return {
      input:"",
      PlayerName: ""
    }
  },
  methods:{
    ClickMenu(){
      this.$router.replace("/")
    }
  },
}
</script>

<style scoped>
.select-room-container{
  display: flex;
  position: absolute;
  top: 40%;
  left: 30%;
  transform: scale(1.5, 1.5);
}
.select-room-container > *{
 margin-left: 2vw;
}
.goback{
  position:absolute;
  display: flex;
  top:2vw;
  left: 2vw;
  transform: scale(1.5, 1.5);
  font-family: "Pacifico", cursive;
  text-shadow: 3px 2px 4px rgb(255 255 255);
  background: none;
  font-size: 2vw;
  border: none;
  white-space: nowrap;
  color: rgba(225, 237, 240, 0.73);
}
</style>