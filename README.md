# Worst Calendar

The worst calendar app that can possibly exist, built on purpose.

**Live app:** https://edmond-i.github.io/worst-calendar/

Every feature that makes a calendar good — clear dates, readable UI, working
event creation, sane notifications — is deliberately inverted here: clashing
colors, jumbled fonts, date cells that lie about what day it is, a
cursor-avoidance UI ("Google Space" effect) on the date pickers, text that
scrambles while you type, an event wizard with a hidden unlock requirement,
and notification sounds designed to be as annoying as possible.

The **Settings** tab is the one part that's not a joke: a real chaos
intensity toggle (off / mild / chaos) and a real volume/mute control.

## Stack

React + TypeScript + Vite.

## Local development

```
npm install
npm run dev
```

## Deploy

```
npm run build
npm run deploy
```

Publishes `dist/` to the `gh-pages` branch, served via GitHub Pages.
