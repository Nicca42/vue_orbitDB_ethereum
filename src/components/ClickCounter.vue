<template>
  <div class="ClickCounter">
    {{ count }}
    <button @click="increment">Increment</button>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "ClickCounter",
  data() {
    return {};
  },
  methods: {
    ...mapActions(["incrementCount"]),
    increment() {
      this.incrementCount();
    },
  },
  computed: {
    ...mapState({ count: (state) => state.count }),
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
