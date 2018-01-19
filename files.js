const request = require('request')

function downloadFile(url){
	return request(url)
}

module.exports = {
	downloadFile
}

//console.log(downloadFile('https://pastebin.com/raw/5yQfBt7Z'))