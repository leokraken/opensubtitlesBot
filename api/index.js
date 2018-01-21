const express = require('express')
const bodyParser = require('body-parser')
const TitlesController = require('./controllers/titles')


const PORT = process.env.PORT || 8080
const app = express()
const titlesController = new TitlesController()

app.use(bodyParser.json())

app.get('/search', (req, res)=>{
	titlesController.search(req, res)
})

app.listen(PORT, ()=>{
	console.log('Running on 8080')
})