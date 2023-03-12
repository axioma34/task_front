<template>
  <default-layout>
    <div class="container">
      <div class="my-3 p-3 bg-body rounded shadow-sm">
        <div class="form-group pull-right">
          <input v-model="search" type="text" class="search form-control" placeholder="What you looking for?">
        </div>
        <table class="table">
          <thead>
          <tr>
            <th>№</th>
            <th v-for="header in headers" :key="header.value" scope="col">
              {{ header.text }}
              <button class="btn" @click="sortOption(header.value)">
              <i :class=" 'bi bi-sort-' + (header.value === sortKey && sortDirection === 'desc' ? 'up' : 'down')"></i>
              </button>
            </th>
            <th>
              Actions
            </th>
            <th>
              <button
                  class="btn btn-primary btn-sm float-end"
                  data-bs-toggle="modal"
                  data-bs-target="#editModal"
              >
                <i class="bi bi-plus-lg bold"></i>
              </button>
            </th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item, key) in sortedItems" :key="item.id">
            <th scope="row"> {{ key + 1 }}</th>
            <td v-for="head in headers" :key="key + head.value"> {{
                head.value === 'due_date' ? formatDate(item[head.value]) : item[head.value]
              }}
            </td>
            <td>
              <button
                  @click="itemClick(item)"
                  type="button"
                  class="btn btn-primary btn-sm"
                  data-bs-toggle="modal"
                  data-bs-target="#editModal"
              >
                <i class="bi bi-pencil"></i>
              </button>

              <!-- Edit Modal -->
              <div class="modal fade" id="editModal" tabindex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h1 class="modal-title fs-5" id="editModalLabel"> {{ editedIndex > -1 ? 'Edit' : 'Add' }} </h1>
                    </div>
                    <div class="modal-body">
                      <div
                          v-for="(item, key) in Object.keys(defaultItem)"
                          :key="key"
                          class="input-group input-group-sm mb-3"
                      >
                        <span class="input-group-text" id="headerInput">
                          {{ getFieldName(item) }}
                        </span>
                        <input
                            v-model="editedItem[item]"
                            :type="getType(item)"
                            :class="getType(item) === 'checkbox' ? 'custom-check' : 'form-control'"
                        >
                      </div>
                    </div>
                    <div class="modal-footer">
                      <button @click="close" type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Close</button>
                      <button @click="save" type="button" class="btn btn-primary btn-sm" data-bs-dismiss="modal">Save changes</button>
                    </div>
                  </div>
                </div>
              </div>

              <button
                  @click="itemClick(item)"
                  type="button"
                  class="btn btn-danger ms-1 btn-sm"
                  data-bs-toggle="modal"
                  data-bs-target="#deleteModal"
              >
                <i class="bi bi-trash3"></i>
              </button>

              <!-- Delete Modal -->
              <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-sm">
                  <div class="modal-content">
                    <div class="modal-body">
                      Are you sure?
                    </div>
                    <div class="modal-footer">
                      <button @click="close" type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Cancel</button>
                      <button @click="deleteItemConfirm" type="button" class="btn btn-primary btn-sm" data-bs-dismiss="modal">Remove</button>
                    </div>
                  </div>
                </div>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </default-layout>
</template>

<script>
import DefaultLayout from '../layouts/defaultLayout'
import { useAuthStore } from '@/stores'

export default {
  name: 'crudTable',
  props: {
    data: { required: true, type: Array },
    url: { required: true, type: String },
    headers: { required: true, type: Array },
    item: { required: true, type: Object }
  },
  components: { DefaultLayout },
  data () {
    return {
      rules: null,
      items: [...this.data],

      editedIndex: -1,
      editedItem: Object.assign({}, this.item),
      defaultItem: Object.assign({}, this.item),
      valid: true,
      sortKey: this.headers[0].value,
      sortDirection: 'asc',
      search: ''
    }
  },
  computed: {
    sortedItems () {
      return [...this.items]
        .filter((item) => {
          let res = false
          Object.keys(item).forEach((key) => {
            const header = this.headers.find(h => h.value === key)
            if (!header) { return }
            if (header.type !== 'text') { return }
            console.log(item[key], this.search, item[key].indexOf(this.search))
            res = res || item[key].toLowerCase().indexOf(this.search.toLowerCase()) > -1
          })
          return res
        })
        .sort((a, b) => {
          let modifier = 1
          if (this.sortDirection === 'desc') modifier = -1
          if (a[this.sortKey] < b[this.sortKey]) return -1 * modifier
          if (a[this.sortKey] > b[this.sortKey]) return modifier
          return 0
        })
    }
  },

  methods: {
    itemClick (item) {
      this.editedIndex = this.items.indexOf(item)
      this.editedItem = Object.assign({}, item)
    },

    async deleteItemConfirm () {
      await this.axios.delete(this.url + 'delete.php?id=' + this.items[this.editedIndex].id)
      this.items.splice(this.editedIndex, 1)
      this.close()
    },

    close () {
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    async save () {
      if (this.editedIndex > -1) {
        await this.axios.post(this.url + 'update.php?id=' + this.items[this.editedIndex].id, this.editedItem)
        Object.assign(this.items[this.editedIndex], this.editedItem)
      } else {
        const user = useAuthStore().StateUser
        const data = { ...{ company_id: user.company_id, person_id: user.id, collaborators: user.name }, ...this.editedItem }
        await this.axios.post(this.url + 'create.php', data)
        this.items.push(data)
      }
      this.close()
    },
    formatDate (date) {
      const d = new Date(date)
      return ('0' + d.getDate()).slice(-2) + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' +
          d.getFullYear() + ' ' + ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2)
    },
    getFieldName (item) {
      const header = this.headers.find(h => h.value === item)
      return header.text
    },
    getType (item) {
      const header = this.headers.find(h => h.value === item)
      switch (header.type) {
        case 'date':
          return 'datetime-local'
        case 'bool':
          return 'checkbox'
        default:
          return 'text'
      }
    },
    sortOption (option) {
      this.sortKey = option
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc'
    }
  }
}

</script>

<style scoped>
.custom-check {
  margin-left: 16px!important;
  margin-top: -1px!important;
}
</style>
