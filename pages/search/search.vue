<template>
	<view>
		<view class="search-box ">
			<view class="search">
				<input type="text" v-model="search" @confirm="inputSearch" confirm-type="search" placeholder="请输入搜索关键字" value="" />
			</view>
			<text class="fs32 mgl20" @tap="inputSearch">搜索</text>
			<!-- 	<view class="searchIcon" v-if="!search">
				<uni-icon type="search" color="#c2c2c2"  size="20"></uni-icon>
			</view> -->
		</view>
		<view class="search-history">

			<view class="betweenBox mgb20" v-if="historySearch.length">
				<text class="title">历史搜索</text>
				<view class="flex-box gray" @tap="clearHistory">
					<uni-icon type="trash" size='24'></uni-icon>
				</view>
			</view>
			<view class="pdt20 pdb20 bdb gray betweenBox" v-for="(item,index) in historySearch" :key='index' >
				<text @tap="goList(item)" style="flex:2;">{{item}}</text>
				<view @tap='delHistory(index)'>
					<uni-icon type="clear" size='24'  color='#C8C8C8'></uni-icon>
				</view>
			</view>

			<view class="betweenBox" v-if="hotSearch.length" style="margin-top: 40upx;">
				<text class="title">热门搜索</text>
			</view>
			<view class="search-btns">
				<view v-for="(item,index) in hotSearch" :key='item.id' @tap="goList(item)">
					{{item.word}}
				</view>
			</view>

		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				search: '',
				hotSearch: [],
				historySearch: []
			};
		},
		onLoad() {
			uni.getStorage({
				key: 'historySearch',
				success: (res) => {
					console.log(res);
					this.historySearch = res.data
				}
			})
			this.getSearchList()
		},
		methods: {
			goBack() {
				uni.navigateBack();
			},
			clearHistory() {
				uni.removeStorage({
					key: 'historySearch',
					success: () => {
						this.historySearch = []
					}
				})
			},
			delHistory(index) {
				let arr = this.historySearch;
				arr.splice(index, 1);
				this.historySearch = arr;
				uni.setStorage({
					key: 'historySearch',
					data: arr
				})
			},
			inputSearch() {
				if (!this.search) return
				let arr = this.historySearch;
				console.log(arr);
				arr.unshift(this.search);
				arr.length >= 10 ? arr.length = 10 : '';
				uni.setStorage({
					key: 'historySearch',
					data: arr,
					success: () => {
						uni.navigateTo({
							url: '../product/product-list?type=2&keywords=' + this.search
						})
					}
				})

			},
			goList(item) {
				let str;
				item.word ? str = item.word : str = item
				uni.navigateTo({
					url: '../product/product-list?type=2&keywords=' + str
				})
			},
			goSearch() {
				uni.navigateTo({
					url: 'search-resoult/search-resoult'
				})
			},
			getSearchList() {
				this.apiUrl.hotSearchList({
					data: {

					}
				}).then(res => {
					if (res.data.status == 1) {
						this.hotSearch = res.data.data
					}
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.search-history {
		padding: 0 30upx;

		.title {
			height: 48upx;
			font-size: 34upx;
			font-weight: 500;
			color: #333333;
			line-height: 48upx;
		}

		.search-btns {
			display: flex;
			flex-wrap: wrap;
			margin-top: 30upx;

			>view {
				height: 40upx;
				font-size: 28upx;
				font-weight: 400;
				color: #333333;
				line-height: 40upx;
				padding: 14upx 30upx;
				background: #F5F5F5;
				margin-right: 20upx;
				margin-bottom: 20upx;
			}
		}
	}

	.search-box {
		line-height: 60upx;
		height: 60upx;
		position: relative;
		background: #fff;
		padding: 10upx 0;
		display: flex;
		align-items: center;
		margin-bottom: 50upx;

		// .searchIcon{
		// 	position: absolute;
		// 	left: 180upx;
		// 	top:50%;
		// 	transform: translateY(-50%);
		// }
		.search {
			display: inline-block;
			width: 580upx;
			height: 68upx;
			border-radius: 30upx;
			overflow: hidden;
			margin-left: 24upx;
			padding-left: 40upx;
			background: #F5F5F5;

			input {
				height: 68upx;
				line-height: 68upx;
				border-radius: 40upx;
				font-size: 28upx;
			}
		}
	}
</style>
