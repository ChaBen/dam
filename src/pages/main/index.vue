<template>
  <v-layout row fullscreen fill-height pa-3>
    <v-flex xs8 mr-3>
      <v-card class="card--flex-toolbar" height="100%" dark>
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
      <v-card class="card--flex-toolbar" height="100%" dark>
        <v-btn class="center black--text" fab dark small absolute top right color="yellow" style="right: 50px" @click="copyArray()">
          <v-icon dark>copyright</v-icon>
        </v-btn>
        <v-card-title class="title">아이디 ({{ ids.length }})</v-card-title>
        <v-list class="auto-scroll">
          <v-list-tile v-for="item in ids" :key="item">{{ item }}</v-list-tile>
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
    loading: true,
    valid: true,
    page: null,
    query: null,
    ids: []
  }),
  computed: {
    cafepar() {
      return Math.floor(this.cafeLen / 10)
    },
    spids() {
      const txt = this.ids.toString()
      return txt.replace(/,/gi, '\n')
    }
  },
  methods: {
    search() {
      if (this.$refs.form.validate()) {
        axios.get(`http://localhost:3000/getid/${this.query}`).then(async res => {
          const rHtml = $(res.data)
          // const aText = rHtml.find('.m-tcol-c .board-box tr[align="center"] .p-nick > a').attr('onclick')
          const cId = String(rHtml.find('.box-g .thm > a').attr('href')).replace('/CafeHistoryView.nhn?clubid=', '')
          if (cId === 'undefined') {
            alert('존재하지 않는 cafe 입니다')
            return
          }
          const page = this.page || 1
          for (let index = 0; index < page; index++) {
            const param = {
              id: cId,
              page: index + 1
            }
            const data = (await axios.post(`http://localhost:3000/member`, param)).data
            const table = $(data).find('#main-area > .article-board:last table tr')
            const users = []
            table.each(function() {
              const id = String($(this).find('.p-nick > a').attr('onclick')).split("'")[1]
              users.push(id)
            })
            this.ids = this.ids.concat(_.uniq(_.compact(users)))
          }
          this.loading = false
        })
      }
    },
    copyArray() {
      if (!this.ids.length) {
        alert('아이디가 없습니다.')
        return
      }
      const t = document.createElement('textarea')
      document.body.appendChild(t)
      const text = String(this.ids.toString().split(','))
      t.value = text.replace(/,/gi, '\n')
      t.select()
      document.execCommand('copy')
      document.body.removeChild(t)
    }
  }
}
</script>

