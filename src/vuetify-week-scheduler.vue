<template>
  <div class="vws vws-mode-edit vws-mode-7">
    <table class="vws-table">
      <tbody>
        <tr>
          <td v-for="day in daysPeriods" :key="'day-' + day.day">
            <div
              class="vws-day"
              @touchstart="onDayDown(day.day, $event)"
              @mousedown="onDayDown(day.day, $event)"
              ref="day"
            >
              <scheduler-period
                v-for="(p, i) in day.periods"
                :key="i"
                :period="p"
                :settings="settings"
                :blockHeight="blockHeight"
                :editable="editable"
                @period-drag="onPeriodDown($event, day.day, p.index)"
                @period-resize="onPeriodResize($event, day.day, p.index)"
                @position-change="onPositionChange(day.day, p.index, $event)"
                @delete="deletePeriod(day.day, p.index)"
                @clone="clonePeriod(day.day, p.index)"
                @edit="editPeriod(day.day, p.index, $event)"
              ></scheduler-period>

              <div
                v-if="newPeriod && newPeriod.day === day.day"
                :style="{
                  top: `${newPeriod.top}px`,
                  height: `${newPeriod.height}px`,
                }"
                class="vws-period-helper"
              >
                <div class="vws-period-helper-time">
                  {{ newPeriod.start }} - {{ newPeriod.end }}
                </div>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="vws-grid">
      <div class="vws-grid-head">
        <div v-for="n in settings.days" class="vws-grid-day" :key="n">
          <v-hover v-slot="{ hover }">
            <div>
              <strong>
                {{
                  !isMobile
                    ? settings.daysList[n - 1]
                    : settings.daysList[n - 1].slice(0, 3)
                }}
              </strong>
              <v-btn
                v-show="editable && hover"
                icon
                x-small
                @click="clearDayPeriods(n - 1)"
                :title="settings.periodRemoveButton"
              >
                <v-icon x-small>mdi-close</v-icon>
              </v-btn>
              <v-btn
                v-show="editable && hover"
                icon
                x-small
                @click="cloneDayPeriods(n - 1)"
                :title="settings.periodDuplicateButton"
              >
                <v-icon x-small>mdi-content-copy</v-icon>
              </v-btn>
              <v-btn
                v-show="editable && hover"
                icon
                x-small
                @click="selectWholeDay(n - 1)"
                :title="settings.periodSelectWholeButton"
              >
                <v-icon x-small>mdi-select-all</v-icon>
              </v-btn>
            </div>
          </v-hover>
        </div>
      </div>
      <div v-for="n in 25" class="vws-grid-line" :key="n">
        <div class="vws-grid-hour">{{ formatHour(n - 1) }}</div>
      </div>
    </div>
    <v-menu
      v-if="showEditMenu"
      v-model="showEditMenu"
      :position-x="x"
      :position-y="y"
      absolute
      offset-y
      :close-on-content-click="false"
    >
      <v-list dense>
        <v-list-item>
          <v-text-field
            label="Title"
            required
            v-model="editEvent.title"
            :type="settings.inputType"
          ></v-text-field>
        </v-list-item>
        <v-list-item class="d-flex" style="max-width: 300px">
          <v-btn
            icon
            v-for="c in settings.colors"
            :key="c"
            :elevation="editEvent.backgroundColor === c ? 10 : 0"
          >
            <v-icon
              :color="c"
              @click="editEvent.backgroundColor = c"
              size="35px"
              >mdi-circle</v-icon
            >
          </v-btn>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
import SchedulerPeriod from "./vuetify-week-scheduler-period.vue";

export default {
  name: "vuetify-week-scheduler", // vue component name
  components: {
    SchedulerPeriod,
  },
  props: {
    config: { type: Object, default: () => {} },
    value: { type: Array, required: true },
    editable: { type: Boolean, default: false },
  },
  data() {
    return {
      settings: {},
      counter: 0,
      blocksEachHour: 0,
      maxBlocks: 0,
      blockHeight: 0,
      events: [], // keep track of listeners
      newPeriod: null,
      draggingPeriod: null,
      resizingPeriod: null,
      showEditMenu: false,
      x: 0,
      y: 0,
      editEvent: null,
    };
  },
  mounted() {
    this.settings = { ...this.getDefaults(), ...this.config };
    this.init();
    this.handleEvents();
  },
  beforeDestroy() {
    this.events.forEach((e) => {
      e.element.removeEventListener(e.event, e.callback);
    });
  },
  computed: {
    data: {
      get() {
        let toReturn = this.value;
        // validate data object
        if (this.value.length !== this.settings.days) {
          toReturn = [];
          for (let i = 0; i < this.settings.days; i++) {
            toReturn.push({
              day: i,
              periods: [],
            });
          }
          this.$emit("input", toReturn);
        }
        return toReturn;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
    daysPeriods() {
      const toReturn = [];
      for (let d = 0; d < this.settings.days; d++) {
        const toPush = {
          day: d,
          periods: [],
        };
        toReturn.push(toPush);

        const day = this.data?.[d];

        if (day) {
          for (let i = 0; i < day.periods.length; i++) {
            const period = day.periods[i];
            const start = this.positionFormat(period.start);
            const end = this.positionFormat(period.end);
            toPush.periods.push({
              options: this.addDefaults(period),
              index: i,
              top: start * this.blockHeight,
              height: (end - start) * this.blockHeight,
            });
          }
        }
      }

      return toReturn;
    },
    isMobile() {
      return this.$vuetify.breakpoint.mdAndDown;
    },
  },
  methods: {
    getDefaults() {
      return {
        hour: 24, // 12
        days: 7, // 7/5
        periodDuration: 15, // 15/30/60
        periodTitle: "",
        periodBackgroundColor: "#F44336FF",
        periodBorderColor: "transparent",
        periodTextColor: "#000",
        periodRemoveButton: "Remove",
        periodDuplicateButton: "Duplicate",
        periodSelectWholeButton: "Select whole day",
        inputType: "text",
        daysList: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        colors: [
          "#F44336",
          "#FF9800",
          "#FFEB3B",
          "#8BC34A",
          "#4CAF50",
          "#00BCD4",
          "#2196F3",
        ],
      };
    },
    /** When clicking on a day */
    onDayDown(day, e) {
      if (!this.editable) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const offset = this.getY(e, true) - rect.top;

      const blocks = Math.floor(offset / this.blockHeight);

      const start = this.blocksToTime(blocks);
      const end = this.blocksToTime(blocks + 2);

      const height = 2 * this.blockHeight;

      // show the ghost period
      this.newPeriod = {
        dragStart: this.getY(e, true),
        startHeight: height,
        maxHeight: e.currentTarget.clientHeight,
        day,
        start,
        end,
        top: blocks * this.blockHeight,
        height,
      };
    },
    /** Add defaults to period  */
    addDefaults(period) {
      return {
        title: this.settings.periodTitle,
        backgroundColor: this.settings.periodBackgroundColor,
        borderColor: this.settings.periodBorderColor,
        textColor: this.settings.periodTextColor,
        ...period,
      };
    },
    handleEvents() {
      const onUp = () => {
        if (this.newPeriod) {
          this.addPeriod(this.newPeriod.day, {
            start: this.newPeriod.start,
            end: this.newPeriod.end,
          });
          this.newPeriod = null;
        } else if (this.draggingPeriod) {
          const { el, day, index } = this.draggingPeriod;
          const top = el.offsetTop;
          const height = el.clientHeight;
          this.onPositionChange(day, index, { top, height });
          this.draggingPeriod = null;
        } else if (this.resizingPeriod) {
          const { el, day, index } = this.resizingPeriod;
          const top = el.offsetTop;
          const height = el.clientHeight;
          this.onPositionChange(day, index, { top, height });
          this.resizingPeriod = null;
        }
      };

      const onMove = (e) => {
        if (this.newPeriod) {
          e.preventDefault();

          const dragDelta = this.roundBlock(
            this.newPeriod.dragStart - this.getY(e, true)
          );
          const height = this.roundBlock(
            this.newPeriod.startHeight - dragDelta
          );

          if (
            height > this.blockHeight &&
            this.newPeriod.top + height <= this.newPeriod.maxHeight
          ) {
            const { start, end } = this.positionToInterval(this.newPeriod);
            const { periods } = this.data[this.newPeriod.day];
            if (this.isValid({ start, end }, periods)) {
              Object.assign(this.newPeriod, { height, start, end });
            }
          }
        } else if (this.draggingPeriod) {
          e.preventDefault();
          const { startDrag, startTop, el, day, index } = this.draggingPeriod;
          const dragDelta = startDrag - this.getY(e, true);
          const top = this.roundBlock(startTop - dragDelta);
          const height = el.clientHeight;
          const maxHeight = el.parentElement.clientHeight;

          if (top + height <= maxHeight && top >= 0) {
            el.style.top = `${top}px`;
            this.onPositionChange(day, index, {
              top,
              height,
            });
          }
        } else if (this.resizingPeriod) {
          e.preventDefault();
          const { startDrag, startTop, startHeight, el, day, index, isUp } =
            this.resizingPeriod;

          const dragDelta = this.roundBlock(startDrag - this.getY(e, true));
          const top = isUp
            ? this.roundBlock(startTop - dragDelta)
            : el.offsetTop;
          let height = this.roundBlock(
            startHeight + (isUp ? dragDelta : -dragDelta)
          );

          const maxHeight = document.querySelector(".vws-day").clientHeight;

          height = Math.max(height, this.blockHeight);

          if (top + height <= maxHeight && top >= 0) {
            el.style.height = `${height}px`;

            if (isUp) {
              el.style.top = `${top}px`;
            }
            this.onPositionChange(day, index, {
              top,
              height,
            });
          }
        }
      };

      this.addListener(document, "mouseup", onUp);
      this.addListener(document, "touchend", onUp);

      this.addListener(document, "mousemove", onMove);
      this.addListener(document, "touchmove", onMove);
    },
    onPeriodDown(e, day, index) {
      if (this.editable) {
        const el = e.currentTarget;
        this.draggingPeriod = {
          el,
          day,
          index,
          startDrag: this.getY(e, false),
          startTop: el.offsetTop,
        };
      }
    },
    onPeriodResize(event, day, index) {
      if (this.editable) {
        const { $event: e, isUp, $el } = event;

        this.resizingPeriod = {
          el: $el,
          day,
          index,
          isUp,
          startDrag: this.getY(e, false),
          startTop: $el.offsetTop,
          startHeight: $el.clientHeight,
        };
      }
    },
    addPeriod(day, period) {
      if (!this.data[day]) {
        this.data[day] = {
          day,
          periods: [],
        };
      }
      const { periods } = this.data[day];

      period = this.addDefaults(period);

      if (this.isValid(period, periods)) {
        periods.push(period);
      }
    },
    init() {
      try {
        // duration validation
        if (![15, 30, 60].includes(this.settings.periodDuration)) {
          throw new Error("Invalide period duration");
        }

        this.blocksEachHour = 60 / this.settings.periodDuration; // How many blocks there are in an hour
        this.maxBlocks = 24 * this.blocksEachHour; // Period height in blocks
        this.blockHeight = 40 / this.blocksEachHour; // Pixel height of each block

        // periods validation
        this.data.forEach((d) => {
          d?.periods.forEach((period, i) => {
            if (!this.isValid(period, d.periods)) {
              d.periods.splice(i, 1);
              // eslint-disable-next-line no-console
              console.error("Invalid period duration", period);
            }
          });
        });
      } catch (error) {
        this.$emit("error", error);
      }
    },
    deletePeriod(day, index) {
      this.data[day].periods.splice(index, 1);
    },
    clonePeriod(day, indexOrPeriod) {
      const period =
        typeof indexOrPeriod === "object"
          ? indexOrPeriod
          : this.data[day].periods[indexOrPeriod];
      for (const d of this.data) {
        if (d.day !== day && this.isValid(period, d.periods)) {
          d.periods.push({ ...period });
        }
      }
    },
    clearDayPeriods(day) {
      if (this.data[day]) {
        this.data[day].periods = [];
      }
    },
    cloneDayPeriods(day) {
      if (this.data[day]) {
        const { periods } = this.data[day];
        for (const d of this.data) {
          if (d.day !== day) {
            for (const p of periods) {
              this.clonePeriod(day, p);
            }
          }
        }
      }
    },
    async onPositionChange(day, periodIndex, pos) {
      day = this.data?.[day];
      const period = day?.periods[periodIndex];

      if (period) {
        const { start, end } = this.positionToInterval(pos);
        const oldStart = period.start;
        const oldEnd = period.end;
        Object.assign(period, { start, end });
        await this.$nextTick();
        if (!this.isValid(period, day.periods)) {
          Object.assign(period, { start: oldStart, end: oldEnd });
        }
      }
    },
    /** Round val to nearest multiple of blockHeight */
    roundBlock(val) {
      return Math.round(val / this.blockHeight) * this.blockHeight;
    },
    /** Returns start/end hours string (hh:mm) from period top/height in pixel */
    positionToInterval(pos) {
      return {
        start: this.blocksToTime(pos.top / this.blockHeight),
        end: this.blocksToTime(
          Math.floor((pos.top + pos.height) / this.blockHeight)
        ),
      };
    },
    /**
     * Return a readable hour from a block position
     * @param position
     * @returns {number}
     */
    blocksToTime(nBlocks) {
      if (nBlocks > this.maxBlocks) {
        nBlocks = 0;
      }

      if (nBlocks < 0) {
        nBlocks = 0;
      }

      let hour = Math.floor(nBlocks / this.blocksEachHour);

      let mn = (nBlocks / this.blocksEachHour - hour) * 60;

      if (this.settings.hour === 12) {
        let time = hour;
        let ind = "";

        if (hour >= 12) {
          ind = "p";
        }
        if (hour > 12) {
          time = hour - 12;
        }
        if (hour === 0 || hour === 24) {
          ind = "";
          time = 12;
        }
        if (mn !== 0) {
          time += `:${mn}`;
        }

        return time + ind;
      }

      if (hour < 10) {
        hour = `0${hour}`;
      }

      if (mn < 10) {
        mn = `0${mn}`;
      }

      // back compatibility when period ends on 23:59
      if (hour === 23 && mn === 59) {
        hour = "24";
        mn = "00";
      }

      return `${hour}:${mn}`;
    },
    /** Hour to string */
    formatHour(hour) {
      if (this.settings.hour === 12) {
        switch (hour) {
          case 0:
          case 24:
            hour = "12am";
            break;
          case 12:
            hour = "12pm";
            break;
          default:
            if (hour > 12) {
              hour = `${hour - 12}pm`;
            } else {
              hour += "am";
            }
        }
      } else {
        if (hour > 24) {
          hour = 0;
        }

        if (hour < 10) {
          hour = `0${hour}`;
        }
        hour += ":00";
      }

      return hour;
    },
    /**
     * Return blocks from a time string (hh:mm)
     * @param time
     * @returns {number}
     */
    positionFormat(time) {
      const split = time.split(":");
      let hour = parseInt(split[0], 10);
      let mn = parseInt(split[1], 10);

      if (this.settings.hour === 12) {
        const matches = time.match(/([0-1]?[0-9]):?([0-5][0-9])?\s?(am|pm|p)?/);
        let ind = matches[3];
        if (!ind) {
          ind = "am";
        }

        hour = parseInt(matches[1], 10);
        mn = parseInt(matches[2], 10);

        if (!mn) {
          mn = 0;
        }

        if (hour === 12 && ind === "am") {
          hour = 0;
        }
        if (hour === 12 && (ind === "pm" || ind === "p")) {
          ind = "am";
        }
        if (ind === "pm" || ind === "p") {
          hour += 12;
        }
      }

      let position = 0;
      position += hour * this.blocksEachHour;
      position += (mn / 60) * this.blocksEachHour;

      // if (Math.floor(position) !== position) {
      // 	return -1
      // }

      return position;
    },
    /**
     * Check if a period is valid
     * @param current
     * @returns {boolean}
     */
    isValid(current, periods) {
      const currentStart = this.positionFormat(current.start);
      const currentEnd = this.positionFormat(current.end);

      let start = 0;
      let end = 0;
      let check = true;

      for (const p of periods) {
        if (p !== current) {
          start = this.positionFormat(p.start);
          end = this.positionFormat(p.end);

          if (start > currentStart && start < currentEnd) {
            check = false;
          }

          if (end > currentStart && end < currentEnd) {
            check = false;
          }

          if (start < currentStart && end > currentEnd) {
            check = false;
          }

          if (start === currentStart || end === currentEnd) {
            check = false;
          }

          if (!check) {
            break;
          }
        }
      }

      return check;
    },
    addListener(element, event, callback, options) {
      this.events.push({
        element,
        event,
        callback,
      });

      element.addEventListener(event, callback, options);
    },
    async editPeriod(day, index, e) {
      if (this.editable) {
        if (this.$listeners.edit) {
          this.$emit("edit", { day, index });
        } else {
          e.preventDefault();
          this.showEditMenu = false;
          this.x = e.clientX;
          this.y = e.clientY;
          const { periods } = this.value[day];
          this.editEvent = periods[index];
          await this.$nextTick();
          this.showEditMenu = true;
        }
      }
    },
    getY(e, prevent) {
      let y = null;
      if (
        e.type === "touchstart" ||
        e.type === "touchmove" ||
        e.type === "touchend" ||
        e.type === "touchcancel"
      ) {
        if (prevent) {
          e.preventDefault();
        }
        const touch = e.touches[0] || e.changedTouches[0];
        y = touch.clientY;
      } else if (
        e.type === "mousedown" ||
        e.type === "mouseup" ||
        e.type === "mousemove" ||
        e.type === "mouseover" ||
        e.type === "mouseout" ||
        e.type === "mouseenter" ||
        e.type === "mouseleave"
      ) {
        y = e.clientY;
      }

      return y;
    },
    selectWholeDay(day) {
      if (this.data[day]) {
        const { periods } = this.data[day];
        if (periods.length > 0) {
          periods[0].start = "00:00";
          periods[0].end = "24:00";
          this.data[day].periods = [periods[0]];
        } else {
          this.data[day].periods = [
            {
              start: "00:00",
              end: "24:00",
              title: this.settings.periodTitle,
              backgroundColor: this.settings.periodBackgroundColor,
              borderColor: this.settings.periodBorderColor,
              textColor: this.settings.periodTextColor,
            },
          ];
        }
      }
    },
  },
};
</script>

<style>
.vws {
  position: relative;
  padding: 40px 20px 20px 60px;
  font-family: system, -apple-system, Roboto, Helvetica Neue, Arial, Helvetica,
    Geneva, sans-serif;
  box-sizing: border-box;
  z-index: 1;
}
.vws-mode-edit {
  cursor: pointer;
}
.vws-mode-edit .ui-draggable-dragging {
  cursor: move;
}
.vws-mode-5 .vws-table td,
.vws-mode-5 .vws-grid-day {
  width: 20%;
}
.vws-table {
  position: relative;
  z-index: 8;
  width: 100%;
  margin-bottom: 20px;
  border-collapse: collapse;
  border-spacing: 0;
  box-sizing: content-box;
}
.vws-table td,
.vws-table th {
  padding: 0;
}
.vws-table td {
  position: relative;
  width: 14.28571%;
  border-left: 1px solid #ccc;
  border-right: 1px solid #ccc;
}
.vws-grid {
  position: absolute;
  top: 40px;
  left: 60px;
  right: 20px;
  box-sizing: content-box;
}
.vws-grid-head {
  position: absolute;
  top: -30px;
  left: 0;
  right: 0;
  display: flex;
}
.vws-grid-day {
  position: relative;
  width: 14.28571%;
  padding: 8px 0 4px 0;
  text-align: center;
  font-size: 12px;
}
.vws-grid-day:hover .vws-day-remove,
.vws-grid-day:hover .vws-day-duplicate,
.vws-grid-day-buttons .vws-day-remove,
.vws-grid-day-buttons .vws-day-duplicate {
  display: block;
}
.vws-grid-line {
  border-top: 1px solid #ccc;
  border-bottom: 1px solid transparent;
  position: relative;
  height: 38px;
  box-sizing: content-box;
}
.vws-grid-line:last-child {
  height: 0;
  border-bottom: none;
}
.vws-grid-line:before {
  content: "";
  position: absolute;
  top: 50%;
  height: 1px;
  width: 100%;
  background: #eee;
}
.vws-grid-hour {
  position: absolute;
  top: -7px;
  left: -50px;
  display: block;
  width: 42px;
  font-size: 12px;
  text-align: right;
}
.vws-day {
  width: 100%;
  height: 960px;
  position: relative;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  touch-action: none;
}
.vws-day-remove {
  bottom: 20px;
  right: 2px;
}
.vws-day-duplicate {
  bottom: 4px;
  right: 2px;
}

.vws-period-helper {
  position: absolute;
  width: 100%;
  min-height: 10px;
}
.vws-period-helper:after {
  content: "";
  display: block;
  position: absolute;
  top: 2px;
  bottom: 2px;
  left: 2px;
  right: 2px;
  background-color: rgba(204, 204, 204, 0.2);
}
.vws-period-helper-time {
  padding: 2px 0 0 5px;
  font-size: 11px;
  font-weight: 700;
  line-height: 16px;
  letter-spacing: -0.5px;
  color: #666;
}
.vws-handle {
  position: absolute !important;
  left: calc(50% - 8px);
  cursor: ns-resize;
}
.vws-day-remove,
.vws-day-duplicate {
  display: none;
  position: absolute;
  height: 10px;
  width: 10px;
  cursor: pointer;
  background-size: 100% 100%;
}

.vws-period {
  cursor: pointer;
  border-radius: 5px;
  touch-action: none;
  outline: 1px solid #ccc;
}

.vws-period {
  position: absolute;
  width: 100%;
  min-height: 10px;
}
.vws-period:hover .vws-period:hover {
  display: block;
}
.vws-period-time,
.vws-period-title {
  display: block;
  line-height: 20px;
  letter-spacing: -0.5px;
  word-break: break-all;
  overflow: hidden;
}
.vws-period-title {
  font-size: 15px;
}
.vws-period-time {
  font-size: 11px;
  font-weight: 700;
  line-height: 16px;
}
.vws-period-container {
  position: absolute;
  top: 2px;
  bottom: 2px;
  left: 2px;
  right: 2px;
  padding: 0 3px;
  border-radius: 3px;
  box-sizing: border-box;
}

.vws-period-buttons {
  position: absolute;
  bottom: 0;
  right: 0;
}
</style>
