import fs from 'fs'
import { stringify } from 'csv'
import { parse } from 'csv/sync'

const writeCsvFile = (file, data, fields, print = []) => {
  const exist = fs.existsSync(file)

  print = print.map(field => data[field])

  if (!Array.isArray(data)) data = [data]

  stringify(data, {
    header: !exist,
    columns: fields
  }).pipe(
    fs
      .createWriteStream(file, { flags: 'a' })
      .on('finish', () => {
        console.log('save', print.join(' '))
      })
      .on('error', () => {
        console.log('failed', print.join(' '))
      })
  )
}

const writeCsvFileSync = (file, data, fields, print = []) => {
  return new Promise((resolve, reject) => {
    const exist = fs.existsSync(file)

    print = print.map(field => data[field])

    if (!Array.isArray(data)) data = [data]

    stringify(data, {
      header: !exist,
      columns: fields
    }).pipe(
      fs
        .createWriteStream(file, { flags: 'a' })
        .on('finish', () => {
          console.log('save', print.join(' '))
          resolve()
        })
        .on('error', () => {
          console.log('failed', print.join(' '))
          reject()
        })
    )
  })
}

const readCsvFile = (data, delimiter = ',') => {
  const records = parse(data, {
    columns: true,
    skip_empty_lines: true,
    delimiter
  })
  return records
}

export {
  readCsvFile,
  writeCsvFile,
  writeCsvFileSync
}