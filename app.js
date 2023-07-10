const { DirectoryLoader } = require('langchain/document_loaders/fs/directory')
const { JSONLoader } = require('langchain/document_loaders/fs/json')

const express = require('express');
const cors = require('cors')

const app = express();

app.use(cors())

app.get('/', async (req, res) => {
  const loader = new DirectoryLoader('static', {
    '.json': path => new JSONLoader(path, ['/wname'])
  })
  const docs = await loader.load()
  res.send(docs);
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
