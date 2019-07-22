<template>
	<view class="pageBg" style="padding-bottom: 80px;">
		<navigator url="../unWholesale/unWholesale">
			<view class="flex-box js-op fs30">
				<text>我要提货</text>
			</view>
		</navigator>

		<view class="flex-box cl-types background-white">
			<view class="" @tap='changeTypes(index)' v-for="(item,index) in typesList" :key='index' :class="{'active':item.active}">
				{{item.name}}
			</view>
		</view>
		<no-data v-if="productList&&!productList.length"></no-data>
		<view class="mgt20 background-white" v-for="(item,index) in productList" :key='index'>
			<view class="cl-num betweenBox bdb pd20">
				<view class="fs24">
					订单编号：{{item.selfMentionSn}}
				</view>
				<text class="primary-color fs30" v-if="item.status==1">未发货</text>
				<text class="primary-color fs30" v-if="item.status==2">已发货</text>
				<text class="primary-color fs30" v-if="item.status==3">已完成</text>
			</view>
			<view class="goods-list list-inline " @tap="go(item)">
				<view class="list-item ">
					<view class="list-img">
						<image :src="item.goodsImage" mode="widthFix" class="w100"></image>
					</view>
					<view class="list-info">
						<view class="oneline title-black fs28">
							{{item.goodsName}}
						</view>
						<view class="gray fs24">
							{{item.packageType}}
						</view>
						<view class="fs28 mgt20 gray">
							x{{item.num}}
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
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
				typesList: [{
						name: '全部订单',
						active: true
					},
					{
						name: '未发货',
						active: false
					},
					{
						name: '已发货',
						active: false
					}
				],
				consignType: -1,
				current: 1,
				productList: false,
				allowRequest:true
			};
		},
		mixins: [myMixin],
		computed: mapState([
			'memberInfo'
		]),
		onShow() {
			this.initPageData();
		},
		onPullDownRefresh() {
			this.initPageData();
		    setTimeout( ()=>{
				 uni.stopPullDownRefresh();
		    }, 1000);
		},
		onLoad(e) {

		},
		components: {
			noData
		},
		onReachBottom() {
			this.getConsignmentList();
		},
		methods: {

			go(product) {
				uni.navigateTo({
					url: '../order?from=tihuo&id=' + product.id
				})
			},
			changeTypes(index) {
				let arr = this.typesList;
				arr.forEach(item => item.active = false)
				arr[index].active = true;
				this.typesListt = arr;
				//get list 
				let n = index;
				n == 0 ? n = -1 : '';
				this.consignType = n;
				console.log(n)

				this.initPageData();
			},
			initPageData() {
				this.productList = [];
				this.current = 1;
				setTimeout(()=>this.getConsignmentList(),200);
			},
			getConsignmentList() {
				if(!this.allowRequest) return
				this.allowRequest = false;
				this.apiUrl.getWholesaleList({
					data: {
						memberId: this.memberInfo.id,
						status: this.consignType,
						current: this.current
					}
				}).then(res => {
					this.allowRequest = true;
					if (res.data.status == 1 && res.data.data.pageList && res.data.data.pageList.length) {
						let arr = res.data.data.pageList;
						arr = this.setImgSize(arr, '400x400','goodsImage');
						this.productList = (this.productList||[]).concat(res.data.data.pageList)
						this.current += 1;
					}
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.js-op {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 100upx;
		background: #FC4E29;
		color: white;
		z-index: 999;
	}

	.cl-types {
		>view {
			margin: 0 20upx;
			padding: 20upx 0;
			font-size: 28upx;

			&.active {
				border-bottom: 2upx solid #FC4E29;
				color: #FC4E29;
			}
		}
	}

	.list-name {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		width: 470upx;
	}

	.oneline {
		width: 470upx;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}

	.cl-btn {
		width: 170upx;
		height: 60upx;
		border-radius: 30px;
		border: solid 1px #a9a9a9;
		color: #a9a9a9;
	}
</style>
