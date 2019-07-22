
// urlEncode
let md5 = require('md5');

function getSign(params, time) {
    if (typeof params == "string") {
        return paramsStrSort(params);
    } else if (typeof params == "object") {
		params.timestamp = time
        var arr = [];
        for (var i in params) {
			if((params[i]||params[i]===0)&&params[i]!==''){
				arr.push((i + "=" + params[i]));
			}
        }
        return paramsStrSort(arr.join(("&")),time);
    }
}

function paramsStrSort(paramsStr) {
    var url = paramsStr;
	let memberSecret =  uni.getStorageSync('memberSecretV2');
	let secret='';
	memberSecret?secret="TPSHOP"+memberSecret:''
    var urlStr = url.split("&").sort().join("&")+secret;
	urlStr = encodeURIComponent(urlStr);
	// console.log(urlStr);
    var newUrl = md5(urlStr).toLocaleUpperCase();
    return newUrl;
}

// #ifdef H5
const clientplatform = 'webapp';
// #endif
// #ifdef MP-WEIXIN
const clientplatform = 'wxmini';
// #endif 
const clientversion  = '201907051901';


let type = 3;
let baseUrl,payUrl;
if(type==1){
	baseUrl = 'https://gsm-mg.vzmapp.cn/gsm_mg/'
	payUrl = 'https://gsm-mg.vzmapp.cn/Payment/'
}else if(type==2){
	baseUrl = 'https://tscebuy-mg2.vzmapp.cn/tsce_mg/'
	payUrl = 'https://tscebuy-mg2.vzmapp.cn/Payment/'
}else if(type==3){
	baseUrl = 'https://mg.gaishifeng.com/gsm_mg/'
	payUrl = 'https://pay-gw.gaishifeng.com/Payment/'
}
let staticImgResource = 'https://img.gaishifeng.com/gsm/'; // img href link
let H5Domain = 'https://m.gaishifeng.com'; // h5 link
let signSecret = '0C03C912017B4EAE5A01A5700AF0F503';
//normal interface using
function uniRequest(options = {}) {
	let {
		data,
		success,
		fail,
		complete
	} = options;
	data = data||{};
	var url = baseUrl+options.url+'.action';
	let dataType = options.dataType||'json';
	let method = options.method||'GET';
	data.appId = 'f7f57ca135a611e9aa7900163e06f83c';
	let member =  uni.getStorageSync('member');
	member? data.memberId = member.id:'';
	//sign
	let timestamp = new Date().getTime();
	data.sign = getSign(data, timestamp);
	data.timestamp = timestamp;
	return new Promise((res, rej) => {
		uni.request({
			url,
			data,
			method,
			header: {
				// #ifdef MP-WEIXIN
				clientplatform,
				clientversion
				// #endif
			},
			success(r) {
				// uni.hideLoading();
				if(r.data.status!=1&&r.data.message){
					uni.showToast({
						title:r.data.message,
						duration:1500,
						icon:'none'
					})
				}
				if(r.data.status==403){
					uni.removeStorageSync('memberSecret')
					uni.removeStorageSync('member')
					uni.navigateTo({
						url:'/pages/login/login'
					})
				}
				res(r)
			},
			fail(err) {
				// uni.hideLoading();
				console.log(err)
				rej(err);
			},
			complete:complete
		})
	});
}
//支付 调用
function payRequest(options = {}) {
	let {
		data,
		success,
		fail,
		complete
	} = options;
	data = data||{};
	var url = payUrl+options.url;
	let dataType = options.dataType||'json';
	let method = options.method||'GET';
	data.appId = 'f7f57ca135a611e9aa7900163e06f83c';

	let member =  uni.getStorageSync('member');
	member? data.memberId = member.id:'';
	//sign
	let timestamp = new Date().getTime();
	data.sign = getSign(data, timestamp);
	data.timestamp = timestamp;
	return new Promise((res, rej) => {
		uni.request({
			url,
			data:data,
			method,
			success(r) {
				res(r)
			},
			fail(err) {
				console.log(err)
				rej(err);
			},
			complete:complete
		})
	});
}
module.exports = {
	uniRequest,
	payRequest,
	baseUrl,
	staticImgResource,
	H5Domain,
	signSecret
};

