<template>
	<view>
		<view class="coupons-card">
			<view class="txt">现有批发券</view>
			<view class="num">
				{{ memberInfo.frozenMoney }}
				<text class="unit">张</text>
			</view>
			<view class="translate" v-if="systemInfo.frozenMoneyTransfer && systemInfo.frozenMoneyTransfer == 'true'">
				<view class="tar"><image src="/static/img/translate.png" mode="widthFix" class="" @tap="showTranslate = !showTranslate"></image></view>
				<view class="op_wrap" v-if="showTranslate" @tap="showTranslate = !showTranslate">
					<view class="background-white">
						<navigator url="couponsTranslate"><view class="pd20 bdb">批发券互转</view></navigator>
						<navigator url="couponsTranslateLilst"><view class="pd20 bdb">互转明细</view></navigator>
					</view>
				</view>
			</view>
		</view>
		<view class="coupons-list">
			<no-data v-if="!list.length"></no-data>
			<view v-for="(item, index) in list" :key="item.id" class="list-item">
				<view class="mb">
					<text class="right num">{{ item.opreate == 1 ? '+' : '-' }}{{ item.num }}</text>
					<text class="title">{{ item.remarks }}</text>
				</view>
				<view>
					<text class="right total">剩余批发券{{ item.afterNum }}张</text>
					<text class="time">{{ item.createDate }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import myMixin from '../../../common/myMixin.js';
import noData from '@/components/no-data';

export default {
	data() {
		return {
			list: [],
			current: 1,
			isPage: 1,
			showTranslate: false,
			allowRequest: true
		};
	},
	mixins: [myMixin],
	computed: mapState([
		'memberInfo',
		'systemInfo'
	]),
	onLoad() {
		this.getList();
	},
	onShow() {
		this.current = 1;
		this.list = [];
		this.getList();
	},
	onPullDownRefresh() {
		this.current = 1;
		this.list = [];
		
		setTimeout(() => {
			this.getList();
		}, 100);
		setTimeout(() => {
			uni.stopPullDownRefresh();
		}, 1000);
	},
	onReachBottom() {
		this.getList();
	},
	components: {
		noData
	},
	methods: {
		getList() {
			if (this.current > this.isPage) return;
			if(!this.allowRequest) return;
			this.allowRequest = false;
			this.apiUrl
				.getIntegrallogList({
					data: {
						current: this.current
					}
				})
				.then(res => {
					this.allowRequest = true;

					if (this.current == 1) {
						this.isPage = res.data.data.pages;
					}
					if (res.data.status == 1 && res.data.data.pageList.length) {
						let arr = res.data.data.pageList;
						arr.forEach(item => (item.createDate = this.format(item.createDate)));
						this.list = this.list.concat(res.data.data.pageList);
						this.current++;
					}
				});
		}
	}
};
</script>

<style lang="less">
.coupons-card {
	margin: 30upx auto 0;
	width: 690upx;
	height: 246upx;
	background: linear-gradient(314deg, rgba(247, 183, 39, 1) 0%, rgba(255, 138, 62, 1) 100%);
	box-shadow: 0 11upx 43upx -13upx rgba(250, 201, 120, 1);
	border-radius: 20upx;
	text-align: center;
	position: relative;
	z-index: 1;

	.txt {
		padding-top: 60upx;
		font-size: 26upx;
		font-family: PingFangSC-Light;
		font-weight: 300;
		color: rgba(255, 255, 255, 1);
		margin-bottom: 14upx;
		line-height: 38upx;
	}

	.num {
		font-size: 54upx;
		font-family: PingFangSC-Semibold;
		font-weight: 600;
		color: rgba(255, 255, 255, 1);
		line-height: 76upx;
	}

	.unit {
		padding-left: 20upx;
		font-size: 30upx;
		font-family: PingFangSC-Regular;
		font-weight: 400;
		color: rgba(255, 255, 255, 1);
	}
}

.coupons-list {
	margin: -40upx auto 0;
	width: 650upx;
	background: rgba(255, 255, 255, 1);
	box-shadow: 0 6upx 14upx 0 rgba(224, 224, 224, 0.5);
	border-radius: 20upx;
	padding: 100upx 20upx 20upx;

	.list-item {
		padding-top: 40upx;
		padding-bottom: 30upx;
		border-bottom: 1px solid #e5e5e5;

		&:last-child {
			border-bottom: none;
		}

		.right {
			float: right;
		}

		.title {
			height: 40upx;
			font-size: 30upx;
			font-family: PingFangSC-Regular;
			font-weight: 400;
			color: rgba(51, 51, 51, 1);
			line-height: 40upx;
			color: #333333;
		}

		.time {
			height: 33upx;
			font-size: 24upx;
			font-family: PingFangSC-Regular;
			font-weight: 400;
			color: rgba(101, 101, 101, 1);
			line-height: 33upx;
			color: #656565;
		}

		.num {
			height: 40upx;
			font-size: 36upx;
			font-family: PingFangSC-Semibold;
			font-weight: 600;
			color: rgba(51, 51, 51, 1);
			line-height: 40upx;
			color: #333333;
		}

		.total {
			color: #999999;
			height: 33upx;
			font-size: 24upx;
			font-family: PingFangSC-Regular;
			font-weight: 400;
			color: rgba(153, 153, 153, 1);
			line-height: 33upx;
		}

		.mb {
			margin-bottom: 10upx;
		}
	}
}
.translate {
	position: absolute;
	right: 10upx;
	top: 10upx;
	left: auto;
	z-index: 10;
	image {
		width: 60upx;
		height: 60upx;
	}
	.op_wrap {
		position: fixed;
		left: 0;
		width: 100vw;
		height: 90vh;
		> view {
			margin-right: 20upx;
			float: right;
		}
	}
}
</style>
