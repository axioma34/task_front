<template>
  <crudTable v-if="data" :data="data" :url="url" :headers="headers" :item="item" />
</template>

<script>

import crudTable from '../../components/crudTable.vue'
import { useAuthStore } from '@/stores'

export default {
  name: 'Tasks',
  components: { crudTable },
  data () {
    return {
      url: '/api/person/task/',
      headers: [
        { text: 'Headline', value: 'headline', type: 'text' },
        { text: 'Description', value: 'description', type: 'text' },
        { text: 'Due date', value: 'due_date', type: 'date' },
        { text: 'Collaborators', value: 'collaborators', type: 'text' },
        { text: 'Solved', value: 'solved', type: 'bool' }
      ],
      item: {
        headline: '',
        description: '',
        due_date: new Date(),
        solved: false
      },
      data: null
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    getUserId () {
      return useAuthStore().StateUser.id
    },
    async init () {
      try {
        const response = await this.axios.get(`/api/person/task/list.php?id=${this.getUserId()}`)
        this.data = response.data
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>
