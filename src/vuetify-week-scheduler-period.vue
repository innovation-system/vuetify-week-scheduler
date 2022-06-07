<template>
  <v-hover v-slot="{ hover }">
    <div
      class="vws-period"
      :style="{
        backgroundColor: options.backgroundColor,
        borderColor: options.borderColor,
        color: options.textColor,
        top: period.top + 'px',
        height: period.height + 'px',
      }"
    >
      <div class="vws-period-container">
        <v-icon
          small
          v-show="$parent.editable && (hover || $parent.isMobile)"
          class="vws-handle"
        >
          mdi-chevron-up
        </v-icon>
        <div class="vws-period-time">
          {{ options.start }} - {{ options.end }}
          <span class="text--caption ml-2" v-show="shortPeriod">{{
            options.title
          }}</span>
        </div>
        <div v-show="!shortPeriod" class="vws-period-title">
          {{ options.title }}
        </div>
        <div
          class="vws-period-buttons"
          v-show="$parent.editable && (hover || $parent.isMobile)"
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
          v-show="$parent.editable && (hover || $parent.isMobile)"
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
  },
  data: () => ({
    events: [],
    edited: false,
  }),
  mounted() {
    this.handleDrag();
    this.handleResize();
  },
  beforeDestroy() {
    this.events.forEach((e) => {
      e.element.removeEventListener(e.event, e.callback);
    });
  },
  computed: {
    options() {
      return this.period.options;
    },
    shortPeriod() {
      return this.period.height <= 30;
    },
  },
  methods: {
    handleDrag() {
      const el = this.$el;
      let shouldDrag = false;
      let startDrag = 0;
      let startTop = 0;
      const maxHeight = el.parentElement.clientHeight;

      const onDown = (e) => {
        e.stopPropagation();
        shouldDrag = this.$parent.editable;
        startDrag = this.$parent.getY(e, false);
        startTop = el.offsetTop;
        this.edited = false;
      };

      const onUp = (e) => {
        e.preventDefault();
        if (shouldDrag) {
          e.stopPropagation();
          shouldDrag = false;
          this.onPositionChange(true);
        }
      };

      const onMove = (e) => {
        e.preventDefault();
        if (shouldDrag) {
          const dragDelta = startDrag - this.$parent.getY(e, true);
          const top = this.roundBlock(startTop - dragDelta);

          if (top + el.clientHeight <= maxHeight && top >= 0) {
            el.style.top = `${top}px`;
            this.onPositionChange();
          }
        }
      };

      this.addListener(el, "mousedown", onDown);
      this.addListener(el, "touchstart", onDown, { passive: true });

      this.addListener(el, "contextmenu", onUp);
      this.addListener(el, "touchend", onUp);

      this.addListener(document, "mouseup", onUp);
      this.addListener(document, "touchmove", onMove);
      this.addListener(document, "mousemove", onMove);

    },
    handleResize() {
      const el = this.$el;
      const [handleUp, handleDown] = el.getElementsByClassName("vws-handle");

      let shouldResize = false;
      const maxHeight = el.parentElement.clientHeight;
      let startDrag = 0;
      let startHeight = 0;
      let isUp = false;
      let startTop = 0;

      // el.offsetTop is the distance between the top edge of the period and the start of the day
      // getY is the starting point in the viewport where the event originated

      const onDown = (e) => {
        // prevent to also trigger the drag event
        e.stopPropagation();
        isUp = e.target === handleUp;
        shouldResize = this.$parent.editable;
        startDrag = this.$parent.getY(e, false);
        startHeight = el.clientHeight;
        startTop = el.offsetTop;
        this.edited = false;
      };

      const onUp = () => {
        if (shouldResize) {
          shouldResize = false;
          this.onPositionChange(true);
        }
      };

      const onMove = (e) => {
        e.preventDefault();
        if (shouldResize) {
          // how many pixel has been dragged
          const dragDelta = this.roundBlock(
            startDrag - this.$parent.getY(e, true)
          );
          const top = isUp
            ? this.roundBlock(startTop - dragDelta)
            : el.offsetTop;
          let height = this.roundBlock(
            startHeight + (isUp ? dragDelta : -dragDelta)
          );

          height = Math.max(height, this.blockHeight);

          if (top + height <= maxHeight && top >= 0) {
            el.style.height = `${height}px`;

            if (isUp) {
              el.style.top = `${top}px`;
            }
            this.onPositionChange();
          }
        }
      };

      this.addListener(handleUp, "mousedown", onDown);
      this.addListener(handleUp, "touchstart", onDown, { passive: true });

      this.addListener(handleDown, "mousedown", onDown);
      this.addListener(handleDown, "touchstart", onDown, { passive: true });

      this.addListener(document, "mouseup", onUp);
      this.addListener(document, "touchend", onUp);

      this.addListener(document, "mousemove", onMove);
      this.addListener(document, "touchmove", onMove);
    },
    addListener(element, event, callback, options) {
      this.events.push({
        element,
        event,
        callback,
      });

      element.addEventListener(event, callback, options);
    },
    roundBlock(val) {
      return this.$parent.roundBlock(val);
    },
    onPositionChange(up = false) {
      if (up && !this.edited) {
        this.$emit("edit");
      } else {
        const el = this.$el;
        this.edited = true;

        const top = el.offsetTop;
        const height = el.clientHeight;

        if (top !== this.period.top || height !== this.period.height) {
          this.$emit("position-change", {
            top,
            height,
          });
        }
      }
    },
  },
  watch: {},
};
</script>
