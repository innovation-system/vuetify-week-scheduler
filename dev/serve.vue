<script>
import Vue from 'vue';
import VuetifyWeekScheduler from '@/VuetifyWeekScheduler.vue';
import SchedulerPeriod from '@/SchedulerPeriod.vue';

export default Vue.extend({
  name: 'ServeDev',
  data: () => ({
    events: [],
    editable: true,
    config: {}
  }),
  components: {
    VuetifyWeekScheduler,
    SchedulerPeriod
  }
});
</script>

<template>
  <div id="app">
    <v-switch label="Editable" v-model="editable" :config="config"></v-switch>
    <vuetify-week-scheduler v-model="events" :editable="editable" />
  </div>
</template>
