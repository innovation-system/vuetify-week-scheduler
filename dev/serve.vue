<template>
  <div id="app">
    <v-app>
      <v-container>
        <h1>Vuetify Week Scheduler</h1>
        <v-row class="ml-5 mt-5" justify="start" align="center">
          <v-checkbox :label="'Editable'" v-model="editable"></v-checkbox>
          <v-btn class="ml-2" color="warning" @click="events = []"> Clear all </v-btn>
        </v-row>
        <vuetify-week-scheduler v-model="events" :editable="editable" />
      </v-container>
    </v-app>
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
});
</script>
