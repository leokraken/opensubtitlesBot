const OS = require('opensubtitles-api');
const OpenSubtitles = new OS({
	useragent: 'TemporaryUserAgent',
    ssl: true
});

function search(imdb){

	return OpenSubtitles.search({
	    sublanguageid: 'spa',       // Can be an array.join, 'all', or be omitted. 
	    //hash: '8e245d9679d31e12',   // Size + 64bit checksum of the first and last 64k 
	    //filesize: '129994823',      // Total size, in bytes. 
	    //path: 'foo/bar.mp4',        // Complete path to the video file, it allows 
	                                //   to automatically calculate 'hash'. 
	    //filename: 'bar.mp4',        // The video file name. Better if extension 
	                                //   is included. 
	    //season: '2',
	    //episode: '3',
	    //extensions: ['srt', 'vtt'], // Accepted extensions, defaults to 'srt'. 
	    limit: 'all',                 // Can be 'best', 'all' or an 
	                                // arbitrary nb. Defaults to 'best' 
	    imdbid: imdb,           // 'tt528809' is fine too. 
	    //fps: '23.96',               // Number of frames per sec in the video. 
	    query: 'dark',   // Text-based query, this is not recommended. 
	    gzip: false                  // returns url to gzipped subtitles, defaults to false 
	}).then(subtitles => {
		console.log(subtitles)
		return subtitles
	})
}

function _searchResponse(response){
	return response.es
}

const IMDB_REGEX = /imdb (.+)/
const DOWNLOAD_REGEX = /download (.+)/


function callbackQueryIMDB(data){
	const match = IMDB_REGEX.exec(data)
	if(match){
		const title = match[1]
		return search(title).then(res => _searchResponse(res))		
	}
	return Promise.reject()
}

function isDownloadCallback(msg){
	return DOWNLOAD_REGEX.exec(msg)
}

function isIMDBCallback(msg){
	return IMDB_REGEX.exec(msg)
}

module.exports = {
	search,
	callbackQueryIMDB,

	//regex
	isDownloadCallback,
	isIMDBCallback
}

