/*
 * @Author: dongyuanwai yuanwaidong@gmail.com
 * @Date: 2024-12-29 16:36:33
 * @LastEditors: dongyuanwai yuanwaidong@gmail.com
 * @LastEditTime: 2025-01-08 22:31:37
 * @FilePath: \test01\src\stores\wordStore.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { WordData } from '../types/word'

// 使用组合式API定义单词存储
export const useWordStore = defineStore('word', () => {
  // 状态
  const wordList = ref<WordData[]>([]) // 单词列表
  const currentIndex = ref(0) // 当前单词索引
  const lastLearnedIndex = ref(0) // 上次学习的单词索引
  const audioPlayer = ref<HTMLAudioElement | null>(null)

  // 获取器
  const currentWord = computed(() => {
    return wordList.value[currentIndex.value]
  })

  // 保存学习进度
  const saveProgress = () => {
    localStorage.setItem('wordProgress', JSON.stringify({
      currentIndex: currentIndex.value,
      lastLearnedIndex: Math.max(lastLearnedIndex.value, currentIndex.value)
    }))
  }

  // 初始化进度
  const initProgress = () => {
    const progress = localStorage.getItem('wordProgress')
    if (progress) {
      const { currentIndex: savedIndex, lastLearnedIndex: savedLastIndex } = JSON.parse(progress)
      currentIndex.value = savedIndex
      lastLearnedIndex.value = savedLastIndex
    }
  }

  // 获取单词列表
  const fetchWords = async () => {
    try {
      const response = await fetch('/A.json')
      wordList.value = await response.json()
    } catch (error) {
      console.error('获取单词列表失败:', error)
    }
  }

  // 下一个单词
  const nextWord = async () => {
    if (wordList.value.length === 0) return
    
    stopAudio()
    
    if (currentIndex.value < wordList.value.length - 1) {
      currentIndex.value++
    } else {
      currentIndex.value = 0
    }
    
    await playWordAudio()
    saveProgress()
  }

  // 上一个单词
  const prevWord = async () => {
    if (wordList.value.length === 0) return
    
    stopAudio()
    
    if (currentIndex.value > 0) {
      currentIndex.value--
    } else {
      currentIndex.value = wordList.value.length - 1
    }
    
    await playWordAudio()
    saveProgress()
  }

  // 播放音频
  const playWordAudio = async () => {
    if (!currentWord.value) return
    
    stopAudio()
    
    const word = currentWord.value.word.toLowerCase()
    const audioUrl = `https://dict.youdao.com/dictvoice?audio=${word}&type=2`
    
    try {
      audioPlayer.value = new Audio(audioUrl)
      let playCount = 0
      
      return new Promise((resolve) => {
        const audio = audioPlayer.value
        if (!audio) return resolve(false)

        const playNext = async () => {
          playCount++
          console.log(`${word} 播放次数:`, playCount)
          
          if (playCount >= 3) {
            audio.removeEventListener('ended', playNext)
            resolve(true)
          } else {
            try {
              audio.currentTime = 0
              await audio.play()
            } catch (error) {
              console.error('重复播放失败:', error)
              audio.removeEventListener('ended', playNext)
              resolve(false)
            }
          }
        }

        audio.addEventListener('ended', playNext)
        audio.play().catch(error => {
          console.error('首次播放失败:', error)
          resolve(false)
        })
      })
    } catch (error) {
      console.error('创建音频播放器失败:', error)
      return Promise.resolve(false)
    }
  }

  // 停止音频
  const stopAudio = () => {
    if (audioPlayer.value) {
      audioPlayer.value.pause()
      audioPlayer.value = null
    }
  }

  return {
    wordList,
    currentIndex,
    lastLearnedIndex,
    currentWord,
    fetchWords,
    nextWord,
    prevWord,
    initProgress,
    playWordAudio,
    stopAudio
  }
}) 