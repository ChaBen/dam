<template>
  <div id="app">
    <input type="text">
    <ul>
      <li v-for="(user, key) in users" :key="key">{{ user }}</li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios'
import $ from 'jQuery'

export default {
  name: 'App',
  data() {
    return {
      html: null,
      users: []
    }
  },
  created() {
    axios.get('http://cafe.daum.net/_c21_/recent_bbs_list?grpid=1Wfj1&fldid=_rec').then(res => {
      const _this = this
      $(res.data).find('.bbsList tr').each(function() {
        const userId = String($(this).find('.nick a').attr('onclick')).slice(20, 31)
        // `axios.get(`https://secure.cafe.daum.net/_c21_/menber_profile?grpid=1Wfj1&userid=${userId}&enc_userid=${userId}`).then(res => {
        //   console.log(res)
        // })`
        _this.users.push(userId)
      })
      console.log(_this.users)
    })
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
