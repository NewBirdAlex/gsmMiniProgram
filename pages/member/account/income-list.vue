<template>
	<view class="">
		<view class="incomeDetail">
			<view class="incomeTitle">
				<view class="blueBg">
					<text class="time">时间</text>
					<text class="amount">金额</text>
					<text class="remarks">备注</text>
				</view>
			</view>
			<view class="incomeTitle incomeSchedules">
				<view v-for="(item,key) in incomeList" :key='key' class="bdb">
					<text class="time gray">{{item.createDate}}</text>
					<text class="amount" :class="{'green':item.operate,'red':!item.operate}">{{item.operate?'+':'-'}}{{item.num}}</text>
					<text class="remarks gray" >{{item.remarks}}</text>
				</view>
				<no-data v-if="!incomeList.length"></no-data>
			</view>
		</view>
	</view>
</template>

<script>
	import noData from '@/components/no-data.vue'
	export default {
		data() {
			return {
				current: 1,
				incomeList: [],
				autoId: '',
				count: 0,
				pages:1
			};
		},
		components:{
			noData
		},
		onPullDownRefresh() {
			this.current = 1;
			this.incomeList=[];
			this.getList().then(()=>{
				this.getList()
			})
		    setTimeout( ()=>{
				 uni.stopPullDownRefresh();
		    }, 1000);
		},
		onLoad() {
			this.getList().then(()=>{
				this.getList()
			})
		},
		onReachBottom() {
			this.getList();
		},
		methods: {
			getList() {
				if(this.pages<this.current) return;
				uni.showLoading({
					title:'加载。。。'
				})
				return new Promise((resolve,reject)=>{
					this.apiUrl.getIncomeList({
						data: {
							current: this.current
						}
					}).then(res => {
						uni.hideLoading();
						if (res.data.status == 1) {
							if(this.current==1){
								this.pages = res.data.data.pages;
							}
							let arr = res.data.data.pageList;
							arr.forEach(item => {
								item.createDate = this.format(item.createDate);
							})
							this.incomeList = this.incomeList.concat(arr)
							this.current += 1;
							console.log(this.current)
							resolve()
						}
					})
				})
			}
		}
	}
</script>

<style lang="less">
	.skbg {
		background-color: #e3f8ff;
	}

	.mf-title {
		>view {
			text-align: center;
			flex: 1;
		}
	}

	.incomeDetail {
		.incomeTitle {
			>view{
				overflow: hidden;
			}
			text {
				font-size: 30upx;
				text-align: center;
				height: 80upx;
				line-height: 80upx;
				float: left;
				width: 200upx;
			}
			.time{
				width: 350upx;
				text-indent: 6upx;
				flex: 2.5;
			}
			.remarks{
				width: 200upx;
				flex: 2;
			}
		}

		.blueBg {
			background-color: #eefbff;
		}
	}
</style>
