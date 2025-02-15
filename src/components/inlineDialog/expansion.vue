<template>
    <div class="expansion-container">
        <div class="dialog-overlay" @click="handleClose"></div>
        <div class="dialog-box" :style="isMobile ? mobileStyle() : computerStyle()">
            <div class="dislog-header">
                <input type="text" style="width: 80%;border: none;padding-left: 10px;height: 28px;"
                    placeholder="请输入您想询问的问题...">
                <button style="border: 1px solid #ebebeb;background-color: white;border-radius: 5px;">
                    <kbd style="font-family: var(--font-sans);font-size: 12px;">
                        <span :style="{ color: color }">Esc</span>
                    </kbd>
                </button>
            </div>
            <div class="dialog-main">
                <div class="suggestions"
                    style="width: 100%;height: 32px;font-size: 12px;padding-left: 12px;line-height: 32px;"
                    :style="{ color: color }">
                    Suggestions
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { defineEmits, onMounted, ref, } from 'vue';

import { useScreenSize } from "@/hooks/useScreenSize"
withDefaults(defineProps<{
    color?: string
}>(), {
    color: "black"
})


let { isMobile } = useScreenSize()
console.log(isMobile.value)


let emit = defineEmits(['closeDialog'])
const handleClose = () => {
    emit("closeDialog", '')
}
const mobileStyle = () => {

    return {
        'width': "100%",
        'left': "0px",
        "bottom": "0px",
        "height": '80%'
    }
}
const computerStyle = () => {

    return {
        'width': "600px",
        'left': "calc(50% - 300px)",
        "bottom": "calc(50% - 230px)",
        'height': "460px"
    }
}
const suggestionsArr = ref<any[]>([
    {
        icon:'',
        content:""
    }
])



</script>

<style>
.expansion-container {
    width: 120%;
    height: 200vh;
    position: fixed;
    z-index: 10;

    left: -10px;
}

.dialog-overlay {
    width: 100%;
    height: 100%;
    /* background-color: hsl(0, 0%, 100% ,1); */
    background-color: rgba(0, 0, 0, 0.5);
}

.dialog-main {
   

}

.dialog-box {
    position: fixed;
    z-index: 20;
    background-color: white;
    border-radius: 1rem;
    /* 圆角顶部 */
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
    overflow: hidden;



}

.dislog-header {
    width: 100%;
    border-top-left-radius: 1rem;
    border-top-right-radius: 1rem;
    display: flex;
    padding: 0px 10px;
    align-items: center;
    height: 53px;
    justify-content: space-between;
    border-bottom: 1px solid #ebebeb;
}
</style>