<template>
  <div id="app">
    <v-app>
      <v-app-bar>
        <v-app-bar-title
          ><v-icon>mdi-calendar</v-icon> Vuetify Week Scheduler</v-app-bar-title
        >

        <v-spacer></v-spacer>

        <v-btn title="Open Github" @click="openGithub" icon>
          <v-icon>mdi-github</v-icon>
        </v-btn>
      </v-app-bar>

      <v-container>
        <v-row class="ml-5 mt-5" justify="start" align="center">
          <v-checkbox :label="'Editable'" v-model="editable"></v-checkbox>
          <v-btn class="ml-2" color="warning" @click="events = []">
            Clear all
          </v-btn>
        </v-row>
        <v-col class="ml-5 mb-1">
          <p class="ma-0 text-caption">
            * Desktop: Right click or double click on an event to edit it
          </p>
          <p class="ma-0 text-caption">
            * Touch devices: Long press on an event to edit it
          </p>
        </v-col>
        <vuetify-week-scheduler
          @edit="onEdit"
          v-model="events"
          :config="config"
          :editable="editable"
        />
      </v-container>

      <v-dialog
        v-model="editDialog"
        persistent
        v-if="editEvent"
        max-width="400px"
      >
        <v-card>
          <v-card-title>
            <span class="text-h5">Edit event</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    label="Title"
                    required
                    v-model="editEvent.title"
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-icon
                    :color="c"
                    :style="{
                      border:
                        editEvent.backgroundColor === c ? '1px solid #ccc' : '',
                    }"
                    v-for="c in colors"
                    :key="c"
                    @click="editEvent.backgroundColor = c"
                    size="50px"
                    >mdi-square</v-icon
                  >
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="editDialog = false">
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-footer fixed>
        <v-spacer></v-spacer>
        <div>Innovation System &copy; {{ new Date().getFullYear() }}</div>
        <v-spacer></v-spacer>
      </v-footer>
    </v-app>
  </div>
</template>

<script>
import Vue from "vue";
import VuetifyWeekScheduler from "../src/vuetify-week-scheduler.vue";

export default Vue.extend({
  components: {
    VuetifyWeekScheduler,
  },
  data: () => ({
    events: [],
    editable: true,
    config: {
      // default period values
      periodBackgroundColor: "#F44336",
      periodTitle: 0,
      periodTextColor: "#fff",
      periodBorderColor: "#ccc",
    },
    editDialog: false,
    editEvent: null,
    colors: ["#F44336", "#3F51B5", "#9C27B0", "#FF9800", "#4CAF50", "#FFEB3B"],
  }),
  methods: {
    onEdit(e) {
      const { day, index } = e;

      const { periods } = this.events[day];
      this.editEvent = periods[index];

      this.editDialog = true;
    },
    openGithub() {
      window.open(
        "https://github.com/innovation-system/vuetify-week-scheduler",
        "_blank"
      );
    },
  },
});
</script>
