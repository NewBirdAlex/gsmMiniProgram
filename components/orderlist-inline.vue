<template>
	<view class="goods-list list-inline " >
		<view class="list-item bdb pdt20 pdb20" v-for="(item,index) in goodsList" :key='index' >
			<view class="list-img">
				<image :src="item.imageUrl||item.image" mode="widthFix" class="w100"></image>
			</view>
			<view class="list-info" v-if="showType=='fillorder'">
				<view class="list-name title-black fs28">
					{{item.productName||item.productname}}
				</view>
				<view class="list-name gray fs24">
					<text class="mgr20 ">规格：{{item.modelName||'无'}}</text><text class=""></text>
				</view>
				<view class="list-price">
					<text class="fs36 primary-color" v-if="item.mulType">￥{{item.selectModel.price}} </text>
					<text class="fs36 primary-color" v-else>￥{{item.type==1?item.selectModel.wholesalePrice:item.price}} </text>
					<text class="gray fs24">x {{item.amount}} </text>
				</view>
			</view>
			<view class="list-info" v-else>
				<view class="list-name title-black fs28">
					{{item.productName||item.productname}}
				</view>
				<view class="list-name gray fs24">
					<text  class="mgr20 ">规格：{{item.modelName||'无'}}</text><text class="">数量：{{item.amount}}</text>
				</view>
				<view class="list-price">
					<text class="fs36 yellow" v-if="item.mulType">￥{{item.selectModel.price}} </text>
					<text class="fs36 yellow" v-else>￥{{item.type==1?item.selectModel.wholesalePrice:item.price}} </text>
					<text class="gray fs24">库存{{item.stock}}件 </text>
				</view>
			</view>
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
			goodsList:{
				type:Array,
				default:[]
			},
			showType:{
				type:[String,Number],
				default:''
			}
		},
		methods:{
			go(id){
				uni.navigateTo({
					url:'/pages/product/product-detail?id='+id
				})
			}
		}
	}
</script>

<style lang="less" scoped>
.goods-list.list-inline {
margin: 0 20rpx;

}
.goods-list.list-inline .list-item .list-img{
	height: auto;
}
</style>
