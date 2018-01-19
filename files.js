const axios = require('axios')

function downloadFile(url){
	return axios({
	  	method:'get',
	  	url:url,
	  	responseType:'stream'

	}).then(response=> {
		console.log(response)
		return response.data
	})
}

module.exports = {
	downloadFile
}

/*
const url= 'https://dl.opensubtitles.org/en/download/src-api/vrf-19e20c62/sid-LUrC,E4i2nFlPtlmJ-kzFUU1Ox3/filead/1955760897'
downloadFile(url).then(data=> console.log(data))
*/