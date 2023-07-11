import { DirectoryLoader } from 'langchain/document_loaders/fs/directory'
import { JSONLoader } from 'langchain/document_loaders/fs/json'

import express from 'express'
import cors from 'cors'

const app = express()

app.use(cors())

app.get('/', async (req, res) => {
  const loader = new DirectoryLoader('static/data', {
    '.json': path => new JSONLoader(path, ['/wname'])
  })
  const docs = await loader.load()
  res.send(docs);
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
