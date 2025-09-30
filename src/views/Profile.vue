<template>
  <div class="profile">
    <div class="container">
      <div class="profile-header">
        <h1>👤 My Profile</h1>
      </div>
      
      <div class="profile-content">
        <div class="profile-info card">
          <h2>Profile Information</h2>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">Username</span>
              <span class="value">{{ userStore.user.username }}</span>
            </div>
            <div class="info-item">
              <span class="label">Email</span>
              <span class="value">{{ userStore.user.email }}</span>
            </div>
            <div class="info-item">
              <span class="label">Joined</span>
              <span class="value">{{ formatDate(userStore.user.joinedDate) }}</span>
            </div>
          </div>
        </div>
        
        <div class="profile-stats card">
          <h2>📊 Quiz Statistics</h2>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon">🎯</div>
              <div class="stat-info">
                <span class="stat-value">{{ userStats.totalScore }}</span>
                <span class="stat-label">Total Score</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">📝</div>
              <div class="stat-info">
                <span class="stat-value">{{ userStats.totalAttempts }}</span>
                <span class="stat-label">Quizzes Taken</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">💯</div>
              <div class="stat-info">
                <span class="stat-value">{{ userStats.accuracy }}%</span>
                <span class="stat-label">Accuracy</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">🏆</div>
              <div class="stat-info">
                <span class="stat-value">{{ userStats.bestScore }}%</span>
                <span class="stat-label">Best Score</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="recent-quizzes card">
          <h2>📈 Recent Quiz Results</h2>
          <div v-if="recentResults.length === 0" class="no-results">
            <p>No quiz results yet. <router-link to="/">Take your first quiz!</router-link></p>
          </div>
          <div v-else class="results-list">
            <div 
              v-for="result in recentResults" 
              :key="result.date" 
              class="result-item"
            >
              <div class="result-info">
                <h4>Quiz {{ result.quizId.replace('daily-', '') }}</h4>
                <span class="result-date">{{ formatDate(result.date) }}</span>
              </div>
              <div class="result-score">
                <span class="score">{{ result.score }}/{{ result.totalQuestions }}</span>
                <span class="percentage">{{ Math.round((result.score / result.totalQuestions) * 100) }}%</span>
              </div>
              <div class="result-attempts">
                <span class="attempts">{{ result.attempts }} attempt{{ result.attempts !== 1 ? 's' : '' }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="achievements card">
          <h2>🏅 Achievements</h2>
          <div class="achievements-grid">
            <div 
              v-for="achievement in achievements" 
              :key="achievement.id"
              class="achievement"
              :class="{ unlocked: achievement.unlocked }"
            >
              <div class="achievement-icon">{{ achievement.icon }}</div>
              <div class="achievement-info">
                <h4>{{ achievement.title }}</h4>
                <p>{{ achievement.description }}</p>
              </div>
              <div class="achievement-status">
                {{ achievement.unlocked ? '✅' : '🔒' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue'
import { useUserStore } from '../stores/user'
import { useQuizStore } from '../stores/quiz'

export default {
  name: 'Profile',
  setup() {
    const userStore = useUserStore()
    const quizStore = useQuizStore()
    
    const userStats = computed(() => {
      const results = quizStore.getQuizResults()
      const totalScore = results.reduce((sum, result) => sum + result.score, 0)
      const totalQuestions = results.reduce((sum, result) => sum + result.totalQuestions, 0)
      const accuracy = totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0
      
      const bestScore = results.length > 0 
        ? Math.max(...results.map(result => Math.round((result.score / result.totalQuestions) * 100)))
        : 0
      
      return {
        totalScore,
        totalAttempts: results.length,
        accuracy,
        bestScore
      }
    })
    
    const recentResults = computed(() => {
      return quizStore.getQuizResults()
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 10)
    })
    
    const achievements = computed(() => {
      const stats = userStats.value
      const results = quizStore.getQuizResults()
      
      return [
        {
          id: 'first-quiz',
          icon: '🌟',
          title: 'First Steps',
          description: 'Complete your first quiz',
          unlocked: stats.totalAttempts >= 1
        },
        {
          id: 'five-quizzes',
          icon: '🔥',
          title: 'Getting Started',
          description: 'Complete 5 quizzes',
          unlocked: stats.totalAttempts >= 5
        },
        {
          id: 'perfect-score',
          icon: '💯',
          title: 'Perfect Score',
          description: 'Get 100% on any quiz',
          unlocked: stats.bestScore === 100
        },
        {
          id: 'high-accuracy',
          icon: '🎯',
          title: 'Sharp Shooter',
          description: 'Maintain 80% accuracy',
          unlocked: stats.accuracy >= 80
        },
        {
          id: 'quiz-master',
          icon: '👑',
          title: 'Quiz Master',
          description: 'Complete 10 quizzes',
          unlocked: stats.totalAttempts >= 10
        },
        {
          id: 'dedicated-learner',
          icon: '📚',
          title: 'Dedicated Learner',
          description: 'Score 100+ total points',
          unlocked: stats.totalScore >= 100
        }
      ]
    })
    
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
    
    onMounted(() => {
      userStore.initAuth()
    })
    
    return {
      userStore,
      userStats,
      recentResults,
      achievements,
      formatDate
    }
  }
}
</script>

<style scoped>
.profile-header {
  text-align: center;
  color: white;
  margin-bottom: 2rem;
}

.profile-header h1 {
  font-size: 2.5rem;
  margin: 0;
}

.profile-content {
  max-width: 1000px;
  margin: 0 auto;
  display: grid;
  gap: 2rem;
}

.info-grid {
  display: grid;
  gap: 1rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
}

.label {
  font-weight: 500;
  color: #6b7280;
}

.value {
  color: #374151;
  font-weight: 500;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-radius: 12px;
  border: 1px solid #bae6fd;
}

.stat-icon {
  font-size: 2rem;
}

.stat-info {
  flex: 1;
}

.stat-value {
  display: block;
  font-size: 1.75rem;
  font-weight: bold;
  color: #0369a1;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
}

.no-results {
  text-align: center;
  color: #6b7280;
  padding: 2rem;
}

.no-results a {
  color: #4f46e5;
  text-decoration: none;
}

.no-results a:hover {
  text-decoration: underline;
}

.results-list {
  display: grid;
  gap: 1rem;
}

.result-item {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 1rem;
  align-items: center;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
  border-left: 4px solid #4f46e5;
}

.result-info h4 {
  margin: 0 0 0.25rem 0;
  color: #374151;
  font-size: 1rem;
}

.result-date {
  font-size: 0.875rem;
  color: #6b7280;
}

.result-score {
  text-align: center;
}

.score {
  display: block;
  font-weight: bold;
  color: #059669;
}

.percentage {
  font-size: 0.875rem;
  color: #6b7280;
}

.attempts {
  font-size: 0.875rem;
  color: #6b7280;
  text-align: center;
}

.achievements-grid {
  display: grid;
  gap: 1rem;
}

.achievement {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.achievement.unlocked {
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border: 1px solid #bbf7d0;
}

.achievement:not(.unlocked) {
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  opacity: 0.6;
}

.achievement-icon {
  font-size: 2rem;
}

.achievement-info {
  flex: 1;
}

.achievement-info h4 {
  margin: 0 0 0.25rem 0;
  color: #374151;
}

.achievement-info p {
  margin: 0;
  font-size: 0.875rem;
  color: #6b7280;
}

.achievement-status {
  font-size: 1.25rem;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .result-item {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 0.5rem;
  }
  
  .achievement {
    flex-direction: column;
    text-align: center;
  }
}
</style>