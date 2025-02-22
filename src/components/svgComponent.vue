<template>
    <div class="svg-container">
        <i class="icon" >
            <svg :style="{width,height}">
                <use :xlink:href="prefix +'-'+ name" :fill=fill></use>
            </svg>
            <slot name="content"></slot>
        </i>
    </div>
</template>

<script setup lang='ts'>
import { withDefaults } from 'vue';
withDefaults(defineProps<{
    prefix?:string;
    name?:string;
    width?:string;
    height?:string;
    fill?:string
}>(),{
    prefix:'#icon',
    name:'milestone',
    width:"18px",
    height:'18px',
    fill:"black",
})
</script>

<style scoped>
.svg-container{
    display: flex;
    align-items: center;
}
.icon{
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>