<script>
import Vue from 'vue';
import VuetifyWeekScheduler from '@/vuetify-week-scheduler.vue';

export default Vue.extend({
  name: 'ServeDev',
  components: {
    VuetifyWeekScheduler
  }
});
</script>

<template>
  <div id="app">
    <vuetify-week-scheduler />
  </div>
</template>
