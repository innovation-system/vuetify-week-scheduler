<template>
  <div id="app">
    <v-container>
      <h1>Vuetify Week Scheduler</h1>
      <v-col>
        <v-checkbox
          label="Editable"
          :v-model="editable"
        ></v-checkbox>
        <v-btn
          color="primary"
          text
          @click="events = []"
          > Clear all </v-btn>
      </v-col>
      <vuetify-week-scheduler v-model="events" :editable="editable" />
    </v-container>
  </div>
</template>

<script>
import Vue from "vue";
import VuetifyWeekScheduler from "@/vuetify-week-scheduler.vue";

export default Vue.extend({
  components: {
    VuetifyWeekScheduler,
  },
  data: () => ({
    events: [],
    editable: true,
    config: {},
  }),
  watch: {
    editable(val) {
      console.log(val)
    },
  }
});
</script>
