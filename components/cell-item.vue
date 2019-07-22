<template>
	<view class="cell-wrap" v-if="dataList">
		<template v-if="side=='left'">
			<view class="left" >
				<image  :src="dataList[0].remomondImageUrl" lazy-load='true' mode="widthFix" class="w100" @tap="goDetail(dataList[0].id)"></image>
			</view>
			<view class="right background-white">
				<view class="linev">
				</view>
				<view class="lineh">
				</view>
				<view class="item" v-for="(item,index) in dataList" :key='index' v-if="index>0&&index<5">
					<navigator :url="'/pages/product/product-detail?id='+item.id">
						<view class="title-black name">
							{{item.productname}}
						</view>
						<view class="yellow fs30">
							￥{{item.price}}
						</view>
						<view class="tar">
							<image  :src="item.remomondImageUrl" mode="widthFix" class="w100"></image>
						</view>
					</navigator>
				</view>
			</view>
		</template>
		<template v-else>
			<view class="right background-white mgt20" v-if="dataList.length>5">
				<view class="linev">
				</view>
				<view class="lineh">
				</view>
				<view class="item" v-for="(item,index) in dataList" :key='index' v-if="index>4&&index<9">
					<navigator :url="'/pages/product/product-detail?id='+item.id">
						<view class="fs26 title-black name">
							{{item.productname}}
						</view>
						<view class="yellow fs30 tar">
							￥{{item.price}}
						</view>
						<view class="">
							<image :src="item.remomondImageUrl" mode="widthFix"></image>
						</view>
					</navigator>
				</view>
			</view>
			<view class="left mgt20" v-if="dataList[9]">
				<image  :src="dataList[9].remomondImageUrl" mode="widthFix" class="w100" @tap="goDetail(dataList[9].id)"></image>
			</view>
		</template>

	</view>
</template>

<script>
	export default {
		data() {
			return {

			};
		},
		props: {
			side: {
				default: 'left'
			},
			dataList: {
				type: Array,
				default: null
			}
		},
		watch:{
			dataList:(val,oldval)=>{
				val[0]?val[0].remomondImageUrl = val[0].remomondImageUrl.replace('240x240','250x500'):''
				val[9]?val[9].remomondImageUrl = val[9].remomondImageUrl.replace('240x240','250x500'):''
			}
		},
		methods: {
			goDetail(id) {
				uni.navigateTo({
					url:'/pages/product/product-detail?id='+id
				})
			}
		},
		onLoad() {
			
		}
	}
</script>

<style lang="less" scoped>
	.first {
		border-right: 1px solid #d8d8d8;
		border-bottom: 1px solid #d8d8d8;
	}

	.last {
		border-left: 1px solid #d8d8d8;
		border-top: 1px solid #d8d8d8;
	}

	.cell-wrap {
		display: flex;
		.left {
			width: 250upx;
			display: flex;
		}

		.right {
			width: 500upx;
			display: flex;
			flex-wrap: wrap;
			border: 1px solid #d8d8d8;
			position: relative;
			image{
				height: auto;
			}
			.lineh {
				position: absolute;
				width: 100%;
				border-top: 2upx solid #d8d8d8;
				left: 0;
				top: 50%;
			}

			.linev {
				position: absolute;
				height: 100%;
				border-right: 2upx solid #d8d8d8;
				left: 50%;
				top: 0;
			}
			.item {
				width: 50%;
				box-sizing: border-box;
				padding: 4upx 6upx 0 6upx;

				image {
					width: 100upx;
					margin: 0;
					padding: 0;
				}

				.name {
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
					line-height: 35upx;
					height: 70upx;
				}
			}
		}
	}
</style>
