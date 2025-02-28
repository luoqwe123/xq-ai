<template>
  <div class="Header-container">
    <div class="left">
      <Logo backColor="#f7f7f7"/>
    </div>
    <div class="right">
      <Contraction  backColor="white" color="#8f8f8f" @click="openExpansion"></Contraction >
    </div>
    <Expansion v-if="expansion" @close-dialog="closeExpansion" color="#8f8f8f" ></Expansion>
  </div>
</template>

<script setup lang='ts'>

import Logo from "./xqLogo.vue";
import Contraction from "./inlineDialog/xqContraction.vue";
import Expansion from "./inlineDialog/xqExpansion.vue";

import { onBeforeUnmount, onMounted, ref } from "vue";


const expansion = ref<boolean>(false);


function openExpansion (){
    
  expansion.value = true;    
   
}
// 添加一个事件监听器到window对象，监听keydown事件
const handleKeydown = (event: KeyboardEvent) => {
 
  if (event.ctrlKey && event.key === 'k') {
        
    event.preventDefault();
    openExpansion();
  } else if (event.key === 'Escape') {
    event.preventDefault();
    closeExpansion();
  }
};
onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown);
});
// window.addEventListener('keydown', function(event) {
//     // 检查是否按下了Ctrl键和W键
//     if (event.ctrlKey && event.key === 'k' || event.ctrlKey && event.key === 'k') {
//         // 阻止默认的关闭标签页行为（在浏览器中Ctrl + W通常会关闭当前标签页）
//          event.preventDefault();
//         // 打印"你好"
//        openExpansion()
//     }
//     if(event.key === 'Escape' ){
//         event.preventDefault();
//         closeExpansion()
//     }
// });
const closeExpansion = ()=>{
  expansion.value = false;
};

</script>

<style scoped>
.Header-container{
    display: flex;
    justify-content: space-between;
    padding: 0px 10px;
    background-color: #f7f7f7;
    height: 42px;
    align-items: center;
    
}
.right{
    width: 256px;
    height: 32px;

}


</style>