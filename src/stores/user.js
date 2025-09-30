import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const isAuthenticated = computed(() => !!user.value)
  
  const login = (userData) => {
    user.value = userData
    localStorage.setItem('user', JSON.stringify(userData))
  }
  
  const logout = () => {
    user.value = null
    localStorage.removeItem('user')
  }
  
  const initAuth = () => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      user.value = JSON.parse(savedUser)
    }
  }
  
  const updateProfile = (profileData) => {
    if (user.value) {
      user.value = { ...user.value, ...profileData }
      localStorage.setItem('user', JSON.stringify(user.value))
    }
  }
  
  return {
    user,
    isAuthenticated,
    login,
    logout,
    initAuth,
    updateProfile
  }
})