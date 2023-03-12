<template>
  <crudTable v-if="data" :data="data" :url="url" :headers="headers" :item="item" />
</template>

<script>

import crudTable from '../../components/crudTable.vue'
import { useAuthStore } from '@/stores'

export default {
  name: 'Companies',
  components: { crudTable },
  data () {
    return {
      url: '/api/admin/person/',
      headers: [
        { text: 'Name', value: 'name', type: 'text' },
        { text: 'Mail', value: 'mail', type: 'text' },
        { text: 'Gender', value: 'gender', type: 'text' },
        { text: 'Birth', value: 'date_of_birth', type: 'date' },
        { text: 'Company name', value: 'company_name', type: 'text' },
        { text: 'Position', value: 'position', type: 'text' },
        { text: 'Tasks', value: 'tasks_count', type: 'text' },
        { text: 'Status', value: 'status', type: 'bool' }
      ],
      item: {
        name: '',
        mail: '',
        gender: '',
        date_of_birth: '',
        company_name: '',
        position: '',
        status: 0
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
        const response = await this.axios.get('/api/admin/person/list.php')
        this.data = response.data
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>
