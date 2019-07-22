<template>
	<view class="register-page">
		<view class="login-form">
			<view class="form-item">
				<view class="form-label">手机号</view>
				<view class="form-input">
					<input type="number" v-model="info.mobilePhone" placeholder="请输入手机号码" value="" />
				</view>
			</view>
			<view class="form-item">
				<view class="form-label">验证码</view>
				<view class="form-input">
					<input type="text" v-model="info.imgCode" placeholder="请输入图形验证码" value="" />
					<view class="appen-solt">
						<image :src="imgCodePath" @tap="initImgCode" class="img-code"></image>
					</view>
				</view>
			</view>
			<view class="form-item">
				<view class="form-label">手机验证码</view>
				<view class="form-input">
					<input type="number" v-model="info.smsCode" placeholder="请输入手机验证码" value="" />
					<view class="appen-solt" @tap="getCode">
						<view class="smscode-btn">
							{{allowGetCode? '获取验证码':countDown+'s'}}
						</view>
					</view>
				</view>
			</view>
			<view class="form-item">
				<view class="form-label">登录密码</view>
				<view class="form-input">
					<input type="text" :password="!showPassword" v-model="info.password" placeholder="请输入登录密码" value="" />
					<view class="appen-solt" @tap="showPassword=!showPassword">
						<text class="password-mode">{{showPassword? '隐藏':'显示'}}</text>
					</view>
				</view>
			</view>
			<view class="form-item">
				<view class="form-label">支付密码</view>
				<view class="form-input">
					<input type="text" :password="!showPassword2" v-model="info.paypwd" placeholder="请输入支付密码" value="" />
					<view class="appen-solt" @tap="showPassword2=!showPassword2">
						<text class="password-mode">{{showPassword2? '隐藏':'显示'}}</text>
					</view>
				</view>
			</view>
			<view class="form-item">
				<view class="form-label">推荐人手机号/ID</view>
				<view class="form-input">
					<input type="text" v-model="info.parent" placeholder="请输入推荐人手机号/ID（非必填）" :disabled="forbid"/>
				</view>
			</view>
		</view>
		<view class="agreement">
			<view @tap="agree = !agree">
				<image v-if="agree" src="/static/img/login/treaty_box_selected@2x.png" mode="widthFix"></image>
				<image v-else src="/static/img/login/treaty_box_unselected@2x.png" mode="widthFix"></image>
				<!-- <uni-icon v-if="agree" type="checkbox-filled" color="#388ceb" size="24"></uni-icon> -->
			</view>
			<view>
				<navigator url="agreements/agreements?type=1"><text class="txt">我已阅读并同意《注册协议》</text></navigator>
			</view>
		</view>
		<view class="submit-btn" @tap="register">完成注册</view>
	</view>
</template>

<script>
	import {
		baseUrl as path,
		signSecret
	} from '@/common/req.js';
	export default {
		data() {
			return {
				info: {
					mobilePhone: '',
					smsCode: '',
					imgCode: '',
					password: '',
					confirmpsw: '',
					paypwd: '',
					confirmpaypwd: '',
					parent: '',
					openId: null,
					weChatAppId: null
				},
				imgCodePath: '',
				key: '',
				allowGetCode: true,
				countDown: 60,
				agree: true,
				showPassword: false,
				showPassword2:false,
				forbid:false
			};
		},
		onLoad(e) {
			e.agree ? (this.agree = true) : '', this.initImgCode();
			e.autoId ? (this.info.parent = e.autoId) : '';
			e.autoId ? this.forbid = true : '';
		},
		onShow(e) {
			uni.getStorage({
				key: 'agreeRegister',
				success: res => {
					this.agree = true;
					uni.removeStorageSync('agreeRegister');
				}
			});
		},
		methods: {
			register() {
				if (!this.info.mobilePhone) {
					uni.showToast({
						duration: 2000,
						icon: 'none',
						title: '请输入手机号码'
					});
					return;
				}
				if (!/^\d{11}$/.test(this.info.mobilePhone)) {
					uni.showToast({
						duration: 2000,
						icon: 'none',
						title: '请输入11位手机号码'
					});
					return;
				}
				if (!this.info.smsCode) {
					uni.showToast({
						duration: 2000,
						icon: 'none',
						title: '请输入手机验证码'
					});
					return;
				}

				if (!this.info.password || !this.info.paypwd ) {
					uni.showToast({
						duration: 1500,
						icon: 'none',
						title: '请填写完整资料'
					});
					return;
				}
				let noteStr = '';
				if (!this.checkPswString(this.info.paypwd)) noteStr = '支付密码格式错误，密码只能是6-16位数字或数字和字母的组合';
				if (!this.checkPswString(this.info.password)) noteStr = '登录密码格式错误，密码只能是6-16位数字或数字和字母的组合';
				if (noteStr) {
					uni.showToast({
						duration: 2000,
						icon: 'none',
						title: noteStr
					});
					return;
				}
				if (!this.agree) {
					uni.showToast({
						duration: 2000,
						icon: 'none',
						title: '注册需要同意注册协议'
					});
					return;
				}
				// register
				uni.showLoading({
					title:'请稍候',
					mask:true
				})
				this.apiUrl
					.submitRegister({
						data: this.info
					})
					.then(
						res => {
							uni.hideLoading();
							let str;
							if (res.data.status == 1) {
								uni.showToast({
									duration: 1500,
									icon: 'none',
									title: '注册成功'
								});

								//签名secret
								let secret = signSecret;
								uni.setStorageSync('memberSecretV2',secret)
								this.$store.commit('saveMember', res.data.data);
								setTimeout(() => {
									uni.switchTab({
										url:'../index/index'
									})
								}, 1500)
							} else {
								uni.showToast({
									duration: 1500,
									icon: 'none',
									title: res.data.message
								});
							}
						},
						err => {}
					);
			},
			getCode() {
				if (!this.allowGetCode) return;
				if (!this.info.mobilePhone) {
					uni.showToast({
						title: '请输入手机号码',
						icon: 'none',
						duration: 2000
					});
				} else if(!/^\d{11}$/.test(this.info.mobilePhone)){
					uni.showToast({
						duration: 2000,
						icon: 'none',
						title: '请输入11位手机号码'
					});
					return;
				}else if (!this.info.imgCode) {
					uni.showToast({
						title: '请输入图片验证码',
						icon: 'none',
						duration: 2000
					});
				} else {
					this.allowGetCode = false;
					this.apiUrl
						.getCode({
							data: {
								mobilePhone: this.info.mobilePhone,
								verifyCode: this.info.imgCode,
								key: this.key,
								type: 1
							}
						})
						.then(
							res => {
								if (res.data.status == 0) {
									this.allowGetCode = true;
									uni.showToast({
										duration: 2000,
										icon: 'none',
										title: '图形验证码错误'
									});
									this.initImgCode();
								}
								if (res.data.status == 1) {
									this.allowGetCode = false;
									this.timeCountdown();
									uni.showToast({
										duration: 2000,
										icon: 'none',
										title: '验证码已发送'
									});
								}
							},
							error => {}
						);
				}
			},
			timeCountdown() {
				if (!this.countDown) {
					this.countDown = 60;
					this.allowGetCode = true;
					return;
				}
				// this.countDown--;
				setTimeout(() => {
					this.countDown--;
					this.timeCountdown();
				}, 1000);
			},
			initImgCode() {
				this.key = new Date().getTime();
				this.imgCodePath = path + '/member_veryCode.action?key=' + this.key;
				this.info.imgCode = '';
			}
		}
	};
</script>

<style lang="less" scoped>
	.register-page {
		padding: 20upx 60upx;
	}

	.password-mode {
		font-size: 26upx;
		color: #656565;
		line-height: 60upx;
	}

	.img-code {
		display: block;
		height: 60upx;
		width: 150upx;
	}

	.smscode-btn {
		width: 160upx;
		border-radius: 6upx;
		border: 1px solid #656565;
		text-align: center;
		line-height: 50upx;
		font-size: 26upx;
		color: #656565;
	}

	.agreement {
		display: flex;
		align-items: center;
		margin-top: 36upx;

		image {
			display: block;
			width: 32upx;
			height: 32upx;
			margin-right: 10upx;
		}

		.txt {
			text-decoration: underline;
			color: #656565;
			font-weight: 300;
			font-size: 28upx;
		}
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

	// .border {
	// 	border: 1px solid gray;
	// 	width: 34upx;
	// 	height: 34upx;
	// 	margin-right: 20upx;
	// }
	// .reg-content {
	// 	padding: 50upx;
	// 	box-sizing: border-box;
	// 	.item {
	// 		height: 80upx;
	// 		background: white;
	// 		border-radius: 40upx;
	// 		display: flex;
	// 		align-items: center;
	// 		margin-bottom: 40upx;
	// 		.icon {
	// 			width: 26upx;
	// 			margin: 0 40upx;
	// 			image {
	// 				width: 100%;
	// 			}
	// 		}
	// 		.input {
	// 			flex: 2;
	// 			background: none;
	// 		}
	// 		.v-code {
	// 			width: 200upx;
	// 			height: 80upx;
	// 			background-color: #388ceb;
	// 			border-radius: 0px 40upx 40upx 0px;
	// 			text-align: center;
	// 			line-height: 80upx;
	// 			color: white;
	// 			&.deny {
	// 				background-color: #d3d3d3;
	// 			}
	// 		}
	// 		.img-code {
	// 			background: none;
	// 			image {
	// 				width: 160upx;
	// 			}
	// 		}
	// 	}
	// }
	// .login-btn {
	// 	width: 650upx;
	// 	height: 80upx;
	// 	background-image: linear-gradient(90deg, #53b1fa 0%, #388ceb 100%);
	// 	border-radius: 40upx;
	// 	color: white;
	// 	line-height: 80upx;
	// 	text-align: center;
	// 	margin-top: 40upx;
	// 	font-size: 36upx;
	// }
</style>
