<template>
  <el-form ref="formRef" :model="form" label-width="120px">
    <el-form-item label="Room id">
      <el-input v-model="form.RoomUUID"></el-input>
    </el-form-item>
    <el-form-item label="Player Name">
      <el-input v-model="form.PlayerName" ref="PlayerNameRef"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="EnterRoom">Submit</el-button>
      <el-button @click="Clear">Clear</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { reactive } from 'vue'

// do not use same name with ref
const form = reactive({
  RoomUUID:"",
  PlayerName: ""
})
</script>

<script>
export default {
  name: "RoomForm",
  methods:{
    EnterRoom(){
      // compulsory input name
      if (this.form.PlayerName === ""){
        alert("Please enter player name to start game. ")
        this.$refs.PlayerNameRef.focus()
      }
      else{
        this.$router.replace({name:"spider", params:{roomUUID: this.form.RoomUUID, gameMode:"1", PlayerName: this.form.PlayerName}})
      }
  },
    Clear(){
      this.form.RoomUUID = ""
      this.form.PlayerName = ""
    }
}
}
</script>
