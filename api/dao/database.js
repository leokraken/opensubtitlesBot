const pg = require('pg-promise')();

// Connection URL
const HOST = process.env.DB_HOST || 'localhost'
const PORT = process.env.DB_PORT || 5432
const DB = process.env.DB_NAME || 'postgres'
const USER = process.env.DB_USER || 'postgres'


const url = `postgres://${USER}@${HOST}:${PORT}/${DB}`;

/**
*
db.ratings.createIndex({'tconst':1})
db.titles.createIndex({originalTitle: 'text'})
*/
const query = "select * from titles left join ratings on (titles.tconst = ratings.tconst) where to_tsvector('english', titles.original_title) @@ to_tsquery('english', ${q}) order by ratings.votes desc nulls last limit ${limit}"

class Database{
	constructor(){
		this.db = pg(url)
	}

	async search(q, limit = 20){
		const titles = await this.db.any(query, {q, limit})
		return titles
	}

}


module.exports = Database