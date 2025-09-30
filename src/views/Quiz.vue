<template>
  <div class="quiz">
    <div class="container">
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Loading quiz...</p>
      </div>
      
      <div v-else-if="!quizStore.currentQuiz" class="error">
        <h2>Quiz not found</h2>
        <router-link to="/" class="btn btn-primary">Back to Home</router-link>
      </div>
      
      <div v-else-if="quizStore.isCompleted" class="quiz-completed">
        <div class="results-card card">
          <div class="results-header">
            <h1>🎉 Quiz Completed!</h1>
            <div class="score-display">
              <span class="score">{{ quizStore.score }}</span>
              <span class="total">/ {{ quizStore.currentQuiz.questions.length }}</span>
            </div>
          </div>
          
          <div class="results-stats">
            <div class="stat">
              <span class="stat-label">Score</span>
              <span class="stat-value">{{ Math.round((quizStore.score / quizStore.currentQuiz.questions.length) * 100) }}%</span>
            </div>
            <div class="stat">
              <span class="stat-label">Questions</span>
              <span class="stat-value">{{ quizStore.currentQuiz.questions.length }}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Attempts</span>
              <span class="stat-value">{{ quizStore.attempts }}</span>
            </div>
          </div>
          
          <div class="results-actions">
            <button @click="retakeQuiz" class="btn btn-secondary">
              🔄 Retake Quiz
            </button>
            <router-link to="/" class="btn btn-primary">
              🏠 Back to Home
            </router-link>
            <router-link to="/leaderboard" class="btn btn-primary">
              🏆 View Leaderboard
            </router-link>
          </div>
        </div>
      </div>
      
      <div v-else class="quiz-active">
        <div class="quiz-header">
          <div class="quiz-info">
            <h1>{{ quizStore.currentQuiz.title }}</h1>
            <p>{{ quizStore.currentQuiz.description }}</p>
          </div>
          
          <div class="quiz-progress">
            <div class="progress-bar">
              <div 
                class="progress-fill" 
                :style="{ width: `${quizStore.progress}%` }"
              ></div>
            </div>
            <span class="progress-text">
              {{ quizStore.currentQuestionIndex + 1 }} / {{ quizStore.currentQuiz.questions.length }}
            </span>
          </div>
        </div>
        
        <div v-if="quizStore.currentQuestion" class="question-card card">
          <div class="question-header">
            <h2>Question {{ quizStore.currentQuestionIndex + 1 }}</h2>
          </div>
          
          <div class="question-content">
            <h3>{{ quizStore.currentQuestion.question }}</h3>
            
            <div class="options">
              <button
                v-for="option in quizStore.currentQuestion.options"
                :key="option"
                @click="selectAnswer(option)"
                class="option-button"
                :class="{ 
                  'selected': selectedAnswer === option,
                  'correct': showAnswer && option === quizStore.currentQuestion.correctAnswer,
                  'incorrect': showAnswer && selectedAnswer === option && option !== quizStore.currentQuestion.correctAnswer
                }"
                :disabled="showAnswer"
              >
                {{ option }}
              </button>
            </div>
          </div>
          
          <div v-if="selectedAnswer && !showAnswer" class="question-actions">
            <button @click="confirmAnswer" class="btn btn-primary">
              Confirm Answer
            </button>
          </div>
          
          <div v-if="showAnswer" class="answer-feedback">
            <div v-if="selectedAnswer === quizStore.currentQuestion.correctAnswer" class="feedback correct">
              ✅ Correct! Well done!
            </div>
            <div v-else class="feedback incorrect">
              ❌ Incorrect. The correct answer is: {{ quizStore.currentQuestion.correctAnswer }}
            </div>
            
            <button @click="nextQuestion" class="btn btn-primary next-btn">
              {{ quizStore.currentQuestionIndex < quizStore.currentQuiz.questions.length - 1 ? 'Next Question' : 'Finish Quiz' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuizStore } from '../stores/quiz'
import { quizApi } from '../api'

export default {
  name: 'Quiz',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const quizStore = useQuizStore()
    const loading = ref(true)
    const selectedAnswer = ref('')
    const showAnswer = ref(false)
    
    const loadQuiz = async () => {
      try {
        loading.value = true
        const quizId = route.params.quizId
        
        if (!quizId) {
          // If no quiz ID, redirect to home
          router.push('/')
          return
        }
        
        const quiz = await quizApi.getQuiz(quizId)
        if (quiz) {
          quizStore.setQuiz(quiz)
        } else {
          console.error('Quiz not found')
        }
      } catch (error) {
        console.error('Failed to load quiz:', error)
      } finally {
        loading.value = false
      }
    }
    
    const selectAnswer = (answer) => {
      if (showAnswer.value) return
      selectedAnswer.value = answer
    }
    
    const confirmAnswer = () => {
      if (!selectedAnswer.value) return
      showAnswer.value = true
    }
    
    const nextQuestion = () => {
      quizStore.answerQuestion(selectedAnswer.value)
      selectedAnswer.value = ''
      showAnswer.value = false
    }
    
    const retakeQuiz = () => {
      quizStore.resetQuiz()
      selectedAnswer.value = ''
      showAnswer.value = false
    }
    
    onMounted(() => {
      loadQuiz()
    })
    
    return {
      quizStore,
      loading,
      selectedAnswer,
      showAnswer,
      selectAnswer,
      confirmAnswer,
      nextQuestion,
      retakeQuiz
    }
  }
}
</script>

<style scoped>
.loading {
  text-align: center;
  padding: 3rem;
  color: white;
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

.error {
  text-align: center;
  color: white;
  padding: 3rem;
}

.quiz-header {
  margin-bottom: 2rem;
  color: white;
  text-align: center;
}

.quiz-info h1 {
  margin-bottom: 0.5rem;
}

.quiz-progress {
  margin-top: 1.5rem;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: #10b981;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.875rem;
  opacity: 0.9;
}

.question-card {
  max-width: 800px;
  margin: 0 auto;
}

.question-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.question-header h2 {
  color: #4f46e5;
  margin: 0;
}

.question-content h3 {
  margin-bottom: 2rem;
  color: #374151;
  font-size: 1.25rem;
  line-height: 1.6;
}

.options {
  display: grid;
  gap: 1rem;
  margin-bottom: 2rem;
}

.option-button {
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  font-size: 1rem;
  text-align: left;
  transition: all 0.3s ease;
}

.option-button:hover:not(:disabled) {
  border-color: #4f46e5;
  transform: translateY(-2px);
}

.option-button.selected {
  border-color: #4f46e5;
  background: #f0f9ff;
}

.option-button.correct {
  border-color: #10b981;
  background: #f0fdf4;
  color: #059669;
}

.option-button.incorrect {
  border-color: #ef4444;
  background: #fef2f2;
  color: #dc2626;
}

.option-button:disabled {
  cursor: not-allowed;
}

.question-actions {
  text-align: center;
}

.answer-feedback {
  text-align: center;
  margin-top: 1.5rem;
}

.feedback {
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-weight: 500;
}

.feedback.correct {
  background: #f0fdf4;
  color: #059669;
  border: 1px solid #10b981;
}

.feedback.incorrect {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #ef4444;
}

.next-btn {
  font-size: 1.1rem;
  padding: 0.875rem 2rem;
}

.quiz-completed {
  max-width: 600px;
  margin: 0 auto;
}

.results-card {
  text-align: center;
}

.results-header h1 {
  margin-bottom: 1rem;
  color: #374151;
}

.score-display {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 2rem;
}

.score {
  color: #10b981;
}

.total {
  color: #6b7280;
}

.results-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat {
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
}

.stat-label {
  display: block;
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #374151;
}

.results-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .results-stats {
    grid-template-columns: 1fr;
  }
  
  .results-actions {
    flex-direction: column;
  }
  
  .score-display {
    font-size: 2rem;
  }
}
</style>