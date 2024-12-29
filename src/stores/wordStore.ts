/*
 * @Author: dongyuanwai yuanwaidong@gmail.com
 * @Date: 2024-12-29 16:36:33
 * @LastEditors: dongyuanwai yuanwaidong@gmail.com
 * @LastEditTime: 2024-12-29 17:21:54
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
  const audio = ref<HTMLAudioElement>(new Audio())

  // 获取器
  const currentWord = computed(() => {
    return wordList.value[currentIndex.value] || null
  })

  // 动作
  const fetchWords = async () => {
    try {
      const response = await fetch('/A.json') // 从服务器获取数据
      const data = await response.json()
      if (Array.isArray(data)) {
        wordList.value = data // 如果是数组，直接赋值
      } else {
        wordList.value = [data] // 如果不是数组，包装成数组
      }
      // 恢复上次学习位置
      currentIndex.value = lastLearnedIndex.value
    } catch (error) {
      console.error('加载单词列表失败:', error)
      // 加载失败时使用默认单词
      wordList.value = [{
        initial: 'A',
        mean: '示例词义',
        phonetic_symbol: '/ɪɡˈzæmpəl/',
        word: 'Example'
      }]
    }
  }

  const nextWord = () => {
    if (wordList.value.length > 0) {
      currentIndex.value = (currentIndex.value + 1) % wordList.value.length
      // 更新最后学习位置
      lastLearnedIndex.value = currentIndex.value
      // 保存到 localStorage
      localStorage.setItem('lastLearnedIndex', currentIndex.value.toString())
      // 切换单词后自动播放音频
      playWordAudio()
    }
  }

  const initProgress = () => {
    const savedIndex = localStorage.getItem('lastLearnedIndex')
    if (savedIndex !== null) {
      lastLearnedIndex.value = parseInt(savedIndex)
      currentIndex.value = lastLearnedIndex.value
    }
  }

  // 修改播放音频的方法
  const playWordAudio = async () => {
    if (currentWord.value) {
      const playCount = 3; // 播放次数
      const audioUrl = `https://dict.youdao.com/dictvoice?type=0&audio=${currentWord.value.word}`;
      
      // 使用单个音频实例
      audio.value.src = audioUrl;
      let playedTimes = 0;

      return new Promise((resolve) => {
        const playNext = () => {
          playedTimes++;
          if (playedTimes < playCount) {
            audio.value.currentTime = 0;
            audio.value.play().catch(error => {
              console.error('播放音频失败:', error);
            });
          } else {
            // 播放完成后移除事件监听
            audio.value.removeEventListener('ended', playNext);
            resolve(true);
          }
        };

        // 添加播放结束事件监听
        audio.value.addEventListener('ended', playNext);

        // 开始第一次播放
        audio.value.play().catch(error => {
          console.error('播放音频失败:', error);
          resolve(false);
        });
      });
    }
  }

  // 添加停止播放方法
  const stopAudio = () => {
    if (audio.value) {
      audio.value.pause();
      audio.value.currentTime = 0;
      // 移除所有事件监听器
      audio.value.removeEventListener('ended', () => {});
      // 清空音频源
      audio.value.src = '';
    }
  }

  return { wordList, currentIndex, lastLearnedIndex, currentWord, fetchWords, nextWord, initProgress, playWordAudio, stopAudio }
}) 