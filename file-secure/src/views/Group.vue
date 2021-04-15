<template>
  <div class="groups">
    <Nav></Nav>
    <p>{{ group_id }}</p>
  </div>
</template>

<script>
import Nav from "../components/navbar.vue";

export default {
  name: 'Group',
  components: {
    Nav
  },
  data: () => ({
    group_id: ""
  }),
  created() {
    this.group_id = this.$route.params.group_id;
  }
}
</script>
