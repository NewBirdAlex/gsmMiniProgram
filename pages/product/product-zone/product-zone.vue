<template>
	<view class="pageBg" style="background: #FFFFFF;">
		<view class="pz-search" v-if="false">
			<view class="search-box background-red">
				<view class="search">
					<input type="text" v-model="keywords" @input="keywordChange" confirm-type="search" placeholder="请输入搜索关键字" />
					<view class="searchIcon" v-if="!keyword"><uni-icon type="search" color="#b8b8b8" size="20"></uni-icon></view>
				</view>
			</view>
		</view>
		<no-data v-if="productList && !productList.length"></no-data>
		<view class="product-list" v-for="(item, index) in productList" :key="item.id">
			<!-- 商品列表 -->
			<view class="pz-cd betweenBox" :class="{ 'pz-pf': productType == 1 }">
				<view class="left">{{ item.batchName }}</view>
				<view class="right betweenBox">
					<!-- 零售 -->
					<uni-countdown
						v-if="productType == 0"
						class="time"
						font-color="#656565"
						border-color="656565"
						bgr-color="#fff"
						@activeOver="delActive(item, index)"
						:timer="item.saleEndTime"
						:startTime="item.proxyEndTime"
						:endTime="item.saleEndTime"
						:now="currentTime"
					></uni-countdown>
					<!-- 批发 -->
					<uni-countdown
						v-else
						class="time"
						font-color="#656565"
						border-color="#656565"
						bgr-color="#fff"
						@activeStart="gettingStart(item, index)"
						@activeOver="delActive(item, index)"
						:timer="item.proxyEndTime"
						:startTime="item.proxyStartTime"
						:endTime="item.proxyEndTime"
						:now="currentTime"
					></uni-countdown>
				</view>
			</view>
			<view class="sale-list">
				<view class="list-item" v-for="(subitem, subindex) in item.productList" :key="subitem.id" @tap="go(subitem)">
					<view class="list-img relative">
						<image :src="subitem.image" mode="widthFix" class="w100"></image>
						<view class="sold-out" v-if="productType==0&&!subitem.stock"><view class="out-logo" v-if="productType==0">售罄</view></view>
						<view class="sold-out" v-if="productType==1&&(!subitem.stock||!item.activeStart)">
							<view class="out-logo" v-if="item.activeStart&&!subitem.stock">售罄</view>
							<view class="out-logo unstart white flex-box" v-if="!item.activeStart">
								<view class="fs26">
									下期
									<view class="fs26">爆品</view>
								</view>
							</view>
						</view>
					</view>
					<view class="list-info">
						<view class="list-name">{{ subitem.productname }}</view>
						<view class="orange" v-if="productType==0&&subitem.giveFrozenMoney">
							赠送{{subitem.giveFrozenMoney}}批发卷
						</view>
						<view class="list-price" v-if="subitem.type != 1">
							<text class="">￥{{ subitem.price }}</text>
						</view>
						<view class="list-price" v-else>
							<text class="">￥{{subitem.productProxyPackageList.length>1? subitem.productProxyPackageList[0].wholesalePrice :subitem.price}}</text>
							<view class="inline" v-if="subitem.productProxyPackageList.length > 1">
								<text>~</text>
								<text class="fs34">{{ subitem.productProxyPackageList[subitem.productProxyPackageList.length - 1].wholesalePrice }}</text>
							</view>
						</view>
						<view class="list-stock">
							<text class="" v-if="subitem.type != 0">库存 {{ subitem.stock }} 件</text>
							<text class="" v-else-if="systemInfo.retailInventoryHidden == 'false'">库存 {{ subitem.stock }} 件</text>
						</view>
						<view class="list-btn">去抢购</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import uniCountdown from './uni-countdown.vue';
import noData from '@/components/no-data';
import { mapState, mapMutations } from 'vuex';
export default {
	data() {
		return {
			keywords: '',
			productList: false,
			productType: '',
			keyword: '',
			timeout: null,
			currentTime: ''
		};
	},
	components: {
		uniCountdown,
		noData
	},
	onPullDownRefresh() {
		this.getList();
		setTimeout(() => {
			uni.stopPullDownRefresh();
		}, 1000);
	},
	computed: mapState(['systemInfo']),

	onLoad(e) {
		this.productType = e.type;
		this.getList();
		this.initTitle(e.type);
	},
	methods: {
		gettingStart(obj, index) {
			console.log('start');
			this.getList();
		},
		delActive(obj, index) {
			let arr = this.productList;
			arr.splice(index, 1);
			this.productList = arr;
		},
		go(item) {
			uni.navigateTo({
				url: '../product-detail?id=' + item.id
			});
		},
		keywordChange(e) {
			clearTimeout(this.timeout);
			this.timeout = setTimeout(() => {
				this.getList();
			}, 1500);
		},
		initTitle(type) {
			let title = '';
			type == 0 ? (title = '零售区') : (title = '批发区');
			uni.setNavigationBarTitle({
				title: title
			});
		},
		getList() {
			uni.showLoading({
				title: '加载中'
			});
			let data = {
				keywords: this.keywords,
				//0零售 1批发 2普通
				type: this.productType
			};
			this.apiUrl
				.getSpecialProduct({
					data
				})
				.then(res => {
					uni.hideLoading();
					if (res.data.status == 1) {
						let arr = res.data.data;
						// arr = this.setImgSize(arr,'350x350')
						arr.forEach(item => {
							item.productList = this.setImgSize(item.productList, '350x350');
							if(this.productType==1){
								if(res.data.now<item.proxyStartTime){
									item.activeStart = false; //预售未开始
									console.log('unstart');
								}else{
									item.activeStart = true; //预售
									console.log('start');
								}
								console.log(item.activeStart);
							}
						});
						this.productList = arr;
						this.currentTime = res.data.now;
					}
				});
		}
	}
};
</script>

<style lang="less" scoped>
.product-list {
	padding-left: 30upx;
	margin-bottom: 60upx;

	.pz-cd {
		padding: 30upx 30upx 30upx 0;
		border-bottom: 1px solid #e5e5e5;

		.left {
			color: #414141;
			height: 50upx;
			font-size: 36upx;
			font-weight: 600;
			line-height: 50upx;
		}
	}

	.sale-list {
		margin-top: 20upx;

		.list-item {
			padding: 20upx 20upx 20upx 0;
			height: 220upx;

			.list-img {
				width: 220upx;
				height: 220upx;
				border-radius: 6px;
				overflow: hidden;
				float: left;

				image {
					display: block;
					width: 220upx;
					height: 220upx;
				}
			}

			.list-info {
				margin-left: 240upx;
				padding-top: 10upx;
				position: relative;

				.list-name {
					width: 450upx;
					height: 80upx;
					font-size: 28upx;
					font-weight: 400;
					color: rgba(51, 51, 51, 1);
					line-height: 40upx;
					letter-spacing: 1px;
					margin-bottom: 40upx;
				}

				.list-price {
					height: 48upx;
					font-size: 34upx;
					font-weight: 600;
					color: rgba(252, 78, 41, 1);
					line-height: 48upx;
					margin-bottom: 4upx;
				}

				.list-stock {
					height: 30upx;
					font-size: 22upx;
					font-weight: 400;
					color: rgba(153, 153, 153, 1);
					line-height: 30upx;
				}

				.list-btn {
					width: 140upx;
					height: 56upx;
					background: rgba(249, 83, 26, 1);
					border-radius: 28upx;
					font-size: 26upx;
					font-weight: 400;
					color: rgba(255, 255, 255, 1);
					text-align: center;
					line-height: 56upx;
					position: absolute;
					right: 0;
					bottom: 20upx;
				}
			}
		}
	}
}

// .pz-cd {
// 	background-image: linear-gradient(90deg, #ffb75a 0%, #e78e00 100%);
// 	border-radius: 1px;
// 	padding: 20upx;
// 	.left {
// 		padding: 4upx 20upx;
// 		color: #fdb556;
// 		border-radius: 50upx;
// 		background: white;
// 	}
// 	.right {
// 		color: white;
// 		font-size: 28upx;
// 	}
// }
// .pz-pf {
// 	background-image: linear-gradient(90deg, #53b1fa 0%, #388ceb 100%);
// 	.left {
// 		color: #388ceb;
// 	}
// }
// .search-box {
// 	line-height: 60upx;
// 	height: 60upx;
// 	position: relative;
// 	padding-bottom: 20upx;
// 	.searchIcon {
// 		position: absolute;
// 		left: 150upx;
// 		top: 50%;
// 		transform: translateY(-50%);
// 	}
// 	.search {
// 		width: 620upx;
// 		height: 60upx;
// 		background: #efefef;
// 		border-radius: 30upx;
// 		overflow: hidden;
// 		text-align: center;
// 		margin: 0 auto;
// 		position: relative;
// 		input {
// 			font-size: 26upx;
// 			height: 60upx;
// 		}
// 	}
// 	image {
// 		width: 45upx;
// 		display: inline-block;
// 		vertical-align: top;
// 		margin-left: 30upx;
// 		margin-top: 12upx;
// 	}
// }
// .mto {
// 	justify-content: flex-start;
// 	margin-left: 20upx;
// }
</style>
