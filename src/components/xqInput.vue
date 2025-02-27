<template>
    <div class="file-input-container" ref="inputArea">
        <div class="inputBox">
            <textarea @input="handleInput" placeholder="Type a message..." row="1" class="text" v-model="newMessage"
                @keydown.enter.prevent="send"></textarea>
            <ul v-if="mediaFiles.length" style="display: flex;flex-wrap: wrap;">
                <li v-for="(media, index) in mediaFiles" :key="index" style="margin-right: 16px;">
                    <!-- <a :href="media.url" target="_blank" rel="noopener noreferrer">
                        {{ media.name }}
                    </a> -->
                    <!-- 如果需要预览图片，可以添加一个条件渲染的 <img> 标签 -->
                    <div class="showFile" style="position: relative;">

                        <img v-if="isImage(media.file)" :src="media.url" alt="" style="max-width: 50px;height: 50px;object-fit: cover
                        ;aspect-ratio: 1;border-radius: 10px;position: relative;"></img>
                        <div class="elseFile" v-else style="display: flex;height: 50px;border-radius: 10px;border: 1px solid #ddd;padding: 0px 6px;
                            ">
                            <Svg name="file"></Svg>
                            <div class="props" style="display: flex;align-items: center;margin-left: 3px;">
                                {{ media.name }}
                            </div>
                        </div>
                        <button style="border-radius: 50%;position: absolute;right: 0px;top: 0px;height: 24px;width: 24px;
                    display: flex;justify-content: center;align-items: center; transform: translate(25%,-25%);
                    background-color: white;cursor: pointer;" @click="removeFile(media, index)">
                            <Svg name="x" width="20px" height="20px"></Svg>
                        </button>
                    </div>
                </li>
            </ul>
            <div class="div">
                <button @click="triggerFileInput"
                    style="width: 20px;height: 20px;font-size: 20px;line-height: 20px;cursor: pointer;">+</button>
                <input type="file" id="fileInput" ref="fileInputRef" style="display: none;"
                    @change="handleFileUpload" />
            </div>

        </div>
    </div>
</template>

<script setup lang='ts'>
//bug  输入框删除了文本，输入框高度的回去
import { computed, ref, defineEmits, watch, watchEffect, toValue } from 'vue';
import { useAiStore } from '@/stores/aiAnswer';
import { askAi } from '@/utils/request';
const dataListStore = useAiStore()
const props = withDefaults(defineProps<{

}>(), {

})
// 定义媒体文件类型
interface MediaFile {
    name: string;
    url: string;
    file: File;
}


const mediaFiles = ref<MediaFile[]>([]);
const fileInputRef = ref<HTMLInputElement | null>(null);
const inputArea = ref<any>(null)
const newMessage = ref('');
const stopBottom = ref(80)
const Oldscroll = ref(34)

const emit = defineEmits(['update:modelValue', 'enter', 'update:stopBottom']);
const send = async (event: any) => {
    if (event.code == 'Enter') {
        event.preventDefault()
    }
    console.log(mediaFiles.value)
    const formdata = {
        text: newMessage.value,
        files: mediaFiles.value.map((el) => el)
    }
    newMessage.value = ''
    mediaFiles.value = []
    // mediaFiles.value.forEach((el, index) => {
    //     removeFile(el, index)
    // });
    console.log(formdata)
    dataListStore.addQuestion(formdata)
    dataListStore.changeStopState()
    emit("enter")
    await askAi(formdata, false)
    if (dataListStore.useStopComp) {
        dataListStore.changeStopState()
    }
    emit("update:stopBottom", stopBottom.value)
}
const handleInput = (e: any) => {
    const el = e.target;
    el.style.overflowY = 'hidden'; // 隐藏垂直滚动条
    el.style.resize = 'none'; // 禁止用户手动调整大小
    el.style.height = 'auto'; // 根据内容自动调整高度
    const scrollHeight = el.scrollHeight;
    el.style.height = `${scrollHeight}px`;

    stopBottom.value = scrollHeight + stopBottom.value - Oldscroll.value
    inputArea.value.style.height = stopBottom.value + 'px'


    Oldscroll.value = scrollHeight
}

// 判断文件是否为图片
const isImage = (file: File): boolean => {
    const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', "'image/jpg'"];

    return imageMimeTypes.includes(file.type);
};
const validtorFile = (Filesize: number) => {
    return Filesize > 5 * 1024 * 1024;
}
const handleFileUpload = (event: Event) => {
    // console.log('url',event)
    const target = event.target as HTMLInputElement;
    const files = target.files;


    if (files) {

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (validtorFile(file.size)) {
                alert("输入的文件不能超过5mb")
                return
            }

            const url = URL.createObjectURL(file);
            if (mediaFiles.value.length >= 5) {
                alert("输入的文件不能超过5个")
                break
            }
            mediaFiles.value.push({
                name: file.name,
                url,
                file,
            });

        }
    }
    console.log("test", mediaFiles.value.length)
    if (mediaFiles.value.length === 1) {
        stopBottom.value = stopBottom.value + 50
        inputArea.value.style.height = stopBottom.value + 'px'
    }

    // 重置文件输入（可选，但通常是个好习惯）
    if (fileInputRef.value) {
        fileInputRef.value.value = '';
    }
};
const triggerFileInput = () => {
    fileInputRef.value?.click()
}
const removeFile = (el: any, index: number) => {
    URL.revokeObjectURL(el.url)

    mediaFiles.value.splice(index, 1)
    if (mediaFiles.value.length === 0) {
        stopBottom.value = stopBottom.value - 50
        inputArea.value.style.height = stopBottom.value + 'px'
    }
}


// 当媒体文件数组变化时，释放对象URL（可选）
// watch(mediaFiles, (newFiles, oldFiles) => {
//     console.log('files',oldFiles,newFiles)
//     oldFiles.forEach(oldFile => {
//         URL.revokeObjectURL(oldFile.url);
//     });
// }, { deep: true, immediate: false });
</script>

<style scoped>
.text {
    outline-style: none;
    width: 98%;
    line-height: 2;
    resize: none;
    overflow-y: hidden;
    min-height: 34px;
}

.inputBox {
    width: 100%;
    height: 100%;
    border: 1px solid #ddd;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    padding: 0px 10px;
    background-color: #f7f7f7;

}
</style>