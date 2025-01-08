<!--
 * @Author: dongyuanwai yuanwaidong@gmail.com
 * @Date: 2024-12-28 11:13:39
 * @LastEditors: dongyuanwai yuanwaidong@gmail.com
 * @LastEditTime: 2025-01-05 17:07:28
 * @FilePath: \test01\src\components\WordCard.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'
import { WordData } from '../types/word'
import { useWordStore } from '../stores/wordStore'

interface Props {
  wordData: WordData;
  animationType?: string;
  isPlaying: boolean;
}

const props = defineProps<Props>()
const wordStore = useWordStore()
const isAnimating = ref(true)

// 添加触摸相关的状态
const touchStartX = ref(0)
const touchEndX = ref(0)
const minSwipeDistance = 50 // 最小滑动距离
let wordTimer: number | null = null

const handleTouchStart = (event: TouchEvent) => {
  touchStartX.value = event.touches[0].clientX
}

const handleTouchEnd = async (event: TouchEvent) => {
  touchEndX.value = event.changedTouches[0].clientX
  const swipeDistance = touchEndX.value - touchStartX.value

  if (Math.abs(swipeDistance) >= minSwipeDistance) {
    if (swipeDistance > 0) {
      // 向右滑动，显示上一个单词
      console.log('向右滑动 ⬅️ 上一个单词')
      await wordStore.prevWord()
    } else {
      // 向左滑动，显示下一个单词
      console.log('向左滑动 ➡️ 下一个单词')
      await wordStore.nextWord()
    }

    // 等待音频播放完成后再设置定时器
    if (props.isPlaying) {
      if (wordTimer) clearTimeout(wordTimer)
      // 等待音频播放完成（3遍）后再设置定时器
      wordTimer = window.setTimeout(() => {
        wordStore.nextWord()
      }, 3000) // 给最后一遍播放留出足够时间
    }
  }
}

const playAudio = () => {
  wordStore.playWordAudio()
}

// 在组件卸载时清理定时器
onBeforeUnmount(() => {
  if (wordTimer) {
    clearTimeout(wordTimer)
  }
})
</script>

<template>
  <div class="word-card"
    @touchstart="handleTouchStart"
    @touchend="handleTouchEnd"
  >
    <div class="word-content">
      <div class="word">
        <span
          v-for="(letter, index) in props.wordData.word.split('')"
          :key="index"
          class="letter"
          :style="{
            '--delay': `${index * 0.1}s`
          }"
          :class="{
            [`animate-${props.animationType || 'pop'}`]: isAnimating
          }"
        >
          {{ letter }}
        </span>
      </div>
      <div class="details">
        <div class="phonetic">
          <span>{{ props.wordData.phonetic_symbol }}</span>
          <button class="play-btn" @click="playAudio">
            <span class="play-icon">🔊</span>
          </button>
        </div>
        <div class="mean">{{ props.wordData.mean }}</div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.word-card {
  width: min(90%, 800px);
  height: 60vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  touch-action: pan-y pinch-zoom; // 优化触摸体验

  .word-content {
    width: 100%;
    height: 100%;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;

    .word {
      width: 100%;
      padding: 0 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: nowrap;
      overflow: visible;
      font-size: min(8vw, 4rem);
      font-weight: bold;
      color: #333;
      min-height: 100px;

      .letter {
        display: inline-block;
        margin: 0 0.05em;
        white-space: nowrap;
        transform-origin: center;
        transform: scale(var(--scale, 1));

        &.animate-pop {
          animation: pop 0.5s ease-in-out infinite;
          animation-delay: var(--delay);
        }

        &.animate-jump {
          animation: jump 0.5s ease-in-out infinite;
          animation-delay: var(--delay);
        }

        &.animate-flip {
          animation: flip 0.5s ease-in-out infinite;
          animation-delay: var(--delay);
        }

        &.animate-blink {
          animation: blink 0.5s ease-in-out infinite;
          animation-delay: var(--delay);
        }

        &.animate-all {
          animation: all 0.5s ease-in-out infinite;
          animation-delay: var(--delay);
        }
      }
    }

    .details {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      width: 100%;
      padding: 0 20px;

      .phonetic {
        font-size: clamp(1rem, 2.5vw, 1.5rem);
        color: #666;
        display: flex;
        align-items: center;
        gap: 8px;
        
        .play-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
          
          &:hover {
            background: rgba(74, 144, 226, 0.1);
          }
          
          .play-icon {
            font-size: 1.2rem;
          }
        }
      }

      .mean {
        font-size: clamp(0.9rem, 2vw, 1.3rem);
        color: #4A90E2;
        text-align: center;
        line-height: 1.4;
        max-width: 100%;
        word-wrap: break-word;
      }
    }
  }
}

@keyframes pop {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.4);
  }
}

@keyframes jump {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes flip {
  0%, 100% {
    transform: rotateY(0);
  }
  50% {
    transform: rotateY(90deg);
  }
}

@keyframes blink {
  0%, 100% {
    color: #333;
  }
  50% {
    color: #FFD700;
    text-shadow: 0 0 8px rgba(255, 215, 0, 0.4);
  }
}

@keyframes all {
  0%, 100% {
    color: #333;
    transform: scale(1) rotateY(0) translateY(0px);
  }
  50% {
    color: #FFD700;
    text-shadow: 0 0 8px rgba(255, 215, 0, 0.4);
    transform: scale(1.4) rotateY(90deg) translateY(-10px);
  }
}
</style> 