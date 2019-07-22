<template>
	<view>
		<view class="note pd40">
			<view class="title">
				温馨提示：
			</view>
			<view class="">
				1. 限时特价、预约资格等购买优惠可能一并取消；
			</view>
			<view class="">
				2. 如遇订单拆分、使用优惠券无法返还；
			</view>
			<view class="">
				3. 支付余额，抵扣余额积分都按原路退款；
			</view>
			<view class="">
				4. 订单一旦取消，无法恢复。
			</view>
		</view>
		<view class="refund-list bdb pd20">
			<view class="left fs30">
				退款原因
			</view>
				<picker class="right betweenBox" mode="selector" :range="reasons" :value="index" @change="changepick">
					<view>{{reasons[index]}}</view>
					<view class="r-icon">
						<uni-icon class='' type='arrowright' size='20'></uni-icon>
					</view>
				</picker>
		</view>
		<view class="refund-list bdb pd20">
			<view class="left fs30">
				联系人
			</view>
			<view class="right">
				<input type="text" class="fs30" placeholder="请输入联系人" v-model="refundContacts" />
			</view>
		</view>
		<view class="refund-list bdb pd20">
			<view class="left fs30">
				手机号
			</view>
			<view class="right">
				<input type="text" class="fs30" placeholder="请输入手机号"  v-model="refundPhone" />
			</view>
		</view>
		<view class="refund-btn flex-box white fs30" @tap="makeRefund">
			申请退款
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				reasons:[
					'订单不能按预计时间送达',
					'操作有误（商品、地址等选错）',
					'重复下单/误下单',
					'其他渠道价格更低',
					'该商品降价了',
					'不想买了',
					'其他原因'
				],
				index:0,
				orderId:null,
				refundContacts:'',
				refundPhone:''
			};
		},
		onLoad(e){
			this.orderId = e.id;
		},
		methods:{
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
							uni.setStorageSync('checkingOrder',checkingOrder)
							setTimeout(()=>{
								uni.navigateBack();
							},1500)
						}
					});
			},
			makeRefund(){
				if(!this.refundContacts||!this.refundPhone){
					uni.showToast({
						title: '请填写完整资料',
						mask: false,
						icon:'none',
						duration: 1500
					});
					return	
				}
				this.apiUrl.applyRefund({data:	{
					disagreereason:this.reasons[this.index],
					orderId:this.orderId,
					refundContacts:this.refundContacts,
					refundPhone:this.refundPhone
				}}).then(res=>{
					if(res.data.status ==1){
						uni.showToast({
							title: '您的申请已提交成功，等待客服处理',
							mask: false,
							duration: 1500,
							icon:'none',
							success:()=>{
								this.getOrderDetail(this.orderId);
							}
						});
					}
				})
			},
			changepick(e){
				this.index = e.target.value
			}
		}
	}
</script>

<style lang="less" scoped>
.refund-btn{
	width: 600upx;
	height: 80upx;
	background: #FC4E29;
	border-radius: 40upx;
	margin: 40upx auto;
}
.refund-list{
	display: flex;
	.left{
		width: 174upx;
	}
	.right{
		flex:2;
		position: relative;
		.r-icon{
			position: absolute;
			right: 0;
			top: 50%;
			transform: translateY(-50%);
		}
	}
}
.note{
	padding: 40upx;
	background: #f4f4f4;
	color: #767676;
	line-height: 40upx;
	.title{
		font-weight: bold;
	}
}
</style>
