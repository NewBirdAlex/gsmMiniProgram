<template>
	<view class="bank ">
		<view class="flex-box b_top">
			<view class="" :class="{ active: showBank }" @tap="showBank = !showBank">
				银行卡
				<view class="line"></view>
			</view>
			<view class="" :class="{ active: !showBank }" @tap="showBank = !showBank">
				支付宝
				<view class="line"></view>
			</view>
		</view>
		<view class="" v-if="showBank">
			<view class="card " v-for="(item, index) in carddata" :key="item.id" >
				<view class="">
					<text class="md">{{ item.bankName }}</text>
				</view>
				<view class=" mgb20">
					<text class="fs28">{{ item.depositBank }}</text>
					<text class="fs28 mgl20">{{ item.userName }}</text>
				</view>
				<view class="mgt20">
					<text class="sm">{{ item.startNum }} **** **** **** {{ item.lastNum }}</text>
				</view>
				<image src="/static/img/public_icon_more_erect@2x.png" mode="widthFix" class="delBtn" @tap="delCard(item)"></image>
			</view>
			<no-data v-if='!carddata.length'></no-data>

		</view>
		<view class="" v-else>
			<view class="card card2" v-for="(item2, index2) in aliBank" :key="item2.modifyTime" >
				<view class="left flex-box">
					<image src="/static/img/icon_alipay@2x.png" mode="width"></image>
				</view>
				<view class="right mgl20">
					<view class=" mgb20">
						<text class="fs28 mgl20">{{ item2.userName }}</text>
					</view>
					<view class="mgt20">
						<text class="sm">{{ item2.cartNO }}</text>
					</view>
				</view>
				
				<image src="/static/img/public_icon_more_erectali@2x.png" mode="widthFix" class="delBtn" @tap="delCard(item2)"></image>
			</view>
			<no-data v-if='!aliBank.length'></no-data>
		</view>
		
		
		<view class="op_btn" v-if="mask">
			<view class="">
				<view class="fs36 background-white pd20 flex-box" @tap="unlinkAccout">
					解绑{{selectBank.type==1?'银行卡':'支付宝'}}
				</view>
				<view class="fs36 background-white pd20 flex-box mgt20" @tap="mask=!mask">
					取消
				</view>
			</view>
		</view>
		<view class="addcard flex-box" @tap="addcard"><text>添加银行卡/支付宝</text></view>
	</view>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import noData from '@/components/no-data.vue'

export default {
	data() {
		return {
			carddata: [],
			showBank: true,
			aliBank: [],
			mask:false,
			selectBank:null
		};
	},
	components:{
		noData
	},
	computed: mapState(['memberInfo']),
	watch: {
		carddata(newv) {
			console.log(newv);
		}
	},
	onPullDownRefresh() {
		this.carddata=[]
		this.aliBank = [];
		setTimeout( ()=>{
			this.getList()
		}, 100);
	    setTimeout( ()=>{
			 uni.stopPullDownRefresh();
	    }, 1000);
	},
	onShow() {
		this.carddata = [];
		this.aliBank = [];
		this.getList();
	},
	methods: {
		unlinkAccout(){
			uni.showModal({
				title: '提示',
				content: '是否确定删除',
				success: res => {
					if (res.confirm) {
						this.apiUrl
							.delCard({
								data: {
									id: this.selectBank.id
								}
							})
							.then(res => {
								if (res.data.status == 1) {
									this.mask = false;
									uni.showToast({
										title: '解除绑定成功',
										duration: 1000,
										icon: 'none'
									});
									setTimeout(() => {
										this.carddata = [];
										this.aliBank = [];
										this.getList();
									}, 1000);
								}
							});
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			});
		},
		getList() {
			this.apiUrl
				.getBankList({
					data: {
						memberId: this.memberInfo.id
					}
				})
				.then(res => {
					if (res.data.status == 1) {
						let arr = res.data.data;
						arr.forEach(item => {
							if (item.type == 1) {
								let len = item.cartNO.length;
								item.startNum = item.cartNO.slice(0, 4);
								item.lastNum = item.cartNO.slice(len - 4);
								this.carddata.push(item);
							} else {
								this.aliBank.push(item);
							}
						});
					}
				});
		},
		delCard(item) {
			this.mask = true;
			this.selectBank = item;
		},
		addcard() {
			uni.navigateTo({
				url: 'add-bank'
			});
		}
	},
	mounted() {}
};
</script>
<style lang="less" scoped>
	.op_btn{
		position: fixed;
		top: 0;
		width: 100%;
		height: 100vh;
		left: 0;
		background: rgba(0, 0, 0, 0.5);
		z-index: 100;
		display: flex;
		flex-direction: column-reverse;
	}
.b_top {
	margin-bottom: 40upx;
	> view {
		height: 60upx;
		line-height: 60upx;
		margin: 30upx 20upx;
		position: relative;
		&.active {
			color: rgba(51, 51, 51, 1);
			font-weight: bold;
			font-size: 40upx;
			.line {
				display: block;
			}
		}
		.line {
			position: absolute;
			bottom: -10upx;
			left: 50%;
			transform: translateX(-50%);
			width: 70upx;
			height: 10upx;
			background: rgba(252, 78, 41, 1);
			border-radius: 6upx;
			display: none;
		}
	}
}
.card {
	box-sizing: border-box;
	padding: 36upx;
	border-radius: 8px;
	color: white;
	margin-bottom: 30upx;
	width: 690upx;
	height: 300upx;
	background: linear-gradient(128deg, rgba(252, 84, 97, 1) 0%, rgba(254, 136, 114, 1) 100%);
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	position: relative;
	&.card2 {
		background: linear-gradient(128deg, rgba(72, 116, 211, 1) 0%, rgba(99, 179, 244, 1) 100%);
		height: 200upx;
		display: flex;
		flex-direction: row;
		.left{
			width: 70upx;
			>image{
				width: 70upx;
				height: 70upx;
			}
		}
		.right{
			flex: 2;
		}
	}
	.sm {
		font-size: 40upx;
		margin-right: 40upx;
	}
	.md {
		font-size: 36upx;
	}
	.delBtn {
		position: absolute;
		right: 10upx;
		top: 40upx;
		width: 10upx;
		padding: 0 30upx;
	}
}
.bank {
	display: flex;
	flex-direction: column;
	align-items: center;
	box-sizing: border-box;
	padding: 20upx 25upx 90upx;
	.addcard {
		height: 90upx;
		font-size: 30upx;
		position: fixed;
		bottom: 0;
		z-index: 3;
		padding: 15upx 30upx;
		
		width:750upx;
		background:rgba(255,255,255,1);
		box-shadow:0 -3upx 7upx 0 rgba(219,219,219,0.5);
		
		text {
			width: 690upx;
			height: 90upx;
			line-height: 90upx;
			text-align: center;
			display: block;
			background: rgba(245, 245, 245, 1);
			border-radius: 10upx;
			color: #333333;
		}
	}
}
</style>
