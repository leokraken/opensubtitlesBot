const OS = require('opensubtitles-api');
const _ = require('lodash');

const OpenSubtitles = new OS({
	useragent: 'TemporaryUserAgent',
    ssl: true
});

const URL_COMPACT = RegExp("https:\/\/dl.opensubtitles.org\/en\/download\/src-api\/vrf-(.+)\/sid-(.*)\/filead\/(.+)")

class OpenSubtitlesService{
	
	constructor(){ 

	}

	search(imdb){

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
			return subtitles
		})
	}

	static _searchResponse(response){
		const subtitles = _.map(response.es, sub => {
			// Parse url, because the shitter telegram data_callback has 64 bytes max length
			sub.url = OpenSubtitlesService.parseURL(sub.url);
			return sub;
		})
		console.log(subtitles);
		return subtitles;
	}

	static parseURL(url){
		const result = URL_COMPACT.exec(url)
		return `-d ${result[1]}-${result[2]}-${result[3]}`;
	}

}


module.exports = OpenSubtitlesService;
