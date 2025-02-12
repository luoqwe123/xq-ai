<template>
    <div class="aiTro-container">
        <div class="header">
            <img :src="Avator" alt="这是ai的头像" style="width: 36px;height: 36px;border-radius: 50%;margin-right: 0.3rem;">
            <div class="text" style="line-height: 36px;">小秋</div>
        </div>
        <div class="main">{{ content }}</div>
        <span></span>
    </div>
</template>

<script setup lang='ts'>
import Avator from "@/../public/125.jpg"
const prop = withDefaults(defineProps<{
    content?:string 
}>(),{
    content:"我是一个综合型助手小秋，不会的问题都可以来问我呦 ٩(๑❛ᴗ❛๑)۶"
})

</script>

<style>

.aiTro-container{
    width: 100%;
    background-color: #e0e0e0;
    padding-left: 12px;
    padding-top: 8px;
    min-height: 76px;
    border-radius: 6px;
}
.header{
    display: flex;
    
}
</style>