<template>
  <div class="app-container">
    <Chat/>
  </div>
</template>

<script setup lang='ts'>

import Chat from "@/components/xqChat.vue";
// import xqInput from "./components/onlyTestCom/inputTest.vue";


</script>

<style scoped>
.app-container{
    width: 100%;
}
.input-area {
  display: flex;
  padding: 10px;
  justify-content: center;
  background-color: #fff;
  border-top: 1.6px solid #ddd;
  width: 96%;
  position: fixed;
  bottom: 0px;
  height: 93px;
  z-index: 2;

}

</style>



