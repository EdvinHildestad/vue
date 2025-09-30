import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useQuizStore = defineStore('quiz', () => {
  const currentQuiz = ref(null)
  const quizzes = ref([])
  const userAnswers = ref([])
  const currentQuestionIndex = ref(0)
  const score = ref(0)
  const attempts = ref(0)
  const isCompleted = ref(false)
  
  const currentQuestion = computed(() => {
    if (!currentQuiz.value || !currentQuiz.value.questions) return null
    return currentQuiz.value.questions[currentQuestionIndex.value]
  })
  
  const progress = computed(() => {
    if (!currentQuiz.value || !currentQuiz.value.questions) return 0
    return ((currentQuestionIndex.value) / currentQuiz.value.questions.length) * 100
  })
  
  const setQuiz = (quiz) => {
    currentQuiz.value = quiz
    userAnswers.value = []
    currentQuestionIndex.value = 0
    score.value = 0
    isCompleted.value = false
  }
  
  const answerQuestion = (answer) => {
    userAnswers.value[currentQuestionIndex.value] = answer
    
    if (answer === currentQuestion.value.correctAnswer) {
      score.value++
    }
    
    if (currentQuestionIndex.value < currentQuiz.value.questions.length - 1) {
      currentQuestionIndex.value++
    } else {
      completeQuiz()
    }
  }
  
  const completeQuiz = () => {
    isCompleted.value = true
    attempts.value++
    
    // Save results to localStorage for persistence
    const results = {
      quizId: currentQuiz.value.id,
      score: score.value,
      totalQuestions: currentQuiz.value.questions.length,
      attempts: attempts.value,
      date: new Date().toISOString()
    }
    
    const savedResults = JSON.parse(localStorage.getItem('quizResults') || '[]')
    savedResults.push(results)
    localStorage.setItem('quizResults', JSON.stringify(savedResults))
  }
  
  const resetQuiz = () => {
    userAnswers.value = []
    currentQuestionIndex.value = 0
    score.value = 0
    isCompleted.value = false
  }
  
  const getQuizResults = () => {
    return JSON.parse(localStorage.getItem('quizResults') || '[]')
  }
  
  return {
    currentQuiz,
    quizzes,
    userAnswers,
    currentQuestionIndex,
    score,
    attempts,
    isCompleted,
    currentQuestion,
    progress,
    setQuiz,
    answerQuestion,
    completeQuiz,
    resetQuiz,
    getQuizResults
  }
})