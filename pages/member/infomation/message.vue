<template>
	<view class="bg">
		<view class="message" v-if="message">
			<view class="mesContent"><text>{{message.content}}</text></view>
			<view class="mesTime"><text>{{message.createDate}}</text></view>
		</view>
	</view>
</template>
<script>
	import myMixin from '../../../common/myMixin.js'

export default{
	data(){
		return {
			message:null
		}
	},
	mixins:[myMixin],
	onLoad(e) {
		this.getDetail(e.id)
	},
	methods:{
		getDetail(id){
			this.apiUrl.getMessageDetail({data:{
				id
			}}).then(res=>{
				if(res.data.status==1){
					this.message = res.data.data;
					this.message.createDate=this.format(this.message.createDate)
				}
			})
		}
	},
}
</script>
<style lang='less' scoped>
	.bg{
		
		background-color: #f4f4f4;
		.message{
			background-color: white;
			padding: 50upx 25upx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			.mesContent{
				text-indent: 2em;
				color: #373737;
			}
			.mesTime{
				display: flex;
				justify-content: flex-end;
				margin-right: 10upx;
				color: #a7a7a7;
				font-size: 25upx;
			}
		}
	}
</style>