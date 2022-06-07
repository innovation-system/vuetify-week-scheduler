# Vuetify Week scheduler

> A simple component to manage weekly events

## Installation

### NPM

``` bash
npm install vuetify-week-scheduler --save
```

### Yarn

``` bash
npm add vuetify-week-scheduler
```

## Usage

Import component

``` javascript
import VueWeekScheduler from 'vuetify-week-scheduler';
```

And add to parent component

``` javascript
export default {
       components: {
           VueWeekScheduler
       },
   // ... data, methods, mounted (), etc.
   }
```

## Configuration

### `config`

- Type: `object`
- Defaults:

``` javascript
{
     hour: 24, // 12
     days: 7, // 7/5
     periodDuration: 15, // 15/30/60
     periodTitle: "",
     periodBackgroundColor: "#F44336FF",
     periodBorderColor: "transparent",
     periodTextColor: "#000",
     periodRemoveButton: "Remove",
     periodDuplicateButton: "Duplicate",
     daysList: [
       "Monday",
       "Tuesday",
       "Wednesday",
       "Thursday",
       "Friday",
       "Saturday",
       "Sunday",
     ],
}
```

Same configuration of https://github.com/Yehzuna/jquery-schedule

### `value`

- Type: `array`
- Required: `true`
  
Array of events, supports two-way binding (`v-model`)

### `editable`

- Type: `boolean`
- Default: `false`

Whether or not the component permits to edit events
