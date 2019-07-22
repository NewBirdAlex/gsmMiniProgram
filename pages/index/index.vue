                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               <template>
	<view class="content ">
		<view class="background-white betweenBox index_top pd20">
			<view class="flex-box"><image src="/static/img/WechatIMG103.png" v-if="!hideLogo" class="logo mgr20" mode="widthFix"></image></view>
			<view class="flex-box relative">
				<image src="/static/img/public_icon_search@2x.png" class=" mgr20" mode="widthFix" @tap="goSearch"></image>
				<image src="/static/img/public_icon_message@2x.png" class="" mode="widthFix" @tap="goMessage"></image>
				<view class="redPoint" v-if="hasUnReadMessage"></view>
			</view>
		</view>
		<view class="swiper mg20">
			<swiper :indicator-dots="true" indicator-color="#fcab98" indicator-active-color="white" :autoplay="true" :interval="3000" :duration="1000">
				<swiper-item v-for="(item, index) in swiperList" :key="index">
					<view class="swiper-item"><image :src="item.images" lazy-load="true" mode="widthFix" @tap="goSwiperProduct(item)"></image></view>
				</swiper-item>
			</swiper>
		</view>
		<view class="main ">
			<view class="short-word background-white">
				<view class="item flex-box">
					<image src="/static/img/index_item_tick@2x.png" mode="widthFix"></image>
					品类齐全
				</view>
				<view class="item flex-box">
					<image src="/static/img/index_item_tick@2x.png" mode="widthFix"></image>
					急速配送
				</view>
				<view class="item flex-box">
					<image src="/static/img/index_item_tick@2x.png" mode="widthFix"></image>
					天天低价
				</view>
				<view class="item flex-box">
					<image src="/static/img/index_item_tick@2x.png" mode="widthFix"></image>
					精致服务
				</view>
			</view>
			<!-- 公告 -->
			<view class="background-white  mg20 " v-if="noteList.length"><Notice :noteList="noteList"></Notice></view>
			<view class="zone background-white">
				<view class="item" @tap="goProductList(0)">
					<view class="pic"><image src="/static/img/function_icon_retail@2x.png" mode="widthFix"></image></view>
					<view class="name">零售专区</view>
				</view>
				<view class="item" @tap="goProductList(1)">
					<view class="pic"><image src="/static/img/function_icon_wholesale@2x.png" mode="widthFix"></image></view>
					<view class="name">批发专区</view>
				</view>
				<view class="item" @tap="goProductList(2)">
					<view class="pic"><image src="/static/img/function_icon_goods@2x.png" mode="widthFix"></image></view>
					<view class="name">商品专区</view>
				</view>
				<view class="item" @tap="goProductList(3)">
					<view class="pic"><image src="/static/img/function_icon_member@2x.png" mode="widthFix"></image></view>
					<view class="name">会员中心</view>
				</view>
			</view>

			<navigator url="../product/product-zone/product-zone?type=0">
				<view class="cdWrap betweenBox background-white pd20 gapBorder pdt70" v-if="retail && retail.productList && retail.productList.length">
					<view class="flex">
						<view class="cd-left mgr20">零售区</view>
						<view class="">
							<view class="cd-middle ">
								<view class="time">
									<uni-countdown
										class="time"
										font-color="#FFFFFF"
										border-color="white"
										bgr-color="rgba(65,65,65,1)"
										@activeOver="retailOver"
										:startTime="retail.proxyStartTime"
										:endTime="retail.saleEndTime"
										:now="currentTime"
									></uni-countdown>
								</view>
							</view>
						</view>
					</view>
					<view class="cd-right">
						更多
						<image src="/static/img/pubulic_icon_expand@2x.png" mode="widthFix" class="id-ri"></image>
					</view>
				</view>
			</navigator>
			<view class="background-white pdl20 pdr20 pdt20 " v-if="retail">
				<view class="spc_item" v-for="(item, index) in retail.productList" :key="index" @tap="goProduct(item)">
					<view class="left relative">
						<image lazy-load :src="item.image" mode="widthFix"></image>
						<view class="sold-out" v-if="!item.stock"><view class="out-logo">售罄</view></view>
					</view>
					<view class="right colTopBottom">
						<view class="name">{{ item.productname }}</view>
						<view class="">
							<view class="orange" v-if="item.giveFrozenMoney">
								赠送{{item.giveFrozenMoney}}批发卷
							</view>
							<view class=" orange mgb20">
								<text>¥</text>
								<text class="price">{{ item.price }}</text>
							</view>
							
							<view class="stock" v-if="item.type != 0">库存{{ item.stock }}件</view>
							<view class="stock" v-else-if="systemInfo.retailInventoryHidden == 'false'">库存{{ item.stock }}件</view>
						</view>
					</view>
					<view class="btn white flex-box">去抢购</view>
				</view>
			</view>
			<!-- 批发区 -->
			<navigator url="../product/product-zone/product-zone?type=1">
				<view class="cdWrap betweenBox background-white mgt20 pd20 gapBorder pdt70" v-if="wholesale && wholesale.productList && wholesale.productList.length">
					<view class="flex">
						<view class="cd-left  ">批发区</view>
						<view class="flex">
							<view class="cd-middle mgr20">
								<view class="time ">
									<uni-countdown
										class="time"
										font-color="#FFFFFF"
										border-color="white"
										bgr-color="rgba(65,65,65,1)"
										@activeStart="gettingStart"
										@activeOver="wholesaleOver"
										:startTime="wholesale.proxyStartTime"
										:endTime="wholesale.proxyEndTime"
										:now="currentTime"
									></uni-countdown>
								</view>
							</view>
						</view>
					</view>
					<view class="cd-right">
						更多
						<image lazy-load src="/static/img/pubulic_icon_expand@2x.png" mode="widthFix" class="id-ri"></image>
					</view>
				</view>
			</navigator>
			<view class="background-white pdl20 pdr20 pdt20" v-if="wholesale">
				<view class="spc_item" v-for="(item, index) in wholesale.productList" :key="index" @tap="goProduct(item)">
					<view class="left relative">
						<image lazy-load :src="item.image" mode="widthFix"></image>
						<view class="sold-out" v-if="(!wholesale && !item.stock) || (wholesale && wholesale.now > wholesale.proxyStartTime && !item.stock)">
							<view class="out-logo">售罄</view>
						</view>
						<view class="sold-out" v-if="wholesale && wholesale.now < wholesale.proxyStartTime">
							<view class="out-logo unstart white flex-box">
								<view class="fs26">
									下期
									<view class="fs26">爆品</view>
								</view>
							</view>
						</view>
					</view>
					<view class="right colTopBottom">
						<view class="name">{{ item.productname }}</view>
						<view class="">
							<view class=" orange mgb20" v-if="item.productProxyPackageList.length > 1">
								<text>¥</text>
								<text class="price">{{ item.productProxyPackageList[0].wholesalePrice }}</text>
								<view class="inline">
									<text>~</text>
									<text class="price">{{ item.productProxyPackageList[item.productProxyPackageList.length - 1].wholesalePrice }}</text>
								</view>
							</view>
							<view class="orange mgb20" v-else>
								<text>¥</text>
								<text class="price">{{ item.price }}</text>
							</view>
							<view class="stock">库存{{ item.stock }}件</view>
						</view>
					</view>
					<view class="btn white flex-box">去抢购</view>
				</view>
			</view>
		</view>
		<!-- 新品上线 -->
		<view class="background-white  mgt20 gapBorder" v-if="newProductList && newProductList.length">
			<recommend-title title="新品上线" bgc="#e78e00" path="new"></recommend-title>
			<swiper class="swiper2" :indicator-dots="true" indicator-color="#fcab98" indicator-active-color="white" :autoplay="true" :interval="3000" :duration="1000">
				<swiper-item v-for="(item, index) in newProductList" :key="index" v-if="index%3==0">
					<view class="swiper-item">
						<view class="new_online">
							<view class="left" @tap="goProduct(newProductList[index])">
								<image lazy-load :src="newProductList[index].image" mode="widthFix"></image>
								<view class="name">
									<view class="white mgr20">
										<text class="fs22 mgl20">￥</text>
										<text class="fs36">{{ newProductList[index].price }}</text>
									</view>
									<view class="">
										<text class="white mgl20 originPrice" v-if="item.initialPrice">￥{{ item.initialPrice }}</text>
									</view>
									<view class="white fs22 mgl20 mgb20 mgr20">{{ newProductList[index].productname }}</view>
								</view>
							</view>
							<view class="right colTopBottom">
								<view class="" @tap="goProduct(newProductList[index + 1])" v-if="newProductList[index + 1]">
									<image lazy-load :src="newProductList[index + 1].image" mode="widthFix" class="w100"></image>
								</view>
								<view class="" @tap="goProduct(newProductList[index + 2])" v-if="newProductList[index + 2]">
									<image lazy-load :src="newProductList[index + 2].image" mode="widthFix" class="w100"></image>
								</view>
							</view>
						</view>
					</view>
				</swiper-item>
			</swiper>
		</view>
		<!-- ad -->
		<view class="mgl20 mgr20 mgt70 gapBorder" v-if="bottomAdList&&bottomAdList.length">
			<image lazy-load @tap="goSwiperProduct(bottomAdList[0])"  :src="bottomAdList[0].images" mode="widthFix" class="w100 radius5"></image>
		</view>
		<!-- 热门推荐 -->
		<view class=" background-white  gapBorder" v-if="hotProductList"><recommend-title title="热卖商品" path="isHot"></recommend-title></view>
		<scroll-view scroll-x class="scroll-wrap " v-if="hotProductList">
			<view class="recomemnt-item recomentHight " v-for="(item, index) in hotProductList" :key="index" @tap="goProduct(item)">
				<view class="item-img">
					<image lazy-load :src="item.image" mode="widthFix"></image>
					<view class="sold-out" v-if="!item.stock"><view class="out-logo">售罄</view></view>
				</view>
				<view class="item-info ">
					<view class="title-black scroll-title">{{ item.productname }}</view>
					<view class="orange   ">
						<text class="fs22">￥</text>
						<text class="priceStyle">{{ item.price }}</text>
					</view>
					<view class="">
						<text class="gray originPrice" v-if="item.initialPrice">￥{{ item.initialPrice }}</text>
						<text style="opacity: 0;">0</text>
					</view>
				</view>
			</view>
		</scroll-view>
		<scroll-view scroll-x class="scroll-wrap flex mgt70 gapBorder pdt70">
			<view class="scroll-select " :class="{ active: currentIndex == index }" v-for="(item, index) in bigCateArr" :key="item.createDate" @tap="changeSort(index)">
				{{ item.itemName }}
				<view class="line"></view>
			</view>
		</scroll-view>
		<view class="pd30 mgt20">
			<no-data v-if="sortProductList && !sortProductList.length"></no-data>
			<view class="recomemnt-item sort-type" v-for="(item, index) in sortProductList" :key="index" @tap="goProduct(item)">
				<view class="item-img">
					<image lazy-load :src="item.image" mode="widthFix"></image>
					<view class="sold-out" v-if="!item.stock"><view class="out-logo">售罄</view></view>
				</view>
				<view class="item-info">
					<view class="title-black scroll-title ">{{ item.productname }}</view>
					<view class="orange   ">
						<text class="fs22">￥</text>
						<text class="priceStyle">{{ item.price }}</text>
					</view>
					<view class="">
						<text class="gray originPrice" v-if="item.initialPrice">￥{{ item.initialPrice }}</text>
					</view>
				</view>
			</view>
		</view>
		<!-- #ifdef H5 -->
		<a href="http://www.beian.miit.gov.cn" style="text-decoration: none;" v-if="false">
			<view class="fs20 tac background-white pd20 mgt20 title-black">Copyright©版权所有 ICP证：粤ICP备18116847号-2</view>
		</a>
		<!-- #endif -->
	</view>
</template>

<script>
import Notice from '@/components/Notice.vue';
import uniCountdown from '@/components/uni-countdown.vue';
import recommendTitle from '@/components/recommend-title.vue';
import myMixin from '../../common/myMixin.js';
import noData from '@/components/no-data.vue';
import { mapState, mapMutations } from 'vuex';
import {baseUrl} from '@/common/req.js'
// #ifdef H5
const wx = require('weixin-js-sdk');
console.log(wx);
wx.ready(function() {
	wx.updateAppMessageShareData({
		title: '盖世风商城', // 分享标题
		desc: '盖世风商城', // 分享描述
		link: location.origin, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
		imgUrl: '/static/img/logo.png', // 分享图标
		success: function() {
			// 设置成功
			alert(222);
		}
	});
});
// #endif
export default {
	data() {
		return {
			title: 'Hello',
			recommendProduct: null,
			hotProductList: null,
			newProductList: null,
			swiperList: null,
			noteList: [],
			retail: null,
			wholesale: null,
			bottomAdList: null,
			middelAdList: null,
			webUrl: '',
			showWebView: false,
			currentTime: '',
			bigCateArr: null,
			currentIndex: 0,
			sortProductList: false,
			hideLogo:true,
			now:''
		};
	},
	components: {
		Notice,
		uniCountdown,
		recommendTitle,
		noData
	},
	computed: mapState(['systemInfo']),
	mixins: [myMixin],
	onPullDownRefresh() {
		this.getProduct();
		this.checkNewMessage();
		setTimeout(() => {
			uni.stopPullDownRefresh();
		}, 1000);
	},
	onLoad() {
		this.forwardMiniProgram();
		this.getSwiper();
		this.getProduct();
		this.getNotice();
		this.checkNewMessage();
		this.getSort();
		
		if (baseUrl.indexOf('mg.gaishifeng')!=-1) {
			// TODO
			this.hideLogo = false;
		}
	},
	onShow() {
		this.getProduct();
		this.checkNewMessage();
		uni.removeStorageSync('backToHomePage'); //order navigator  
		uni.removeStorageSync('paySuccessToHomePage');  
		uni.removeStorageSync('checkingOrder');  
	},
	onShareAppMessage(res) {
		return {
			title: '库存清货首选平台，购物享折扣、寄售获分润、推广赚佣金'
		};
	},
	methods: {
		changeSort(index) {
			this.currentIndex = index;
			this.sortProductList = [];
			this.getSortList();
		},
		getSortList() {
			let data = {
				type: 2,
				current: 1,
				bigCategory: this.bigCateArr[this.currentIndex].code
			};
			this.apiUrl
				.getNormalProduct({
					data
				})
				.then(res => {
					if (res.data.status == 1) {
						if (res.data.data.pageList.length) {
							let arr = res.data.data.pageList;
							arr = this.setImgSize(arr, '350x350','image');
							this.sortProductList = (this.sortProductList || []).concat(arr);
						}
					}
				});
		},
		retailOver() {
			setTimeout(() => {
				this.getProduct();
			}, 1000);
		},
		wholesaleOver() {
			console.log('over');
			setTimeout(() => {
				this.getProduct();
			}, 1500);
		},
		gettingStart() {
			setTimeout(() => {
				this.getProduct();
			}, 1000);
		},
		goSwiperProduct(item) {
			if (item.type == 2) {
				uni.navigateTo({
					url: '/pages/product/product-detail?id=' + item.url
				});
			} else if (item.type == 1) {
				uni.navigateTo({
					url: 'webPage/webPage?url=' + item.url
				});
			} else if (item.type == 4) {
				uni.setStorageSync('swiperContent', item.imageText);
				uni.navigateTo({
					url: 'webPage/webPage?richText=true'
				});
			}
		},
		goSearch() {
			uni.navigateTo({
				url: '../search/search'
			});
		},
		goProductList(type) {
			if (type == 3) {
				uni.switchTab({
					url: '../member/member'
				});
				return;
			}
			if (type != 2) {
				uni.navigateTo({
					url: '../product/product-zone/product-zone?type=' + type
				});
				return;
			}
			uni.navigateTo({
				url: '../product/product-list?type=' + type
			});
		},
		goProduct(item) {
			uni.navigateTo({
				url: '../product/product-detail?id=' + item.id
			});
		},
		goMessage() {
			uni.navigateTo({
				url: '../member/infomation/info-center'
			});
		},
		getProduct() {
			this.apiUrl
				.getIndexProduct({
					data: {}
				})
				.then(res => {
					if (res.data.status != 1) return;
					this.now = res.data.now;
					this.currentTime = res.data.now;
					this.recommendProduct = this.setImgSize(res.data.data.recommendProduct, '300x240','remomondImageUrl');
					let newProductListArr = res.data.data.newProductList;
					newProductListArr.forEach(item => {
						item.remomondImageUrl ? delete item.remomondImageUrl : '';
					});
					this.newProductList = this.setImgSize(newProductListArr, '550x400');
					res.data.data.hotProductList&&res.data.data.hotProductList.length?this.hotProductList = this.setImgSize(res.data.data.hotProductList, '500x500','image'):'';
					res.data.data.adList?this.swiperList = res.data.data.adList:'';
					res.data.data.noticeList?this.noteList = res.data.data.noticeList:'';
					if(res.data.data.retail){
						this.retail = res.data.data.retail;
						this.retail ? (this.retail.productList = this.setImgSize(this.retail.productList, '170x170','image')) : '';
					}else{
						this.retail = null;
					}
					if (res.data.data.wholesale) {
						this.wholesale = null;
						res.data.data.wholesale.now = res.data.now;
						//批发是否开始
						this.wholesale = res.data.data.wholesale;
						this.wholesale.productList = this.setImgSize(this.wholesale.productList, '170x170','image');
					}else{
						this.wholesale = null;
					}
					this.middelAdList = res.data.data.middelAdList;
					this.middelAdList = this.setImgSize(this.middelAdList, '750x200','images');
					this.bottomAdList = res.data.data.bottomAdList;
					this.bottomAdList = this.setImgSize(res.data.data.bottomAdList, '750x200','images');
				});
		},
		getSort() {
			this.apiUrl
				.getProductTree({
					data: {
						type: 2
					}
				})
				.then(res => {
					if (res.data.status == 1) {
						let mydata = res.data.data;
						this.bigCateArr = mydata;
						this.getSortList();
					}
				});
		},
		getNotice(data) {
			this.apiUrl
				.getHomeNotice({
					data: {}
				})
				.then(res => {});
		},
		getSwiper() {
			this.apiUrl
				.getSwipe({
					data: {
						locationType: 1
					}
				})
				.then(res => {
					if (res.data.status != 1) return;
				});
		}
	}
};
</script>

<style lang="less" scoped>
/* #ifdef H5 */
uni-swiper {
	height: 350upx !important;
}
.content {
	padding-bottom: 100upx;
}
/* #endif */
/* #ifdef MP-WEIXIN */
swiper {
	height: 350upx;
}
/* #endif */

.swiper2 {
	height: 440upx !important;
}

.recomentHight {
	height: 480upx !important;
}
.spc_item {
	display: flex;
	padding: 20upx;
	box-shadow: 0upx 4upx 10upx 0upx rgba(222, 222, 222, 0.5);
	border-radius: 10upx;
	border: 1px solid rgba(239, 239, 239, 1);
	position: relative;
	margin-bottom: 20upx;
	.btn {
		position: absolute;
		right: 20upx;
		bottom: 20upx;
		width: 150upx;
		height: 58upx;
		background: rgba(249, 83, 26, 1);
		border-radius: 30px;
	}
	.left {
		width: 220upx;
		height: 220upx;
		margin-right: 20upx;
		image {
			width: 220upx;
			height: 220upx;
			border-radius: 6upx;
		}
	}
	.right {
		.name {
			font-weight: 400;
			color: rgba(51, 51, 51, 1);
			line-height: 42upx;
			letter-spacing: 1px;
			font-size: 30upx;
		}
		.price {
			font-weight: bold;
			font-size: 34upx;
		}
		.stock {
			color: rgba(153, 153, 153, 1);
			font-size: 22upx;
		}
	}
}

uni-image {
	height: auto;
}
.pdt70 {
	padding-top: 70upx;
}
.mgt70 {
	margin-top: 70upx;
}
.priceStyle {
	font-size: 34upx;
	font-weight: bold;
	color: #fc4e29;
}
.scroll-select {
	font-size: 32upx;
	font-weight: 400;
	color: rgba(101, 101, 101, 1);
	margin: 0 20upx;
	display: inline-block;
	height: 60upx;
	line-height: 50upx;
	position: relative;
	&.active {
		font-size: 42upx;
		font-weight: bold;
		color: rgba(51, 51, 51, 1);
		.line {
			display: block;
		}
	}
	.line {
		display: none;
		width: 70upx;
		height: 8upx;
		background: rgba(252, 78, 41, 1);
		border-radius: 5upx;
		position: absolute;
		bottom: -4upx;
		left: 50%;
		transform: translateX(-50%);
	}
}
.id-ri {
	width: 36upx;
}
.scroll-wrap {
	white-space: nowrap;
}
.scroll-title {
	width: 100%;
	white-space: normal;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	overflow: hidden;
	height: 74upx;
	line-height: 37upx;
	margin-bottom: 12upx;
}
.recomemnt-item {
	margin: 20upx;
	display: inline-block;
	width: 300upx;
	height: 560upx;
	position: relative;
	box-shadow: 0px 8upx 24upx 0px rgba(210, 210, 210, 0.5);
	border-radius: 10upx;
	&.sort-type {
		width: 340upx;
		border-radius: 10upx;
		overflow: hidden;
		margin: 0upx 0 10upx 0;
		&:nth-child(2n) {
			margin-left: 10upx;
		}
		.item-img {
			width: 340upx;
			image {
				width: 100%;
				height: 340upx !important;
				border-radius: 0;
			}
		}
	}
	.item-img {
		width: 300upx;
		image {
			width: 100%;
			height: 240upx;
			border-radius: 10upx;
		}
	}
	.item-info {
		padding: 30upx 20upx 12upx 20upx;
	}
}
.scroll-item {
	margin: 20upx;
	display: inline-block;
	width: 550upx;
	position: relative;
	.item-img {
		width: 550upx;
		image {
			width: 100%;
			border-radius: 10upx;
		}
	}
	.item-info {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
	}
}
.cdWrap {
	display: flex;
	margin-top: 50upx;
	.cd-left {
		font-size: 40upx;
		width: 140upx;
		font-size: 42upx;
		font-weight: bold;
		color: rgba(51, 51, 51, 1);
	}
	.cd-middle {
		flex: 2;
		display: flex;
		align-items: center;

		.time {
		}
	}

	.cd-right {
		display: flex;
		align-items: center;
		color: rgba(153, 153, 153, 1);
		font-size: 26upx;

		image {
			width: 12upx;
			margin-left: 10upx;
		}
	}
}

.zone {
	display: flex;
	justify-content: center;
	align-items: center;
	margin: 60upx auto 60upx auto;
	.item {
		flex: 1;
		justify-content: center;
		align-items: center;
		text-align: center;
		.name {
			color: rgba(51, 51, 51, 1);
			font-size: 28upx;
			font-weight: bold;
		}
		image {
			width: 126upx;
			height: auto;
		}
	}
}

.swiper {
	border-radius: 20upx;
	overflow: hidden;
	image {
		width: 100%;
	}
}

.short-word {
	display: flex;
	justify-content: space-around;
	margin: 35upx auto;
	.item {
		font-size: 24upx;
		color: rgba(101, 101, 101, 1);
		image {
			width: 30upx;
			height: auto;
			margin-right: 10upx;
		}
	}
}
.redPoint {
	position: absolute;
	left: 145upx;
	top: -2upx;
	width: 12upx;
	height: 12upx;
	background: #f62626;
	border-radius: 50%;
	z-index: 10;
}

.index_top {
	margin-bottom: 30upx;
	image {
		width: 60upx;
	}
	.logo {
		width: 276upx;
	}
	.wd_border {
		border: 2upx dashed rgba(51, 51, 51, 1);
	}
}

.new_online {
	height: 440upx;
	display: flex;
	justify-content: space-between;
	margin: 20upx;
	.left {
		width: 460upx;
		height: 440upx;
		margin-right: 20upx;
		border-radius: 10upx;
		overflow: hidden;
		position: relative;
		image {
			width: 100%;
			height: 440upx !important;
		}
		.name {
			position: absolute;
			bottom: 0;
			width: 100%;
			padding: 20upx 0;
			background: rgba(0, 0, 0, 0.3);
		}
	}
	.right {
		width: 210upx;
		image {
			height: 210upx !important;
		}
	}
}
</style>
