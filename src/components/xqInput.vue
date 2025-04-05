<template>
  <div class="file-input-container" ref="inputArea">
    <div class="inputBox">
      <textarea @input="handleInput" placeholder="Type a message..." ref="textArea" row="1" class="text"
                v-model="newMessage" @keydown.enter.prevent="send"
                :style="{ lineHeight: props.textareaH + 'px', height: props.textareaH + 'px' }"></textarea>
      <ul v-if="mediaFiles.length" style="display: flex;flex-wrap: wrap;">
        <li v-for="(media, index) in mediaFiles" :key="index" style="margin-right: 16px;">
          <!-- <a :href="media.url" target="_blank" rel="noopener noreferrer">
                        {{ media.name }}
                    </a> -->
          <!-- 如果需要预览图片，可以添加一个条件渲染的 <img> 标签 -->
          <div class="showFile" style="position: relative;">

            <img v-if="isImage(media.file)" :src="media.url" alt="" :style="imgStyle" />
            <div class="elseFile" v-else
                 :style="{ height: props.inputImage + 'px', display: 'flex', borderRadius: '10px', border: '1px solid #ddd', padding: '0px 6px' }">
              <Svg name="file"></Svg>
              <div class="props" style="display: flex;align-items: center;margin-left: 3px;">
                {{ media.name }}
              </div>
            </div>
            <button style="border-radius: 50%;position: absolute;right: 0px;top: 0px;height: 24px;width: 24px;
                    display: flex;justify-content: center;align-items: center; transform: translate(25%,-25%);
                    background-color: white;cursor: pointer;" @click="removeFile(media, index)">
              <xqSvg name="x" width="20px" height="20px"></xqSvg>
            </button>
          </div>
        </li>
      </ul>
      <div class="div" style="display: flex;justify-content: space-between;">
        <button @click="triggerFileInput"
                style="width: 20px;height: 20px;font-size: 24px;line-height: 20px;cursor: pointer;">+</button>
        <input type="file" id="fileInput" ref="fileInputRef" style="display: none;" @change="handleFileUpload" />
        <button @click="send()"
                :style="{ backgroundColor: sendBtnBack, width: '24px', height: '24px', borderRadius: '50%', display: ' flex', justifyContent: 'center' }">
          <xqSvg name="right" width="20px" height="20px" :fill='sendBtnFill'></xqSvg>
        </button>
      </div>

    </div>
  </div>
</template>

<script setup lang='ts'>
//bug  输入框删除了文本，输入框高度的回去
import { ref, defineEmits, watchEffect, computed, type CSSProperties,withDefaults  } from 'vue';
import { useAiStore } from '@/stores/aiAnswer';
import { askAi } from '@/utils/request';
import { useScreenSize } from "@/hooks/useScreenSize";
import { xidaMessage } from 'xida-ui';
const { isMobile } = useScreenSize();
const dataListStore = useAiStore();
const props = withDefaults(defineProps<{
  inputImage?: number
  textareaH?: number
}>(), {
  textareaH: 36,
  inputImage: 50
});
// 定义媒体文件类型
export interface MediaFile {
  type: string
  name: string;
  url: string;
  file: File;
}


const mediaFiles = ref<MediaFile[]>([]);
const fileInputRef = ref<HTMLInputElement | null>(null);
const inputArea = ref<HTMLInputElement | null>(null);
const textArea = ref<HTMLTextAreaElement | null>(null);
const newMessage = ref('');
const stopBottom = ref(93);
const sendBtnFill = ref("#b2b8b8");
const sendBtnBack = ref("");

const emit = defineEmits(['update:modelValue', 'enter', 'update:stopBottom']);

const InputArea = () => {
  if (inputArea.value && textArea.value) {
    inputArea.value.style.height = "93px";
    textArea.value.style.height = props.textareaH + 'px';
  }

};
watchEffect(() => {
  if (newMessage.value) {
    sendBtnFill.value = "white";
    sendBtnBack.value = "#5d5cde";
    // console.log(sendBtnFill.value);
  } else {
    sendBtnFill.value = "#afb5b5";
    sendBtnBack.value = "";
  }

  if (isMobile) {
    if (newMessage.value.length <= 20) {
      InputArea();
    }
  } else {
    if (newMessage.value.length <= 35) {
      InputArea();
    }
  }

});
const send = async (event?: KeyboardEvent): Promise<void> => {
  if (event && event.code == 'Enter') {
    event.preventDefault();
  }
  // console.log(mediaFiles.value);
  const formdata = {
    text: newMessage.value,
    files: mediaFiles.value.map((el) => el)
  };
  // console.log("files",formdata.files)
  newMessage.value = '';
  mediaFiles.value = [];
  // mediaFiles.value.forEach((el, index) => {
  //     removeFile(el, index)
  // });
  // console.log(formdata);
  dataListStore.addQuestion(formdata);
  dataListStore.changeStopState();
  emit("enter");
  await askAi(formdata, false);
  if (dataListStore.useStopComp) {
    dataListStore.changeStopState();
  }
  // console.log(stopBottom.value);
  emit("update:stopBottom", stopBottom.value);
};
const imgStyle = computed((): CSSProperties => ({
  maxWidth: props.inputImage + 'px',   // 动态宽度
  height: props.inputImage + 'px',     // 动态高度
  objectFit: 'cover',           // 移除多余空格
  aspectRatio: '1',             // 字符串形式，CSS 支持
  borderRadius: '10px',         // 圆角
  position: 'relative',         // 相对定位
}));




const getInputLine = (el: HTMLTextAreaElement) => {
  el.style.height = 'auto'; // 重置高度以获取准确 scrollHeight
  const scrollHeight = el.scrollHeight;
  // 计算行数：总高度减去内边距，除以单行高度
  // console.log(scrollHeight, props.textareaH);
  const calculatedLines = Math.round(scrollHeight / props.textareaH);
  return Math.max(1, calculatedLines); // 至少为 1 行

};
const handleInput = (e: Event) => {
  const el = e.target as HTMLTextAreaElement;
  el.style.overflowY = 'hidden'; // 隐藏垂直滚动条
  el.style.resize = 'none'; // 禁止用户手动调整大小
  el.style.lineHeight = `${props.textareaH}px`;
  el.style.height = 'auto'; // 根据内容自动调整高度
  const newLineCount = getInputLine(el); // 当前行数
  // const newHeight = lineHeight * newLineCount + paddingHeight; // 新高度
  const newHeight = props.textareaH * newLineCount;

  // 更新 textarea 高度
  el.style.height = `${newHeight}px`;

  // console.log(newLineCount);
  // 同步更新外层容器高度
  if (inputArea.value) {
    inputArea.value.style.height = `${newHeight + stopBottom.value - props.textareaH}px`; // 外层额外 10px padding 和 10px margin-top

  }
  // const scrollHeight = el.scrollHeight;
  // // console.log(scrollHeight);
  // el.style.height = `${scrollHeight}px`;
  // stopBottom.value = scrollHeight + stopBottom.value - textareaHeight.value;
  // // console.log("stop",scrollHeight,textareaHeight.value);

  // if (inputArea.value) inputArea.value.style.height = stopBottom.value + 'px';

  // textareaHeight.value = scrollHeight;

};

// 判断文件是否为图片
const isImage = (file: File): boolean => {
  const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', "'image/jpg'"];

  return imageMimeTypes.includes(file.type);
};
const validtorFile = (Filesize: number) => {
  return Filesize > 5 * 1024 * 1024;
};
const handleFileUpload = (event: Event) => {
  // console.log('url',event)
  const target = event.target as HTMLInputElement;
  const files = target.files;


  if (files) {

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (validtorFile(file.size)) {
        xidaMessage({
          content:"输入的文件不能超过5mb",
          type:"danger"
        });
        return;
      }

      const url = URL.createObjectURL(file);
      if (mediaFiles.value.length >= 5) {
        xidaMessage({
          content:"输入的文件不能超过5个",
          type:"danger"
        });
        break;
      }
      mediaFiles.value.push({
        name: file.name,
        url,
        file,
        type: file.type
      });

    }
  }
  // console.log("test", mediaFiles.value.length);
  if (mediaFiles.value.length === 1) {
    stopBottom.value = stopBottom.value + props.inputImage;
    if (inputArea.value) inputArea.value.style.height = stopBottom.value + 'px';
  }

  // 重置文件输入（可选，但通常是个好习惯）
  if (fileInputRef.value) {
    fileInputRef.value.value = '';
  }
};
const triggerFileInput = () => {
  fileInputRef.value?.click();
};
const removeFile = (el: MediaFile, index: number) => {
  URL.revokeObjectURL(el.url);

  mediaFiles.value.splice(index, 1);
  if (mediaFiles.value.length === 0) {
    stopBottom.value = stopBottom.value - props.inputImage;
    if (inputArea.value) inputArea.value.style.height = stopBottom.value + 'px';
  }
};


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
  resize: none;
  overflow-y: hidden;

}

.inputBox {
  width: 100%;
  height: 100%;
  border: 1px solid #ddd;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  padding: 5px 10px;
  background-color: #f7f7f7;

}
</style>