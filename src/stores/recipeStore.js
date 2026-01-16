import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { PRESET_RECIPES } from '@/utils/constants'

export const useRecipeStore = defineStore('recipes', () => {
  // State
  const presetRecipes = ref(PRESET_RECIPES)
  const customRecipes = ref([])

  // Getters
  const allRecipes = computed(() => [...presetRecipes.value, ...customRecipes.value])

  const getRecipeById = computed(() => (id) => {
    return allRecipes.value.find(r => r.recipeId === id)
  })

  const getRecipesByDevice = computed(() => (device) => {
    return allRecipes.value.filter(r => r.device === device)
  })

  const getRecipesByDifficulty = computed(() => (difficulty) => {
    return allRecipes.value.filter(r => r.difficulty === difficulty)
  })

  // Actions
  function addCustomRecipe(recipe) {
    const newRecipe = {
      ...recipe,
      recipeId: crypto.randomUUID(),
      isPreset: false,
      createdBy: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    customRecipes.value.push(newRecipe)
    return newRecipe
  }

  function updateCustomRecipe(recipeId, updates) {
    const index = customRecipes.value.findIndex(r => r.recipeId === recipeId)
    if (index !== -1) {
      customRecipes.value[index] = {
        ...customRecipes.value[index],
        ...updates,
        updatedAt: new Date()
      }
      return customRecipes.value[index]
    }
    return null
  }

  function deleteCustomRecipe(recipeId) {
    const index = customRecipes.value.findIndex(r => r.recipeId === recipeId)
    if (index !== -1) {
      customRecipes.value.splice(index, 1)
      return true
    }
    return false
  }

  return {
    // State
    presetRecipes,
    customRecipes,

    // Getters
    allRecipes,
    getRecipeById,
    getRecipesByDevice,
    getRecipesByDifficulty,

    // Actions
    addCustomRecipe,
    updateCustomRecipe,
    deleteCustomRecipe
  }
}, {
  persist: {
    key: 'recipes',
    storage: localStorage,
    paths: ['customRecipes'] // 只持久化自定义方案
  }
})
