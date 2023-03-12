<template>
  <default-layout>
    <div class="container">
      <div class="row justify-content-md-center">
        <div class="col-4">
          <h1> Profile </h1>
          <form @submit.prevent="submit">
            <div class="mb-3">
              <label for="formControlInput" class="form-label">Email address</label>
              <input v-model="user.mail" type="email" class="form-control" id="formControlInput" required>
            </div>
            <div class="mb-3">
              <label for="nameInput" class="form-label">Name</label>
              <input v-model="user.name" type="text" class="form-control" id="nameInput" required>
            </div>
            <div class="mb-3">
              <label for="genderInput" class="form-label">Gender</label>
              <input v-model="user.gender" type="text" class="form-control" id="genderInput">
            </div>
            <div class="mb-3">
              <label for="dateInput" class="form-label">Date of birth</label>
              <input v-model="user.date_of_birth" type="date" class="form-control" id="dateInput" required>
            </div>
            <div class="mb-3">
              <label for="passwordInput" class="form-label">Password</label>
              <input v-model="user.password" type="password" class="form-control" id="passwordInput">
            </div>
            <div class="mb-3">
              <label class="form-check-label" for="positionInput">Position</label>
              <input :value="user.position" class="form-control" type="text" id="positionInput" readonly>
            </div>
            <div v-if="saved" class="alert alert-success" role="alert">
              User data saved successfully!
            </div>
            <div v-if="error" class="alert alert-danger" role="alert">
              Cannot save user. Error!
            </div>
            <div class="row">
              <button type="submit" class="btn btn-primary">Submit</button>
            </div>
            <div class="row">
                <button @click="$router.push('/tasks')" type="button" class="btn btn-dark mt-1">
                  Back
                </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </default-layout>
</template>
<script>
import defaultLayout from '@/layouts/defaultLayout.vue'
import { useAuthStore } from '@/stores'

export default {
  components: { defaultLayout },
  data () {
    return {
      user: {
        name: useAuthStore().StateUser.name,
        gender: useAuthStore().StateUser.gender,
        mail: useAuthStore().StateUser.mail,
        date_of_birth: useAuthStore().StateUser.date_of_birth,
        position: useAuthStore().StateUser.position,
        password: null
      },
      saved: false,
      error: false
    }
  },
  methods: {
    async submit () {
      const user = { ...useAuthStore().StateUser, ...this.user }
      await this.axios.post('/api/admin/person/update.php?id=' + useAuthStore().StateUser.id, user).then(() => {
        this.saved = true
        setTimeout(() => {
          this.saved = false
        }, 3000)
        useAuthStore().setUser(user)
      }).catch(() => {
        this.error = true
        setTimeout(() => {
          this.error = false
        }, 3000)
      })
    }
  }
}
</script>
<style scoped>
</style>
