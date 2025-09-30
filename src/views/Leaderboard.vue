<template>
  <div class="leaderboard">
    <div class="container">
      <div class="leaderboard-header">
        <h1>🏆 Leaderboard</h1>
        <p>See how you rank against other quiz masters!</p>
      </div>
      
      <div class="leaderboard-content">
        <div v-if="loading" class="loading">
          <div class="spinner"></div>
          <p>Loading leaderboard...</p>
        </div>
        
        <div v-else class="leaderboard-sections">
          <div class="podium card">
            <h2>🥇 Top 3 Players</h2>
            <div class="podium-places">
              <div 
                v-for="(player, index) in topThree" 
                :key="player.id"
                class="podium-place"
                :class="`place-${index + 1}`"
              >
                <div class="place-number">{{ index + 1 }}</div>
                <div class="place-medal">{{ ['🥇', '🥈', '🥉'][index] }}</div>
                <div class="player-info">
                  <span class="username">{{ player.username }}</span>
                  <span class="score">{{ player.totalScore }} points</span>
                  <span class="accuracy">{{ getAccuracy(player) }}% accuracy</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="full-leaderboard card">
            <div class="leaderboard-filters">
              <h2>📋 All Players</h2>
              <div class="filter-buttons">
                <button 
                  @click="sortBy = 'score'"
                  class="filter-btn"
                  :class="{ active: sortBy === 'score' }"
                >
                  By Score
                </button>
                <button 
                  @click="sortBy = 'accuracy'"
                  class="filter-btn"
                  :class="{ active: sortBy === 'accuracy' }"
                >
                  By Accuracy
                </button>
                <button 
                  @click="sortBy = 'attempts'"
                  class="filter-btn"
                  :class="{ active: sortBy === 'attempts' }"
                >
                  By Activity
                </button>
              </div>
            </div>
            
            <div class="leaderboard-list">
              <div class="list-header">
                <span class="rank-col">Rank</span>
                <span class="player-col">Player</span>
                <span class="score-col">Score</span>
                <span class="accuracy-col">Accuracy</span>
                <span class="attempts-col">Quizzes</span>
              </div>
              
              <div 
                v-for="(player, index) in sortedPlayers" 
                :key="player.id"
                class="player-row"
                :class="{ 'current-user': isCurrentUser(player) }"
              >
                <span class="rank">{{ index + 1 }}</span>
                <span class="player">
                  <span class="username">{{ player.username }}</span>
                  <span v-if="isCurrentUser(player)" class="you-badge">You</span>
                </span>
                <span class="score">{{ player.totalScore }}</span>
                <span class="accuracy">{{ getAccuracy(player) }}%</span>
                <span class="attempts">{{ player.totalAttempts }}</span>
              </div>
            </div>
          </div>
          
          <div v-if="userStore.isAuthenticated" class="user-stats card">
            <h2>📊 Your Performance</h2>
            <div class="user-stats-grid">
              <div class="user-stat">
                <span class="stat-icon">🏅</span>
                <div class="stat-info">
                  <span class="stat-value">{{ userRank }}</span>
                  <span class="stat-label">Your Rank</span>
                </div>
              </div>
              <div class="user-stat">
                <span class="stat-icon">🎯</span>
                <div class="stat-info">
                  <span class="stat-value">{{ userStats.totalScore }}</span>
                  <span class="stat-label">Total Score</span>
                </div>
              </div>
              <div class="user-stat">
                <span class="stat-icon">📈</span>
                <div class="stat-info">
                  <span class="stat-value">{{ userStats.accuracy }}%</span>
                  <span class="stat-label">Accuracy</span>
                </div>
              </div>
              <div class="user-stat">
                <span class="stat-icon">🔥</span>
                <div class="stat-info">
                  <span class="stat-value">{{ userStats.totalAttempts }}</span>
                  <span class="stat-label">Quizzes Taken</span>
                </div>
              </div>
            </div>
            
            <div class="progress-to-next">
              <p>
                <strong>{{ pointsToNextRank }}</strong> points to rank {{ userRank - 1 }}
                <span v-if="userRank === 1">(You're #1! 🎉)</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '../stores/user'
import { useQuizStore } from '../stores/quiz'
import { leaderboardApi } from '../api'

export default {
  name: 'Leaderboard',
  setup() {
    const userStore = useUserStore()
    const quizStore = useQuizStore()
    const players = ref([])
    const loading = ref(true)
    const sortBy = ref('score')
    
    const userStats = computed(() => {
      const results = quizStore.getQuizResults()
      const totalScore = results.reduce((sum, result) => sum + result.score, 0)
      const totalQuestions = results.reduce((sum, result) => sum + result.totalQuestions, 0)
      const accuracy = totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0
      
      return {
        totalScore,
        totalAttempts: results.length,
        accuracy
      }
    })
    
    const enhancedPlayers = computed(() => {
      let allPlayers = [...players.value]
      
      // Add current user if authenticated and not already in list
      if (userStore.isAuthenticated) {
        const currentUserInList = allPlayers.find(p => p.username === userStore.user.username)
        if (!currentUserInList) {
          allPlayers.push({
            id: userStore.user.id,
            username: userStore.user.username,
            totalScore: userStats.value.totalScore,
            totalAttempts: userStats.value.totalAttempts
          })
        }
      }
      
      return allPlayers
    })
    
    const sortedPlayers = computed(() => {
      const sorted = [...enhancedPlayers.value]
      
      switch (sortBy.value) {
        case 'accuracy':
          return sorted.sort((a, b) => getAccuracy(b) - getAccuracy(a))
        case 'attempts':
          return sorted.sort((a, b) => b.totalAttempts - a.totalAttempts)
        default: // score
          return sorted.sort((a, b) => b.totalScore - a.totalScore)
      }
    })
    
    const topThree = computed(() => {
      return sortedPlayers.value.slice(0, 3)
    })
    
    const userRank = computed(() => {
      if (!userStore.isAuthenticated) return null
      
      const index = sortedPlayers.value.findIndex(p => p.username === userStore.user.username)
      return index >= 0 ? index + 1 : null
    })
    
    const pointsToNextRank = computed(() => {
      if (!userStore.isAuthenticated || userRank.value === 1) return 0
      
      const nextPlayer = sortedPlayers.value[userRank.value - 2]
      return nextPlayer.totalScore - userStats.value.totalScore
    })
    
    const getAccuracy = (player) => {
      if (player.totalAttempts === 0) return 0
      // Mock calculation - in real app this would come from backend
      const estimatedQuestions = player.totalAttempts * 5 // assuming 5 questions per quiz
      return Math.round((player.totalScore / estimatedQuestions) * 100)
    }
    
    const isCurrentUser = (player) => {
      return userStore.isAuthenticated && player.username === userStore.user.username
    }
    
    const loadLeaderboard = async () => {
      try {
        loading.value = true
        players.value = await leaderboardApi.getLeaderboard()
      } catch (error) {
        console.error('Failed to load leaderboard:', error)
      } finally {
        loading.value = false
      }
    }
    
    onMounted(() => {
      userStore.initAuth()
      loadLeaderboard()
    })
    
    return {
      userStore,
      players,
      loading,
      sortBy,
      userStats,
      sortedPlayers,
      topThree,
      userRank,
      pointsToNextRank,
      getAccuracy,
      isCurrentUser
    }
  }
}
</script>

<style scoped>
.leaderboard-header {
  text-align: center;
  color: white;
  margin-bottom: 2rem;
}

.leaderboard-header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.loading {
  text-align: center;
  color: white;
  padding: 3rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.leaderboard-sections {
  display: grid;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.podium-places {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.podium-place {
  text-align: center;
  padding: 1.5rem;
  border-radius: 12px;
  background: linear-gradient(135deg, #fef3c7 0%, #fcd34d 100%);
  border: 2px solid #f59e0b;
}

.podium-place.place-1 {
  background: linear-gradient(135deg, #fef3c7 0%, #fbbf24 100%);
  border-color: #d97706;
  transform: scale(1.05);
}

.podium-place.place-2 {
  background: linear-gradient(135deg, #f3f4f6 0%, #d1d5db 100%);
  border-color: #9ca3af;
}

.podium-place.place-3 {
  background: linear-gradient(135deg, #fef2f2 0%, #fecaca 100%);
  border-color: #f87171;
}

.place-number {
  font-size: 1.5rem;
  font-weight: bold;
  color: #374151;
}

.place-medal {
  font-size: 2rem;
  margin: 0.5rem 0;
}

.player-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.username {
  font-weight: bold;
  color: #374151;
}

.score {
  color: #4f46e5;
  font-weight: 500;
}

.accuracy {
  font-size: 0.875rem;
  color: #6b7280;
}

.leaderboard-filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.filter-buttons {
  display: flex;
  gap: 0.5rem;
}

.filter-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-btn:hover,
.filter-btn.active {
  background: #4f46e5;
  color: white;
  border-color: #4f46e5;
}

.leaderboard-list {
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
}

.list-header {
  display: grid;
  grid-template-columns: 60px 1fr 80px 80px 80px;
  gap: 1rem;
  padding: 1rem;
  background: #f9fafb;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
}

.player-row {
  display: grid;
  grid-template-columns: 60px 1fr 80px 80px 80px;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid #f3f4f6;
  transition: background 0.2s ease;
}

.player-row:hover {
  background: #f9fafb;
}

.player-row.current-user {
  background: #f0f9ff;
  border-left: 4px solid #4f46e5;
}

.rank {
  font-weight: bold;
  color: #4f46e5;
}

.player {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.you-badge {
  background: #4f46e5;
  color: white;
  padding: 0.125rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

.score {
  font-weight: 600;
  color: #059669;
}

.user-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.user-stat {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f0f9ff;
  border-radius: 8px;
  border: 1px solid #bae6fd;
}

.stat-icon {
  font-size: 1.5rem;
}

.stat-info {
  flex: 1;
}

.stat-value {
  display: block;
  font-size: 1.25rem;
  font-weight: bold;
  color: #0369a1;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
}

.progress-to-next {
  text-align: center;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
  color: #6b7280;
}

@media (max-width: 768px) {
  .podium-places {
    grid-template-columns: 1fr;
  }
  
  .leaderboard-filters {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .list-header,
  .player-row {
    grid-template-columns: 50px 1fr 60px 60px 60px;
    font-size: 0.875rem;
  }
  
  .user-stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>