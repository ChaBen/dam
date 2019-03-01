<template>
  <v-app id="app">

    <Dam-header />

    <v-content class="full-height">
      <v-container class="full-height" fluid pa-0>
        <router-view />
      </v-container>
    </v-content>

  </v-app>
</template>

<script>
import DamHeader from '@/components/common/header'

export default {
  name: 'App',
  components: {
    DamHeader
  }
}
</script>
