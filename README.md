[![ci](https://github.com/innovation-system/vuetify-week-scheduler/actions/workflows/ci.yml/badge.svg)](https://github.com/innovation-system/vuetify-week-scheduler/actions/workflows/ci.yml)

# Vuetify Week scheduler

> A simple component to manage weekly events

Inspired by [jquery-schedule](https://github.com/Yehzuna/jquery-schedule).

## Installation

### NPM

``` bash
npm install vuetify-week-scheduler --save
```

### Yarn

``` bash
yarn add vuetify-week-scheduler
```

## Demo

Checkout a demo [here](t https://innovation-system.github.io/vuetify-week-scheduler/).

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

## Props

### `config`

- Type: `object`
- Defaults:

``` javascript
{
     hour: 24, // hour format, 24/12
     days: 7, // number of days, 7/5
     periodDuration: 15, // event duration inteval 15/30/60
     periodTitle: "", // event default title
     periodBackgroundColor: "#F44336FF", // event default color
     periodBorderColor: "transparent", // event default border color
     periodTextColor: "#000", // event default text color
     periodRemoveButton: "Remove", // label of event remove button
     periodDuplicateButton: "Duplicate", // label of event duplicate button
     daysList: [    // list of days labels
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

### `value`

- Type: `array`
- Required: `true`
  
Array of events, supports two-way binding (`v-model`)

### `editable`

- Type: `boolean`
- Default: `false`Events

Whether or not the component permits to add/edit events

## Events

### `edit(obj)`

``` javascript
obj: {
    day: number,
    index: number
}
```

### `error(err)`

- `err` error throwed during initialization
