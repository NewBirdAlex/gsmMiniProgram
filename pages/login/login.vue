<template>

	<view class="login-page">
		<view class="hello">你好，</view>
		<view class="welcome">欢迎来到盖世风，马上登录</view>
		<view class="login-form">
			<view class="form-item">
				<view class="form-label">手机号</view>
				<view class="form-input">
					<input type="number" v-model="mobilePhone" placeholder="请输入手机号码" value="" />
					</view>
			</view>
			<view class="form-item">
				<view class="form-label">登录密码</view>
				<view class="form-input">
					<input type="text" :password="!showPassword" v-model="password" placeholder="请输入登录密码" value="" />
					<view class="appen-solt" @tap="showPassword=!showPassword">
						<text class="password-mode">{{showPassword? '隐藏':'显示'}}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="submit-btn" @tap="goLogin">登录</view>
		<view class="fun-btn">
			<text @tap="go(1)">快速注册</text>
			<text @tap="go(2)">忘记密码</text>
		</view>
	</view>
</template>

<script>
	import {signSecret} from '@/common/req.js'
	export default {
		data() {
			return {
				mobilePhone: '',
				password: '',
				save: true,
				fromDetail: false,
				showPassword: false
			}
		},
		methods: {

		},
		onShow() {
			uni.getStorage({
				key: 'pagefromDetail',
				success: (res) => {
					this.fromDetail = res.data; //page from product-detail
				},
				fail: () => {
					uni.setStorage({
						key: 'pagefrom',
						data: 'login' //page frome member
					})
				}
			})

		},
		destroyed() {
			uni.removeStorageSync('pagefromDetail');
		},
		methods: {
			go(index) {
				if (index == 1) {
					uni.navigateTo({
						url: 'register'
					})
				}
				if (index == 2) {
					uni.navigateTo({
						url: 'reset-psw'
					})
				}
			},
			goLogin() {
				if (!this.mobilePhone) {
					uni.showToast({
						icon: 'none',
						duration: 2000,
						title: '请输入手机号码'
					})
					return
				}
				if (!this.password) {
					uni.showToast({
						icon: 'none',
						duration: 2000,
						title: '请输入登录密码'
					})
					return
				}
				uni.showLoading({
					title:'请稍候',
					mask:true
				})
				this.apiUrl.login({
					data: {
						mobilePhone: this.mobilePhone,
						password: this.password
					}
				}).then(res => {
					uni.hideLoading();
					let message = null;
					if (res.data.status == 0) message = '手机号不存在';
					if (res.data.status == 2) message = '密码错误';
					if (res.data.status == 3) message = '会员被禁用';

					if (message) {
						uni.showToast({
							icon: 'none',
							duration: 2000,
							title: message
						})
					} else {
						uni.showToast({
							icon: 'none',
							duration: 1500,
							title: '登录成功'
						})
						uni.removeStorage({
							key: 'pagefrom'
						})
						//签名secret
						let secret = signSecret;
						uni.setStorageSync('memberSecretV2',secret)
						
						this.$store.commit('saveMember', res.data.data);
						setTimeout(() => {
							let url;
							this.fromDetail ? url = '/pages/product/product-detail?id=' + this.fromDetail : url = '/pages/member/member'
							if (this.fromDetail) {
								uni.navigateBack();
							} else {
								uni.switchTab({
									url
								})
							}
						}, 1500)
					}
				})
			}
		}
	}
</script>

<style lang="less">
	.login-page {
		padding: 0 60upx;
		margin-top: 90upx;

		.hello {
			height: 75upx;
			font-size: 54upx;
			font-weight: 500;
			color: #333333;
			line-height: 75upx;
			margin-bottom: 28upx;
		}

		.welcome {
			height: 50upx;
			font-size: 36upx;
			font-weight: 400;
			color: #333333;
			line-height: 50upx;
			margin-bottom: 20upx;
		}
	}

	.password-mode {
		font-size: 26upx;
		color: #656565;
		line-height: 60upx;
	}

	.submit-btn {
		margin-top: 60upx;
		margin-bottom: 40upx;
		height: 90upx;
		background: #FC4E29;
		border-radius: 50upx;
		line-height: 90upx;
		text-align: center;
		font-size: 36upx;
		font-weight: 400;
		color: #ffffff;
	}

	.fun-btn {
		float: right;

		text {
			display: inline-block;
			padding: 0 20upx;
			height: 37upx;
			font-size: 26upx;
			font-weight: 300;
			color: #656565;
			line-height: 37upx;
			border-right: 1px solid #E5E5E5;

			&:last-child {
				border-right: none;
			}
		}
	}

	// 	.active-circle{
	// 		background: #388ceb;
	// 		color: white;
	// 	}
	// 	.login-btn{
	// 		width: 650upx;
	// 		height: 80upx;
	// 		background-image: linear-gradient(90deg,
	// 			#53b1fa 0%,
	// 			#388ceb 100%);
	// 		border-radius: 40upx;
	// 		color: white;
	// 		line-height: 80upx;
	// 		text-align: center;
	// 		margin-top: 40upx;
	// 		font-size: 36upx;
	// 	}
	// 	.reg{
	// 		background: white;
	//
	// 		color: #388ceb;
	// 		border-radius: 40upx;
	// 		border: 1px solid #388ceb;
	// 	}
	// 	.remember{
	// 		display: flex;
	// 		justify-content:space-between;
	// 		align-items: center;
	// 		.rm-left{
	// 			display: flex;
	// 			align-items: center;
	// 		}
	// 	}
	// 	view{
	// 		line-height: 0;
	// 	}
	// 	.login-main {
	// 		.login-top {
	// 			position: relative;
	// 			background: #f4f4f4;
	//
	// 			.xlogo {
	// 				position: absolute;
	// 				left: 50%;
	// 				transform: translateX(-50%) translateY(50%);
	// 				bottom: 0;
	// 				width: 200upx;
	// 			}
	// 		}
	//
	// 		.content {
	// 			height: 500upx;
	// 			background: #f4f4f4;
	// 			// background: skyblue;
	// 			padding: 120upx 50upx 0 50upx;
	//
	// 			.phone {
	// 				height: 80upx;
	// 				background: white;
	// 				border-radius: 40upx;
	// 				display: flex;
	// 				align-items: center;
	// 				margin-bottom: 40upx;
	// 				.icon{
	// 					width: 26upx;
	// 					margin: 0 40upx;
	// 					image{
	// 						width: 100%;
	// 					}
	// 				}
	// 				.input{
	// 					flex: 2;
	// 					background: none;
	// 				}
	// 			}
	// 		}
	// 	}
</style>
