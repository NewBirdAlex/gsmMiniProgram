<template>
	<view class="pc-wrap">
		<view class="">
			<view class="top flex-box" @click="toSearch" id="top">
				<view class="search-frame ">
					<image src="/static/img/public_icon_search@2x.png" mode="widthFix"></image>
					<text class="gray">搜索喜欢的商品</text>
				</view>
			</view>
		</view>
		<view class="pro-type relative">
			<!-- 大类 -->
			<scroll-view id="haha" class="pro-big-type" :style="{ height: windowHeight + 'px' }" scroll-with-animation="true" scroll-y="true" :scroll-into-view="bigCateId">
				<view
					class="pro-type-item relative"
					v-for="(item, index) in bigCateArr"
					:key="item.id"
					:class="showItem == index ? 'active' : ''"
					:data-id="item.id"
					:data-index="index"
					:data-bigcode="item.code"
					@click="bigCateTap"
				>
					<view class="flex-box ">
					{{ item.itemName }}
					<view class="line">
						
					</view>
					</view>
				</view>
			</scroll-view>

			<!-- 大类下的小类 -->
			<scroll-view
				class="smallCate-frame mgt20"
				:style="{ height: windowHeight - searchFrameHeight + 'px' }"
				scroll-with-animation="true"
				scroll-y="true"
				:scroll-into-view="bigCateId"
			>
				<view v-for="(item, index) in bigCateArr" :key="item.id" v-if="false">
					<view class="bigCate-name" :id="'bigcate' + index">
						<image lazy-load :src="item.image"></image>
						<view>{{ item.itemName }}</view>
					</view>
					<view class="pro-sm-type clearfix ">
						<block v-for="(cateItem, cateIndex) in item.children" :key="cateItem.id">
							<view class="pst-item">
								<image lazy-load v-if="cateItem.image != ''" :src="cateItem.image" />
								<image lazy-load v-else src="../../img/img-default.png" />

								<view class="title">{{ cateItem.itemName }}</view>
							</view>
						</block>
					</view>
				</view>
				<view class="pro-sm-type clearfix " v-if="bigCateArr.length">
					<block v-for="(cateItem, cateIndex) in bigCateArr[subIndex].children" :key="cateItem.id">
						<navigator :url="'product-list?type=2&smallCategory=' + cateItem.code">
							<view class="pst-item">
								<image lazy-load v-if="cateItem.image != ''" :src="cateItem.image" />
								<image lazy-load v-else src="../../img/img-default.png" />
								<view class="title">{{ cateItem.itemName }}</view>
							</view>
						</navigator>
					</block>
				</view>
				<view class="pd20 gray tac fs36" v-if="!(bigCateArr && bigCateArr[subIndex] && bigCateArr[subIndex].children && bigCateArr[subIndex].children.length)">
					暂无产品
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			bigCateArr: [],
			smallCateArr: [],
			showItem: 0,
			categoryCode: '',
			categoryId: 0,
			code: '',
			bigCateId: '',
			windowHeight: '',
			searchFrameHeight: '',
			subIndex: 0
		};
	},
	onPullDownRefresh() {
		this.bigCateArr = [];
		this.smallCateArr = [];
		this.subIndex = 0;
		this.showItem = 0;
		this.categoryId = 0;
		let that = this;
		uni.getSystemInfo({
			success: function(res) {
				console.log(res);
				that.windowHeight = res.windowHeight;
			},
		})
		that.getBigCateGory();
		that.getSearchFrameHeight();
		setTimeout( ()=>{
			 uni.stopPullDownRefresh();
		}, 1000);
	},
	onLoad() {
		let that = this;
		uni.getSystemInfo({
			success: function(res) {
				console.log(res);
				that.windowHeight = res.windowHeight;
			}
		});
		that.getBigCateGory();
		that.getSearchFrameHeight();
	},
	methods: {
		//去搜索
		toSearch(e) {
			// uni.navigateTo({
			// 	url: 'product-list?type=2&bigCategory=' + this.bigCateArr[this.showItem].code
			// });
			uni.navigateTo({
				url:'../search/search'
			})
		},
		//   获取搜索框高度
		getSearchFrameHeight() {
			//创建节点选择器
			let that = this;
			var query = uni.createSelectorQuery();
			//选择id
			query.select('#top').boundingClientRect();
			query.exec(function(res) {
				if (res && res[0]) {
					that.searchFrameHeight = res[0].height;
				}
			});
		},
		// 获取产品大分类
		getBigCateGory() {
			let that = this;
			this.apiUrl
				.getProductTree({
					data: {
						type: 2
					}
				})
				.then(res => {
					console.log(res);
					if (res.data.status == 1) {
						let mydata = res.data.data;
						console.log(mydata);
						mydata.forEach(item => {
							item.children = this.setImgSize(item.children, '260x260','image');
						});
						that.bigCateArr = mydata;
					}
				});
		},
		bigCateTap(e) {
			let that = this;
			if (e) {
				that.showItem = e.target.dataset.index;
				(that.categoryId = e.target.dataset.id), (that.categoryCode = e.target.dataset.bigcode);
				that.bigCateId = 'bigcate' + e.target.dataset.index;
				this.subIndex = e.target.dataset.index;
			} else {
				that.showItem = 0;
				that.categoryId = that.bigCateArr[0].id;
				that.categoryCode = that.bigCateArr[0].code;
			}
		}
	}
};
</script>
<style lang="less" scoped>
@import url('./product-category.less');
.line{
	position: absolute;
	left: 0;
	top: 50%;
	width:14upx;
	height:60upx;
	background:rgba(252,78,41,1);
	border-radius:6upx;
	transform: translateY(-50%);
	display: none;
}
</style>
