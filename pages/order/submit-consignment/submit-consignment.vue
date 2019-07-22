<template>
	<view class="pageBg" v-if="product" style="background: #fff;">
		<view class="sc-top">
			<view class="">
				<image :src="product.appProductOrderList[0].imageUrl" mode="widthFix"></image>
			</view>
			<view class="mgl20 zhedie">
				{{product.appProductOrderList[0].productName}}
			</view>
		</view>
		<view class="w670">
			<view class="mt70mb30">
				<text class="sale-title">出售信息</text>
				<text class="sale-number">（可出售量{{product.appProductOrderList[0].mayAmout}}）</text>
			</view>
			<view class="flex form-item">
				<view class="w200">
					出售套餐
				</view>
				<view class="">
					<picker mode="selector" :range="package" @change="changepackage" v-if="false">
						<text v-if="!index" class="gray">请选择出售套餐</text>
						<text v-else>{{package[index]}}</text>
					</picker>
					{{product.appProductOrderList[0].productModelName}}
				</view>
			</view>
			<view class="form-item flex">
				<view class="w200">
					出售价格(元)
				</view>
				<text class="yellow">{{product.appProductOrderList[0].retailPrice}}</text>
			</view>
			<view class="form-item flex">
				<view class="w200">
					出售数量
				</view>
				<input style="flex: 2;" type="number" placeholder="请输入出售数量" v-model="num" @blur='fixedNum' />
			</view>
			<view class="agreement ">
				<view @tap="agree = !agree">
					<image v-if="agree" src="/static/img/login/treaty_box_selected@2x.png" mode="widthFix"></image>
					<image v-else src="/static/img/login/treaty_box_unselected@2x.png" mode="widthFix"></image>
					<!-- <uni-icon v-if="agree" type="checkbox-filled" color="#388ceb" size="24"></uni-icon> -->
				</view>
				<view>
					<navigator url="/pages/login/agreements/agreements?type=2"><text class="txt">我已阅读并同意《寄售协议》</text></navigator>
				</view>
			</view>
			<!-- <view class="form-item flex">
				<view class="w200">
					支付密码
				</view>
				<view class="flex-box" style="flex:2;">
					<input type="text" :password="!showPassword" placeholder="请输入支付密码" v-model="code" />
					<text class="password-mode" @tap="showPassword=!showPassword">{{showPassword? '隐藏':'显示'}}</text>
				</view>
			</view> -->
		</view>
		<view class="submit-btn" @tap="submit">
			寄售
		</view>
		<!-- <agree-pop :type="2"></agree-pop> -->
	</view>
</template>
<script>
	import agreePop from '@/components/agreement-pop.vue'
	export default {
		data() {
			return {
				big: true,
				index: null,
				package: [
					'258套餐',
					'358套餐',
					'458套餐',
					'558套餐',
					'658套餐'
				],
				num: 0,
				code: '',
				product: null,
				showAgreement: true,
				showPassword:false,
				allowRquest:true,
				agree:true
			};
		},
		components: {
			agreePop
		},
		onLoad(e) {
			uni.getStorage({
				key: 'jsProduct',
				success: (res) => {
					this.product = res.data;
					this.num = this.product.appProductOrderList[0].mayAmout;
				}
			})
			this.initAgreement();
		},
		methods: {
			fixedNum(evt) {
				console.log(evt)
				if (evt.detail.value == 0) {
					this.num = 1;
					uni.showToast({
						title: '寄售数量至少为 1',
						mask: false,
						icon: 'none',
						duration: 1500
					});
				}
				if (evt.detail.value > this.product.appProductOrderList[0].mayAmout) {
					this.num = this.product.appProductOrderList[0].mayAmout;
					uni.showToast({
						title: '可寄售数量只有 ' + this.num,
						mask: false,
						icon: 'none',
						duration: 1500
					});
				}
			},
			initAgreement() {
				uni.getStorage({
					key: 'consigmentAgreement',
					success: () => {
						this.showAgreement = false;
					},
					fail: () => {
						this.showAgreement = true;
					}
				})
			},
			makeDeal() {
				uni.setStorage({
					key: 'consigmentAgreement',
					data: true,
					success: () => {
						this.showAgreement = false;
					}
				})
			},
			goBack() {
				uni.navigateBack()
			},
			changepackage(e) {
				this.index = e.target.value
			},
			submit() {
				if (!this.num ) {
					uni.showToast({
						title: '请填写相关寄售资料',
						mask: false,
						icon: 'none',
						duration: 1500
					});
					return
				}
				
				if(!this.agree){
					uni.showToast({
						title: '购买该商品需要同意购买协议，请勾选',
						duration: 1500,
						icon: 'none'
					});
					return;
				}
				
				if(!this.allowRquest) return
				this.allowRquest = false;
				let data = {
					num: this.num,
					orderId: this.product.id,
					// paypwd: this.code,
					type: 1 //1-寄售，2提货
				}
				uni.showLoading({
					title:'请稍候',
					mask:true
				})
				this.apiUrl.consignProduct({
					data
				}).then(res => {
					this.allowRquest = true;
					uni.hideLoading();
					if (res.data.status == 1) {
						uni.showToast({
							title: '提交成功',
							duration: 2000,
							icon: 'success'
						})
						setTimeout(function() {
							console.log(22222);
							uni.navigateBack({
								delta: 2
							});
						}, 1000)
					}
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.zhedie {
		height: 80upx;
	}

	.mt70mb30 {
		margin-top: 70upx;
		margin-bottom: 30upx;
	}

	.sc-top {
		display: flex;
		padding: 30upx;
		width: 630upx;
		height: 150upx;
		background: rgba(255, 255, 255, 1);
		box-shadow: 0px 10upx 29upx 0px rgba(235, 235, 235, 1);
		border-radius: 20upx;
		margin: 25upx auto;

		image {
			width: 150upx;
			border-radius: 8upx;
			border: 1px solid rgba(245, 245, 245, 1)
		}

		>view {
			font-size: 28upx;
			font-family: PingFangSC-Regular;
			font-weight: 400;
			color: rgba(0, 0, 0, 1);
			line-height: 40upx;
		}
	}

	.w670 {
		width: 670upx;
		margin: 0 auto;
	}

	.form-item {
		align-items: center;
		line-height: 46upx;
		padding: 37upx 0;
		border-bottom: 1px solid #E5E5E5;
		color: #333333;
		font-size: 32upx;

		.input-placeholder {
			color: rgba(194, 194, 194, 1);
		}
	}

	.sale-title {
		color: #333333;
		font-size: 36upx;
	}

	.sale-number {
		color: #999999;
		font-size: 26upx;
	}

	.submit-btn {
		text-align: center;
		color: #fff;
		line-height: 90upx;
		margin: 50upx auto 100upx;
		width: 670upx;
		height: 90upx;
		background: #F9531A;
		border-radius: 50upx;
		font-size: 36upx;
	}

	// 	.pp-wrap {
	// 		height: 100%;
	//
	// 		.content {
	// 			height: 80%;
	// 			overflow-y: scroll;
	// 			border: 1px solid rgba(147, 147, 147, 1);
	// 			border-radius: 10upx;
	// 		}
	//
	// 		.btns {
	// 			.btn {
	// 				width: 300upx;
	// 				height: 70upx;
	// 				background: rgba(255, 255, 255, 1);
	// 				border: 2upx solid rgba(56, 140, 235, 1);
	// 				border-radius: 35upx;
	//
	// 				&:last-child {
	// 					background: rgba(61, 147, 245, 1);
	// 					color: white;
	// 				}
	// 			}
	// 		}
	// 	}
	//
</style>
