const Database = require('../dao/database')

class TitlesController{
	constructor(){
		this.database = new Database()
	}

	async search(req, res, next){
		try{
			const doc = await this.database.search()
			res.status(200).send(doc)
		}catch(err){
			console.log(err)
			res.status(500).end()
		}

	}
}

module.exports = TitlesController