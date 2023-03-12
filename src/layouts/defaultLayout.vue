<template>
  <div>
    <nav class="navbar bg-dark" data-bs-theme="dark">
      <div class="container-fluid">
        <a class="navbar-brand">
          Welcome
          <b>
            <router-link v-if="auth.isAuthenticated && !auth.isAdmin" to="/profile">
              {{ auth.StateUser.name }}
            </router-link>
          </b>
          {{ auth.isAuthenticated && !auth.isAdmin ? 'to the company ' + auth.StateUser.company_name : '' }}
          <template v-if="auth.isAdmin">
            <router-link class="navbar-brand ps-3" to="/companies">
              Companies
            </router-link>
            <router-link class="navbar-brand ps-1" to="/people">
              People
            </router-link>
          </template>
        </a>
        <form class="d-flex">
          <button @click.prevent="authClick" class="btn btn-primary" type="submit">
            {{ auth.isAuthenticated ? 'Logout' : 'Login' }}
          </button>
        </form>
      </div>
    </nav>
    <main>
      <slot/>
    </main>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores'
import router from '../router'

export default {
  name: 'defaultLayout',
  data () {
    return {
      auth: useAuthStore()
    }
  },
  methods: {
    authClick () {
      if (this.auth.isAuthenticated) {
        this.auth.LogOut()
      }
      router.push('/login')
    }
  }
}
</script>

<style scoped>
.navbar-brand {
  color: white !important;
}

.active {
  color: #0c63e4 !important;
}
</style>
