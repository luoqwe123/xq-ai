<template>
  <div class="contraction-container">
    <div class="contraction" >
      <button class="btn" :style="{ backgroundColor: backColor, color:color}">
        <div class="left">
          <Svg name="search" :fill=color></Svg>
          <span style="line-height: 18px;font-size: 14px;margin-left: 6px;">Search...</span>
        </div>
        <div class="kbd">
          <kbd style="font-family: var(--font-sans);font-size: 12px;">
            <span :style="{color: color}">⌘ K</span>
          </kbd>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang='ts'>
import  Svg from "@/components/svgComponent.vue";
withDefaults(defineProps<{
    backColor?: string
    color?: string

}>(), {
  backColor: 'black',
  color:"black"
});

</script>

<style scoped>
.contraction-container {
    height: 100%;
    width: 100%;
}

.contraction {
    height: 100%;
    width: 100%;
}

.btn {
    border: none;
    height: 100%;
    width: 100%;
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    padding: 0px 8px;
    align-items: center;
}
.left{
    display: flex;

}
.kbd{
    display: flex;
    align-items: center;
    width: 32px;
    height: 20px;
    padding-left: 4px;
    border-radius: 5px;
    background-color: hwb(0 97% 3%);
}



</style>