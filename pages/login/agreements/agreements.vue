<template>
	<view class="pageBg">
		<view class="pd20" v-html="agreement">

		</view>
		<view class="flex-box">
			<view class="login-btn" @tap="goBack" v-if="type==1">
				同意该协议并返回注册页
			</view>
			<view class="login-btn" @tap="goBack" v-if="type==3">
				同意该协议并返回提现
			</view>
			<view class="login-btn" @tap="goBack" v-if="type==6">
				同意该协议并返回支付
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				agreement: null,
				type: 1
			};
		},
		onLoad(e) {
			this.type = e.type;
			if (this.type == 6) {
				uni.setNavigationBarTitle({
					title: '支付协议'
				});
			}
			if (this.type == 5) {
				uni.setNavigationBarTitle({
					title: '批发协议'
				});
			}
			if (this.type == 4) {
				uni.setNavigationBarTitle({
					title: '零售协议'
				});
			}
			if (this.type == 3) {
				uni.setNavigationBarTitle({
					title: '提现协议'
				});
			}
			if (this.type == 2) {
				uni.setNavigationBarTitle({
					title: '寄售协议'
				});
			}
			this.getAgreement()
		},
		methods: {
			goBack() {
				if (this.type == 1) {
					uni.setStorageSync('agreeRegister',true)
					uni.navigateBack();
				}
				if (this.type == 6) {
					uni.navigateTo({
						url: '../../order/submitOrder/submitOrder?agree=true'
					})
				}
				if (this.type == 3) {
					uni.setStorageSync('agreeWidthDraw',true)
					uni.navigateBack();
				}
			},
			getAgreement() {

				this.apiUrl.getRegisterAgreement({
						data: {
							type: this.type
						}
					})
					.then(res => {
						res.data.status == 1 ? this.agreement = res.data.data.content : ''
					})
			}
		},

	}
</script>

<style lang="less">
	.login-btn {
		width: 650upx;
		height: 80upx;
		background-image: linear-gradient(90deg,
			#53b1fa 0%,
			#388ceb 100%);
		border-radius: 40upx;
		color: white;
		line-height: 80upx;
		text-align: center;
		margin-top: 40upx;
		font-size: 36upx;
	}
</style>
