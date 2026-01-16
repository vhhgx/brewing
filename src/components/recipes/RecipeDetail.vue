<template>
  <div class="recipe-detail min-h-screen bg-gray-50">
    <Header :title="recipe?.name || '方案详情'" show-back />

    <div v-if="recipe" class="p-4 space-y-6 pb-24">
      <!-- 基本参数 -->
      <Card padding="normal" shadow="normal">
        <h2 class="text-xl font-semibold mb-4 text-gray-800">冲煮参数</h2>
        <div class="grid grid-cols-2 gap-4">
          <div class="param-item">
            <div class="text-sm text-gray-500 mb-1">咖啡粉</div>
            <div class="text-2xl font-bold text-amber-700">{{ recipe.coffeeWeight }}g</div>
          </div>
          <div class="param-item">
            <div class="text-sm text-gray-500 mb-1">水量</div>
            <div class="text-2xl font-bold text-blue-600">{{ recipe.totalWater }}g</div>
          </div>
          <div class="param-item">
            <div class="text-sm text-gray-500 mb-1">水温</div>
            <div class="text-2xl font-bold text-red-500">{{ recipe.temperature }}℃</div>
          </div>
          <div class="param-item">
            <div class="text-sm text-gray-500 mb-1">研磨度</div>
            <div class="text-lg font-semibold text-gray-700">{{ recipe.grindSizeDesc }}</div>
          </div>
          <div class="param-item">
            <div class="text-sm text-gray-500 mb-1">粉水比</div>
            <div class="text-lg font-semibold text-gray-700">{{ recipe.ratio }}</div>
          </div>
          <div class="param-item">
            <div class="text-sm text-gray-500 mb-1">器具</div>
            <div class="text-lg font-semibold text-gray-700">{{ recipe.device }}</div>
          </div>
        </div>
      </Card>

      <!-- 标签信息 -->
      <Card padding="normal" shadow="small">
        <div class="flex items-center gap-2 flex-wrap">
          <span class="px-3 py-1 text-sm rounded-full bg-green-100 text-green-800 font-medium">
            {{ recipe.difficulty }}
          </span>
          <span
            v-for="tag in recipe.tags"
            :key="tag"
            class="px-3 py-1 text-sm rounded-full bg-amber-50 text-amber-700"
          >
            {{ tag }}
          </span>
        </div>
      </Card>

      <!-- 分段步骤 -->
      <Card padding="normal" shadow="normal">
        <h2 class="text-xl font-semibold mb-4 text-gray-800">冲煮步骤</h2>
        <div class="space-y-4">
          <div
            v-for="step in recipe.steps"
            :key="step.stepId"
            class="step-item p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div class="flex items-start gap-4">
              <div class="step-number flex-shrink-0 w-10 h-10 flex items-center justify-center bg-amber-600 text-white rounded-full font-bold text-lg">
                {{ step.stepId + 1 }}
              </div>
              <div class="flex-1">
                <h3 class="font-bold text-lg mb-2 text-gray-800">{{ step.name }}</h3>
                <p class="text-sm text-gray-600 mb-3 leading-relaxed">{{ step.instruction }}</p>
                <div class="flex items-center gap-4 text-sm">
                  <span v-if="step.waterAmount > 0" class="flex items-center gap-1 text-blue-600 font-medium">
                    <span class="text-lg">💧</span>
                    {{ step.waterAmount }}g
                  </span>
                  <span class="flex items-center gap-1 text-gray-600 font-medium">
                    <span class="text-lg">⏱</span>
                    {{ step.duration }}s
                  </span>
                  <span class="text-gray-400 text-xs">
                    {{ step.startTime }}s - {{ step.endTime }}s
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <!-- 预计总时长 -->
      <Card padding="normal" shadow="small" class="bg-gradient-to-r from-amber-50 to-orange-50">
        <div class="flex items-center justify-between">
          <div class="text-gray-600 font-medium">预计总时长</div>
          <div class="text-3xl font-bold text-amber-700">
            {{ totalDuration }}s
          </div>
        </div>
      </Card>
    </div>

    <!-- 空状态 -->
    <div v-else class="flex items-center justify-center h-screen">
      <div class="text-center text-gray-400">
        <p class="mb-4">未找到方案</p>
        <Button variant="primary" @click="router.push('/')">
          返回首页
        </Button>
      </div>
    </div>

    <!-- 开始冲煮按钮 - 固定在底部 -->
    <div v-if="recipe" class="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-lg">
      <Button
        variant="primary"
        size="large"
        class="w-full text-lg font-semibold"
        @click="startBrewing"
      >
        <span class="flex items-center justify-center gap-2">
          <span>开始冲煮</span>
          <span class="text-xl">☕</span>
        </span>
      </Button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useRecipeStore } from '@/stores/recipeStore'
import Header from '@/components/ui/layout/Header.vue'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'

const router = useRouter()
const route = useRoute()
const recipeStore = useRecipeStore()

const recipe = computed(() => recipeStore.getRecipeById(route.params.id))

const totalDuration = computed(() => {
  if (!recipe.value || !recipe.value.steps.length) return 0
  return recipe.value.steps[recipe.value.steps.length - 1].endTime
})

function startBrewing() {
  router.push({
    name: 'Brewing',
    params: { recipeId: recipe.value.recipeId }
  })
}
</script>

<style scoped>
.param-item {
  @apply transition-transform hover:scale-105;
}

.step-item {
  @apply transition-all duration-200;
}
</style>
