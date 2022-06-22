<template>
  <v-hover v-slot="{ hover }">
    <div
      class="vws-period"
      @mousedown.stop="$emit('period-drag', $event)"
      @touchstart.stop="$emit('period-drag', $event)"
      @contextmenu.stop.prevent="$emit('edit', $event)"
      @dblclick.stop.prevent="$emit('edit', $event)"
      :style="{
        backgroundColor: options.backgroundColor,
        outlineColor: options.borderColor,
        textColor: options.textColor,
        color: options.textColor,
        top: period.top + 'px',
        height: period.height + 'px',
      }"
    >
      <div class="vws-period-container">
        <v-icon
          small
          v-show="editable && hover"
          class="vws-handle"
          @mousedown.stop="$emit('period-resize', { $event, isUp: true, $el })"
          @touchstart.stop="$emit('period-resize', { $event, isUp: true, $el })"
        >
          mdi-chevron-up
        </v-icon>
        <div class="vws-period-time">
          {{ options.start }} - {{ options.end }}
          <span class="text--caption ml-2" v-show="shortPeriod">{{
            options.title
          }}</span>
        </div>
        <div v-show="!shortPeriod" class="vws-period-title text-truncate">
          {{ options.title }}
        </div>
        <div
          class="vws-period-buttons"
          v-show="editable && hover"
          justify="end"
        >
          <v-btn
            icon
            x-small
            @click.stop="$emit('delete')"
            @mousedown.stop
            @touchstart.stop
            :title="settings.periodRemoveButton"
          >
            <v-icon x-small>mdi-close</v-icon>
          </v-btn>
          <v-btn
            icon
            x-small
            @click.stop="$emit('clone')"
            @mousedown.stop
            @touchstart.stop
            :title="settings.periodDuplicateButton"
          >
            <v-icon x-small>mdi-content-copy</v-icon>
          </v-btn>
        </div>
        <v-icon
          small
          class="vws-handle"
          @mousedown.stop="$emit('period-resize', { $event, isUp: false, $el })"
          @touchstart.stop="
            $emit('period-resize', { $event, isUp: false, $el })
          "
          v-show="editable && hover"
          style="bottom: 0"
        >
          mdi-chevron-down
        </v-icon>
      </div>
    </div>
  </v-hover>
</template>

<script>
export default {
  name: "vuetify-week-scheduler-period",
  props: {
    period: Object,
    settings: Object,
    blockHeight: Number,
    editable: { type: Boolean, default: false },
  },
  computed: {
    options() {
      return this.period.options;
    },
    shortPeriod() {
      return this.period.height <= 30;
    },
  },
};
</script>
