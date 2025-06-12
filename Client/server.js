const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
    const newHTML = '<h1>HEHEHEHA</h1>';
  res.send(newHTML);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})