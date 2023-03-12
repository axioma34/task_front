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
      url: '/api/admin/company/',
      headers: [
        { text: 'Name', value: 'name', type: 'text' },
        { text: 'Phone', value: 'phone', type: 'text' },
        { text: 'Address', value: 'address', type: 'text' },
        { text: 'Web site', value: 'web_site', type: 'text' },
        { text: 'Mail', value: 'mail', type: 'text' },
        { text: 'Users', value: 'users_count', type: 'text' },
        { text: 'Tasks', value: 'tasks_count', type: 'text' }
      ],
      item: {
        name: '',
        phone: '',
        address: '',
        web_site: '',
        mail: ''
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
        const response = await this.axios.get('/api/admin/company/list.php')
        this.data = response.data
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>
