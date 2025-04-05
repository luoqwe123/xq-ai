<template>
  <div class="logo-container">
    <div class="picture">
      <img :src="imgUrl" alt="" class="img">
    </div>
       
    <div class="select">
      <select v-model="selectedModel" @change="handleSelectChange" :style="{backgroundColor: backColor}">
        <option :value="item" v-for="(item,key) in modelArr" :key="key">{{ item }}</option>
      </select>

    </div>
  </div>
</template>

<script setup lang='ts'>
import { ref,withDefaults,onMounted,  } from 'vue';
import { useAiStore } from '@/stores/aiAnswer';
import imgUrl from  "/125.jpg";
const store = useAiStore();
withDefaults(defineProps<{
    backColor?: string
}>(),{
  backColor:'white'
});
const modelArr = ref<string[]>([]);

const selectedModel = ref<string>('');
const handleSelectChange = () => {
  store.changeModel(selectedModel.value);
};

async function getModel (){
  let res = await fetch(import.meta.env.VITE_GLOB_API_URL+'model',{
    method:"GET",
    headers: {
      'Content-Type': 'application/json',
    },
  });
  res = await res.json();
    
  modelArr.value = Object.keys(res);
  selectedModel.value = modelArr.value[0];
}
onMounted(async ()=>{
  await getModel();
  handleSelectChange();
});

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