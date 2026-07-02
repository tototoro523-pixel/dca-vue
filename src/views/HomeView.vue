<script setup>
import { useRouter } from 'vue-router'
import AppHeader from '@/components/common/AppHeader.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BottomNavigation from '@/components/common/BottomNavigation.vue'

const router = useRouter()
const startAnalysis = () => router.push('/analysis')
</script>

<template>
  <div class="page">
    <AppHeader title="DCA" />
    <main class="page-content">
      <h2>재무제표를 활용한 신용분석 시스템</h2>
      <p>기업의 핵심 재무지표를 분석합니다.</p>
      <BaseButton @click="startAnalysis">기업 신용분석 시작</BaseButton>
    </main>
    <BottomNavigation />
  </div>
</template>

<style scoped>
.page { min-height: 100vh; }
.page-content { display: flex; flex-direction: column; gap: 16px; padding: 24px 16px 96px; }
</style>
