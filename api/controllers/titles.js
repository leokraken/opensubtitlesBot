const Database = require('../dao/database')

class TitlesController{
	constructor(){
		this.database = new Database()
	}

	async search(req, res, next){
		try{
			const q = req.query.q
			const limit = req.query.limit
			const doc = await this.database.search(q, limit)
			res.status(200).send(doc)
		}catch(err){
			console.log(err)
			res.status(500).end()
		}

	}
}

module.exports = TitlesController