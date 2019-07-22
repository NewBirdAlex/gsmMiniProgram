<template>
	<view>
		<view class="coupons-card">
			<view class="txt">现有优惠券</view>
			<view class="num">{{memberInfo.distributMoney}} <text class="unit">张</text></view>
		</view>
		<view class="coupons-list">
			<no-data v-if="!list.length"></no-data>
			<view v-for="(item,index) in list" :key='item.id' class="list-item">
				<view class="mb">
					<text class="right num">{{item.operate?'+':'-'}}{{item.num}}</text>
					<text class="title">{{couponsTitle[item.type] || ''}}</text>
				</view>
				<view>
					<text class="right total">剩余优惠券{{item.afterNum}}张</text>
					<text class="time">{{item.createDate}}</text>
				</view>
			</view>
		</view>
	</view>
	<!-- <view class="pageBg">
		<view class="ms-top white flex-box">
			<view class="tac">
				<view class="fs28">
					现有优惠券
				</view>
				<view class="big">
					{{memberInfo.distributMoney}}
				</view>
			</view>
		</view>
		<no-data v-if="!list.length"></no-data>

		<view class="background-white pd20 mgb20" v-for="(item,index) in list" :key = 'item.id'>
			<view v-if="item.num!=0">
				<view class="betweenBox">
					<text class="fs30 " v-if="item.type==1">收入</text>
					<text class="fs30 " v-if="item.type==2">支出 </text>
					<text class="fs30 " v-if="item.type==8">购买商品</text>
					<text class="fs30 " v-if="item.type==9">购物返购物积分 </text>
					<text class="fs30 " v-if="item.type==18">商品退款</text>
					<text class="green" :class="{'red':!item.operate}">{{item.operate?'+':'-'}}{{item.num}}</text>
				</view>
				<view class="betweenBox gray fs24">
					<text class=" ">{{item.createDate}}</text>
					<text class="">剩余优惠券：{{item.afterNum}}</text>
				</view>
			</view>
		</view>
	</view> -->
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import myMixin from '../../../common/myMixin.js'
	import noData from '@/components/no-data'
	
	export default {
		data() {
			return {
				current:1,
				list:[],
				couponsTitle: {
					1: '收入',
					2: '支出',
					3: '取消订单返回',
					8: '购物使用',
					9: '购物附赠',
					10: '回收出售商品',
				}
			};
		},
		mixins:[myMixin],
		computed: mapState([
			'memberInfo'
		]),
		components:{
			noData
		},
		onLoad() {
			this.getList()
		},
		onPullDownRefresh() {
			this.current = 1;
			this.list = [];
		    this.getList();
			setTimeout( ()=>{
				 uni.stopPullDownRefresh();
			}, 1000);
		},
		onReachBottom() {
			this.getList()
		},
		methods:{
			getList(){
				this.apiUrl.getScoreList({
					data:{
						current:this.current
					}
				}).then(res=>{
					if(res.data.status == 1&&res.data.data.pageList.length){
						let arr = res.data.data.pageList;
						arr.forEach(item=>{
							item.createDate = this.format(item.createDate);
						})
						this.list = this.list.concat(arr);
						this.current++;
					}
				})
			}
		}
	}
</script>

<style lang="less">
	.coupons-card {
		margin: 30upx auto 0;
		width: 690upx;
		height: 246upx;
		background: linear-gradient(131deg,rgba(44,137,247,1) 0%,rgba(69,208,254,1) 100%);
		box-shadow: 0 11upx 43upx -13upx rgba(111,151,252,1);
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
			border-bottom: 1px solid #E5E5E5;
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
// .ms-top{
// 	height: 350upx;
// 	background-image: linear-gradient(90deg, 
// 		#53b1fa 0%, 
// 		#388ceb 100%);
// 	.big{
// 		font-size: 60upx;
// 	}
// }
</style>
