<template>
	<view class="withdraw">
		<view class="top">
			<text class="num">{{balance.userMoney}}</text>
			<text class="txt">可提现余额(元)</text>
			<view class="to-detail flex-box" @click="cashdetail">
				提现明细
				<uni-icon type="arrowright" color='white' size='24'></uni-icon>
			</view>
		</view>
		<view class="center">
			<view class="price"><input placeholder="请输入提现金额" @input="checkMoney" type="number" v-model="withdrawalAmount" /></view>
			<view class="note" v-if="withdrawalAmount">提现手续费<text class="mgl20 mgr20">{{servicePrice}}元</text> 24小时内到账</view>
			<view class="note" v-else>提现手续费<text class="mgl20 mgr20">{{balance.serviceCharge*100+'%'}}  </text> 24小时内到账</view>
		</view>
		<view class="drawForm">
			<view class="drawInput">
				<view class="section">
					<view class="title">选择银行</view>
					<view class="" style="flex: 2;" @tap="chooseBank">
						<view class="" v-if="bank">
							<text v-if="bank.type==2">支付宝</text>
							<text v-else>{{bank.bankName||bank.depositBank}}</text>
							<text>(尾号 {{bank.lastNum}})</text>
						</view>
						<view class="betweenBox pdr20" v-else>
							<text class=" fs32" style="color:rgb(134,134,130)">请选择银行</text>
							<uni-icon type="arrowright" size='20'></uni-icon>
						</view>
					</view>
				</view>
				<view class="section">
					<view class="title">支付密码</view>
					<view class="flex-box" style="flex:2;">
						<input class="fs32" style="flex:2;" placeholder="请输入支付密码" :password="!showPassword" type="text" v-model="payPassword" />
						<text class="password-mode" @tap="showPassword=!showPassword">{{showPassword? '隐藏':'显示'}}</text>
					</view>
				</view>
				<!-- 	<view class="pd20 tac betweenBox">
					<view class="flex-box">
						<view class="def-circle border flex-box mgr20" @tap="agree = !agree">
							<uni-icon v-if='agree' type="checkbox-filled" color="#388ceb " size='24'></uni-icon>
						</view>
						<navigator url="../../login/agreements/agreements?type=3">
							<text class="blue fs24 underline">我已阅读并同意《盖世风提现协议》</text>
						</navigator>
					</view>
				</view> -->
			</view>
		</view>
		<view class="drawSubmit">
			<button class="mgt20" @tap="formSubmit">申请提交</button>
		</view>
	</view>
</template>
<script>
	import math from '../../../common/math.js'
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		data() {
			return {
				withdrawalAmount: '',
				bankName: '',
				accountNo: '',
				accountName: '',
				payPassword: '',
				serviceCharge: '',
				balance: {},
				agree: true,
				index: 0,
				showNote: true,
				bank: null,
				showPassword:false,
				allowRequest:true
			}
		},
		computed: {
			...mapState([
				'memberInfo'
			]),
			servicePrice(vm) {
				return vm.withdrawalAmount * vm.balance.serviceCharge
			}
		},
		destroyed() {
			uni.removeStorage({
				key: 'pickBank'
			})
		},
		onLoad(e) {
			this.getMoney();
		},
		onShow() {
			uni.getStorage({
				key: 'agreeWidthDraw',
				success(res) {
					this.agree = true;
					uni.removeStorageSync('agreeWidthDraw')
				}
			})
			uni.getStorage({
				key: 'pickBank',
				success: (res) => {
					let len = res.data.cartNO.length;
					res.data.lastNum = res.data.cartNO.slice(len - 4);
					console.log(res.data.lastNum)
					this.bank = res.data;
				}
			})
		},
		methods: {
			checkMoney() {
				if (this.withdrawalAmount > this.balance.userMoney) {
					uni.showToast({
						title: '提现金额超出余额',
						mask: false,
						icon: 'none',
						duration: 1500
					});
					this.withdrawalAmount = this.balance.userMoney;
				}
			},
			chooseBank() {
				uni.navigateTo({
					url: '../bank/choose-bank'
				})
			},
			getMoney(data) {
				this.apiUrl.getLeftMoney({
					data: {
						memberId: this.memberInfo.id
					}
				}).then(res => {
					console.log('getLeftMoney', res)
					if (res.data.status == 1) {
						this.serviceCharge = res.data.data.serviceCharge
						this.balance = res.data.data
					}
				})
			},
			drawinput(e) {
				console.log(e)
				if (e.target.id == "amount") {
					this.amount = e.detail.value;
				}
			},
			formSubmit(e) {
				if(!this.allowRequest) return
				if (this.withdrawalAmount <= 0) {
					uni.showToast({
						title: '提现金额必须大于0元',
						icon: 'none',
						mask: false,
						duration: 1500
					});
					return;
				}
				if (!this.payPassword) {
					uni.showToast({
						title: '请输入支付密码',
						icon: 'none',
						mask: false,
						duration: 1500
					});
					return;
				}
				let data = {
					bankId:this.bank.id,
					payPassword: this.payPassword,
					withdrawalAmount: this.withdrawalAmount,
					serviceCharge: this.serviceCharge
				}
				uni.showLoading({
					title:'请稍候',
					mask:true
				})
				this.allowRequest = false;
				this.apiUrl.applyWidthDraw({
					data
				}).then(res => {
					this.allowRequest = true;
					uni.hideLoading();
					if (res.data.status == 1) {
						uni.showToast({
							title: '您的提现申请已提交成功，工作人员将尽快处理',
							icon: 'none',
							mask: false,
							duration: 1500
						});
						setTimeout(function() {
							uni.navigateBack()
						}, 1500)
					}
				})
			},
			cashdetail() {
				uni.navigateTo({
					url: '/pages/member/account/cashdetail'
				})
			}
		},
	}
</script>
<style lang='less' scoped>
	.fs32{font-size: 32upx;}
	.withdraw {
		.top {
			position: relative;
			height: 400upx;
			background: linear-gradient(314deg, rgba(247, 183, 39, 1) 0%, rgba(255, 138, 62, 1) 100%);
			color: #fff;

			.num {
				padding-top: 100upx;
				display: block;
				text-align: center;
				height: 100upx;
				font-size: 70upx;
				font-family: PingFangSC-Semibold;
				font-weight: 600;
				color: rgba(255, 255, 255, 1);
				line-height: 100upx;
			}

			.txt {
				display: block;
				text-align: center;
				height: 40upx;
				font-size: 28upx;
				font-family: PingFangSC-Light;
				font-weight: 300;
				color: rgba(255, 255, 255, 1);
				line-height: 40upx;
				opacity: 0.7;
			}

			.to-detail {
				position: absolute;
				top: 20upx;
				right: 30upx;
				height: 45upx;
				font-size: 32upx;
				font-family: PingFangSC-Regular;
				font-weight: 400;
				color: rgba(255, 255, 255, 1);
				line-height: 45upx;
			}
		}

		.center {
			position: relative;
			z-index: 1;
			margin: -100upx auto 0;
			width: 690upx;
			height: 260upx;
			background: rgba(255, 255, 255, 1);
			box-shadow: 0 20upx 32upx 0upx rgba(238, 238, 238, 1);
			border-radius: 10upx;
			text-align: center;

			.price {
				padding: 65upx 0 45upx;
				width: 610upx;
				margin: 0 40upx;
				border-bottom: 1px solid #E5E5E5;

				input {
					height: 50upx;
					font-size: 40upx;
					font-family: PingFangSC-Medium;
					font-weight: 500;
					color: rgba(51, 51, 51, 1);
					line-height: 50upx;
				}
			}

			.note {
				margin-top: 20upx;
				height: 37upx;
				font-size: 26upx;
				font-family: PingFangSC-Regular;
				font-weight: 400;
				color: rgba(153, 153, 153, 1);
				line-height: 37upx;

				text {
					color: #FF5954;
				}
			}
		}

		.drawForm {
			margin-top: 60upx;
			width: 100%;

			form {
				display: flex;
				width: 100%;
				justify-content: center;
			}

			.drawInput {
				background-color: white;
				width: 750upx;
				padding-left: 40upx;
				padding-right: 40upx;
				box-sizing: border-box;

				.section {
					display: flex;
					flex-direction: row;
					width: 100%;
					height: 120upx;
					border-bottom: solid 1upx #dfdfdf;
					align-items: center;

					.title {
						width: 240upx;
						box-sizing: border-box;
						padding-left: 15upx;
						font-size: 32upx;
						font-family: PingFangSC-Regular;
						font-weight: 400;
						color: rgba(51, 51, 51, 1);
					}

					.fs32 {
						font-size: 32upx;
						font-family: PingFangSC-Light;
						font-weight: 300;
					}
				}
			}
		}

		.drawSubmit {
			margin-top: 120upx;
			width: 100%;

			button {
				width: 670upx;
				height: 90upx;
				line-height: 90upx;
				background: rgba(252, 78, 41, 1);
				border-radius: 50upx;
				font-size: 36upx;
				font-family: PingFangSC-Regular;
				font-weight: 400;
				color: rgba(255, 255, 255, 1);
			}
		}
	}


	/* .drawContent {
		background-color: #f5f5f5;
		height: 100%;
		width: 100%;
		position: fixed;
		display: flex;
		flex-direction: column;
		.header {
			height: 180upx;
			width: 100%;
			background:linear-gradient(90deg,rgba(83,177,250,1) 0%,rgba(56,140,235,1) 100%);
			display: flex;
			flex-direction: column;
			justify-content: center;
			view {
				padding: 0 32upx;
				line-height: 1.4;
				text {
					color: #fefefe;
					padding: 0 18upx;
				}
				.smText {
					font-size: 28upx;
				}
				.mdText {
					font-size: 60upx;
				}
				.opacity8 {
					opacity: 0.8;
				}
			}


		}

		.drawForm {
			width: 100%;
			form {
				display: flex;
				width: 100%;
				justify-content: center;
			}
			.drawInput {
				background-color: white;
				width: 750upx;
				padding-left: 25upx;
				box-sizing: border-box;

				.section {
					display: flex;
					flex-direction: row;
					width: 100%;
					height: 90upx;
					border-top: solid 1upx #dfdfdf;
					align-items: center;

					.title {
						width: 240upx;
						box-sizing: border-box;
						padding-left: 15upx;
					}
				}
			}


		}
	}
	.drawSubmit {
		position: absolute;
		left: 0;
		bottom: 200upx;
		width: 100%;
		text {
			display: flex;
			justify-content: center;
			color: #388ceb;
		}
		button {
			width: 600upx;
			height: 80upx;
			line-height: 80upx;
			background-image: linear-gradient(90deg,
				#53b1fa 0%,
				#388ceb 100%);
			border-radius: 40px;
			font-size: 30upx;
			color: #ffffff;
		}
	} */
</style>
