const gulp = require('gulp')
const path = require('path')
const {runner} = require('mocha-headless-chrome')
const stagesQty = 10

const options = {
  timeout: 3000,
  visible: false,
  args: ['no-sandbox', 'disable-setuid-sandbox']
}

for (let i = 1; i < stagesQty; i++) {
  gulp.task(`stage-${i}`, () => {
    const file = path.resolve(`spec/stage-${i}/index.html`)

    runner({
      ...options,
      file,
    })
  })
}