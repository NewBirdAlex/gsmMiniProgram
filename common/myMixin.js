export default {
	data(){
		return {
			hasUnReadMessage:false
		}
	},
	methods: {
		add0(m) {
			return m < 10 ? '0' + m : m
		},
		format(shijianchuo) {
			//shijianchuo是整数，否则要parseInt转换
			var time = new Date(shijianchuo);
			var y = time.getFullYear();
			var m = time.getMonth() + 1;
			var d = time.getDate();
			var h = time.getHours();
			var mm = time.getMinutes();
			var s = time.getSeconds();
			return y + '-' + this.add0(m) + '-' + this.add0(d) + ' ' + this.add0(h) + ':' + this.add0(mm) + ':' + this.add0(s);
		},
		setImgSize(arr,size,attr){
			if(!arr||!arr.length) return
			arr.forEach(item=>{
				let str;
				if(attr){
					str = attr;
					if(!item[str]) return
				}else{
					if(item.image) str = 'image';
					if(item.images) str = 'images';	
					if(item.imageUrl) str = 'imageUrl';
					if(item.remomondImageUrl) str = 'remomondImageUrl';
					if(item.goodsImage) str = 'goodsImage';
					if(!item[str]) return
				}
				if(item[str].indexOf(size)!=-1) return
				let subs = item[str].split('.');
				let len = subs.length;
				subs[len-2] =subs[len-2]+`_r${size}p`;
				item[str] = subs.join('.')
			})
			return arr
		},
		checkpsw(e){
			if(!e.detail.value) return
			let val = e.detail.value;
			let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/g;
			if(!reg.test(val)){
				console.log(reg.test(val));
				uni.showToast({
					duration:1500,
					icon:'none',
					title:'密码只能由6-16位数字与字母组合，请重新填写'
				})
			}
		},
		checkPswString(str){
			// let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/g;
			let reg = /^[a-zA-Z\d]{6,16}$/g;
			if(!reg.test(str)){
				return false
			}else{
				return true
			}
		},
		goProduct(product){
			let id;
			product.goodsId?id=product.goodsId:'';
			console.log(product);
			uni.navigateTo({
				url:'/pages/product/product-detail?id='+id
			})
		},
		submitPageBackToIndex(){
			uni.getStorage({
				key:'backToHomePage',
				success: (res) => {
					uni.removeStorageSync('backToHomePage')
					uni.switchTab({
						url:'/pages/index/index'
					})
				}
			})
		},
		forwardMiniProgram(){
			// #ifdef MP-WEIXIN
			wx.showShareMenu({
			  withShareTicket: true
			})
			// #endif
		},
		checkNewMessage(){
			this.apiUrl.checkNewMessage().then(res=>{
				if(res.data.status==1&&res.data.data){
					this.hasUnReadMessage = true;
				} else{
					this.hasUnReadMessage = false;
				}
			})
		},
		multiply(n1 = 0, n2 = 0) {
			var s1 = n1.toString()
			var s2 = n2.toString()
			var l1 = (s1.split('.')[1] || '').length
			var l2 = (s2.split('.')[1] || '').length
			var r1 = Number(s1.replace('.', ''))
			var r2 = Number(s2.replace('.', ''))
			return r1 * r2 / Math.pow(10, l1 + l2)
		},
		divide(n1 = 0, n2 = 0) {
			var s1 = n1.toString()
			var s2 = n2.toString()
			var l1 = (s1.split('.')[1] || '').length
			var l2 = (s2.split('.')[1] || '').length
			var r1 = Number(s1.replace('.', ''))
			var r2 = Number(s2.replace('.', ''))
			return this.multiply((r1 / r2), Math.pow(10, l2 - l1))
		},
		add(n1 = 0, n2 = 0) {
			var s1 = n1.toString()
			var s2 = n2.toString()
			var l1 = (s1.split('.')[1] || '').length
			var l2 = (s2.split('.')[1] || '').length
			var c = Math.abs(l1 - l2)
			var m = Math.pow(10, Math.max(l1, l2))

			var r1 = 0
			var r2 = 0
			if (c > 0) {
				var cm = Math.pow(10, c)
				if (l1 > l2) {
					r1 = Number(s1.replace('.', ''))
					r2 = Number(s2.replace('.', '')) * cm
				} else {
					r1 = Number(s1.replace('.', '')) * cm
					r2 = Number(s2.replace('.', ''))
				}
			} else {
				r1 = Number(s1.replace('.', ''))
				r2 = Number(s2.replace('.', ''))
			}
			return (r1 + r2) / m
		},
		subtract(n1 = 0, n2 = 0) {
			var l1 = (n1.toString().split('.')[1] || '').length
			var l2 = (n2.toString().split('.')[1] || '').length
			var m = Math.pow(10, Math.max(l1, l2))
			var n = (l1 >= l2) ? l1 : l2
			return Number(((n1 * m - n2 * m) / m).toFixed(n))
		}
	}
}
