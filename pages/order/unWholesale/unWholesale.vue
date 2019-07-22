<template>
	<view class="pageBg">
		<view class="tac fs36 gray pd20 mgt20" v-if="!productList.length">
			暂无订单
		</view>
		<view class="mgt20 background-white pdb10" v-for="(item,index) in productList" :key='index'>
			<view class="cl-num betweenBox bdb pd20">
				<view class="fs24">
					订单编号：{{item.orderNO}}
				</view>
			</view>
			<view class="goods-list list-inline " >
				<view class="list-item " >
					<view class="list-img">
						<image :src="item.appProductOrderList[0].imageUrl" mode="widthFix" class="w100"></image>
					</view>
					<view class="list-info">
						<view class="list-name title-black fs28">
							{{item.appProductOrderList[0].productName}}
						</view>
						<view class="fs28 gray">
							{{item.appProductOrderList[0].productModelName}}
						</view>
						<view class="fs28 gray betweenBox">
							x{{item.appProductOrderList[0].mayAmout}}
							<view class="uc-btn flex-box white" @tap='sell(item)'>
								我要提货
							</view>	
							
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {mapState,mapMutations} from 'vuex'

	export default {
		data() {
			return {
				productList:[],
				current:1
			};
		},
		computed: mapState([
			'memberInfo'
		]),
		onShow() {
			this.getList()
		},
		onPullDownRefresh() {
			this.current = 1;
			this.productList = [];
		   this.getList();
		    setTimeout( ()=>{
				 uni.stopPullDownRefresh();
		    }, 1000);
		},
		onReachBottom() {
			this.getList()
		},
		methods:{
			sell(item){
				uni.setStorage({
					key:'jsProduct',
					data:item,
					success: (res) => {
						uni.navigateTo({
							url:'../submit-wholesale/submit-wholesale'
						})		
					}
				})
				
			},
			getList(type){
				this.apiUrl.getUnConsignment({
					data:{
						memberId:this.memberInfo.id,
						current:this.current
					}
				}).then(res=>{
					if(res.data.status==1&&res.data.data.pageList.length){
						let arr = res.data.data.pageList;
						arr.forEach(item=>{
							item.appProductOrderList = this.setImgSize(item.appProductOrderList,'400x400');
						})
						this.productList = this.productList.concat(arr)
						this.current+=1;
					}
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	
	.uc-btn{
		width: 170upx;
		height: 60upx;
		background-color: #FC4E29;
		border-radius: 30upx;
	}
	.list-info{
		position: relative;
		.uc-btn{
			position: absolute;
			right: 20upx;
			bottom: 10upx;
		}
	}
	.pdb10{padding-bottom: 10upx;}
</style>
