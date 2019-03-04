<template>
  <v-toolbar :clipped-left="$vuetify.breakpoint.mdAndUp" class="elevation-0" app fixed dark>
    <v-toolbar-title style="width: 300px">
      <span class="hidden-sm-and-down">Program</span>
    </v-toolbar-title>
    <v-spacer/>
    <v-btn class="black--text" color="yellow" to="/">아이디</v-btn>
    <v-btn class="black--text" color="yellow" to="/email">이메일</v-btn>
  </v-toolbar>
</template>

<script>
export default {
  data: () => ({
  }),
  methods: {
    toggleDrawer() {
      this.$store.commit('TOGGLE_DRAWER')
    }
  }
}
</script>
