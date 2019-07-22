<template>
	<view class="colTopBottom pageBg">
		<view class="" style="padding-top: 100px;">
			<view class="ps-circle flex-box">
				<view class="flex-box">
					<image src="../../../static/img/success-ticket.png" mode="widthFix"></image>
				</view>
			</view>
			<view class="tac fs30 mgb20 mgt20 title-black">
				支付成功
			</view>
		</view>

		<view class="" v-if="order" style="margin-bottom: 80px;">
			<navigator url="../unconsignment/unconsignment">
				<view class="blue-btn mgt40 primary-background" v-if="order.type==1">
					我要寄售
				</view>
			</navigator>
			<navigator url="../wholesale-list/wholesale-list">
				<view class="blue-btn mgt40 primary-background" v-if="order.type==1">
					我要自提
				</view>
			</navigator>
			<navigator :url="'../order?id='+order.id">
				<view class="blue-btn mgt40 primary-background" v-if="order.type!=1">
					查看订单
				</view>
			</navigator>

			<navigator url="/pages/index/index" open-type='switchTab' v-if="order.type!=1">
				<view class="white-btn mgt40 primary-border">
					去首页
				</view>
			</navigator>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				order: null
			};
		},
		onShow() {
			uni.setStorageSync('paySuccessToHomePage',true)
			this.getProductType();
		},
		methods: {
			getProductType() {
				this.order = uni.getStorageSync('payingOrder');
			}
		},
	}
</script>

<style lang="less" scoped>
	.ps-circle {
		>view {
			width: 150upx;
			height: 150upx;
			border-radius: 50%;
			border: 8upx solid #388ceb;
			margin-top: 40upx;

			image {
				width: 94upx;
			}
		}
	}
</style>
