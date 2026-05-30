# Esports Talent Test 2.0

[中文](README.md) | [English](README.en.md)

A Douyin virtual interactive-space project with six lightweight challenges for reaction speed, tapping speed, vision, tracking, memory, and hand-eye coordination. This version is an offline multi-file HTML5 Canvas build suitable for packaging as an interactive-space zip.

Live demo: [https://swording-k.github.io/esports-talent/](https://swording-k.github.io/esports-talent/)

## Highlights

- Six-dimensional esports assessment: reaction, tapping speed, vision, tracking, sequence memory, and coordination
- Professional tactical HUD visual style with dark surfaces, data panels, restrained motion, and high-contrast information
- Mobile-first interaction: tracking and coordination use offset touch controls to reduce finger occlusion
- Talent report with single-test results, local best scores, overall index, and a six-axis radar chart
- Offline local records stored with `localStorage`

## Challenges

| Test | What It Does | Ability |
| --- | --- | --- |
| Reaction Speed | Tap as soon as the signal turns green | Reaction time |
| Tapping Speed | Tap as many targets as possible in 30 seconds | Click speed |
| Peripheral Vision | Memorize the number of colored dots in a short flash | Observation and memory |
| Dynamic Tracking | Track a moving target with offset touch controls | Target tracking |
| Sequence Memory | Repeat the direction sequence | Short-term memory |
| Hand-Eye Coordination | Catch falling targets with an offset slider | Coordination |

## Run Locally

Use a local static server:

```bash
python3 -m http.server 4173
```

Then open `http://127.0.0.1:4173/index.html`.

## Publish

The root directory must contain `index.html`. Package these files into the upload zip:

- `index.html`
- `styles.css`
- `src/app.js`
- `assets/icon.png`

The project does not rely on network requests, external links, CDNs, iframes, or remote assets.

## Checks

```bash
node tests/static-checks.mjs
node --check src/app.js
```

## Product Notes

See [`项目介绍文档.md`](./项目介绍文档.md) for the Chinese product document.
