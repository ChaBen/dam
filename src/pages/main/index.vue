<template>
  <v-layout row fullscreen fill-height pa-3>
    <v-flex xs8 mr-3>
      <v-card class="card--flex-toolbar" height="100%">
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-layout column>
            <v-flex px-5 pt-5>
              <v-text-field
                v-model="page"
                label="Page"
                solo-inverted
              />
            </v-flex>
            <v-flex px-5 py-2>
              <v-text-field
                v-model="query"
                :rules="[v => !!v || 'cafe id를 입력하세요']"
                flat
                solo-inverted
                append-icon="search"
                label="Cafe Id"
                class="hidden-sm-and-down"
                required
              />
            </v-flex>
            <v-flex pa-5 text-xs-center>
              <v-btn :disabled="!valid" color="info" @click="search">추출시작</v-btn>
            </v-flex>
          </v-layout>
        </v-form>
      </v-card>
    </v-flex>
    <v-flex xs8>
      <v-card height="100%">
        <v-card-title class="title">아이디 ({{ ids.length }})</v-card-title>
        <v-list class="auto-scroll">
          <v-list-tile v-for="(item, index) in ids" :key="index">{{ item }}</v-list-tile>
        </v-list>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import _ from 'lodash'
import axios from 'axios'
import $ from 'jQuery'

export default {
  data: () => ({
    valid: true,
    page: null,
    query: 'girlsingerand',
    ids: []
  }),
  computed: {
    cafepar() {
      return Math.floor(this.cafeLen / 10)
    }
  },
  methods: {
    search() {
      if (this.$refs.form.validate()) {
        axios.get(`http://127.0.0.1:3000/getid/${this.query}`).then(async res => {
          const rHtml = $(res.data)
          // const aText = rHtml.find('.m-tcol-c .board-box tr[align="center"] .p-nick > a').attr('onclick')
          const cId = String(rHtml.find('.box-g .thm > a').attr('href')).replace('/CafeHistoryView.nhn?clubid=', '')
          if (cId === 'undefined') {
            alert('존재하지 않는 cafe 입니다')
            return
          }
          const users = []
          const page = this.page || 1
          for (let index = 0; index < page; index++) {
            const param = {
              id: cId,
              page: index + 1
            }
            const data = (await axios.post(`http://127.0.0.1:3000/member`, param)).data
            const table = $(data).find('.m-tcol-c .board-box tr[align="center"]')
            table.each(function() {
              const id = String($(this).find('.p-nick > a').attr('onclick')).split("'")[1]
              users.push(id)
            })
          }
          this.ids = _.uniq(_.compact(users))
        })
      }
    }
  }
}
</script>

