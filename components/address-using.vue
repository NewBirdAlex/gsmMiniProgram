<template>
	<view class="">
		<view class="address pd20 pageBd" >
			<view class="address-tag background-blue tac white fs20">
				收货信息
			</view>
			<view class="" v-if="!address">
				<view class="fs30 title-black" v-if="activeAddress">
					<text class=" mgr20">{{activeAddress.consignee}}</text>
					<text class="mgl20">{{activeAddress.mobile}}</text>
				</view>
				<view class="locate mgt10" v-if="activeAddress">
					<image src="/static/img/locate.png" mode="widthFix" class="mgr20"></image>
					<view class="gray fs24 mgt10">{{activeAddress.position+activeAddress.address}}</view>
				</view>
				<view class="background-white pd20 " v-else>
					没有收获地址，去添加地址
				</view>	
				<image v-if="arrow" src="/static/img/rightArrow.png" mode="widthFix" class="ra"></image>	
			</view>
			<view class="" v-else>
				<view class="fs30 title-black" >
					<text class=" mgr20">{{address.consignee}}</text>
					<text class="mgl20">{{address.mobile}}</text>
				</view>
				<view class="locate mgt10" >
					<image src="/static/img/locate.png" mode="widthFix" class="mgr20"></image>
					<view class="gray fs24 mgt10">{{address.shippingAddress}}</view>
				</view>
			</view>
			<view class="pdt20 pdb20 background-white red au-close" v-if="badAddress">
				<image src="/static/img/red-close.png" mode="widthFix" class=""></image>
				不支持配送
			</view>
		</view>
		
	</view>
	
</template>

<script>
	import {mapState,mapMutations} from 'vuex'

	export default {
		data() {
			return {
				
			};
		},
		computed: mapState([
			'activeAddress'
		]),
		props:{
			arrow:{
				type:Boolean,
				default:false
			},
			address:{
				type:Object,
				default:null
			},
			badAddress:{
				type:Boolean,
				default:false
			}
		}
	}
</script>

<style lang="less" scoped>
.au-close{
	display: flex;
	align-items: center;
	image{
		width: 40upx;
		margin-right: 20upx;
	}
}
.address{
	position: relative;
	.ra{
		position: absolute;
		right: 20upx;
		top: 50%;
		width: 16upx;
		transform: translateY(-50%)
	}
	.locate{
		display: flex;
		image{width: 22upx;margin-top: 10upx;}
		>view{
			width: 560upx;
		}
	}
	.address-tag{
		width: 140upx;
		height: 34upx;
		background-image: linear-gradient(90deg, 
			#53b1fa 0%, 
			#388ceb 100%);
		border-radius: 30upx;
		line-height: 34upx;
		margin-bottom: 10upx;
	}
}
</style>
