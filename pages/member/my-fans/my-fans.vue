<template>
	<view>
		<view class="member-card">
			<view class="top flex">
				<view class="">
					<image class="remember-avatar" :src="memberInfo.logo" v-if="memberInfo.logo"></image>
					<image class="remember-avatar" src="/static/img/logoGsp.png" v-else></image>
				</view>
				<view class="flex-box top_info">
					<text class="member-name">{{memberInfo.userName||memberInfo.mobilePhone}}</text>
					<!-- <view class="">
						<text class="fs22 tag" v-if="memberInfo">{{memberInfo.identityStr}}</text>
					</view> -->
				</view>
			</view>
			<view class="bottom">
				<view class="">
					<text >推荐人：{{ memberInfo.parentName || memberInfo.parentPhone ||'无'}} <text class="mgl20"></text></text>
					<text> 直推粉丝：{{count}}</text>
				</view>
				<view class="flex">
					<text >推荐人手机号码：{{ memberInfo.parentPhone || '无' }} <text class="mgl20"></text></text>
					<text > 团队粉丝：{{memberInfo.teamFansNumber}}</text>
				</view>
			</view>
		</view>
		<view class="fans-list">
			<view class="fans-item" v-for="(item,index) in list" :key='index'>
				<image class="fans-avatar" :src="item.logo" v-if="item.logo"></image>
				<image class="fans-avatar" v-else src="/static/img/logoGsp.png"></image>
				<view class="fans-infos">
					<view class="name">{{item.userName||item.autoId}}</view>
					<view class="le_d fs24">
						<text style="width: 120px;"> 团队粉丝：{{item.teamFansNumber}}</text>
						<text class="mgl20">会员等级：{{item.identityStr}}</text>
					</view>
					<view class="detail fs24">
						<text class="" style="width: 120px;">当月业绩：{{item.monthlyPerformance}}</text>
						<text class="mgl20">ID:{{item.autoId}}</text>
						<text class="mgl20"> 联系电话:{{item.mobilePhone||'无'}}</text>
					</view>
					<text class="time">{{item.createDate.time}}</text>
				</view>
			</view>
		</view>
		<no-data v-if="!list.length"></no-data>
	</view>
	
</template>

<script>
	import noData from '@/components/no-data'
	import {
		mapState
	} from 'vuex'
	export default {
		data() {
			return {
				current: 1,
				list: [],
				autoId: '',
				count: 1,
				logo: '',
				allowRequest:true
			};
		},
		computed: mapState([
			'memberInfo'
		]),
		onPullDownRefresh() {
			this.current = 1;
			this.list=[];
			setTimeout( ()=>{
				 this.getList();
			}, 100);
		    setTimeout( ()=>{
				 uni.stopPullDownRefresh();
		    }, 1000);
		},
		onLoad() {
			this.getList();
		},
		components: {
			noData
		},
		onReachBottom() {
			this.getList();
		},
		methods: {
			getList() {
				if(!this.allowRequest) return
				this.allowRequest = false;
				this.apiUrl.getFansList({
					data: {
						current: this.current,
						pageCount: 20
					}
				}).then(res => {
					this.allowRequest = true;
					if (res.data.status == 1) {
						this.autoId = res.data.data.autoId;
						this.count = res.data.data.list.count;
						if (res.data.data.list.pageList.length) {
							let arr = res.data.data.list.pageList;
							arr.forEach(item=>{
								item.createDate.time = this.format(item.createDate.time);
							})
							this.list = this.list.concat(arr);
							this.current += 1;
						}
					}
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.top_info{
		// flex-direction: column;
		// justify-content: flex-start;
		// align-items: flex-start;
	}
	.tag {
		padding: 2upx 10upx;
		border-radius: 16px;
		color: white;
		margin-left: 10upx;
		background: black;
	}
	.member-card {
		position: relative;
		width: 690upx;
		height: 300upx;
		background: linear-gradient(137deg, rgba(255, 157, 126, 1) 0%, rgba(254, 91, 125, 1) 100%);
		box-shadow: 0 11upx 43upx -13upx rgba(255, 198, 206, 1);
		border-radius: 20upx;
		margin: 30upx auto 80upx;
		.top {
			padding-top: 60upx;
			padding-left: 50upx;
			.remember-avatar {
				float: left;
				width:80upx;
				height:80upx;
				border-radius:40upx;
			}
			.member-name {
				font-size:36upx;
				// line-height: 80upx;
				font-family:PingFangSC-Semibold;
				font-weight:600;
				color:rgba(255,255,255,1);
				padding-left: 20upx;
			}
		}
		.bottom {
			position: absolute;
			bottom: 0;
			left: 0;
			right: 0;
			height:80upx;
			padding-top: 10upx;
			background:rgba(255,255,255,0.1);
			>view{
				line-height: 30upx;
				color: white;
				> text {
					&:first-child{
						width: 70%;
						text-indent: 20upx;
					}
					width: 30%;
					display: inline-block;
					font-size:24upx;
					font-family:PingFangSC-Regular;
					font-weight:400;
					color:rgba(255,255,255,1);
					line-height:34upx;
				}
			}
		}
	}

	.fans-list {
		width: 690upx;
		margin: 0 auto;
		padding-bottom: 100upx;
		.fans-item {
			padding: 40upx 10upx 0;
			.fans-avatar {
				float: left;
				width:100upx;
				height:100upx;
				border-radius:55upx;
			}
			.fans-infos {
				position: relative;
				margin-left: 120upx;
				padding-bottom: 40upx;
				border-bottom: 2upx #E5E5E5 solid;
				.name {
					font-size:34upx;
					font-family:PingFangSC-Semibold;
					font-weight:600;
					color:rgba(51,51,51,1);
					height: 48upx;
					line-height: 48upx;
					padding-top: 4upx;
					margin-bottom: 8upx;
				}
				.le_d{
					color:rgba(101,101,101,1);
					margin-bottom: 8upx;
				}
				.detail {
					text {
						font-family:PingFangSC-Regular;
						font-weight:400;
						color:rgba(101,101,101,1);
					}
				}
				.time {
					position: absolute;
					right: 0;
					top: 4upx;
					font-size:24upx;
					font-family:PingFangSC-Regular;
					font-weight:400;
					color:rgba(153,153,153,1);
				}
			}
		}
	}
	/* 	.skbg{
		background-color: #e3f8ff;
	}
.mf-title{
	>view{
		text-align: center;
		width: 150upx;
		&:nth-child(2){
			width: 250upx;
		}
		&:nth-child(3){
			width: 150upx;
		}
		&:nth-child(4){
			width: 310upx;
		}
	}
} */
</style>
