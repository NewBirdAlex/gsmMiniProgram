<template>
	<view class="pageBg ">
		<view class="background-white bdb list mgt20" v-for="(item,index) in list" :key='item.id'>
			<view class="betweenBox pd20">
				<text class="fs30">{{item.phone}}</text>
				<text class="fs30" :class="{'green':item.operate,'red':!item.operate}">{{item.operate?'+':'-'}}{{item.num}}</text>
			</view>
			<view class="betweenBox pdl20 pdr20 pdb20">
				<text class="fs24 gray">{{item.createDate}}</text>
				<text class="fs26">剩余批发卷: {{item.afterNum}}</text>
			</view>
			<view class=" pdl20 pdr20 pdb20">
				<text class="fs24 gray">备注：</text>
				<text class="fs26 gray">{{item.remarks||'无'}}</text>
			</view>
		</view>
		<no-data v-if="!list.length"></no-data>

	</view>
</template>

<script>
	import noData from '@/components/no-data.vue';

	export default {
		data() {
			return {
				current:1,
				list:[],
				allowRequest:true
			};
		},
		onLoad() {
			this.getList()
		},
		onReachBottom() {
			this.getList()
		},
		components:{
			noData
		},
		methods:{
			getList(){
				if(!this.allowRequest) return
				this.allowRequest = false;
				this.apiUrl.member_integralloTransferPagination({data:{
					current:this.current,
				}}).then(res=>{
					this.allowRequest = true;

					if(res.data.status==1&&res.data.data.pageList.length){
						let arr = res.data.data.pageList;
						arr.forEach(item=>{
							item.createDate = this.format(item.createDate);
						})
						this.list = this.list.concat(arr);
						this.current+=1;
						if(this.current==2){
							this.getList();
						}
					}
				})
			}
		}
	}
</script>

<style lang="less" scoped>
.list{
}
</style>
