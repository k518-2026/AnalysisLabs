// assets/ の CSS に中身から作った版番号を付ける（更新したときに古いキャッシュを使わせないため）
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ASSETS = path.resolve(__dirname, '..', 'assets');

function v(file) {
  const buf = fs.readFileSync(path.join(ASSETS, file));
  return crypto.createHash('sha1').update(buf).digest('hex').slice(0, 8);
}

module.exports = file => `${file}?v=${v(file)}`;
