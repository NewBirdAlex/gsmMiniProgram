<template>
	<view class="pageBg">
		<view class="od-nav  background-white">
			<view class="gray fs28" v-for="(item, index) in navList" :key="index" :class="{ 'primary-color': item.active }" @click="changeList(index)">{{ item.name }}</view>
		</view>
		<no-data v-if="orderList&&!orderList.length"></no-data>
		<view class="od-list mgt20 background-white">
			<view class="item pageBd" v-for="(item, index) in orderList" :key="item.id">
				<view class="item-num pd20 betweenBox bdb">
					<text class="fs26">订单编号：{{ item.orderNO }}</text>
					<view class="yellow fs30" v-if="item.payStatus == 0">
						<!-- {{item.orderStatusStr}} -->
						<text v-if="item.payStatus == 0 && item.orderStatus == 1">待付款</text>
						<text v-else-if="item.orderStatus == 4">已取消</text>
						<text v-else-if="item.orderStatus == 9">已取消</text>
						<order-countdown
							v-if="item.payStatus == 0 && item.orderStatus != 4 && item.orderStatus != 9"
							@activeOver="timeOver(index)"
							:currentTime="systemInfo.now"
							:orderType="item.type"
							:timer="item.createDate"
						></order-countdown>
					</view>
					<view class="primary-color fs30" v-if="item.payStatus == 1">
						<!-- {{item.orderStatusStr}} -->
						<text v-if="item.orderStatus == 1">待发货</text>
						<text v-if="item.orderStatus == 2">待收货</text>
						<text v-if="item.orderStatus == 3">已签收</text>
						<text v-if="item.orderStatus == 4">已取消</text>
						<text v-if="item.orderStatus == 5">申请退款中</text>
						<text v-if="item.orderStatus == 6">拒绝退款</text>
						<text v-if="item.orderStatus == 7">已退款</text>
						<text v-if="item.orderStatus == 8">已评论</text>
						<text v-if="item.orderStatus == 9">已取消</text>
					</view>
				</view>
				<view class="goods-list list-inline" @tap="goDetail(item.id)">
					<view class="list-item bdb " v-for="(subitem, subindex) in item.appProductOrderList" :key="subitem.id">
						<view class="list-img"><image :src="subitem.imageUrl" mode="widthFix" class="w100"></image></view>
						<view class="list-info ">
							<view class="list-name title-black fs28">{{ subitem.productName }}</view>
							<view class="gray fs24">规格：{{ subitem.productModelName }} 数量：{{ subitem.amout }}</view>
							<view class="list-price">
								<text class="fs36 primary-color">￥{{ subitem.price }}</text>
							</view>
						</view>
					</view>
				</view>
				<view class="betweenBox pd20">
					<view class="flex-box">
						<text class="fs30">合计：</text>
						<text class="primary-color fs36">￥{{ item.orderAmount }}</text>
					</view>
					<view class="" v-if="item.orderStatus == 4">
						<!-- <view class="op-btns gray">
							已取消订单
						</view> -->
					</view>
					<view class="" v-else>
						<view class="flex-box">
							<view class="op-btns" v-if="item.payStatus == 0 && item.orderStatus != 9" @tap="cancelOrder(item, index)">取消订单</view>
							<view class="op-btns background-yellow white nobd" v-if="item.payStatus == 0 && item.orderStatus != 9" @tap="goToPay(item)">立即付款</view>
							<view class="op-btns" v-if="item.payStatus == 1 && item.type == 1 && item.appProductOrderList[0].mayAmout" @tap="goConsignOrWhole(0)">我要提货</view>
							<view
								class="op-btns primary-background white nobd"
								v-if="item.payStatus == 1 && item.type == 1 && item.appProductOrderList[0].mayAmout"
								@tap="goConsignOrWhole(1)"
							>
								我要寄售
							</view>
							<view class="op-btns primary-background white nobd" v-if="item.orderStatus == 2 && item.payStatus == 1" @tap="haveGetProduct(item.id)">确认收货</view>
							<view class="op-btns " v-if="item.type == 2 && item.payStatus == 1 && (item.orderStatus == 1 || item.orderStatus == 6)" @tap="refund(item)">
								申请退款
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import orderCountdown from '@/components/order-countdown.vue';
	import noData from '@/components/no-data';
export default {
	data() {
		return {
			navList: [
				{
					name: '全部订单',
					active: true
				},
				{
					name: '待付款',
					active: false
				},
				{
					name: '待发货',
					active: false
				},
				{
					name: '待收货',
					active: false
				},
				{
					name: '退换货',
					active: false
				}
			],
			orderType: 0,
			orderList: false,
			current: 1,
			pageCount: 10,
			allowRequest:true,
			noMoreData:false
		};
	},
	components: { 
		orderCountdown ,
		noData
	},
	onShow() {
		this.upDateOrderStarus();
		this.$store.dispatch('getSystemInfo');
	},
	onPullDownRefresh() {
		this.initListDate();
	    setTimeout( ()=>{
			 uni.stopPullDownRefresh();
	    }, 1000);
	},
	onLoad(e) {
		e.orderType ? (this.orderType = e.orderType) : '';
		this.initNav(this.orderType);
		this.getList();
	},
	computed: mapState(['memberInfo', 'systemInfo']),
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
		upDateOrderStarus(){
			let checkingOrder = uni.getStorageSync('checkingOrder');
			if(this.orderList&&this.orderList.length&&checkingOrder){
				let arr = this.orderList;
				for(let i = 0;i<arr.length;i++){
					if(arr[i].id==checkingOrder.id){
						arr[i] = checkingOrder;
					}
				}
				this.orderList = arr;
			}
		},
		timeOver(index) {
			let arr = this.orderList;
			arr[index].orderStatus = 9;
			this.orderList = arr;
		},
		haveGetProduct(id) {
			//收获
			uni.showModal({
				title: '提示',
				content: '确认收货',
				success: (res)=>{
					if (res.confirm) {
						console.log('用户点击确定');
						this.apiUrl
							.confirmDelivery({
								data: {
									orderId: id
								}
							})
							.then(res => {
								if (res.data.status == 1) {
									uni.showToast({
										title: '操作成功',
										duration: 1500,
										icon: 'success'
									});
									// update status
									this.getOrderDetail(id);
								}
							});
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			});
			
		},
		goConsignOrWhole(type) {
			if (type) {
				uni.navigateTo({
					url: 'unconsignment/unconsignment'
				});
			} else {
				uni.navigateTo({
					url: 'unWholesale/unWholesale'
				});
			}
		},
		refund(item) {
			uni.navigateTo({
				url: '../refund/refund?id=' + item.id
			});
		},
		goToPay(item) {
			uni.setStorageSync('payingObj',item);
			uni.navigateTo({
				url: 'submitOrder/submitOrder'
			});
		},
		goDetail(id) {
			uni.navigateTo({
				url: 'order?id=' + id
			});
		},
		initNav(index) {
			let arr = this.navList;
			arr.forEach(item => (item.active = false));
			let n = index;
			if (n == 4) {
				arr[n].active = true;
				n = 5;
			} else {
				arr[n].active = true;
			}
			this.orderType = n;
			this.navList = arr;
		},
		initListDate() {
			this.noMoreData = false;
			this.current = 1;
			this.orderList = [];
			setTimeout(()=>this.getList(),200);
		},
		getList() {
			let mid = this.memberInfo.id;
			if(!this.allowRequest) return
			this.allowRequest = false;
			uni.showLoading({
				title:'加载中...'
			})
			this.apiUrl
				.getOrderList({
					data: {
						status: this.orderType,
						memberId: mid,
						pageCount: this.pageCount,
						current: this.current
					}
				})
				.then(res => {
					this.allowRequest = true;
					uni.hideLoading();
					if (res.data.status == 1) {
						if(res.data.data.pages==this.current){
							this.noMoreData = true;
						}
						if (res.data.data.pageList.length) {
							let arr = res.data.data.pageList;
							arr.forEach(item => {
								item.appProductOrderList = this.setImgSize(item.appProductOrderList, '200x200');
							});
							this.orderList = (this.orderList||[]).concat(arr);
							this.current += 1;
						}
					}
				});
		},
		changeList(index) {
			this.noMoreData = false;
			let arr = this.navList;
			arr.forEach(item => (item.active = false));
			arr[index].active = true;
			this.navList = arr;

			//order type
			let type = index;
			type == 4 ? ++type : '';
			this.orderType = type;
			this.initListDate();
		},
		getOrderDetail(id){
			this.apiUrl
				.getOrderDetail({
					data: {
						orderId: id
					}
				})
				.then(res => {
					console.log(res);
					if (res.data.status == 1) {
						let checkingOrder = res.data.data;
						console.log(checkingOrder);

						if(this.orderList&&this.orderList.length&&checkingOrder){
							let arr = this.orderList;
							for(let i = 0;i<arr.length;i++){
								if(arr[i].id==checkingOrder.id){
									arr[i] = checkingOrder;
									this.orderList.splice(i,1,checkingOrder);
								}
							}
							console.log(arr);
							// this.orderList = arr;
							console.log(this.orderList);
						}
					}
				});
		},
		//取消订单
		cancelOrder(item, index) {
			uni.showModal({
				title: '提示',
				content: '确认取消订单',
				success: res => {
					if (res.confirm) {
						this.apiUrl
							.cancelOrder({
								data: {
									orderId: item.id
								}
							})
							.then(res => {
								if (res.data.status == 1) {
									uni.showToast({
										title: '成功取消订单',
										duration: 1500,
										icon: 'success'
									});
									this.getOrderDetail(item.id);
								} else {
									uni.showToast({
										title: res.data.message,
										duration: 2000,
										icon: 'none'
									});
								}
							});
					}
				}
			});
		}
	}
};
</script>

<style lang="less">
.goods-list {
	margin: 0 20upx;
	.list-item {
		padding: 20upx 0;
		.list-img {
			height: auto;
		}
	}
}
.op-btns {
	width: 170upx;
	height: 60upx;
	text-align: center;
	line-height: 60upx;
	margin-right: 20upx;
	font-size: 26upx;
	border-radius: 30upx;
	border: 2upx solid #a9a9a9;
}
.od-nav {
	display: flex;
	justify-content: space-around;
	height: 70upx;
	line-height: 70upx;
	align-items: center;
	> view {
		height: 100%;
		&.primary-color {
			border-bottom: 4upx solid #FC4E29;
		}
	}
}
</style>
