<template>
  <div class="home">
    <div class="container">
      <div class="hero">
        <h1>🧠 Daily Quiz Games</h1>
        <p>Challenge yourself with daily quizzes and compete with friends!</p>
        
        <div v-if="!userStore.isAuthenticated" class="auth-prompt">
          <router-link to="/login" class="btn btn-primary">
            Get Started
          </router-link>
        </div>
      </div>
      
      <div v-if="userStore.isAuthenticated" class="user-dashboard">
        <div class="welcome-card card">
          <h2>Welcome back, {{ userStore.user.username }}! 👋</h2>
          <div class="stats">
            <div class="stat">
              <span class="stat-value">{{ userStats.totalScore }}</span>
              <span class="stat-label">Total Score</span>
            </div>
            <div class="stat">
              <span class="stat-value">{{ userStats.totalAttempts }}</span>
              <span class="stat-label">Quizzes Taken</span>
            </div>
            <div class="stat">
              <span class="stat-value">{{ userStats.accuracy }}%</span>
              <span class="stat-label">Accuracy</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="quizzes-section">
        <h2>Today's Quizzes</h2>
        <div v-if="loading" class="loading">Loading quizzes...</div>
        
        <div v-else class="quiz-grid">
          <div 
            v-for="quiz in quizzes" 
            :key="quiz.id" 
            class="quiz-card card"
            @click="startQuiz(quiz.id)"
          >
            <div class="quiz-header">
              <h3>{{ quiz.title }}</h3>
              <span class="difficulty" :class="quiz.difficulty">
                {{ quiz.difficulty }}
              </span>
            </div>
            <p>{{ quiz.description }}</p>
            <div class="quiz-meta">
              <span>{{ quiz.questions.length }} questions</span>
              <span class="quiz-date">{{ formatDate(quiz.date) }}</span>
            </div>
            <button class="btn btn-primary">Start Quiz</button>
          </div>
        </div>
      </div>
      
      <div class="features-section">
        <h2>Features</h2>
        <div class="features-grid">
          <div class="feature card">
            <div class="feature-icon">🎯</div>
            <h3>Daily Challenges</h3>
            <p>New quizzes every day to keep you engaged and learning.</p>
          </div>
          <div class="feature card">
            <div class="feature-icon">🏆</div>
            <h3>Leaderboards</h3>
            <p>Compete with other players and see where you rank.</p>
          </div>
          <div class="feature card">
            <div class="feature-icon">📊</div>
            <h3>Progress Tracking</h3>
            <p>Monitor your performance and improvement over time.</p>
          </div>
          <div class="feature card">
            <div class="feature-icon">🎲</div>
            <h3>Multiple Categories</h3>
            <p>Choose from various topics and difficulty levels.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { useQuizStore } from '../stores/quiz'
import { quizApi } from '../api'

export default {
  name: 'Home',
  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    const quizStore = useQuizStore()
    const quizzes = ref([])
    const loading = ref(true)
    
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
    
    const loadQuizzes = async () => {
      try {
        loading.value = true
        quizzes.value = await quizApi.getDailyQuizzes()
      } catch (error) {
        console.error('Failed to load quizzes:', error)
      } finally {
        loading.value = false
      }
    }
    
    const startQuiz = (quizId) => {
      if (!userStore.isAuthenticated) {
        router.push('/login')
        return
      }
      router.push(`/quiz/${quizId}`)
    }
    
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString()
    }
    
    onMounted(() => {
      userStore.initAuth()
      loadQuizzes()
    })
    
    return {
      userStore,
      quizzes,
      loading,
      userStats,
      startQuiz,
      formatDate
    }
  }
}
</script>

<style scoped>
.hero {
  text-align: center;
  padding: 3rem 0;
  color: white;
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.hero p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.auth-prompt {
  margin-top: 2rem;
}

.user-dashboard {
  margin-bottom: 3rem;
}

.welcome-card h2 {
  margin-bottom: 1.5rem;
  color: #374151;
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.stat {
  text-align: center;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
}

.stat-value {
  display: block;
  font-size: 2rem;
  font-weight: bold;
  color: #4f46e5;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
}

.quizzes-section {
  margin-bottom: 3rem;
}

.quizzes-section h2 {
  color: white;
  margin-bottom: 1.5rem;
  text-align: center;
}

.loading {
  text-align: center;
  color: white;
  font-size: 1.1rem;
}

.quiz-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.quiz-card {
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.quiz-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.quiz-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.quiz-header h3 {
  margin: 0;
  color: #374151;
}

.difficulty {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.difficulty.easy {
  background: #10b981;
  color: white;
}

.difficulty.medium {
  background: #f59e0b;
  color: white;
}

.difficulty.hard {
  background: #ef4444;
  color: white;
}

.quiz-meta {
  display: flex;
  justify-content: space-between;
  margin: 1rem 0;
  font-size: 0.875rem;
  color: #6b7280;
}

.features-section {
  margin-top: 4rem;
}

.features-section h2 {
  color: white;
  text-align: center;
  margin-bottom: 2rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.feature {
  text-align: center;
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature h3 {
  margin-bottom: 1rem;
  color: #374151;
}

.feature p {
  color: #6b7280;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: 2rem;
  }
  
  .stats {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .quiz-grid,
  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>