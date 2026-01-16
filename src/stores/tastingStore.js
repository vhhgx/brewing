import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useTastingStore = defineStore('tasting', () => {
  // State
  const records = ref([])

  // Getters
  const getAllRecords = computed(() => {
    return [...records.value].sort((a, b) =>
      new Date(b.timestamp) - new Date(a.timestamp)
    )
  })

  const getRecordById = computed(() => (id) => {
    return records.value.find(r => r.brewRecordId === id)
  })

  const getRecordsByRecipeId = computed(() => (recipeId) => {
    return records.value.filter(r => r.linkedRecipeId === recipeId)
  })

  // Actions
  function createRecord(brewData) {
    console.log('🆕 tastingStore.createRecord called with:', brewData)
    
    const newRecord = {
      brewRecordId: crypto.randomUUID(),
      linkedRecipeId: brewData.recipeId,
      linkedCoffeeBean: null, // P1 功能
      timestamp: new Date().toISOString(),

      actualParameters: {
        coffeeWeight: brewData.actualParameters.coffeeWeight,
        waterWeight: brewData.actualParameters.totalWater,
        temperature: brewData.actualParameters.temperature,
        totalTime: brewData.totalTime || 0,
        stepsCompleted: brewData.actualSteps || [],
        deviations: ''
      },

      tastingNotes: {
        flavorTags: [],
        dimensions: {
          aroma: 3,
          body: 3,
          acidity: 3,
          sweetness: 3,
          aftertaste: 3
        },
        overallScore: 3,
        notes: '',
        imageUrl: ''
      },

      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    records.value.push(newRecord)
    console.log('✅ Record created and added to store:', newRecord)
    console.log('📊 Total records now:', records.value.length)
    
    return newRecord
  }

  function updateRecord(id, data) {
    const index = records.value.findIndex(r => r.brewRecordId === id)
    if (index !== -1) {
      records.value[index] = {
        ...records.value[index],
        ...data,
        updatedAt: new Date().toISOString()
      }
      return records.value[index]
    }
    return null
  }

  function deleteRecord(id) {
    const index = records.value.findIndex(r => r.brewRecordId === id)
    if (index !== -1) {
      records.value.splice(index, 1)
      return true
    }
    return false
  }

  return {
    // State
    records,

    // Getters
    getAllRecords,
    getRecordById,
    getRecordsByRecipeId,

    // Actions
    createRecord,
    updateRecord,
    deleteRecord
  }
}, {
  persist: {
    key: 'tasting-records',
    storage: localStorage
  }
})
