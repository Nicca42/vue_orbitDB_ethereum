<template>
  <div class="counter">
    <h1>Counter</h1>
    <ClickCounter/>
  </div>
</template>

<script>
// @ is an alias to /src
import ClickCounter from "@/components/ClickCounter.vue";

export default {
  name: "Home",
  components: {
    ClickCounter
  }
};
</script>
