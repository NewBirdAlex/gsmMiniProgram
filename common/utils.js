const utils = {
	parseurl(data){
		let str = '?';
		for(let item in data){
			str+= item + '='+ data[item]+'&'
		}
		return str.slice(0,-1)
	}
}
module.exports = utils