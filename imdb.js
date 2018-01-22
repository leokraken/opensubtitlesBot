const request = require('request-promise')

const limit = 20;

class IMDB {
	constructor(){}

	search(title){
		const options ={
			uri: 'http://207.246.78.24:8080',
			qs:{
				q: title,
				limit
			},
			json:true
		}
		return request(options)
	}
}

module.exports = IMDB