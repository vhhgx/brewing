<template>
  <Card
    clickable
    hoverable
    @click="handleClick"
    class="recipe-card"
  >
    <div class="flex items-start justify-between mb-3">
      <div class="flex-1">
        <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ recipe.name }}</h3>
        <div class="flex items-center gap-2 text-sm text-gray-600">
          <span>{{ recipe.device }}</span>
          <span>•</span>
          <span>{{ recipe.ratio }}</span>
        </div>
      </div>
      <span
        class="px-2 py-1 text-xs rounded-full"
        :class="difficultyColor"
      >
        {{ recipe.difficulty }}
      </span>
    </div>

    <div class="flex items-center justify-between text-sm">
      <span class="text-gray-500 flex items-center gap-1">
        <span>⏱</span>
        <span>{{ totalDuration }}s</span>
      </span>
      <div class="flex gap-1">
        <span
          v-for="tag in displayTags"
          :key="tag"
          class="px-2 py-0.5 text-xs bg-amber-50 text-amber-700 rounded"
        >
          {{ tag }}
        </span>
      </div>
    </div>
  </Card>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import Card from '@/components/ui/Card.vue'

const props = defineProps({
  recipe: {
    type: Object,
    required: true
  }
})

const router = useRouter()

const totalDuration = computed(() => {
  const steps = props.recipe.steps
  return steps[steps.length - 1].endTime
})

const displayTags = computed(() => {
  return props.recipe.tags.slice(0, 2)
})

const difficultyColor = computed(() => {
  const colors = {
    '初级': 'bg-green-100 text-green-800',
    '中级': 'bg-yellow-100 text-yellow-800',
    '高级': 'bg-red-100 text-red-800'
  }
  return colors[props.recipe.difficulty] || 'bg-gray-100 text-gray-800'
})

function handleClick() {
  router.push({
    name: 'RecipeDetail',
    params: { id: props.recipe.recipeId }
  })
}
</script>
