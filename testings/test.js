const fs = require('fs')

const files = fs.readdirSync('static/data')

const brandMapping = {
  "1000101562": "元气森林",
  "1000355784": "元气森林",
  "686038": "元气森林",
  "17153": "百草味",
  "1000003685": "百草味",
  "1000014286": "可口可乐"
}

for (const file of files) {
  const filename = `static/data/${file}`
  const data = JSON.parse(fs.readFileSync(filename, 'utf-8'))

  if (Array.isArray(data)) {
    data.forEach(item => {
      item.brand = brandMapping[item.shop_id]
    })

    fs.writeFileSync(filename, JSON.stringify(data.slice(0, 50)), 'utf8')
  }
}

console.log(files)