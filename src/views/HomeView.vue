<template>
  <div class="home-view min-h-screen bg-gradient-to-b from-amber-50 to-white pb-20">
    <!-- 顶部标题 -->
    <div class="px-4 pt-6 pb-4">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">☕ 手冲咖啡助手</h1>
      <p class="text-gray-600">选择一个冲煮方案开始</p>
    </div>

    <!-- 方案卡片列表 -->
    <div class="px-4 space-y-3">
      <RecipeCard
        v-for="recipe in allRecipes"
        :key="recipe.recipeId"
        :recipe="recipe"
      />
    </div>

    <!-- 底部导航栏 -->
    <TabBar />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRecipeStore } from '@/stores/recipeStore'
import RecipeCard from '@/components/recipes/RecipeCard.vue'
import TabBar from '@/components/ui/layout/TabBar.vue'

const recipeStore = useRecipeStore()

const allRecipes = computed(() => recipeStore.allRecipes)
</script>
