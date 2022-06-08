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

Checkout a demo [here](https://innovation-system.github.io/vuetify-week-scheduler/).

Demo source code is [here](/dev/)

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
  
Array of events, two-way binding with (`v-model`). The format of events is:

```js
[
      {
        "day": 0,
        "periods": [
          {
            "start": "00:00",
            "end": "09:00",
            "title": 15,
            "backgroundColor": "#FF0000FF"
          },
          {
            "start": "09:00",
            "end": "20:00",
            "title": 22,
            "backgroundColor": "#008000FF"
          }
        ]
      },
      {
        "day": 1,
        "periods": []
      }
      ...
```

### `editable`

- Type: `boolean`
- Default: `false`

Whether or not the component permits to add/edit events

## Events

### `edit(obj)`

In desktop devices this event is emitted when user right clicks on double clicks on an event, in touch devices this is emitted when user long press on an event.

``` javascript
obj: {
    day: number, // the day index
    index: number // the period index
}
```

### `error(err)`

- `err` error throwed during initialization
