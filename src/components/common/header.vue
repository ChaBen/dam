<template>
  <v-toolbar :clipped-left="$vuetify.breakpoint.mdAndUp" color="blue darken-3" app fixed dark>
    <v-toolbar-title style="width: 300px">
      <v-toolbar-side-icon @click.stop="toggleDrawer"/>
      <span class="hidden-sm-and-down">Daum Api</span>
    </v-toolbar-title>
    <v-spacer/>
    <v-btn to="/">아이디</v-btn>
    <v-btn to="/email">이메일</v-btn>
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
