<template>
	<view class="pageBg">
		<view class="fs24 tac pd20 background-white">付款金额</view>
		<view class="primary-color bigFont tac background-white pdb20">￥{{ order.orderAmount || 0 }}</view>
		<!-- pay by different types -->
		<view class="background-white mgt40">
			<view class="">
				<radio-group @change="radioChange">
					<label class="betweenBox pd20 bdb" v-for="(item, index) in items" :key="index">
						<view class="flex-box fs30">
							<image v-if="item.value == 1" src="/static/img/alipay.png" mode="widthFix" class="payIcon mgr20"></image>
							<image v-if="item.value == 2" src="/static/img/wechatpay.png" mode="widthFix" class="payIcon mgr20"></image>
							<image v-if="item.value == 3" src="/static/img/balance.png" mode="widthFix" class="payIcon mgr20"></image>
							{{ item.name }}
							<text class="gray mgl20" v-if="item.value == 3">可用余额￥{{ memberInfo.userMoney }}元</text>
						</view>
						<view><radio :value="item.value" :checked="item.value == current" /></view>
					</label>
				</radio-group>
			</view>
		</view>
		<view class="pd20 tac betweenBox">
			<view class="flex-box">
				<view class="def-circle border flex-box mgr20" @tap="agree = !agree"><uni-icon v-if="agree" type="checkbox-filled" color="#FC4E29" size="24"></uni-icon></view>
				<navigator url="../../login/agreements/agreements?type=6"><text class="primary-color fs24 underline">我已阅读并同意《盖世风支付协议》</text></navigator>
			</view>
		</view>
		<view class="mgt40" style="margin-top: 50%;" v-if="systemInfo">
			<view class="tac fs24 primary-color" v-if="order.type == 0">请在{{ systemInfo.resaleTimeLimit }}分钟内完成付款，否则订单失效。</view>
			<view class="tac fs24 primary-color" v-if="order.type == 1">请在{{ systemInfo.wholesaleTimeLimit }}分钟内完成付款，否则订单失效。</view>
			<view class="tac fs24 primary-color" v-if="order.type == 2">请在{{ systemInfo.generalTimeLimit }}分钟内完成付款，否则订单失效。</view>
			<view class="paybtn white flex-box " :class="{ unpay: timeEnd || !allowBalance }" @tap="pay" v-if="showCd">
				<text class="mgr20 ">去付款</text>

				<order-countdown :timer="order.createDate" :currentTime="systemInfo.now" :orderType="order.type" @activeOver="notAllowPay"></order-countdown>
			</view>
		</view>
		<uni-popup :show="showYue" @hide="showYue = !showYue" msg="">
			<view class="pbc-wrap">
				<view class="tac pbc-top pdb20">
					请输入支付密码
					<view class="close flex-box" @tap="showYue = !showYue"><uni-icon class="" type="closeempty" size="30"></uni-icon></view>
				</view>
				<view class="primary-color fs36 tac">￥{{ order.orderAmount || 0 }}</view>
				<view class="input_code bdb betweenBox">
					<input type="text" style="flex: 2;" :focus="showYue" :password="!showPassword" v-model="inputCode" class="last" />
					<view class="appen-solt " @tap="showPassword = !showPassword">
						<text class="password-mode flex">{{ showPassword ? '隐藏' : '显示' }}</text>
					</view>
				</view>
				<view class="paybtn white flex-box paybtn2" :class="{ unpay: inputCode.length < 6 }" @tap="payByYue">支付</view>
			</view>
		</uni-popup>
	</view>
</template>
<script>
import orderCountdown from '@/components/order-countdown.vue';
import uniPopup from '@/components/uni-popup.vue';

import { mapState, mapMutations } from 'vuex';
export default {
	data() {
		return {
			agree: true,
			items: [
				{
					value: '1',
					name: '支付宝支付'
				},
				{
					value: '2',
					name: '微信支付'
				},
				{
					value: '3',
					name: '余额支付'
				}
			],
			current: '',
			order: {
				orderAmount: 0,
				type: 2
			},
			inputCode: '',
			showYue: false,
			allowBalance: true,
			timeEnd: false,
			showPassword: false,
			showCd: false
		};
	},
	computed: mapState(['memberInfo', 'systemInfo']),
	destroyed() {
		uni.removeStorageSync('payingObj');
	},
	onShow() {
		//nav
		uni.getStorage({
			key: 'paySuccessToHomePage',
			success: res => {
				uni.removeStorageSync('paySuccessToHomePage');
				uni.switchTab({
					url: '/pages/index/index'
				});
			}
		});
		//pay

		// #ifdef H5
		let payWay = [
			{
				value: '2',
				name: '微信支付'
			},
			{
				value: '3',
				name: '余额支付'
			}
		];
		if (this.isWeiXin()) {
			//h5 微信
			this.items = payWay;
			this.current = 2;
		} else {
			//h5 支付宝支付
			this.items = [
				{
					value: '1',
					name: '支付宝支付'
				},
				{
					value: '3',
					name: '余额支付'
				}
			];
			this.current = 1;
		}
		// #endif

		// #ifdef MP-WEIXIN
		let payWayWx = [
			{
				value: '2',
				name: '微信支付'
			},
			{
				value: '3',
				name: '余额支付'
			}
		];
		this.items = payWayWx;
		this.current = 2;
		// #endif
		// #ifdef APP-PLUS
		let payWayApp = [
			{
				value: '2',
				name: '微信支付'
			},
			{
				value: '1',
				name: '支付宝支付'
			},
			
			{
				value: '3',
				name: '余额支付'
			}
		];
		this.items = payWayApp;
		this.current = 2;
		// #endif
	},
	created() {},
	onLoad(e) {
		e.agree ? (this.agree = true) : '';
		setTimeout(() => {
			this.order = uni.getStorageSync('payingObj');
		}, 100);
		// wechat pay
		// #ifdef H5
		if (this.getQueryString('code')) {
			this.payByWechat();
		}
		// #endif
		//the next page go back to index page

		uni.setStorageSync('backToHomePage', true);
		this.$store.dispatch('getSystemInfo');
		setTimeout(() => (this.showCd = true), 300);
		
		//发票
		uni.removeStorage({
			key: 'receiptInfo'
		})
	},
	watch: {
		current(val, oldVal) {
			console.log(val);
			if (val == 3) {
				if (this.order.orderAmount > this.memberInfo.userMoney) {
					this.allowBalance = false;
				}
			} else {
				this.allowBalance = true;
			}
		}
	},
	methods: {
		notAllowPay() {
			this.timeEnd = true;
			uni.showToast({
				duration: 2000,
				icon: 'none',
				title: '超时未支付，请重新购买'
			});
			setTimeout(() => {
				uni.switchTab({
					url: '../../index/index'
				});
			}, 1500);
		},
		payByWechat() {
			let code = this.getQueryString('code');
			this.apiUrl
				.getOpenId({
					data: {
						code,
						type: 'webapp'
					}
				})
				.then(res => {
					if (res.data.status == 1) {
						return this.apiUrl.getWeChatParams({
							// get wechat params
							data: {
								openId: res.data.data.openId,
								orderId: this.order.id,
								trade_type: 'JSAPI'
							}
						});
					}
				})
				.then(res => {
					if (res.data.status == 1) {
						this.wechatWebpay(res.data.data);
					}
				});
		},
		wechatWebpay(data) {
			let orderId = this.order.id;
			let self = this;
			let pay = function() {
				WeixinJSBridge.invoke(
					'getBrandWCPayRequest',
					{
						appId: data.appId, //公众号名称，由商户传入
						timeStamp: data.timeStamp, //时间戳，自1970年以来的秒数
						nonceStr: data.nonceStr, //随机串
						package: data.package,
						signType: data.signType, //微信签名方式：
						paySign: data.paySign //微信签名
					},
					function(res) {
						if (res.err_msg == 'get_brand_wcpay_request:ok') {
							// 使用以上方式判断前端返回,微信团队郑重提示：
							//res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
							self.savePayingProductType();
							uni.navigateTo({
								url: '../pay-success/pay-success'
							});
						}
						if (res.err_msg == 'get_brand_wcpay_request:cancel' || res.err_msg == 'get_brand_wcpay_request:fail') {
							// 失败
							let url = location.origin + '/#/pages/order/order?id=' + orderId;
							location.href = url;
						}
					}
				);
			};
			if (typeof WeixinJSBridge == 'undefined') {
				if (document.addEventListener) {
					document.addEventListener('WeixinJSBridgeReady', pay, false);
				} else if (document.attachEvent) {
					document.attachEvent('WeixinJSBridgeReady', pay);
					document.attachEvent('onWeixinJSBridgeReady', pay);
				}
			} else {
				pay();
			}
		},
		getQueryString(name) {
			let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
			let r = window.location.search.substr(1).match(reg);
			if (r != null) return unescape(r[2]);
			return null;
		},
		savePayingProductType() {
			uni.removeStorageSync('payingOrder');
			uni.setStorageSync('payingOrder', this.order);
		},
		payByYue() {
			if (this.inputCode.length < 6) return;
			if (!this.allowBalance) return;
			uni.showLoading();
			this.allowBalance = false; //防误触
			this.apiUrl
				.payByBalance({
					data: {
						orderId: this.order.id,
						password: this.inputCode
					}
				})
				.then(res => {
					uni.hideLoading();
					this.allowBalance = true;
					if (res.data.status == 1) {
						this.savePayingProductType();
						uni.navigateTo({
							url: '../pay-success/pay-success'
						});
					} else {
						uni.showToast({
							title: res.data.message,
							mask: false,
							icon: 'none',
							duration: 1500
						});
					}
				});
		},
		radioChange: function(evt) {
			for (let i = 0; i < this.items.length; i++) {
				if (this.items[i].value == evt.target.value) {
					this.current = evt.target.value;
					break;
				}
			}
		},
		isWeiXin() {
			//window.navigator.userAgent属性包含了浏览器类型、版本、操作系统类型、浏览器引擎类型等信息，这个属性可以用来判断浏览器类型
			var ua = window.navigator.userAgent.toLowerCase();
			//通过正则表达式匹配ua中是否含有MicroMessenger字符串
			if (ua.match(/MicroMessenger/i) == 'micromessenger') {
				return true;
			} else {
				return false;
			}
		},
		pay() {
			if (!this.allowBalance) return;
			if (!this.agree) {
				uni.showToast({
					duration: 2000,
					icon: 'none',
					title: '需要同意支付协议'
				});
				return;
			}
			if (!this.current) {
				uni.showToast({
					duration: 2000,
					icon: 'none',
					title: '请选择支付方式'
				});
				return;
			}
			if (this.timeEnd) {
				uni.showToast({
					duration: 2000,
					icon: 'none',
					title: '超时未支付，请重新购买'
				});
				setTimeout(() => {
					uni.switchTab({
						url: '../../index/index'
					});
				}, 2000);
				return;
			}

			if (this.current == 1) {
				//alipay
				uni.showLoading({
					title: '...',
					mask: true
				});
				// #ifdef H5
				let url = location.origin + '/#/pages/order/pay-success/pay-success';
				this.apiUrl
					.useAlipay({
						data: {
							orderId: this.order.id,
							type: 'web',
							returnUrl: url
						}
					})
					.then(res => {
						uni.hideLoading();
						if (res.data.status == 1) {
							this.savePayingProductType();
							const div = document.createElement('div');
							div.innerHTML = res.data.data.orderString;
							document.body.appendChild(div);
							this.$nextTick(() => {
								document.forms[0].submit(); //提交form表单
							});
						} else {
							uni.showToast({
								title: res.data.message,
								mask: false,
								icon: 'none',
								duration: 1500
							});
						}
					});
				// #endif

				// #ifdef APP-PLUS
				console.log('choose alipay');
				this.apiUrl
					.useAlipay({
						data: {
							orderId: this.order.id,
							type: 'app'
						}
					})
					.then(res => {
						uni.hideLoading();
						console.log('alipay prepay info:' + JSON.stringify(res));
						if (res.data.status == 1) {
							console.log('alipay prepay orderString:' + JSON.stringify(res.data.orderString));
							uni.requestPayment({
								provider: 'alipay',
								orderInfo: res.data.data.orderString,
								success: res => {
									console.log('ali pay success:' + JSON.stringify(res));
									this.savePayingProductType();
									uni.navigateTo({
										url: '../pay-success/pay-success'
									});
								},
								fail: function(err) {
									console.log('ali fail:' + JSON.stringify(err));
									uni.showToast({
										icon: 'none',
										title: '支付失败，请稍后重试.',
										duration: 2000
									});
								}
							});
						} else {
							uni.showToast({
								title: res.data.message,
								mask: false,
								icon: 'none',
								duration: 1500
							});
						}
					});
				// #endif
			} else if (this.current == 2) {
				//wechatpay
				uni.showLoading({
					title: '...',
					mask: true
				});
				// #ifdef H5
				//公纵号
				let origin = location.origin;
				let url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxc75e0c815860d199&redirect_uri=${origin}/%23/pages/order/submitOrder/submitOrder&response_type=code&scope=snsapi_base#wechat_redirect`;
				console.log(url);
				location.href = url;
				return;
				// #endif
				// #ifdef MP-WEIXIN
				uni.login({
					// 小程序 pay
					provider: 'weixin',
					success: res => {
						this.apiUrl
							.getOpenId({
								// get openid
								data: {
									code: res.code
								}
							})
							.then(res => {
								if (res.data.status == 1) {
									return this.apiUrl.getWeChatParams({
										// get wechat params
										data: {
											openId: res.data.data.openId,
											orderId: this.order.id,
											trade_type: 'MINIAPP'
										}
									});
								} else {
									uni.hideLoading();
									uni.showToast({
										icon: 'none',
										title: res.data.message,
										duration: 1500
									});
								}
							})
							.then(res => {
								uni.hideLoading();
								wx.requestPayment({
									//pay for it
									...res.data.data,
									success: res => {
										console.log('success:' + JSON.stringify(res));
										this.savePayingProductType();
										uni.navigateTo({
											url: '../pay-success/pay-success'
										});
									},
									fail: function(err) {
										console.log('fail:' + JSON.stringify(err));
										uni.showToast({
											icon: 'none',
											title: '支付失败，请稍后重试.',
											duration: 2000
										});
									}
								});
							});
					}
				});
				// #endif

				// #ifdef APP-PLUS
				this.apiUrl
					.getWeChatParams({
						data: {
							orderId: this.order.id,
							trade_type: 'APP'
						}
					})
					.then(res => {
						if (res.data.status == 1) {
							let orderInfo = res.data.data;
							console.log('orderInfo:'+JSON.stringify(orderInfo));
							orderInfo.package = 'Sign=WXPay';
							uni.requestPayment({
								provider: 'wxpay',
								orderInfo: JSON.stringify(orderInfo),
								success: res => {
									uni.hideLoading();
									console.log('success:' + JSON.stringify(res));
									this.savePayingProductType();
									uni.navigateTo({
										url: '../pay-success/pay-success'
									});
								},
								fail: function(err) {
									console.log('orderInfo:' + JSON.stringify(orderInfo));
									console.log('fail:' + JSON.stringify(err));
									uni.showToast({
										icon: 'none',
										title: '支付失败，请稍后重试.',
										duration: 2000
									});
								}
							});
						} else {
							uni.showToast({
								title: res.data.message,
								mask: false,
								icon: 'none',
								duration: 1500
							});
						}
					});
				// #endif
			} else if (this.current == 3) {
				// 余额支付
				this.showYue = !this.showYue;
			}
		}
	},
	components: {
		orderCountdown,
		uniPopup
	}
};
</script>

<style lang="less" scoped>
.bigFont {
	font-size: 46upx;
}

.payIcon {
	width: 40upx;
}

.paybtn {
	width: 600upx;
	height: 70upx;
	background: #fc4e29;
	border-radius: 35upx;
	margin: 20upx auto;
}

.pbc-top {
	text-align: center;
	position: relative;

	.close {
		position: absolute;
		right: 0;
		top: 0;
		width: 20upx;
	}
}

.input_code {
	flex: 2;
	border-radius: 10upx;
	position: relative;
	overflow: hidden;
	.appen-solt {
		padding: 0 10upx;
	}
	.last {
		border: none;
	}
}

.paybtn2 {
	width: 100%;
	background: #fc4e29;
}

.pbc-wrap {
	display: flex;
	height: 100%;
	flex-direction: column;
	justify-content: space-between;
	width: 100%;
}

.unpay {
	background: rgba(184, 184, 184, 1);
}
</style>
