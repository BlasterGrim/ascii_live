{
  "name": "blastergrim-ascii",
  "version": "1.0.0",
  "description": "Animazione ASCII via Curl",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "figlet": "^1.6.0"
  },
  "engines": {
    "node": ">=14.x"
  }
}
