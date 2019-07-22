<template>
	<view class="pageBg pdt20" >
		
		<view class="info background-white mg20 pd20 bdb mgt20" v-for="(item,index ) in list" :key='item.id' @tap="goDetail(item.id)">
			<view class="infoHeader betweenBox">
				<text class="fs30">{{item.bankName}}（尾号{{item.accountNo}}）</text>
				<text class="money primary-color fs36">{{item.applyAmount}}</text>
			</view>
			<view class=" betweenBox">
				<text class="green" v-if="item.status==2">已通过</text>
				<text class="primary-color" v-if="item.status==1">申请中</text>
				<text class="red" v-if="item.status==3">已拒绝</text>
				<text class="gray">{{item.applyTime}}</text>
			</view>
		</view>
		<no-data v-if="!list.length"></no-data>

	</view>
</template>
<script>
	import myMixin from '../../../common/myMixin.js'
	import noData from '@/components/no-data';

	export default{
		data(){
			return {
				current:1,
				list:[]
			}
		},
		mixins:[myMixin],
		onPullDownRefresh() {
			this.current = 1;
			this.list=[];
			
			setTimeout( ()=>{
				 this.getList()
			}, 100);
		    setTimeout( ()=>{
				 uni.stopPullDownRefresh();
		    }, 1000);
		},
		onLoad() {
			this.getList()
		},
		onReachBottom() {
			this.getList()
		},
		components: { 
			noData
		},
		methods:{
			goDetail(id){
				uni.navigateTo({
					url:'cashdetail-info?id='+id
				})
			},
			getList(){
				this.apiUrl.getCashList({data:{
					current:this.current
				}}).then(res=>{
					if(res.data.status ==1){
						let arr = res.data.data.pageList;
						arr.forEach(item=>{
							item.applyTime = this.format(item.applyTime);
							item.accountNo=item.accountNo.slice(-4)
						})
						this.list = this.list.concat(arr);
						console.log(this.list)
						this.current+=1;
					}
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.info{
		border-radius: 20upx;
		line-height: 50upx;
	}
</style>
