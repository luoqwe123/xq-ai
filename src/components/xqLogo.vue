<template>
  <div class="logo-container">
    <div class="picture">
      <img :src="imgUrl" alt="" class="img">
    </div>
       
    <div class="select">
      <select v-model="selectedFruit" @change="handleSelectChange" :style="{backgroundColor: backColor}">
        <option value="deepseek-r1">deepseek-r1</option>
      </select>

    </div>
  </div>
</template>

<script setup lang='ts'>
import { ref,withDefaults } from 'vue';
import imgUrl from  "/125.jpg";
withDefaults(defineProps<{
    backColor?: string
}>(),{
  backColor:'white'
});


let selectedFruit = ref("deepseek-r1");
const handleSelectChange = () => {
    
};

</script>

<style scoped>
.logo-container{
    display: flex;
    align-items: center;
    height: 100%;
}
.picture{
    width: 32px;
    height: 32px;
}
.img{
    width: 100%;
    height: 100%;
    border-radius: 10px;
    margin-right: 3px;
}

</style>