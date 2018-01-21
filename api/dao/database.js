const MongoClient = require('mongodb').MongoClient;

// Connection URL
const HOST = process.env.MONGO_HOST || 'localhost'
const PORT = process.env.MONGO_PORT || 27017
const DB = process.env.MONGO_DB || 'test'

const url = `mongodb://${HOST}:${PORT}/${DB}`;

/**
*
db.ratings.createIndex({'tconst':1})
db.titles.createIndex({originalTitle: 'text'})
*/

class Database{
	constructor(){
		MongoClient.connect(url, (err, client) => {
			console.log("Connected to mongodb");
			const db = client.db(DB);
			this.collection = db.collection('titles')
		});
	}

	async search(q){
		const doc = await this.collection.findOne()
		return doc
	}

	async searchCustom(){
		const results = (await this.collection.aggregate([
			{ $match: { $text: { $search: "dark" } } },
			{
				$lookup:
				{
					from: "ratings",
					localField: "tconst",
					foreignField: "tconst",
					as: "rating"
				}
			},
			{ "$project": { 
				"tconst": 1, 
				"originalTitle":1,
				"rate": { "$arrayElemAt": [ "$rating", 0 ] }
			}},
			{ $sort: { 'rate.numVotes': -1} }

			])).toArray()
		return results
	}
}


module.exports = Database