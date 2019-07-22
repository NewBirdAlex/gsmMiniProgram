<template>
	<view class="pageBg" style="background: #FFFFFF;">
		<view class="search-box">
			<view class="search">
				<input type="text" v-model="keywords" @confirm="searchProduct" confirm-type="search" placeholder="输入搜索内容" value="" />
			</view>
			<text class="fs32 mgl20" @tap="searchProduct">搜索</text>
		</view>
		<view class="search-options">
			<view class="options-trangle" @tap="changeSortName('sellCount')">
				销量
				<image src="/static/img/trangle/public_icon_price_up@2x.png" v-if="sortName == 'sellCount' && sortType == 'asc'"
				 mode="widthFix"></image>
				<image src="/static/img/trangle/public_icon_price_down@2x.png" v-if="sortName == 'sellCount' && sortType == 'desc'"
				 mode="widthFix"></image>
				<image src="/static/img/trangle/public_icon_price_normal@2x.png" v-if="!sortName||sortName =='price'" mode="widthFix"></image>
			</view>
			<view class="options-trangle" @tap="changeSortName('price')">
				价格
				<image src="/static/img/trangle/public_icon_price_up@2x.png" v-if="sortName == 'price'&& sortType == 'asc'" mode="widthFix"></image>
				<image src="/static/img/trangle/public_icon_price_down@2x.png" v-if="sortName == 'price' && sortType == 'desc'"
				 mode="widthFix"></image>
				<image src="/static/img/trangle/public_icon_price_normal@2x.png" v-if="!sortName||sortName =='sellCount'" mode="widthFix"></image>
			</view>
			<!-- 			<view class="list-display">
				<image src="/static/img/guird.png" mode="widthFix" v-if="showInline" @click="showInline = !showInline"></image>
				<image src="/static/img/inList.png" mode="widthFix" v-else @click="showInline = !showInline"></image>
			</view>
			<view class="line"></view> -->
			<view class="options-trangle"  @click="drawer = !drawer">
				<!-- <uni-icon type="list" size='24'></uni-icon> -->
				筛选
				<image src="/static/img/trangle/public_icon_brush_up_gray@2x.png" mode="widthFix"></image>
			</view>
		</view>
		<!-- 商品列表 -->
		<view class="goods-list" :class="{ 'list-inline': showInline }">
			<view class="list-item background-white" v-for="(item, index) in productList" :key="item.id" @tap="go(item.id)">
				<view class="list-img">
					<image :src="item.image" lazy-load="true" mode="widthFix"></image>
					<view class="sold-out" v-if="!item.stock">
						<view class="out-logo">售罄</view>
					</view>
				</view>
				<view class="list-info">
					<view class="list-name">{{ item.productname }}</view>
					<view class="list-price">￥{{ item.price }}</view>
					<text class="gray mgl20  originPrice" v-if="item.initialPrice">￥{{item.initialPrice}}</text>
					<view class="list-stock">库存 {{ item.stock }} 件</view>
				</view>
			</view>
		</view>
		<no-data v-if="productList&&!productList.length"></no-data>
		<uni-drawer :visible="drawer" :mask="true" mode="right" @close="closeDrawer">
			<view class="init-drawer">
				<view class="uni-title  tac white">筛选</view>
				<view class="content pd20">
					<view class="title-black fs28">全部分类</view>
					<view class="drawer-btns">
						<view class="btn flex-box mgt20 mgr20" :class="{ active: item.active }" v-for="(item, index) in sortList" :key="index"
						 @tap="selectSort(item, index)">
							{{ item.itemName }}
						</view>
					</view>
					<view class="title-black fs28 mgt40">价格区间(元)</view>
					<view class="select-price">
						<view class="select-input"><input type="text" placeholder="最低价" v-model="minPrice" /></view>
						<text>-</text>
						<view class="select-input"><input type="text" placeholder="最高价" v-model="maxPrice" /></view>
					</view>
				</view>
				<view class="confirm" @tap="confirmSearch">确定</view>
			</view>
		</uni-drawer>
	</view>
</template>

<script>
	import uniDrawer from '@/components/uni-drawer.vue';
	import myMixin from '../../common/myMixin.js';
	import noData from '@/components/no-data';

	export default {
		data() {
			return {
				showInline: false,
				inprice: false,
				drawer: false,
				sortList: null,
				keywords: '',
				productList: [],
				selectedSort: null,
				minPrice: '',
				maxPrice: '',
				productType: 0,
				current: 1,
				smallCategory: '',
				bigCategory: '',
				sortName: '',
				allowRequest: true,
				sortType: '',
				isHot:'',
				isNew:'',
				isremomond:'',
				noMoreData:false
			};
		},
		mixins: [myMixin],
		watch: {
			sortName: function(val, oldVal) {
				this.initProduct();
				this.getList();
			},
			sortType: function(val, oldVal) {
				this.initProduct();
				this.getList();
			}
		},
		onPullDownRefresh() {
		   this.current = 1;
		   this.productList = [];
		   setTimeout( ()=>{
		   	 this.getList();
		   }, 10);
			setTimeout( ()=>{
				 uni.stopPullDownRefresh();
			}, 1000);
		},
		onLoad(e) {
			this.getSort();
			this.productType = e.type;
			
			if (e.smallCategory) this.smallCategory = e.smallCategory;
			if (e.bigCategory) this.bigCategory = e.bigCategory;
			if (e.keywords) this.keywords = e.keywords;
			if (e.isNew) this.isNew = e.isNew;
			if (e.isHot) this.isHot = e.isHot;
			if (e.isremomond) this.isremomond = e.isremomond;
			this.getList();
		},
		onReachBottom() {
			if(this.noMoreData){
				uni.showToast({
					title:'没有更多数据了',
					icon:'none',
					duration:1500
				});
				return
			}
			this.getList();
		},
		methods: {
			changeSortName(type) {
				this.noMoreData = false;
				if (this.sortName) {
					if (this.sortName == type) {
						if (this.sortType == 'asc') {
							this.sortType = 'desc';
						} else if (this.sortType == 'desc') {
							this.sortType = '';
							this.sortName = '';
						} else {
							this.sortType = 'asc';
							this.sortName = type;
						}
					} else {
						this.sortType = 'asc';
						this.sortName = type;
					}
				} else {
					this.sortName = type;
					this.sortType = 'asc';
				}
			},
			initTitle(type) {},
			searchProduct() {
				this.initProduct();
				this.getList();
			},
			//select  sort
			selectSort(item, index) {
				this.bigCategory = '';
				this.smallCategory = '';
				let arr = [...this.sortList];
				arr.forEach(item => (item.active = false));
				arr[index].active = true;
				this.sortList = arr;
				this.selectedSort = item;
			},
			go(id) {
				uni.navigateTo({
					url: '/pages/product/product-detail?id=' + id
				});
			},
			closeDrawer() {
				this.drawer = false;
			},
			getSort() {
				this.apiUrl.getProductSort().then(res => {
					this.sortList = res.data.data;
				});
			},
			confirmSearch() {
				this.drawer = false;
				this.initProduct();
				this.getList();
			},
			initProduct() {
				this.current = 1;
				this.productList = [];
			},
			getList() {
				if (!this.allowRequest) return;
				this.allowRequest = false;
				uni.showLoading({
					title: '加载中'
				});
				let data = {
					// 					productName:'',
					sortName: this.sortName,
					leastPrice: this.minPrice,
					mostPrice: this.maxPrice,
					keywords: this.keywords,
					//0零售 1批发 2普通
					type: this.productType,
					current: this.current,
					bigCategory: this.bigCategory,
					smallCategory: this.smallCategory,
					sortType: this.sortType
				};
				this.isNew?data.isNew = 1:'';
				this.isHot?data.isHot = 1:'';
				this.isremomond?data.isremomond = 1:'';
				this.selectedSort ? (data.bigCategory = this.selectedSort.code) : '';
				this.apiUrl
					.getNormalProduct({
						data
					})
					.then(res => {
						this.allowRequest = true;
						uni.hideLoading();
						if (res.data.status == 1) {
							if(res.data.data.pages == this.current){
								this.noMoreData = true;
							}

							if (res.data.data.pageList.length) {
								let arr = res.data.data.pageList;
								arr = this.setImgSize(arr, '350x350','image');
								this.current += 1;
								this.productList = (this.productList||[]).concat(arr);
							}
						} else {
							this.initProduct();
						}
					});
			}
		},
		components: {
			uniDrawer,
			noData
		}
	};
</script>

<style lang="less" scoped>
	.search-box {
		line-height: 60upx;
		height: 60upx;
		position: relative;
		background: #fff;
		padding: 10upx 0;
		display: flex;
		align-items: center;

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

	.init-drawer {
		.uni-title {
			background-color: #FC4E29;
		}

		.drawer-btns {
			display: flex;
			flex-wrap: wrap;

			.btn {
				border-radius: 28upx;
				color: rgba(178, 178, 178, 1);
				font-size: 26upx;
				width: 160upx;
				height: 55upx;
				border: 1px solid rgba(191, 191, 191, 1);
				border-radius: 28upx;
			}

			.active {
				border: 1px solid rgba(56, 140, 235, 1);
				color: rgba(56, 140, 235, 1);
			}
		}

		.select-price {
			display: flex;
			justify-content: space-between;
			margin-top: 20upx;

			.select-input {
				width: 210upx;
				height: 55upx;
				border-radius: 28upx;
				border: solid 1upx #bfbfbf;
				text-align: center;
			}

			text {
				margin-left: 20upx;
				margin-right: 20upx;
			}
		}

		.confirm {
			position: absolute;
			bottom: 0;
			left: 0;
			width: 100%;
			height: 80upx;
			background-color: #FC4E29;
			text-align: center;
			line-height: 80upx;
			color: white;
			font-size: 30upx;
		}
	}

	.list-inline {
		.list-item {
			.list-img {
				width: 200upx;
				height: 200upx;

				image {
					display: contents;
				}
			}
		}
	}

	.search-options {
		display: flex;
		justify-content: space-around;
		align-items: center;
		padding: 22upx 0;
		box-shadow: 0px 5px 17px 0px rgba(202, 202, 202, 0.5);

		.options-input {
			width: 536upx;
			height: 68upx;
			background: rgba(245, 245, 245, 1);
			border-radius: 40upx;

			input {
				height: 100%;
				font-size: 28upx;
				font-weight: 400;
				color: rgba(51, 51, 51, 1);
			}
		}

		.line {
			width: 2upx;
			background: #c2c2c2;
			height: 40upx;
		}

		>view {
			display: flex;
			height: 100%;
			align-items: center;
			justify-content: center;
		}

		.options-trangle {
			height: 45upx;
			font-size: 32upx;
			font-weight: 400;
			color: rgba(101, 101, 101, 1);
			line-height: 45upx;
			padding: 0 20upx;
			image {
				width: 20upx;
				margin-left: 10upx;
			}
		}

		.list-display {
			image {
				width: 22upx;
			}
		}
	}

	.goods-list {
		padding: 30upx;

		.list-item {
			width: 336upx;
			height: 570upx;
			background: rgba(255, 255, 255, 1);
			border-radius: 15upx;
			border: 2upx solid rgba(245, 245, 245, 1);
			margin-left: 0;
			overflow: hidden;
			margin-bottom: 10upx;

			&:nth-child(odd) {
				margin-right: 10upx;
			}

			.list-img {

				image {
					width: 336upx;
					display: block;
				}
			}

			.list-info {
				padding: 16upx;

				.list-name {
					height: 74upx;
					font-size: 26upx;
					font-weight: 400;
					color: rgba(51, 51, 51, 1);
					line-height: 37upx;
					letter-spacing: 1px;
					margin-bottom: 12upx;
				}

				.list-price {
					height: 48upx;
					font-size: 34upx;
					font-weight: 600;
					color: rgba(252, 78, 41, 1);
					line-height: 33upx;
					margin-bottom: 5upx;
				}

				.list-stock {
					height: 30upx;
					font-size: 22upx;
					font-weight: 400;
					color: rgba(153, 153, 153, 1);
					line-height: 30upx;
				}
			}
		}
	}
</style>
