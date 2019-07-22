<template>
	<view class="fo-wrap pageBg">
		<view class="background-white">
			<navigator url="/pages/addressManage/addressManage">
				<address-using :arrow="true" :badAddress='badAddress'></address-using>
			</navigator>
		</view>
		<view class="background-white">
			<orderlist-inline :goodsList="product" showType='fillorder'></orderlist-inline>
		</view>
		<view class="pd20 betweenBox background-white bdb">
			<text class="fs30 title-black">订单运费</text>
			<text class="primary-color fs36">￥{{expressFee||0}} </text>
		</view>
		<view class="" style="height: 10px;">

		</view>
		<view class="pd20 betweenBox background-white bdb" v-if="orderType==2&&allowIntegral.allowIntegral!=0">
			<text class="fs30 title-black">使用 {{allowIntegral.allowIntegral}} 张优惠卷可抵扣￥{{allowIntegral.allowIntegralMoney}} 元</text>
			<switch @change="switchChange" />
		</view>
		<view class="pd20 betweenBox background-white bdb" v-if="false">
			<text class="fs30 title-black">支持配送</text>
			<text class="gray fs30">申通快递 </text>
		</view>
		<view class="pd20 betweenBox background-white bdb" v-if="allowReceipt">
			<text class="fs30 title-black">发票信息</text>
			<view class="gray fs30 flex-box" @tap="navigatorToReciept">
				<text v-if="!receipt">填写发票信息</text>
				<view class="" v-else>
					<text v-if="receipt.invoiceStatus==1">{{receipt.invoiceType==1?'纸质发票-个人':'纸质发票-公司'}}</text>
					<text v-if="receipt.invoiceStatus==2">增值税发票</text>
				</view>
			</view>
		</view>
		<view class="pd20 betweenBox background-white pageBd">
			<text class="fs30 title-black">购买备注</text>
			<input type="text" v-model="notice" placeholder="请填写备注" class="tar" />
		</view>

		<view class="fd-btns betweenBox background-white ">
			<view class="fs24 pdl20 flex-box">
				合计：
				<text class="primary-color fs36">￥{{totalMoney}}</text>
			</view>
			<view class="white btn flex-box" :class="{'forbid':badAddress}" @tap='submitOrder'>
				提交订单
			</view>
		</view>
		<uni-popup :show='maintain' msg='提示'>
			<view class="pop-wrap">
				<view class="">
					抱歉，现在是系统维护时间，禁止下单
				</view>
				<view class="blue tac fs30" @tap="goBack">
					知道了
				</view>
			</view>

		</uni-popup>
	</view>
</template>

<script>
	import addressUsing from '@/components/address-using.vue'
	import orderlistInline from '@/components/orderlist-inline.vue'
	import uniPopup from '@/components/uni-popup.vue'
	import {
		mapState,
		mapMutations
	} from 'vuex'
	// let plugins = require('@/common/plugins.js');
	
	export default {
		data() {
			return {
				maintain: false,
				recieverIndex: 0,
				notice: '',
				product: [],
				expressFee: 0,
				totalMoney: 0,
				receipt: null,
				usePoints: 0,
				productIds: [],
				orderType: 2,
				badAddress: false,
				allowIntegral: {
					allowIntegralMoney: 0,
					allowIntegral: 0
				},
				allowReceipt: false,
				allowOrder:true
			};
		},
		computed: mapState([
			'memberInfo',
			'activeAddress'
		]),
		watch: {
			activeAddress: function(val, oldVal) {
				this.getExpress();
			}
		},
		onShow(e) {
			this.getReceiptFromStorage();
			// this.getExpress();
			// back to index
			this.submitPageBackToIndex();
		},
		onLoad(e) {
			this.orderType = e.type;
			this.$store.dispatch('getMemberInfo');
			this.initProduct();
			this.getSystemInfo();
			
		},
		methods: {
			navigatorToReciept() {
				if (!this.allowReceipt) {
					uni.showToast({
						title: '该商品不支持开发票',
						mask: false,
						icon: 'none',
						duration: 1500
					});
					return
				}else{
					uni.setStorage({
						key:'recieptType',
						data:this.allowReceipt,
						success: () => {
							uni.navigateTo({
								url:'../receipt/receipt'
							})		
						}
					})
				}
				
			},
			goBack() {
				uni.navigateBack()
			},
			getSystemInfo() {
				this.apiUrl.getsystemInfo().then(res => {
					if (res.data.status == 1) {
						res.data.data.systemMaintenance == 'true' ? this.maintain = true : this.maintain = false;
					}
				})
			},
			getScore() { //使用积分
				let productInfo = [];
				this.product.forEach(item => {
					let obj = {};
					obj = {
						amout: item.amount,
						productId: item.productId ? item.productId : item.id,
						productModelId: item.modelId ? item.modelId : item.selectModel.id
					}
					productInfo.push(obj)
				})
				this.apiUrl.getAllowIntegralMoney({
					data: {
						productInfo: JSON.stringify(productInfo),
						memberId: this.memberInfo.id
					}
				}).then(res => {
					if (res.data.status == 1) {
						this.allowIntegral = res.data.data;
					}
				})
			},
			//提交订单
			submitOrder() {
				if (!this.activeAddress) {
					uni.showToast({
						icon: 'none',
						duration: 2000,
						title: '请选择收货地址'
					})
					return
				}
				if (this.badAddress) {
					uni.showToast({
						icon: 'none',
						duration: 2000,
						title: '改地址不在配送范围内，请重新选择'
					})
					return
				}
				if(!this.allowOrder) return
				this.allowOrder = false; //防止多次点击
				uni.showLoading({
					title:'请稍候',
					mask:true
				})
				
				let productInfo = [];
				let shoppingCartIds = []
				this.product.forEach(item => {
					let obj = {};
					if (this.orderType == 2) { //普通商品
						obj = {
							amout: item.amount,
							productId: item.productId ? item.productId : item.id,
							productModelId: item.modelId ? item.modelId : item.selectModel.id
						}
					} else if (this.orderType == 1) { //批发零售
						obj = {
							amout: item.amount,
							productId: item.id,
							productProxyPackageId: item.selectModel.id
						}
					} else {
						obj = {
							amout: item.amount,
							productId: item.id
						}
					}
					productInfo.push(obj)
					item.shoppingCartIds ? shoppingCartIds.push(item.shoppingCartIds) : ''
				})
				let receipt = 
				this.receipt?receipt = this.receipt:receipt={invoiceStatus:0};
				let data = {
					address: this.activeAddress.address,
					city: this.activeAddress.city,
					consignee: this.activeAddress.consignee,
					district: this.activeAddress.district,
					memberId: this.memberInfo.id,
					mobile: this.activeAddress.mobile,
					productInfo: JSON.stringify(productInfo),
					province: this.activeAddress.province,
					type: this.ProductType,
					userNote: this.notice,
					shoppingCartIds: shoppingCartIds.join(','),
					usePoints: this.usePoints,
					...receipt
				}

				this.apiUrl.submitOrder({
					data
				}).then(res => {
					uni.hideLoading();
					if (res.data.status == 1) {
						uni.showToast({
							icon: 'none',
							duration: 1500,
							title: '提交成功'
						})
						//提交后获取订单
						return this.apiUrl.getOrderDetail({
							data: {
								orderId: res.data.data.orderId
							}
						})

					} else {
						this.allowOrder = true;
						uni.showToast({
							icon: 'none',
							duration: 1500,
							title: res.data.message
						})
					}
				}, rej => {}).then(res => {
					if (!res || res.data.status != 1){
						this.allowOrder = true;
						return
					} 
					console.log(res);
					//使用优惠券后金额为 0
					if(res.data.data.orderAmount==0){
						uni.setStorageSync('payingOrder',res.data.data);
						uni.navigateTo({
							url:'../pay-success/pay-success'
						})
						return
					}
					
					
					//正常提交订单
					uni.setStorage({
						key: 'payingObj',
						data: res.data.data,
						success: () => {
							uni.showToast({
								icon: 'none',
								duration: 1500,
								title: '订单提交成功'
							})
							//get systerm setting infomation
							this.$store.dispatch('getSystemInfo');
							setTimeout(() => {
								uni.navigateTo({
									url: '../submitOrder/submitOrder'
								})
							}, 1000)
						}
					}, rej => {})
					
				})
			},

			getExpress() { //获取运费
				if (this.activeAddress&&this.product.length) {
					let modelIds = [];
					let amounts = []
					let productArr = [...this.product];
					productArr.forEach(item => {
						amounts.push(item.amount)
					})
					let data = {
						addressId: this.activeAddress.id,
						amounts: amounts.join(',')
					}
					if (this.orderType == 2) { //普通
						let arr = [...this.product];
						arr.forEach(item => {
							if (item.modelId) { //来自购物车的 
								modelIds.push(item.modelId);
							} else { //直接购买
								modelIds.push(item.selectModel.id);
							}
						})
						data.modelIds = modelIds.join(',')
					} else { //批发 零售
						data.productId = this.productIds.join(',')
					}
					this.apiUrl.getOrderExpress({
						data
					}).then(res => {
						if (res.data.status == 1) {
							let exp = 0;
							res.data.data.forEach(item => {
								exp += item.fee;
								item.code == 0 ? this.badAddress = true : this.badAddress = false;//是否支持配送
							})
							this.totalMoney = this.subtract(this.totalMoney,this.expressFee);
							this.expressFee = exp;
							this.totalMoney = this.add(this.totalMoney,exp);
						}
					})
				}
			},
			ifAllowReceipt() {
				let arr = this.productIds;
				this.apiUrl.getReciept({
					data: {
						productIds: arr.join(',')
					}
				}).then(res => {
					if (res.data.status == 1) {
						if (res.data.data.isInvoice == 1) {
							this.allowReceipt = res.data.data.invoiceType.split(',');
						} else {
							this.allowReceipt == false;
						}
					}
				})
			},
			//获取发票
			getReceiptFromStorage() {
				console.log('getReceiptFromStorage')
				uni.getStorage({
					key: 'receiptInfo',
					success: (res) => {
						this.receipt = res.data;
					}
				})
			},
			//获取 要购买的产品
			initProduct() {
				uni.getStorage({
					key: 'payingProduct',
					success: (res) => {
						if (this.orderType == 0) {
							//零售商品
							this.product.push(res.data);
							this.productIds.push(this.product[0].id)
							this.product.forEach(item => {
								this.totalMoney +=this.multiply(item.price,item.amount)//总价钱
							})
							this.ProductType = 0;
						} else if (this.orderType == 1) {
							//批发商品
							this.product.push(res.data);
							if (res.data.selectModel) {
								this.productIds.push(this.product[0].selectModel.productId);
							} else {
								this.productIds.push(this.product[0].id)
							}
							this.product.forEach(item => {
								this.totalMoney +=this.multiply(item.selectModel.wholesalePrice,item.amount) //总价钱
							})
							this.ProductType = 1;
						} else {
							//普通商品
							if (!res.data.length || res.data.length < 2) { //单个商品
								res.data.length ? this.product.push(res.data[0]) : this.product.push(res.data);
								this.product.forEach(item => {
									if (item.mulType) {
										this.totalMoney +=this.multiply(item.selectModel.price,item.amount) //总价钱
										if (this.product[0].selectModel) {
											this.productIds.push(this.product[0].selectModel.productId);
										} else {
											this.productIds.push(this.product[0].productId)
										}
										
									} else {
										this.totalMoney +=this.multiply(item.price,item.amount) //总价钱
										this.productIds.push(this.product[0].id);
										console.log('enter')
										console.log(this.productIds)
									}

								})
								
							} else { //多个商品
								this.product = res.data
								this.product.forEach(item => {
									this.totalMoney +=this.multiply(item.price,item.amount) //总价钱
									this.productIds.push(item.productId)
								})
							}
							this.ProductType = 2;
							this.getScore();

						}
						//设置图片尺寸
						this.product = this.setImgSize(this.product, '200x200');
						this.getExpress();
						this.ifAllowReceipt();
					}
				})
			},
			switchChange(e) {
				e.detail.value ? this.usePoints = 1 : this.usePoints = 0;
				if(this.usePoints){
					let p = this.allowIntegral.allowIntegralMoney||0
					this.totalMoney = this.subtract(this.totalMoney,p);
				}else{
					let p = this.allowIntegral.allowIntegralMoney||0
					this.totalMoney = this.add(this.totalMoney,p);
				}
			},
			goaddress() {
				uni.navigateTo({
					url: '/pages/addressManage/addressManage'
				})
			},
			changeReciever(e) {
				this.recieverIndex = e.target.value;
			}
		},
		components: {
			addressUsing,
			orderlistInline,
			uniPopup
		}
	}
</script>

<style lang="less">
	.fo-wrap{
		padding-bottom: 100upx;
	}
	.forbid {
		background: #B9B9B9 !important;
		color: white;
	}

	.fo-ra {
		width: 14upx;
	}

	.fd-btns {
		display: flex;
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		z-index: 10;

		.btn {
			width: 300upx;
			height: 100upx;
			background: #FC4E29;
		}
	}

	.pop-wrap {
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
	}
</style>
