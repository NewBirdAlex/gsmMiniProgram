<template>
	<view class="balance pageBg" style="background: #F9F9F9;">
		<view class="balance-top">
			<view class="balance-top-bg"></view>
			<view class="balance-card">
				<view class="card-top">
					<image v-if="staticImgResource" :src="staticImgResource + 'common/balanceHeader.png'" class="card-top-bg"></image>
					<view class="card-top-content">
						<view class="price">
							<text class="txt">账户余额(元)</text>
							<text class="num">{{ balance.userMoney }}</text>
						</view>
						<view class="price-detail">
							<view>
								<text class="txt">可提现余额</text>
								<text class="num">{{ balance.userMoney }}</text>
							</view>
							<view>
								<text class="txt">冻结余额</text>
								<text class="num">{{ balance.congealMoney }}</text>
							</view>
						</view>
					</view>
				</view>
				<view class="card-bottom">
					<view class="card-bottom-btn betweenBox" @tap="withdraw()">
						<text>我要提现</text>
						<uni-icon class="icon-right" type="arrowright" size="20"></uni-icon>
					</view>
					<view class="card-bottom-btn betweenBox" @tap="cashdetail()">
						<text>提现明细</text>
						<uni-icon class="icon-right" type="arrowright" size="20"></uni-icon>
					</view>
					<view class="line"></view>
				</view>

				<view class="translate " v-if="systemInfo.userMoneyTransfer && systemInfo.userMoneyTransfer == 'true'">
					<view class="tar"><image src="/static/img/translate.png" mode="widthFix" class="" @tap="showTranslate = !showTranslate"></image></view>
					<view class="op_wrap" v-if="showTranslate" @tap="showTranslate = !showTranslate">
						<view class="background-white">
							<navigator url="yueTranlate"><view class="pd20 bdb">余额互转</view></navigator>
							<navigator url="translateList"><view class="pd20 bdb">互转明细</view></navigator>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="balance-list">
			<view class="list-title">
				<text>收入明细记录</text>
				<view class="more">
					<navigator url="income-list">
						<text>更多</text>
						<uni-icon style="position: relative;top: -2upx;" type="arrowright" size="16"></uni-icon>
					</navigator>
				</view>
			</view>
			<view class="list-content">
				<view class="list-item" v-for="(item, key) in incomeList" :key="key">
					<view>
						<text class="right num">{{ item.operate==1 ? '+' : '-' }}{{ item.num }}</text>
						<text class="title">{{ item.remarks }}</text>
					</view>
					<!-- v-if="item.remark" -->
					<view class="time" style="padding: 4px 0;height: auto;" v-if="item.reason">
						原因：{{item.reason}}
					</view>
					<view>
						<!-- <text class="right">充值成功</text> -->
						<text class="time">{{ item.createDate }}</text>
					</view>
				</view>
				<no-data v-if="incomeList && !incomeList.length"></no-data>
			</view>
		</view>
	</view>
</template>

<script>
import utils from '@/common/utils.js';
import { staticImgResource } from '@/common/req.js';
import { mapState, mapMutations } from 'vuex';
import noData from '@/components/no-data';

export default {
	data() {
		return {
			balance: '',
			mask: false,
			incomeList: false,
			staticImgResource: staticImgResource,
			showTranslate: false
		};
	},
	computed: mapState([
		'memberInfo',
		'systemInfo',
	]),
	onShow() {
		this.incomeList = [];
		this.getIncomeList();
		this.getMoney();
	},
	onPullDownRefresh() {
		this.current = 1;
		this.incomeList = false;

		setTimeout(() => {
			this.getIncomeList();
			this.getMoney();
		}, 10);
		setTimeout(() => {
			uni.stopPullDownRefresh();
		}, 1000);
	},
	onLoad() {
		
	},
	components: {
		noData
	},
	methods: {
		getMoney(data) {
			console.log(this.memberInfo);
			this.apiUrl
				.getLeftMoney({
					data: {
						memberId: this.memberInfo.id
					}
				})
				.then(res => {
					if (res.data.status == 1) {
						this.balance = res.data.data;
					}
				});
		},
		froozentip() {
			this.mask = !this.mask;
		},
		withdraw(param) {
			let query = param ? utils.parseurl(param) : '';
			uni.navigateTo({
				url: '/pages/member/account/withdraw' + query
			});
		},
		getIncomeList() {
			this.apiUrl
				.getIncomeList({
					data: {
						current: 1
					}
				})
				.then(res => {
					if (res.data.status == 1) {
						let arr = res.data.data.pageList;
						arr.forEach(item => {
							item.createDate = this.format(item.createDate);
						});
						this.incomeList = (this.incomeList || []).concat(arr);
					}
				});
		},
		cashdetail(param) {
			let query = param ? utils.parseurl(param) : '';
			uni.navigateTo({
				url: '/pages/member/account/cashdetail'
			});
		}
	}
};
</script>
<style lang="less" scoped>
.balance {
	width: 750upx;
	margin: 0 auto;

	.balance-top {
		margin-bottom: 70upx;

		.balance-top-bg {
			position: absolute;
			left: 0;
			top: 0;
			width: 750upx;
			height: 328upx;
			background: rgba(43, 35, 59, 1);
			border-radius: 0 0 100upx 100upx;
		}

		.balance-card {
			width: 690upx;
			margin: 0 auto;

			.card-top {
				height: 390upx;
				padding-top: 40upx;
				position: relative;
				z-index: 10;

				.card-top-bg {
					position: absolute;
					display: block;
					width: 690upx;
					height: 390upx;
				}

				.card-top-content {
					position: relative;
					z-index: 1;
					padding: 50upx;

					.price {
						margin-bottom: 60upx;

						.txt {
							display: block;
							font-size: 28upx;
							font-family: PingFangSC-Regular;
							font-weight: 400;
							color: rgba(111, 63, 47, 1);
							line-height: 40upx;
							height: 40upx;
							opacity: 0.8;
							margin-bottom: 8upx;
						}

						.num {
							font-size: 70upx;
							font-family: PingFangSC-Semibold;
							font-weight: 600;
							color: rgba(111, 63, 47, 1);
							line-height: 90upx;
							height: 90upx;
							display: block;
						}
					}

					.price-detail {
						> view {
							float: left;
							width: 50%;
						}

						.txt {
							font-size: 24upx;
							font-family: PingFangSC-Regular;
							font-weight: 400;
							color: rgba(111, 63, 47, 1);
							line-height: 33upx;
							height: 33upx;
							opacity: 0.67;
							display: block;
							margin-bottom: 20upx;
						}

						.num {
							display: block;
							font-size: 40upx;
							font-family: PingFangSC-Regular;
							font-weight: 400;
							color: rgba(111, 63, 47, 1);
							line-height: 40upx;
							height: 40upx;
						}
					}
				}
			}

			.card-bottom {
				margin-top: -46upx;
				padding-top: 80upx;
				height: 76upx;
				background: rgba(255, 255, 255, 1);
				box-shadow: 0 6upx 14upx 0 rgba(224, 224, 224, 0.5);
				border-radius: 20upx;
				position: relative;

				.line {
					width: 2upx;
					height: 135upx;
					position: absolute;
					left: 345upx;
					bottom: 0;
					background: #ededed;
				}

				.card-bottom-btn {
					width: 264upx;
					float: left;
					padding-left: 50upx;
					padding-right: 30upx;

					text {
						height: 44upx;
						font-size: 30upx;
						font-family: PingFangSC-Regular;
						font-weight: 400;
						color: rgba(101, 101, 101, 1);
						line-height: 44upx;
						color: #656565;
					}

					.icon-right {
						float: right;
						color: #e5e5e5;
						position: relative;
						line-height: 44upx;
						height: 44upx;
					}
				}
			}
		}
	}

	.balance-list {
		margin: 0 auto;
		width: 690upx;

		.list-title {
			margin-bottom: 30upx;
			position: relative;
			text-align: center;
			height: 50upx;
			font-size: 36upx;
			font-family: PingFangSC-Medium;
			font-weight: 500;
			color: rgba(51, 51, 51, 1);
			line-height: 50upx;

			.more {
				position: absolute;
				right: 0;
				top: 8upx;
				height: 37upx;
				font-size: 26upx;
				font-family: PingFangSC-Regular;
				font-weight: 400;
				color: rgba(153, 153, 153, 1);
				line-height: 37upx;
				color: #999999;
			}
		}

		.list-content {
			background: #fff;
			border-radius: 20upx;
			padding: 20upx 30upx;

			.list-item {
				border-bottom: 1px solid #e5e5e5;
				padding: 40upx 0;
				&:last-child {
					border-bottom: none;
				}

				.right {
					float: right;
				}

				.title {
					height: 50upx;
					font-size: 30upx;
					font-family: PingFangSC-Regular;
					font-weight: 400;
					color: rgba(51, 51, 51, 1);
					line-height: 50upx;
					color: #333333;
					margin-bottom: 12upx;
				}

				.num {
					height: 50upx;
					font-size: 36upx;
					font-family: PingFangSC-Semibold;
					font-weight: 600;
					color: rgba(51, 51, 51, 1);
					line-height: 50upx;
					color: #333333;
					margin-bottom: 12upx;
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
			}
		}
	}
}
.translate {
	position: absolute;
	right: 50upx;
	top: 50upx;
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
