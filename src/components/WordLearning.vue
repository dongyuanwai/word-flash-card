<template>
  <div class="word-learning">
    <div class="nav-header">
      <div class="nav-left">
        <button class="back-btn" @click="goBack">
          <span class="arrow">←</span> 返回
        </button>
      </div>
      <div class="nav-title">单词学习</div>
      <div class="nav-right"></div>
    </div>

    <div class="container">
      <div class="card-container">
        <Transition name="card">
          <WordCard 
            v-if="wordStore.wordList.length > 0"
            :key="wordStore.currentIndex" 
            :wordData="wordStore.currentWord!" 
            :animationType="currentAnimation"
            :isPlaying="isPlaying"
          />
        </Transition>
      </div>
      <div class="control-buttons">
        <button @click="togglePlay" class="control-btn">
          {{ isPlaying ? '暂停' : '继续' }}
        </button>
      </div>
      <div class="buttons">
        <button @click="changeAnimation('jump')">JUMP</button>
        <button @click="changeAnimation('pop')">POP</button>
        <button @click="changeAnimation('flip')">FLIP</button>
        <button @click="changeAnimation('blink')">BLINK</button>
        <button @click="changeAnimation('all')">ALL</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useWordStore } from '../stores/wordStore'
import WordCard from './WordCard.vue'

const router = useRouter()
const wordStore = useWordStore()

const currentAnimation = ref('pop')
const isPlaying = ref(true)
let wordTimer: ReturnType<typeof setInterval> | null = null

const goBack = () => {
  router.push('/')
}

const nextWord = async () => {
  await wordStore.nextWord()
}

const changeAnimation = (type: string) => {
  currentAnimation.value = type
}

const togglePlay = async () => {
  isPlaying.value = !isPlaying.value
  if (isPlaying.value) {
    await wordStore.playWordAudio()
    wordTimer = setInterval(nextWord, 6000)
  } else {
    if (wordTimer) {
      clearInterval(wordTimer)
      wordTimer = null
    }
    wordStore.stopAudio()
  }
}

onMounted(async () => {
  // 初始化进度
  wordStore.initProgress()
  // 获取单词列表
  await wordStore.fetchWords()
  // 添加延时确保单词加载完成后播放
  if (wordStore.currentWord) {
    await wordStore.playWordAudio()
  }
  
  if (isPlaying.value) {
    wordTimer = setInterval(nextWord, 6000)
  }
})

onBeforeUnmount(() => {
  if (wordTimer) {
    clearInterval(wordTimer)
  }
  // 停止并清理音频
  wordStore.stopAudio()
})
</script>

<style scoped>
.word-learning {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f0f2f5;
}

.nav-header {
  width: 100%;
  height: 50px;
  background: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.nav-left {
  width: 100px;
}

.nav-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
}

.nav-right {
  width: 100px;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background: #f5f5f5;
  color: #333;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 1rem;
  font-weight: 500;
}

.back-btn:hover {
  background: #e8e8e8;
  transform: translateY(-1px);
}

.arrow {
  font-size: 1.4rem;
}

.container {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.word {
  font-size: min(10vw, 5rem) !important;
}

h1 {
  color: #2c3e50;
  margin-bottom: 40px;
  font-size: clamp(1.5rem, 5vw, 2.5rem);
}

.control-buttons {
  margin-bottom: 20px;
}

.control-btn {
  padding: 10px 24px;
  font-size: 1.1rem;
  background: #2196F3;
  border-radius: 8px;
  transition: all 0.3s;
}

.control-btn:hover {
  background: #1976D2;
  transform: translateY(-2px);
}

.buttons {
  display: flex;
  gap: 10px;
}

button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background: #4CAF50;
  color: white;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.3s;
}

button:hover {
  background: #45a049;
}

.card-container {
  position: relative;
  width: 100%;
  height: 60vh;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card-enter-active {
  transition: all 0.5s ease-in-out;
  transform-origin: bottom left;
  position: absolute;
  width: min(90%, 800px);
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
}

.card-leave-active {
  transition: all 0.5s ease-in-out;
  transform-origin: bottom left;
  position: absolute;
  width: min(90%, 800px);
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
}

.card-enter-from {
  transform: translate(-50%, -50%);
  opacity: 0;
}

.card-enter-to {
  transform: translate(-50%, -50%);
  opacity: 1;
}

.card-leave-from {
  transform: translate(-50%, -50%) rotate(0deg);
}

.card-leave-to {
  transform: translate(-50%, -50%) rotate(-90deg);
}
</style> 