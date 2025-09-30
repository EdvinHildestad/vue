<template>
  <div id="app">
    <nav class="navbar">
      <div class="container">
        <div class="nav-content">
          <router-link to="/" class="logo">
            🧠 Daily Quiz
          </router-link>
          
          <div class="nav-links">
            <router-link to="/" class="nav-link">Home</router-link>
            <router-link to="/leaderboard" class="nav-link">Leaderboard</router-link>
            
            <template v-if="userStore.isAuthenticated">
              <router-link to="/profile" class="nav-link">Profile</router-link>
              <button @click="logout" class="btn btn-secondary">Logout</button>
            </template>
            <template v-else>
              <router-link to="/login" class="btn btn-primary">Login</router-link>
            </template>
          </div>
        </div>
      </div>
    </nav>
    
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script>
import { useUserStore } from './stores/user'

export default {
  name: 'App',
  setup() {
    const userStore = useUserStore()
    
    const logout = () => {
      userStore.logout()
      this.$router.push('/')
    }
    
    return {
      userStore,
      logout
    }
  }
}
</script>

<style scoped>
.navbar {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
  color: #4f46e5;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-link {
  text-decoration: none;
  color: #374151;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.nav-link:hover,
.nav-link.router-link-active {
  background: #f3f4f6;
  color: #4f46e5;
}

.main-content {
  min-height: calc(100vh - 80px);
  padding: 2rem 0;
}

@media (max-width: 768px) {
  .nav-content {
    flex-direction: column;
    gap: 1rem;
  }
  
  .nav-links {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>