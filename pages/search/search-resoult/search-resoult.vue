<template>
	<view>
		<view class="search-options">
			<view class="options-input mgl20 mgr20">
				<input type="text" value="" placeholder="输入搜索内容" />
			</view>
			<view class=" options-trangle" @click="inprice=!inprice">
				销量
				<image src="../../../static/img/db-trangle.png" v-if="!inprice"  mode="widthFix"></image>
				<image src="../../../static/img/active-trangle.png" v-else  mode="widthFix"></image>
			</view>
			<view class=" options-trangle" @click="inSale=!inSale" >
				价格
				<image src="../../../static/img/db-trangle.png" v-if="!inSale" mode="widthFix"></image>
				<image src="../../../static/img/active-trangle.png" v-else mode="widthFix"></image>
			</view>
			<view class="list-display">
				<image src="../../../static/img/guird.png"  mode="widthFix" v-if="showInline" @click="showInline=!showInline"></image>
				<image src="../../../static/img/inList.png" mode="widthFix" v-else @click="showInline=!showInline"></image>
			</view>
			<view class="line">
				
			</view>
			<view class="list-display mgr20">
				<!-- <uni-icon type="list" size='24'></uni-icon> -->
				<image src="../../../static/img/list.png" mode="widthFix" @click="drawer=!drawer"></image>

			</view>
		</view>
		<!-- 商品列表 -->
		<view class="goods-list " :class="{'list-inline':showInline}">
			<view class="list-item" v-for="i in 6" :key='i' @tap="go">
				<view class="list-img">
					<image src="../../../static/img/uselessimg/product1.png" mode="widthFix" class="w100"></image>
				</view>
				<view class="list-info">
					<view class="list-name title-black fs28">
						小户型茶几北欧简约时尚圆形茶几日式橡木实木...
					</view>
					<view class="list-price">
						<text class="fs36 yellow">￥350.00 </text>
						<text class="gray fs24">库存990件 </text>
					</view>
				</view>
			</view>
		</view>
		<uni-drawer :visible="drawer" :mask="true" mode="right" @close='closeDrawer'>
			<view  class="init-drawer">
				<view class="uni-title  tac white">筛选</view>
				<view class="content pd20">
					<view class="title-black fs28">
						全部分类
					</view>
					<view class="drawer-btns">
						<view class="btn" v-for="i in 5" :key='i'>
							菜刀/剪刀
						</view>
					</view>
					<view class="title-black fs28 mgt40">
						价格区间(元)
					</view>
					<view class="select-price">
						<view class="select-input">
							<input type="text" placeholder="最低价" value="" />
						</view>
						<text>-</text>
						<view class="select-input">
							<input type="text" placeholder="最低价" value="" />
						</view>
					</view>
				</view>
				<view class="confirm">
					确定
				</view>
			</view>
		</uni-drawer>
	</view>
</template>

<script>
	import uniDrawer from "@/components/uni-drawer.vue"
	export default {
		data() {
			return {
				showInline:false,
				inprice:false,
				inSale:false,
				drawer:false
			};
		},
		methods:{
			go(){
				uni.navigateTo({
					url:'../../product/product-detail'
				})
			},
			closeDrawer(){
				this.drawer=false;
			}
		},
		components: {uniDrawer}
	}
</script>

<style lang="less" scoped>
	
	.init-drawer{
		.uni-title{
			background-color: #388ceb;
		}
		.drawer-btns{
			display: flex;
			flex-wrap: wrap;
			.btn{
				width: 160upx;
				height: 55upx;
				border-radius: 28upx;
				border: solid 1px #bfbfbf;
				color: #b2b2b2;
				font-size: 24upx;
				margin-right: 10upx;
				margin-bottom: 10upx;
				text-align: center;
				line-height: 55upx;
			}
		}
		.select-price{
			display:flex;
			justify-content:space-between;
			margin-top: 20upx;
			.select-input{
				width: 210upx;
				height: 55upx;
				border-radius: 28upx;
				border: solid 1upx #bfbfbf;
				text-align: center;
			}
			text{
				margin-left: 20upx;
				margin-right: 20upx;
			}
		}
		.confirm{
			position: absolute;
			bottom:0;
			left: 0;
			width: 100%;
			height: 80upx;
			background-color: #388ceb;
			text-align: center;
			line-height: 80upx;
			color: white;
			font-size: 30upx;
		}
	}
.goods-list.list-inline{
	margin: 20upx;
	.list-item{
		width: 100%;
		display: flex;
		.list-img{
			width: 200upx;
			margin-right: 20upx;
		}
		.list-name{
			line-height: 45upx;
			height: 100upx;
		}
		.list-info{
			
		}
	}
}
.goods-list{
	display: flex;
	justify-content: space-around;
	flex-wrap: wrap;
	margin-top: 40upx;
	.list-item{
		width: 350upx;
		margin-top: 20upx;
		.list-name{
			line-height: 43upx;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
		}
		.list-price{
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
	}
}
.search-options{
	display: flex;
	justify-content: space-between;
	align-items: center;
	.options-input{
		width: 240upx;
		height: 60upx;
		background-color: #f1f1f1;
		border-radius: 30upx;
		padding-left: 30upx;
		padding-right: 30upx;
		input{
			height: 100%;
		}
	}
	.line{
		width: 2upx;
		background: #c2c2c2;
		height: 40upx;
	}
	>view{
		display: flex;
		height: 100%;
		align-items: center;
		justify-content: center;
	}
	.options-trangle{
		image{
			width: 20upx;
			margin-left: 10upx;
		}
	}
	.list-display{
		image{
			width: 35upx;
		}
	}
}
</style>
