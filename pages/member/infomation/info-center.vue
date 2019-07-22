<template>
	<view class="bg pageBg">
		<view class="infolist" v-for="(item,index) in messageList" :key='item.id' @tap="go(item)">
			<view class="infoheader betweenBox">
				<view class="infotitle" style="width: 60%;"><view class="point" v-if="!item.isRead"></view><text>{{item.title}}</text></view>
				<view class="infotime" >{{format(item.createDate)}}</view>
			</view>
			<view class="infoContent">{{item.content}}</view>
		</view>
		<no-data v-if="!messageList.length"></no-data>

	</view>
</template>
<script>
	import {mapState,mapMutations} from 'vuex'
	import myMixin from '../../../common/myMixin.js'
	import noData from '@/components/no-data'

export default{
	data(){
		return {
			messageList:[],
			current:1,
			allowRequest:true
		}
	},
	mixins:[myMixin],
	onLoad() {
		if(!this.memberInfo){
			uni.navigateTo({
				url:'/pages/login/login'
			})
			return
		}else{
			this.getList()
		}
	},
	computed: mapState([
		'memberInfo'
	]),
	onReachBottom() {
		this.getList()
	},
	onShow(){
		this.current = 1;
		this.messageList = [];
		this.getList();
	},
	components:{
		noData
	},
	methods:{
		go(item){
			uni.navigateTo({
				url:'message?id='+item.id
			})
		},
		getList(){
			if(!this.allowRequest) return
			this.allowRequest = false;
			this.apiUrl.getMessage({data:{
				current:this.current,
				memberId:this.memberInfo.id
			}}).then(res=>{
				this.allowRequest = true;
				if(res.data.status == 1&&res.data.data.pageList.length){
					let arr = res.data.data.pageList;
					arr.forEach(item=>item.createDate=this.format(item.createDate))
					this.messageList = this.messageList.concat(arr) 
					this.current++;
				}
			})
		}
	},
}
</script>
<style lang='less' scoped>
	.bg{
		.infolist{
			box-sizing: border-box;
			height: 180upx;
			background-color: #ffffff;
			padding: 25upx 20upx;
			display: flex;
			justify-content: space-between;
			flex-direction: column;
			margin-bottom: 20upx;
			.infoheader{
				display: flex;
				justify-content: space-between;
				position: relative;
				.infotitle{
					display: flex;
					flex-direction: row;
					align-items: center;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 1;
					-webkit-box-orient: vertical;
					.point{
						position: absolute;
						left:0;
						top: 50%;
						transform: translateY(-50%);
						width: 10upx;
						height: 10upx;
						background-color: #FC4E29;
						border-radius: 50px;
						
					}
					text{
						margin-left: 10upx;
						font-size: 30upx;
						color: #232323;
					}
				}
				.infotime{
					font-size: 25upx;
					color: #c3c3c3;
					margin-right: 5upx;
				}
			}
			.infoContent{
				font-size: 25upx;
				color: #8d8d8d;
				overflow: hidden;
				height: 65upx;
				line-height: 35upx;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2; /*截取第三行*/
			}
		}
	}
</style>