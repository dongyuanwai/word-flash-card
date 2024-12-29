<template>
  <div class="home-page">
    <div class="content">
      <h1>欢迎使用单词学习</h1>
      <p>点击下方按钮开始学习单词</p>
      <button @click="startLearning" class="start-btn">开始背单词</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const startLearning = () => {
  router.push('/learning')
}
</script>

<style scoped>
.home-page {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f2f5;
}

.content {
  text-align: center;
}

h1 {
  color: #2c3e50;
  font-size: clamp(2rem, 6vw, 3rem);
  margin-bottom: 20px;
}

p {
  color: #666;
  font-size: clamp(1rem, 3vw, 1.5rem);
  margin-bottom: 40px;
}

.start-btn {
  padding: 15px 40px;
  font-size: 1.2rem;
  border: none;
  border-radius: 8px;
  background: #4CAF50;
  color: white;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(74, 144, 226, 0.2);
}

.start-btn:hover {
  background: #45a049;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(74, 144, 226, 0.3);
}
</style> 