<template>
	<view class="wrap background-white betweenBox pdl20 pdr20 pdb20">
		<view class="middle " >
			{{title}}
		</view>
		<view class="more gray flex-box " v-if="path" @click="go">
			更多 
			<image src="/static/img/pubulic_icon_expand@2x.png" mode="widthFix" class="id-ri mgl20"></image>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		props:{
			bgc:{
				type:String,
				default:'#388ceb'
			},
			title:{
				type:String,
				default:'为你推荐'
			},
			path:{
				type:String,
				default:null
			}
		},
		methods:{
			go(){
				let url;
				this.path == 'new'? url = '/pages/product/product-list?type=2&isNew=1':'';
				this.path == 'isHot'? url = '/pages/product/product-list?type=2&isHot=1':'';
				uni.navigateTo({
					url
				})
			}
		}
	}
</script>

<style lang="less">
.wrap{
	margin-top: 70upx;
	.more{
		image{
			width: 12upx;
		}
		
	}
	.middle{
		font-size:42upx;
		font-weight:bold;
		color:rgba(51,51,51,1);
	}
}

</style>
