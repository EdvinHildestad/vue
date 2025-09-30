<template>
  <div class="login">
    <div class="container">
      <div class="login-container">
        <div class="login-card card">
          <h1>{{ isRegister ? 'Create Account' : 'Welcome Back' }}</h1>
          <p>{{ isRegister ? 'Join the quiz community!' : 'Sign in to start playing quizzes' }}</p>
          
          <form @submit.prevent="handleSubmit" class="login-form">
            <div class="form-group">
              <label for="username">Username</label>
              <input 
                id="username"
                v-model="form.username" 
                type="text" 
                required 
                placeholder="Enter your username"
              >
            </div>
            
            <div v-if="isRegister" class="form-group">
              <label for="email">Email</label>
              <input 
                id="email"
                v-model="form.email" 
                type="email" 
                required 
                placeholder="Enter your email"
              >
            </div>
            
            <div class="form-group">
              <label for="password">Password</label>
              <input 
                id="password"
                v-model="form.password" 
                type="password" 
                required 
                placeholder="Enter your password"
              >
            </div>
            
            <div v-if="error" class="error-message">
              {{ error }}
            </div>
            
            <button 
              type="submit" 
              class="btn btn-primary submit-btn"
              :disabled="loading"
            >
              {{ loading ? 'Please wait...' : (isRegister ? 'Create Account' : 'Sign In') }}
            </button>
          </form>
          
          <div class="form-footer">
            <p>
              {{ isRegister ? 'Already have an account?' : "Don't have an account?" }}
              <button 
                @click="toggleMode" 
                class="link-button"
              >
                {{ isRegister ? 'Sign In' : 'Create Account' }}
              </button>
            </p>
          </div>
          
          <div class="demo-notice">
            <p><strong>Demo Mode:</strong> Use any username and password to continue</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { userApi } from '../api'

export default {
  name: 'Login',
  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    const isRegister = ref(false)
    const loading = ref(false)
    const error = ref('')
    
    const form = reactive({
      username: '',
      email: '',
      password: ''
    })
    
    const toggleMode = () => {
      isRegister.value = !isRegister.value
      error.value = ''
      form.username = ''
      form.email = ''
      form.password = ''
    }
    
    const handleSubmit = async () => {
      try {
        loading.value = true
        error.value = ''
        
        let result
        if (isRegister.value) {
          result = await userApi.register(form)
        } else {
          result = await userApi.login({
            username: form.username,
            password: form.password
          })
        }
        
        userStore.login(result.user)
        router.push('/')
        
      } catch (err) {
        error.value = err.message || 'An error occurred. Please try again.'
      } finally {
        loading.value = false
      }
    }
    
    return {
      isRegister,
      loading,
      error,
      form,
      toggleMode,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.login {
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
}

.login-container {
  max-width: 400px;
  margin: 0 auto;
}

.login-card {
  text-align: center;
}

.login-card h1 {
  margin-bottom: 0.5rem;
  color: #374151;
}

.login-card p {
  margin-bottom: 2rem;
  color: #6b7280;
}

.login-form {
  text-align: left;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #4f46e5;
}

.error-message {
  background: #fef2f2;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.submit-btn {
  width: 100%;
  padding: 0.875rem;
  font-size: 1rem;
  margin-bottom: 1.5rem;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-footer {
  text-align: center;
  margin-bottom: 1rem;
}

.link-button {
  background: none;
  border: none;
  color: #4f46e5;
  text-decoration: underline;
  cursor: pointer;
  font-size: inherit;
}

.link-button:hover {
  color: #4338ca;
}

.demo-notice {
  background: #f0f9ff;
  border: 1px solid #0ea5e9;
  border-radius: 6px;
  padding: 1rem;
  margin-top: 1rem;
}

.demo-notice p {
  margin: 0;
  color: #0369a1;
  font-size: 0.875rem;
}

@media (max-width: 480px) {
  .login-container {
    padding: 0 1rem;
  }
}
</style>