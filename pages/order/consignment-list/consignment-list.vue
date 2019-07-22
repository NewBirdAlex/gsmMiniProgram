<template>
	<view class="pageBg" style="padding-bottom: 80px;background: #F9F9F9;">
		<view class="flex-box js-op fs30" @tap="go"><text>我要寄售</text></view>
		<view class="flex-box cl-types background-white">
			<view class="" @tap="changeTypes(index)" v-for="(item, index) in typesList" :key="index" :class="{ active: item.active }">
				{{ item.name }}
				<view class="line"></view>
			</view>
		</view>
		<no-data v-if="productList&&!productList.length"></no-data>
		<view class="order-item" v-for="(item, index) in productList" :key="index">
			<view class="betweenBox">
				<view class="order-number">
					订单编号：{{ item.consignmentSn }}
					<!-- <text class="copyBtn" @tap="clipBoard(item.consignmentSn)">复制</text> -->
				</view>
				<text class="order-status">{{ orderStatus[item.sellStatus] || '' }}</text>
			</view>
			<view class="order-item-product">
				<image class="product-image" :src="item.goodsImage"></image>
				<view class="product-info">
					<view class="title">{{ item.goodsName }}</view>
					<view class="spec">买入套餐：{{ item.packageType }} x{{ item.num }}</view>
					<view class="num">
						成交数量：{{ item.num - item.surplusNum }}, 出售价格：
						<text class="price">￥{{ item.goodsPrice }}</text>
					</view>
				</view>
			</view>
			<!-- #ifdef MP-WEIXIN -->
			<view class="betweenBox order-item-bottom" v-if="item.shareAccelerate.basicSwitch == 1">
				<view class="time flex-box" style="flex: 1;justify-content: left">
					<view>当前排名：{{ item.rank }}</view>
				</view>
				<view class="flex-box btn" v-if="item.sellStatus==1&&!item.doneNum" @tap="cancelOrder(item)" style="margin-right: 10upx">取消寄售</view>
				<button open-type="share" class="share-btn flex-box btn" :data-id="item.id" :data-image="item.goodsImage">我要加速</button>
				<!--<view>{{item.id}}</view>-->
			</view>
			<view class="betweenBox order-item-bottom" v-else>
				<view class="time">
					<view class="" v-if="item.doneNum">
						成交时间：
						<text>{{ item.modifyTime }}</text>
					</view>
				</view>
				<view class="flex-box btn" v-if="item.sellStatus==1&&!item.doneNum" @tap="cancelOrder(item)">取消寄售</view>
			</view>
			<!-- #endif -->

			<!-- #ifndef MP-WEIXIN -->
			<view class="betweenBox order-item-bottom">
				<view class="time">
					<view class="" v-if="item.doneNum">
						成交时间：
						<text>{{ item.modifyTime }}</text>
					</view>
				</view>
				<view class="flex-box btn" v-if="item.sellStatus==1&&!item.doneNum" @tap="cancelOrder(item)">取消寄售</view>
			</view>
			<!-- #endif -->
		</view>
		<uni-popup :show="showCode">
			<view class="showCode">
				<view class="tac">提示</view>
				<view class="tac pd20">继续操作，请输入支付密码：</view>
				<view class="bdb pdb20 flex-box">
					<input type="text" style="flex: 2;" placeholder="请输入支付密码" :password="!showPassword" class="tac" v-model="safeCode" />
					<text class="password-mode mgr20" @tap="showPassword=!showPassword">{{showPassword? '隐藏':'显示'}}</text>
				</view>
				<view class=" betweenBox btns">
					<view class="flex-box " @tap="showCode = !showCode">关闭</view>
					<view class="flex-box" @tap="cancelJishou">确定</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	import myMixin from '../../../common/myMixin.js';
	import noData from '@/components/no-data';
	import uniPopup from '@/components/uni-popup';

	export default {
		data() {
			return {
				typesList: [{
						name: '全部订单',
						active: true
					},
					{
						name: '寄售中',
						active: false
					},
					{
						name: '已寄售',
						active: false
					},
					{
						name: '已取消',
						active: false
					}
				],
				consignType: -1,
				productList: false,
				current: 1,
				allowRequest: true,
				showCode: false,
				safeCode: '',
				cancelObj: null,
				showPassword: false,
				orderStatus: {
					1: '寄售中',
					2: '已寄售',
					3: '已取消',
					4: '部分已寄售'
				}
			};
		},
		mixins: [myMixin],
		computed: mapState(['memberInfo']),
		onShow(e) {
			this.initData();
		},
		onReachBottom() {
			this.getConsignmentList();
		},
		onPullDownRefresh() {
			this.initData();
			setTimeout(() => {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		components: {
			noData,
			uniPopup
		},
		methods: {
			copyTextToClipboard(text) {
				var textArea = document.createElement('textarea');
				textArea.style.position = 'fixed';
				textArea.style.top = 0;
				textArea.style.left = 0;
				textArea.style.width = '2em';
				textArea.style.height = '2em';
				textArea.style.padding = 0;
				textArea.style.border = 'none';
				textArea.style.outline = 'none';
				textArea.style.boxShadow = 'none';
				textArea.style.background = 'transparent';
				textArea.value = text;
				document.body.appendChild(textArea);
				textArea.select();
				try {
					var msg = document.execCommand('copy') ? '成功' : '失败';
					console.log('复制内容 ' + msg);
					uni.showToast({
						title: '复制成功',
						icon: 'none',
						mask: false,
						duration: 1500
					});
				} catch (err) {
					console.log('不能使用这种方法复制内容');
				}
				document.body.removeChild(textArea);
			},
			clipBoard(str) {
				console.log(str);
				// #ifdef H5
				this.copyTextToClipboard(str);
				// #endif
				// #ifndef H5
				uni.setClipboardData({
					data: str,
					success: function() {
						uni.showToast({
							title: '复制成功',
							icon: 'none',
							mask: false,
							duration: 1500
						});
					}
				});
				// #endif
			},
			cancelJishou() {
				if (!this.safeCode) {
					uni.showToast({
						title: '请输入支付密码',
						icon: 'none',
						mask: false,
						duration: 1500
					});
					return;
				}
				this.apiUrl
					.cancelConsignment({
						data: {
							id: this.cancelObj.id,
							paypwd: this.safeCode
						}
					})
					.then(res => {
						if (res.data.status == 1) {
							this.showCode = false;
							this.safeCode = '';
							uni.showToast({
								title: '取消成功',
								duration: 1500,
								icon: 'none',
								icon: 'success'
							});
							setTimeout(() => {
								this.initData();
								this.getConsignmentList();
							}, 1500);
						}
					});
			},
			initData() {
				this.productList = [];
				this.current = 1;
				setTimeout(() => this.getConsignmentList(), 200)
			},
			go() {
				uni.navigateTo({
					url: '../unconsignment/unconsignment'
				});
			},
			cancelOrder(item) {
				uni.showModal({
					title: '提示',
					content: '取消寄售将返回余额与批发卷，不能再次选择寄售或提货，取消请点击确定按钮',
					success: (res)=>{
						if (res.confirm) {
							this.showCode = true;
							this.cancelObj = item;
						} else if (res.cancel) {
							
						}
					}
				});

				
			},
			changeTypes(index) {
				let arr = this.typesList;
				if (arr[index].active == true) return
				arr.forEach(item => (item.active = false));
				arr[index].active = true;
				this.typesListt = arr;
				//get list
				let n = index;
				n == 0 ? (n = -1) : '';
				this.consignType = n;
				this.initData();
			},
			getConsignmentList(type) {
				if (!this.allowRequest) return;
				this.allowRequest = false;
				this.apiUrl
					.goodsConsignment({
						data: {
							memberId: this.memberInfo.id,
							sellStatus: this.consignType,
							current: this.current
						}
					})
					.then(res => {
						this.allowRequest = true;
						if (res.data.status == 1 && res.data.data.pageList && res.data.data.pageList.length) {
							let arr = res.data.data.pageList;
							arr = this.setImgSize(arr, '400x400', 'goodsImage');
							this.productList = this.productList || [];
							arr.forEach(item => {
								item.modifyTime ? (item.modifyTime = this.format(item.modifyTime)) : '';
								this.productList.push(item);
							});
							// this.productList = this.productList.concat(arr);
							// this.productList =[...this.productList,...arr];
							this.current += 1;
						}
					});
			}
		},
		onShareAppMessage(options) {
			const shareId = options.target.dataset.id;
			const goodsImage = option.target.dataset.goodsImage;
			return {
				title: '分享加速',
				imageUrl: goodsImage,
				path: '/pages/share/expedite?shareId=' + shareId
			};
		}
	};
</script>

<style lang="less" scoped>
	.copyBtn {
		padding: 6upx 20upx;
		margin-left: 20upx;
		border: 1px solid #a9a9a9;
		border-radius: 10upx;
	}

	.showCode {
		width: 100%;
		height: 280upx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;

		.btns {
			padding-top: 20upx;

			>view {
				width: 150upx;
				height: 60upx;
				border: 1px solid #bfbfbf;
				border-radius: 40upx;

				&:last-child {
					color: #388ceb;
					border: 1px solid #388ceb;
				}
			}
		}
	}

	.js-op {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 100upx;
		background: rgba(252, 78, 41, 1);
		color: white;
		z-index: 999;
	}

	.cl-types {
		>view {
			margin: 0 20upx;
			padding: 20upx 0 10upx;
			font-size: 32upx;
			font-weight: 400;
			color: rgba(102, 102, 102, 1);
			border-radius: 10upx;

			.line {
				margin: 14upx auto 0;
				width: 70upx;
				height: 10upx;
				border-radius: 6upx;
			}

			&.active {
				color: #388ceb;
				font-size: 40upx;
				font-weight: 500;
				color: rgba(51, 51, 51, 1);

				.line {
					background: #fc4e29;
				}
			}
		}
	}

	.order-item {
		padding: 30upx 30upx 20upx;
		margin: 30upx 30upx 0;
		background: #ffffff;

		.order-number {
			color: #656565;
			font-size: 26upx;
			font-weight: 300;
		}

		.order-status {
			font-size: 26upx;
			font-weight: 400;
			color: #f9531a;
		}

		.order-item-product {
			margin-top: 30upx;
			border-bottom: 1px solid #e5e5e5;

			.product-image {
				width: 150upx;
				height: 150upx;
				display: block;
				float: left;
			}

			.product-info {
				margin-left: 170upx;

				.title {
					height: 80upx;
					font-size: 28upx;
					font-weight: 400;
					color: #333333;
					line-height: 40upx;
					overflow: hidden;
					margin-bottom: 14upx;
				}

				.spec {
					height: 33upx;
					font-size: 24upx;
					font-weight: 400;
					color: #999999;
					line-height: 33upx;
					margin-bottom: 40upx;
				}

				.num {
					height: 40upx;
					font-size: 28upx;
					font-weight: 400;
					color: #656565;
					line-height: 40upx;
					// text-align: right;
					margin-bottom: 20upx;
				}

				.price {
					color: #333333;
					font-weight: 600;
				}
			}
		}

		.order-item-bottom {
			padding-top: 23upx;

			.time {
				height: 37upx;
				font-size: 26upx;
				font-weight: 300;
				color: rgba(101, 101, 101, 1);
				line-height: 37upx;
			}

			.btn {
				width: 170upx;
				height: 64upx;
				border-radius: 35upx;
				border: 1px solid rgba(203, 203, 203, 1);
				font-size: 28upx;
				font-weight: 400;
				color: rgba(101, 101, 101, 1);
				line-height: 64upx;
				padding: 0;
			}

			.share-btn {
				border: 1px solid #f9531a;
				background: #f9531a;
				color: #ffffff;
			}
		}
	}

	// 	.list-name {
	// 		overflow: hidden;
	// 		text-overflow: ellipsis;
	// 		white-space: nowrap;
	// 		width: 470upx;
	// 	}
	//
	// 	.oneline {
	// 		width: 470upx;
	// 		overflow: hidden;
	// 		white-space: nowrap;
	// 		text-overflow: ellipsis;
	// 	}
	//
	// 	.cl-btn {
	// 		width: 170upx;
	// 		height: 60upx;
	// 		border-radius: 30px;
	// 		border: solid 1px #a9a9a9;
	// 		color: #a9a9a9;
	// 	}
</style>
