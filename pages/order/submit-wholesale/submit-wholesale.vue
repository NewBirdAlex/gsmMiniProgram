<template>
	<view class="pageBg">
		<view class="background-white">
			<navigator url="/pages/addressManage/addressManage"><address-using :arrow="true"></address-using></navigator>
		</view>
		<view class="pd20 sc-top background-white">
			<view class=""><image :src="product.appProductOrderList[0].imageUrl" mode="widthFix"></image></view>
			<view class="mgl20 fs30 zhedie">{{ product.appProductOrderList[0].productName }}</view>
		</view>
		<view class="background-white">
			<view class="mgt20 blue fs30 pd20 background-white bdb">
				<text>提货信息</text>
				<text class="fs24">（可提货量{{ product.appProductOrderList[0].mayAmout }}）</text>
			</view>
			<view class="mgl20 pd20 background-white flex bdb fs30">
				<view class="w200">提货数量</view>
				<input type="number" placeholder="请输入提货数量" v-model="num" @blur="fixedNum" />
			</view>
			<view class="mgl20 pd20 background-white flex">
				<view class="w200">支付密码</view>
				<view class="flex-box" style="flex:2;">
					<input type="text" style="flex:2;" :password="!showPassword" class="fs30" placeholder="请输入支付密码" v-model="code" />
					<text class="password-mode" @tap="showPassword=!showPassword">{{showPassword? '隐藏':'显示'}}</text>
				</view>
			</view>
		</view>
		<view class="blue-btn mgt40 primary-background" @tap="submit">提货</view>
		<agree-pop :type="5"></agree-pop>
	</view>
</template>

<script>
import agreePop from '@/components/agreement-pop.vue';

import addressUsing from '@/components/address-using.vue';
import { mapState, mapMutations } from 'vuex';

export default {
	data() {
		return {
			index: null,
			package: ['258套餐', '358套餐', '458套餐', '558套餐', '658套餐'],
			num: '',
			code: '',
			product: null,
			showPassword:false,
			allowRquest:true
		};
	},
	computed: mapState(['activeAddress']),
	components: {
		addressUsing,
		agreePop
	},
	onLoad(e) {
		uni.getStorage({
			key: 'jsProduct',
			success: res => {
				this.product = res.data;
			}
		});
	},
	methods: {
		fixedNum(evt) {
			console.log(evt);
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
					title: '可寄售数量只有 ' + this.product.appProductOrderList[0].mayAmout,
					mask: false,
					icon: 'none',
					duration: 1500
				});
			}
		},
		changepackage(e) {
			this.index = e.target.value;
		},
		submit() {
			let str;
			!this.code ? (str = '请输入支付密码') : '';
			!this.num ? (str = '请输入提货数量') : '';
			if (str) {
				uni.showToast({
					title: str,
					mask: false,
					icon: 'none',
					duration: 1500
				});
				return;
			}
			if (!this.activeAddress) {
				uni.showToast({
					title: '请选择收货地址',
					mask: false,
					duration: 1500
				});
				return;
			}
			if(!this.allowRquest) return
			this.allowRquest = false;
			let data = {
				num: this.num,
				orderId: this.product.id,
				paypwd: this.code,
				type: 2, //1-寄售，2提货
				address: this.activeAddress.address,
				city: this.activeAddress.city,
				consignee: this.activeAddress.consignee,
				district: this.activeAddress.district,
				mobile: this.activeAddress.mobile,
				province: this.activeAddress.province
			};
			uni.showLoading({
				title:'请稍候',
				mask:true
			})
			this.apiUrl
				.consignProduct({
					data
				})
				.then(res => {
					uni.hideLoading();
					this.allowRquest = true;
					if (res.data.status == 1) {
						uni.showToast({
							title: '提交成功',
							duration: 2000,
							icon: 'success'
						});
						setTimeout(function() {
							console.log(22222);
							uni.navigateBack({
								delta: 2
							});
						}, 1000);
					}
				});
		}
	}
};
</script>

<style lang="less" scoped>
.zhedie {
	height: 80upx;
}
.sc-top {
	display: flex;
	image {
		width: 120upx;
	}
	> view {
		line-height: 40upx;
	}
}
</style>
