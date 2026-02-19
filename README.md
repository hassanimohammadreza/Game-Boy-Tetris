# Game Boy Tetris - Retro Web Game 🎮🟩

A **retro Game Boy-inspired Tetris** implemented in pure JavaScript, HTML, and CSS.  
This project replicates the classic Tetris feel with pixelated graphics, scanlines, Game Boy color palette, 8-bit sound effects, and smooth animations.  

![Game Boy Tetris Screenshot](https://github.com/hassanimohammadreza/Game-Boy-Tetris/blob/main/assets/Tetris.png?raw=true)

---

## Features

- **Authentic Game Boy Style**
  - Green monochrome palette (#306230 and #9bbc0f)
  - Pixelated block style and shadows
  - Scanline overlay and soft blinking "GAME OVER"
  - LCD-style visual lines for retro effect

- **Gameplay**
  - Classic 10x20 Tetris board
  - All 7 Tetromino shapes included
  - Rotation, left/right/down movement using arrow keys
  - Line clearing with score increment
  - Auto game reset on Game Over with smooth animation

- **Sound & Effects**
  - 8-bit square wave sound effects for piece placement and Game Over
  - Screen shake effect when pieces lock
  - Game Over animation with blinking text and scanline motion

- **Responsive Design**
  - Auto-scales to fit screen while maintaining retro aspect ratio
  - Works on desktop and mobile browsers

- **Score Tracking**
  - Score updates in real time on-screen
  - Points awarded for each line cleared (10 points per line)

---

## Demo

You can try the game directly in your browser:

[Live Demo Link](https://hassanimohammadreza.github.io/Game-Boy-Tetris/)

---

## Controls

| Key           | Action               |
|---------------|--------------------|
| Arrow Left    | Move Tetromino left |
| Arrow Right   | Move Tetromino right|
| Arrow Down    | Move Tetromino down faster |
| Arrow Up      | Rotate Tetromino    |

---

## Folder Structure

```graphql
gameboy-tetris/
├── index.html       # Main HTML file
├── style.css        # Retro Game Boy styles
├── script.js        # Game logic and animations
├── README.md        # Project documentation
└── assets/
    └── screenshot.png
```

---

## Credits

- Inspired by the original Game Boy Tetris (Nintendo, 1989)

- Font: Press Start 2P by Google Fonts

- Sound effects generated via Web Audio API


---

### ⭐ If you found this project useful, consider giving it a star!
