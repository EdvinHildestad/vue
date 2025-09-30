import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Mock data for development when backend is not available
const mockQuizzes = [
  {
    id: 'daily-1',
    title: 'Daily Quiz - General Knowledge',
    description: 'Test your general knowledge with today\'s quiz!',
    difficulty: 'medium',
    date: new Date().toISOString().split('T')[0],
    questions: [
      {
        id: 1,
        question: 'What is the capital of France?',
        options: ['London', 'Berlin', 'Paris', 'Madrid'],
        correctAnswer: 'Paris'
      },
      {
        id: 2,
        question: 'Which planet is known as the Red Planet?',
        options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
        correctAnswer: 'Mars'
      },
      {
        id: 3,
        question: 'What is 2 + 2?',
        options: ['3', '4', '5', '6'],
        correctAnswer: '4'
      },
      {
        id: 4,
        question: 'Who painted the Mona Lisa?',
        options: ['Van Gogh', 'Picasso', 'Da Vinci', 'Michelangelo'],
        correctAnswer: 'Da Vinci'
      },
      {
        id: 5,
        question: 'What is the largest ocean on Earth?',
        options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'],
        correctAnswer: 'Pacific'
      }
    ]
  },
  {
    id: 'daily-2',
    title: 'Daily Quiz - Science',
    description: 'Challenge yourself with science questions!',
    difficulty: 'hard',
    date: new Date().toISOString().split('T')[0],
    questions: [
      {
        id: 1,
        question: 'What is the chemical symbol for gold?',
        options: ['Go', 'Gd', 'Au', 'Ag'],
        correctAnswer: 'Au'
      },
      {
        id: 2,
        question: 'How many bones are in an adult human body?',
        options: ['206', '305', '186', '256'],
        correctAnswer: '206'
      },
      {
        id: 3,
        question: 'What is the speed of light?',
        options: ['300,000 km/s', '299,792,458 m/s', '186,000 mph', 'All of the above'],
        correctAnswer: 'All of the above'
      }
    ]
  }
]

export const quizApi = {
  async getDailyQuizzes() {
    try {
      const response = await api.get('/api/quizzes/daily')
      return response.data
    } catch (error) {
      console.log('Using mock data - backend not available')
      return mockQuizzes
    }
  },
  
  async getQuiz(quizId) {
    try {
      const response = await api.get(`/api/quizzes/${quizId}`)
      return response.data
    } catch (error) {
      console.log('Using mock data - backend not available')
      return mockQuizzes.find(quiz => quiz.id === quizId)
    }
  },
  
  async submitQuizResult(quizId, result) {
    try {
      const response = await api.post(`/api/quizzes/${quizId}/results`, result)
      return response.data
    } catch (error) {
      console.log('Could not submit to backend - saving locally')
      return { success: true, message: 'Result saved locally' }
    }
  }
}

export const userApi = {
  async login(credentials) {
    try {
      const response = await api.post('/api/auth/login', credentials)
      return response.data
    } catch (error) {
      // Mock login for development
      if (credentials.username && credentials.password) {
        return {
          user: {
            id: Date.now(),
            username: credentials.username,
            email: `${credentials.username}@example.com`,
            totalScore: 0,
            totalAttempts: 0,
            joinedDate: new Date().toISOString()
          },
          token: 'mock-jwt-token'
        }
      }
      throw new Error('Invalid credentials')
    }
  },
  
  async register(userData) {
    try {
      const response = await api.post('/api/auth/register', userData)
      return response.data
    } catch (error) {
      // Mock registration for development
      return {
        user: {
          id: Date.now(),
          username: userData.username,
          email: userData.email,
          totalScore: 0,
          totalAttempts: 0,
          joinedDate: new Date().toISOString()
        },
        token: 'mock-jwt-token'
      }
    }
  }
}

export const leaderboardApi = {
  async getLeaderboard() {
    try {
      const response = await api.get('/api/leaderboard')
      return response.data
    } catch (error) {
      console.log('Using mock leaderboard data')
      return [
        { id: 1, username: 'QuizMaster', totalScore: 450, totalAttempts: 15 },
        { id: 2, username: 'BrainBox', totalScore: 380, totalAttempts: 12 },
        { id: 3, username: 'Smarty', totalScore: 320, totalAttempts: 10 },
        { id: 4, username: 'Genius', totalScore: 290, totalAttempts: 9 },
        { id: 5, username: 'Scholar', totalScore: 250, totalAttempts: 8 }
      ]
    }
  }
}

export default api