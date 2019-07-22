<template>
	<view class="pageBg">
		<view class="pdl20 pdr20 background-white" v-if="detail">
			<view class="betweenBox pd20 bdb fs30">
				<text class="gray" >提现状态</text>
				<text class="primary-color " v-if="detail.status==1">申请中</text>
				<text class="green" v-if="detail.status==2">已通过</text>
				<text class="red " v-if="detail.status==3">已拒绝</text>
			</view>
			<view class="betweenBox pd20 bdb fs30" v-if="detail.status==3">
				<text class="gray reject">拒绝原因</text>
				<text class="red">{{detail.remark}}</text>
			</view>
			<view class="betweenBox pd20 bdb fs30">
				<text class="gray">开户银行</text>
				<text class="">{{detail.bankName}}</text>
			</view>
			<view class="betweenBox pd20 bdb fs30">
				<text class="gray">开户姓名</text>
				<text class="">{{detail.accountName}}</text>
			</view>
			<view class="betweenBox pd20 bdb fs30">
				<text class="gray">提现金额（元）</text>
				<text class="">{{detail.applyAmount}}</text>
			</view>
			<view class="betweenBox pd20 bdb fs30">
				<text class="gray">提现手续费（元）</text>
				<text class="">{{detail.serviceCharge}}</text>
			</view>
			<view class="betweenBox pd20 bdb fs30">
				<text class="gray">实际到账（元）</text>
				<text class="">{{detail.applyAmount-detail.serviceCharge}}</text>
			</view>
			<view class="betweenBox pd20  fs30">
				<text class="gray">提现时间</text>
				<text class="">{{detail.applyTime}}</text>
			</view>
			
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				detail:null
			};
		},
		onLoad(e) {
			this.getDetail(e.id)
		},
		methods: {
			getDetail(id) {
				this.apiUrl.getWidthDrawDetail({data:{
					id
				}}).then(res=>{
					if(res.data.status ==1){
						this.detail = res.data.data;
						this.detail.applyTime = this.format(this.detail.applyTime);
					}
				})
			}
		},
	}
</script>

<style lang="less" scoped>
.reject{
	width: 300upx;
}
</style>
