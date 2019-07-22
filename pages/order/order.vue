<template>
	<view class="pageBg" v-if="order">
		<view class="background-white">
			<view class="pd20 bdb betweenBox fs30">
				<text class="title-black ">订单状态</text>
				<view class="yellow">
					<text class="primary-color " v-if="order.payStatus == 0 && order.orderStatus != 4 && order.orderStatus != 9">待付款</text>
					<text class="primary-color " v-else>{{ order.orderStatusStr }}</text>
					<order-countdown
						v-if="order.payStatus == 0 && order.orderStatus != 4 && order.orderStatus != 9"
						:currentTime="systemInfo.now"
						:orderType="order.type"
						:timer="order.createDate"
					></order-countdown>
				</view>
			</view>
			<view class="pd20 bdb betweenBox fs30" v-if="order.adminRefundRemrk && order.orderStatus != 7">
				<text class="title-black ">拒绝退款原因</text>
				<text class="primary-color ">{{ order.adminRefundRemrk }}</text>
			</view>
			<view class="pd20 bdb betweenBox fs30" v-if="order.disagreereason">
				<text class="title-black ">申请退款原因</text>
				<text class="primary-color ">{{ order.disagreereason }}</text>
			</view>
			<view class="pd20 bdb betweenBox fs30" v-if="false">
				<text class="title-black ">支付状态</text>
				<view class="primary-color " v-if="order.payStatus == 0">
					待支付
					<order-countdown :timer="order.createDate" :orderType="order.type"></order-countdown>
				</view>
				<view class="primary-color " v-if="order.payStatus == 1">已支付</view>
			</view>
			<view class="pd20 bdb betweenBox fs30" v-if="order.payStatus">
				<text class="title-black ">支付方式</text>
				<text class="title-black ">{{ order.payName }}</text>
			</view>
			<view class="pd20 bdb betweenBox fs30" v-if="order.payTime">
				<text class="title-black ">支付时间</text>
				<text class="title-black ">{{ order.payTime || '无' }}</text>
			</view>
			<view class="pd20 bdb betweenBox fs30">
				<text class="title-black ">订单编号</text>
				<text class="title-black ">{{ order.orderNO }}</text>
			</view>
			<view class="pd20 bdb betweenBox fs30">
				<text class="title-black ">下单时间</text>
				<text class="title-black ">{{ order.addTime }}</text>
			</view>

			<view class="pd20 pageBd betweenBox fs30">
				<text class="title-black ">购买备注</text>
				<text class="title-black ">{{ order.userNote || '无' }}</text>
			</view>
			<!-- express -->
			<navigator :url="'logistics/logistics?id=' + order.id + (fromTihuo ? '&tihuoId=' + orderId : '')" v-if="expressInfo">
				<view class="address pd20 pageBd">
					<view class="address-tag background-blue tac white fs20">物流信息</view>
					<view class="">
						<view class="locate">
							<image src="/static/img/locate-yellow.png" mode="widthFix" class="mgr20"></image>
							<view class="primary-color fs24 mgt10" v-if="expressInfo">
								{{ expressInfo.context }}
								<view class="gray fs24 mgt10">{{ expressInfo.time }}</view>
							</view>
							<view class="gray fs24 mgt10" v-else>暂无物流信息</view>
						</view>
						<image src="/static/img/rightArrow.png" mode="widthFix" class="ra"></image>
					</view>
				</view>
			</navigator>

			<!-- //addresss -->
			<address-using :address="order"></address-using>

			<!-- 发票 -->
			<view class="background-white pd20 order-fp pageBd" v-if="order.appOrderInvoice.invoiceStatus != 0">
				<view class="order-fpTag fs20">发票信息</view>
				<view class="betweenBox pd20">
					<view class="gray fs30">发票类型</view>
					<view class="rightPart" v-if="order.appOrderInvoice.invoiceStatus == 1">纸质发票</view>
					<view class="rightPart" v-if="order.appOrderInvoice.invoiceStatus == 2">增值税发票</view>
				</view>
				<view class="betweenBox pd20" v-if="order.appOrderInvoice.invoiceTitle">
					<view class="gray fs30">发票抬头</view>
					<view class="rightPart">{{ order.appOrderInvoice.invoiceTitle }}</view>
				</view>
				<view class="betweenBox pd20" v-if="order.appOrderInvoice.uniformSocialCreditCode">
					<view class="gray fs30">统一社会信用代码</view>
					<view class="rightPart">{{ order.appOrderInvoice.uniformSocialCreditCode }}</view>
				</view>
				<view class="betweenBox pd20 " v-if="order.appOrderInvoice.unitName">
					<view class="gray fs30">单位名称</view>
					<view class="rightPart">{{ order.appOrderInvoice.unitName }}</view>
				</view>
				<view class="betweenBox pd20 " v-if="order.appOrderInvoice.taxpayerCode">
					<view class="gray fs30">纳税人识别号</view>
					<view class="rightPart">{{ order.appOrderInvoice.taxpayerCode }}</view>
				</view>
				<view class="betweenBox pd20 " v-if="order.appOrderInvoice.unitAddress">
					<view class="gray fs30">单位地址</view>
					<view class="rightPart">{{ order.appOrderInvoice.unitAddress }}</view>
				</view>
				<view class="betweenBox pd20" v-if="order.appOrderInvoice.unitName">
					<view class="gray fs30">单位电话</view>
					<view class="rightPart">{{ order.appOrderInvoice.unitName }}</view>
				</view>
				<view class="betweenBox pd20 " v-if="order.appOrderInvoice.bankName">
					<view class="gray fs30">开户银行</view>
					<view class="rightPart">{{ order.appOrderInvoice.bankName }}</view>
				</view>
				<view class="betweenBox pd20" v-if="order.appOrderInvoice.bankAccount">
					<view class="gray fs30">银行账号</view>
					<view class="rightPart">{{ order.appOrderInvoice.bankAccount }}</view>
				</view>
			</view>
			<!-- 商品 -->
			<view class="goods-list list-inline ">
				<view class="list-item bdb" v-for="(item, index) in order.appProductOrderList" :key="item.orderId" @tap="goToProduct(item)">
					<view class="list-img"><image :src="item.imageUrl" mode="widthFix" class="w100"></image></view>
					<view class="list-info">
						<view class="list-name title-black fs28">{{ item.productName }}</view>
						<view class="gray fs24">规格：{{ item.productModelName }}</view>
						<view class="list-price">
							<text class="fs36 primary-color">￥{{ item.price }}</text>
							<text class="gray fs24">x {{ item.amout }}</text>
						</view>
					</view>
				</view>
			</view>
			<view class="pd20 bdb betweenBox fs30">
				<text class="title-black ">订单运费</text>
				<text class="title-black ">￥{{ order.shippingPrice }}</text>
			</view>
			<view class="pd20 bdb betweenBox fs30" v-if="order.giveFrozenMoney">
				<text class="title-black ">赠送批发卷</text>
				<text class="title-black ">{{ order.giveFrozenMoney }}</text>
			</view>
			<view class="pd20 bdb betweenBox fs30">
				<text class="title-black ">积分抵扣</text>
				<text class="title-black ">￥{{ order.integral }}</text>
			</view>
			<view class="pd20 pageBd betweenBox fs30">
				<text class="title-black ">实付金额</text>
				<text class="title-black primary-color">￥{{ order.orderAmount }}</text>
			</view>
			<view class="pageBd"></view>
			<view class="pageBd"></view>
			<view class="pageBd"></view>
			<view class="btn_wrap" v-if="!platform">
				<view class="two-btns " v-if="order.type == 1 && order.orderStatus != 4 && order.payStatus == 1 && !fromTihuo">
					<view class="flex-box fs30">我要提货</view>
					<view class="background-blue white flex-box fs30">我要寄售</view>
				</view>
				<view class="two-btns " v-if="order.payStatus == 0 && order.orderStatus != 9 && order.orderStatus != 4">
					<view class="flex-box fs30" @tap="cancelOrder">取消订单</view>
					<view class="background-yellow white flex-box fs30" @tap="payNow">立即付款</view>
				</view>
				<navigator :url="'../refund/refund?id=' + order.id">
					<view class="full-btn background-blue white fs30 flex-box" v-if="order.type == 2 && order.payStatus == 1 && order.orderStatus == 1 && order.orderStatus != 5">
						申请退款
					</view>
				</navigator>
				<view class="full-btn background-blue white fs30 flex-box " v-if="order.orderStatus == 2 && order.payStatus == 1" @tap="haveGetProduct(order.id)">确认收货</view>
			</view>
		</view>
	</view>
</template>

<script>
import orderCountdown from '@/components/order-countdown.vue';
import addressUsing from '@/components/address-using.vue';
import myMixin from '@/common/myMixin.js';
import { mapState, mapMutations } from 'vuex';
export default {
	data() {
		return {
			order: null,
			orderId: null,
			expressInfo: null,
			fromTihuo: false,
			platform: false
		};
	},
	mixins: [myMixin],
	onShow() {
		this.getOrderDetail(this.orderId);
	},
	onUnload() {
		console.log('checking');
		uni.setStorageSync('checkingOrder',this.order);
	},
	onLoad(e) {
		if (e.from) this.fromTihuo = true;
		this.orderId = e.id;
		this.getOrderDetail(e.id);
		// #ifdef H5
		if (e.platform) {
			this.platform = true;
			document.querySelector('uni-page-head').style.display = 'none';
		}
		// #endif
	},
	computed: mapState(['memberInfo', 'systemInfo']),
	methods: {
		haveGetProduct(id) {
			uni.showModal({
				title: '提示',
				content: '确认收货',
				success: (res)=>{
					if (res.confirm) {
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
									this.getOrderDetail(id);
								}
							});
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			});
			//收获
			
		},
		payNow() {
			uni.setStorage({
				key: 'payingObj',
				data: this.order,
				success: () => {
					uni.navigateTo({
						url: `submitOrder/submitOrder`
					});
				}
			});
		},
		cancelOrder() {
			uni.showModal({
				title: '提示',
				content: '确定要取消订单吗',
				success: res => {
					this.apiUrl
						.cancelOrder({
							data: {
								orderId: this.order.id
							}
						})
						.then(res => {
							if (res.data.status == 1) {
								uni.showToast({
									title: '成功取消订单',
									mask: false,
									icon: 'none',
									duration: 1500
								});
								this.getOrderDetail(this.order.id);
							}
						});
				},
				fail: () => {},
				complete: () => {}
			});
		},
		goToProduct(product) {
			if (!product.enable) {
				uni.showToast({
					title: '商品已下架或不存在',
					mask: false,
					icon: 'none',
					duration: 1500
				});
				return;
			}
			uni.navigateTo({
				url: '../product/product-detail?id=' + product.productId
			});
		},
		getExpress() {
			let data = {};
			this.fromTihuo ? (data.selfMentionOrderId = this.orderId) : ''; //提货物流参数
			data.orderId = this.orderId;
			this.apiUrl
				.getParcelInfo({
					data
				})
				.then(res => {
					console.log(res);
					if (res.data.status == 1 && res.data.data && res.data.data.route.length) {
						this.expressInfo = res.data.data.route[0];
					}
				});
		},
		getOrderDetail(id) {
			if (this.fromTihuo) {
				this.apiUrl
					.order_getSelfMentionOrder({
						data: {
							id: id
						}
					})
					.then(res => {
						if (res.data.status == 1) {
							this.order = res.data.data;
							this.order.addTime = this.format(this.order.addTime);
							this.order.payTime ? (this.order.payTime = this.format(this.order.payTime)) : '';
							this.order.appProductOrderList = this.setImgSize(this.order.appProductOrderList, '200x200');

							if (this.order.shippingStatus == 1) {
								this.getExpress();
							}
						}
					});
			} else {
				this.apiUrl
					.getOrderDetail({
						data: {
							orderId: id
						}
					})
					.then(res => {
						if (res.data.status == 1) {
							this.order = res.data.data;
							this.order.addTime = this.format(this.order.addTime);
							this.order.payTime ? (this.order.payTime = this.format(this.order.payTime)) : '';
							this.order.appProductOrderList = this.setImgSize(this.order.appProductOrderList, '200x200');
							if (this.order.shippingStatus == 1) {
								this.getExpress();
							}
						}
					});
			}
		}
	},
	components: {
		orderCountdown,
		addressUsing
	}
};
</script>

<style lang="less" scoped>
.btn_wrap {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	background: white;
}
.order-fp {
	.order-fpTag {
		width: 140upx;
		height: 36upx;
		background: linear-gradient(90deg, rgba(31, 205, 84, 1) 0%, rgba(17, 146, 20, 1) 100%);
		border-radius: 30upx;
		line-height: 36upx;
		margin-bottom: 10upx;
		color: white;
		text-align: center;
	}
	.rightPart {
		width: 400upx;
	}
	.betweenBox {
		padding: 10upx 20upx;
	}
}
.full-btn {
	height: 100upx;
}

.two-btns {
	display: flex;

	> view {
		flex: 1;
		height: 100upx;
	}
}

.address {
	position: relative;

	.ra {
		position: absolute;
		right: 20upx;
		top: 50%;
		width: 16upx;
		transform: translateY(-50%);
	}

	.locate {
		display: flex;

		image {
			width: 22upx;
			margin-top: 10upx;
		}

		> view {
			width: 560upx;
		}
	}

	.address-tag {
		width: 140upx;
		height: 34upx;
		background: #fc4e29;
		border-radius: 30upx;
		line-height: 34upx;
		margin-bottom: 10upx;
	}
}
</style>
