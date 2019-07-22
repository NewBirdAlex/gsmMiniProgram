<template>
	<view class="pageBg" v-if="expressInfo">
		<view class="background-white pdt20">
			<view class="goods-list list-inline " >
				<view class="list-item ">
					<view class="list-img relative">
						<image :src="order.appProductOrderList[0].imageUrl" mode="widthFix" class="w100"></image>
						<view class="showNum">
							共{{totalNum}}件商品
						</view>
					</view>
					<view class="list-info" >
						<view class="list-name primary-color  fs30">
							<text v-if="expressInfo.state==0">在途中</text>
							<text v-if="expressInfo.state==1">已揽件</text>
							<text v-if="expressInfo.state==2">疑难件</text>
							<text v-if="expressInfo.state==3">已签收</text>
							<text v-if="expressInfo.state==4">已退签</text>
							<text v-if="expressInfo.state==5">正在派件 </text>
							<text v-if="expressInfo.state==6">已退回</text>
						</view>
						<view class="list-name title-black fs28">{{order.shippingName||expressInfo.com}}
						</view>
						<view class="list-price mgb20 gray">
							快递单号:  {{expressInfo.nu}}
						</view>
					</view>
				</view>
			</view>	
		</view>
		
		<view class="mgt20 background-white">
			<view class="log-item" v-for="(item,index) in expressInfo.route" :key='index'>
				<view class="pdt20">
					<view class="fs30">{{item.time.split(' ')[0]}}</view>
					<view class="gray">{{item.time.split(' ')[1]}}</view>
				</view>
				<view class="">
					<view class="fs30 gray" :class="{'primary-color':index==0}">
						<view :class="{'top':index==0}" class="lg-circle flex-box">
							<view class="inner">
								
							</view>
						</view>
					</view>
					<view class="fs24 " :class="{'primary-color':index==0,'gray':index!=0}">
						{{item.context}}
					</view>
				</view>
			</view>
			<view class="tac pd20 fs30" v-if="!expressInfo.route || !expressInfo.route.length">
				暂无物流信息
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				orderId:null,
				order:null,
				expressInfo:null,
				tihuoId:'',
				totalNum:0
			};
		},
		onLoad(e){
			this.orderId = e.id;
			e.tihuoId?this.tihuoId = e.tihuoId:'';
			this.getOrderDetail(e.id)
		},
		methods:{
			getExpress(data){
				this.apiUrl.getParcelInfo({data:{
					orderId:this.orderId,
					selfMentionOrderId:this.tihuoId
				}}).then(res=>{
					console.log(res);
					if(res.data.status==1){
						this.expressInfo = res.data.data
					}
				})
			},
			getOrderDetail(id){
				if(this.tihuoId){
					this.apiUrl.order_getSelfMentionOrder({
						data: {
							id: id
						}
					}).then(res => {
						if(res.data.status==1){
							this.order = res.data.data;
							this.order.appProductOrderList=this.setImgSize(this.order.appProductOrderList,'300x300')
							this.order.appProductOrderList.forEach(item=>{
								this.totalNum+=Number(item.amout)
							})
							this.getExpress()
						}
					})
				}else{
					this.apiUrl.getOrderDetail({data:{
						orderId:id
					}}).then(res=>{
						if(res.data.status==1){
							this.order = res.data.data;
							this.order.appProductOrderList=this.setImgSize(this.order.appProductOrderList,'300x300')
							this.order.appProductOrderList.forEach(item=>{
								this.totalNum+=Number(item.amout)
							})
							this.getExpress()
						}
					})	
				}
				
			}
		}
	}
</script>

<style lang="less" scoped>
	.showNum{
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 40upx;
		line-height: 40upx;
		color: white;
		background: rgba(0, 0, 0, .5);
		text-align: center;
	}
.log-item{
	display: flex;
	>view{
		&:first-child{
			width: 200upx;
			text-align: center;

		}
		&:nth-child(2){
			flex: 2;
			padding: 20upx;
			border-left: 1upx solid #d1d1d1;
			position: relative;
			.lg-circle{
				position: absolute;
				top: 40upx;
				left: 0;
				width: 25upx;
				height: 25upx;
				transform: translateX(-50%);
				.inner{
					width: 16upx;
					height: 16upx;
					border-radius: 50%;
					background: #d1d1d1;
					
				}
			}
			.top{
				
				border-radius: 50%;
				background-color: #ffdab2;
				.inner{
					background: #FC4E29;
				}
			}
		}
	}
}
</style>
