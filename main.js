#!/usr/bin/env node

var fs = require('fs')
var getDirectory = require('path').dirname
var getBase = require('path').basename
var getExt = require('path').extname
var join = require('path').join
var spawn = require('child_process').spawn

var path = process.argv[2]

if (!path) throw new Error('Must specify path')

var ext = getExt(path)
var name = getBase(path, ext)
var dir = getDirectory(path) || process.cwd()
var code = name.match(/[0-9]{4}$/)[0]
var output = 'GP00' + code + ext
var listPath = 'GP00' + code + '.txt'

var id = 0
var files = []

while (true) {
  var fileName = join(dir, 'GP' + ('0' + id).slice(-2) + code + ext)
  if (id === 0) {
    fileName = join(dir, 'GOPR' + code + ext)
  }
  if (fs.existsSync(fileName)) {
    files.push(fileName)
    id += 1
  } else {
    break
  }
}

fs.writeFileSync(listPath, files.map(f => `file '${f}'`).join('\n'))

spawn('ffmpeg', [
  '-f', 'concat',
  '-safe', '0',
  '-i', listPath,
  '-codec', 'copy',
  output
], {
  stdio: 'inherit'
})
