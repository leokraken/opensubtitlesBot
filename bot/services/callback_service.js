const EventEmitter = require('events');
const util = require('util');

const OpensubtitleService = require('./opensubtitles_service')

class CallbackEvents extends EventEmitter{
	constructor(){
		super();
		this.IMDB_REGEX = /imdb (.+)/
		this.DOWNLOAD_REGEX = /-d (.+)-(.+)-(.+)/;
		this.openSubtitlesService = new OpensubtitleService();
		this.DOWNLOAD_URL_FORMAT= "https://dl.opensubtitles.org/en/download/src-api/vrf-%s/sid-%s/filead/%s";
	}

	callbackQueryIMDB(data){
		const match = this.IMDB_REGEX.exec(data)
		if(match){
			console.log(this)
			const title = match[1]
			this.openSubtitlesService
				.search(title)
				.then(res => {
					const response = OpensubtitleService._searchResponse(res);
					console.log('emit imdb');
					this.emit('imdb', response);
				})		
		}
	}

	callbackDownload(data){
		const match = this.DOWNLOAD_REGEX.exec(data)
		if(match){
			console.log(this)
			this.emit('test', match)
			const url = util.format(this.DOWNLOAD_URL_FORMAT, match[1], match[2], match[3]);
			console.log('emit download', url)
			this.emit('downsub', url);

		}
	}

	isDownloadCallback(msg){
		return this.DOWNLOAD_REGEX.exec(msg)
	}

	isIMDBCallback(msg){
		return this.IMDB_REGEX.exec(msg)
	}

	run(msg){
		if(this.isIMDBCallback(msg)){
			this.callbackQueryIMDB(msg);
		}else if(this.isDownloadCallback(msg)){
			this.callbackDownload(msg);
		}
	}
}

module.exports = CallbackEvents;


const emitter= new CallbackEvents()
emitter.on('downsub', (data)=>{console.log('asdasdsa',data)})
emitter.callbackDownload('-d 197a0c49-89o9gj7aU9AgjLak,EPO1gU3Ds5-1953210038')