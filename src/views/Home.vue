<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <LandingPage/>
  </div>
</template>

<script>
// @ is an alias to /src
import LandingPage from '@/components/LandingPage.vue'

export default {
  name: 'Home',
  components: {
    LandingPage
  }
}
</script>
