<template>
	<view class="car ">
		<view class="cart-op  white fs30 pd20 tar" v-if="goodsList.length">
			<text @tap="editOrder=!editOrder">{{editOrder?'完成':'编辑'}}</text>
		</view>

		<view class="car-item background-white" v-for="(item,index) in goodsList" :key='index'>
			<view class="left flex-box">
				<view class="def-circle flex-box" :class="{active:item.select}" @tap="selectGoods(index)">
					<template v-if="item.select">
						<uni-icon type="checkmarkempty" size='22'></uni-icon>
					</template>
				</view>
			</view>
			<view class="right " :class="{'bdb':index!=goodsList.length-1}">
				<!-- 商品 -->
				<view class="goods-list list-inline">
					<view class="list-item ">
						<view class="list-img">
							<image :src="item.imageUrl" mode="widthFix" class="w100" @tap="goProductDetail(item)"></image>
							<view class="mask" v-if="!item.enable">
								<view class="">
									已失效
								</view>
							</view>
						</view>
						<view class="list-info">
							<view class="list-name title-black fs28">
								{{item.productName}}
							</view>
							<view class="gray fs24">
								<text v-if="item.modelName&&item.modelName!='无'">规格：{{item.modelName}} </text>
								<!-- 数量：{{item.amount}} -->
								<image src="/static/img/pubulic_icon_expand_down@2x.png"
								 mode="widthFix" @tap="selectProductModel(item,index)" v-if="editOrder&&item.enable&&item.modelName&&item.modelName!='无'" class="edit">
								 </image>
							</view>
							<view class="list-price mgt20 ">
								<text class="fs36 orange">￥{{item.price}} </text>
								<uni-number-box v-if="item.enable" :min="1" :value='item.amount' @change='changeGoodsAmount($event,index)'></uni-number-box>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="" style="height: 40px;">

		</view>
		<view class="car-money car-item background-white pdt20" v-if="goodsList.length">
			<view class="left flex-box">
				<view class="def-circle flex-box" :class="{active:selectAll}" @tap="buyAll">
					<template v-if="selectAll">
						<uni-icon type="checkmarkempty" size='24'></uni-icon>
					</template>
				</view>
			</view>
			<view class="right betweenBox" >
				<view class="">
					<text>全选</text>
				</view>
				<view class="flex-box">
					<template v-if="!editOrder">
						<text class="fs26">合计：</text>
						<text class="orange fs36">￥{{totalMoney}}</text>
						<text class="paybtn flex-box white mgl20 fs30 mgr20" @tap="check">去结算</text>
					</template>
					<template v-else>
						<text class="paybtn delbtn flex-box  mgl20 fs30 mgr20" @tap="delShoppingCar">删除</text>
					</template>
				</view>
			</view>
		</view>
		<!-- 弹出选择商品 -->
		<view class="car-pop" v-if="showPop">
			<view class="content">
				<view class="close-icon">
					<uni-icon type="closeempty" size='30' @click='showPop=false'></uni-icon>
				</view>
				<view class="top-img">
					<view class="left">
						<image :src="modelSource.image||modelSource.productImageList[0].imageUrl" mode="widthFix" class="w100"></image>
					</view>
					<view class="right">
						<view class="red fs36">
							￥{{(selectModel?selectModel.price:false)||modelSource.price}} 元
						</view>
						<view class="gray fs24" v-if="modelSource.stock">
							库存 {{(selectModel?selectModel.stock:false)||modelSource.stock}} 件
						</view>
						<view class="">
							请选择规格 数量
						</view>
					</view>
				</view>
				<view class="pdl20 pdr20">
					<view class="" v-if="modelSource.mulType" v-for="(item,index) in modelSource.attributeKeyList" :key='index'>
						<view class="">
							选择{{item.keyName}}
						</view>
						<view class="size-choose">
							<view class="size-btn mgt10" v-for="(subitem,subindex) in item.valueList" :key='subindex' :class="{'active-btn':subitem.active}"
							 @tap="selectAttr(subitem,index,subindex)">
								{{subitem.valueName}}
							</view>
						</view>
					</view>
					<view class="buy-btn" @tap='confirmModel'>
						确定
					</view>
				</view>
			</view>
		</view>
		<view class="emptyCar  tac" v-if="!goodsList.length">
			<image src="/static/img/cart1.png" mode="widthFix"></image>
			<view class="fs30 gray">
				您的购物车还没有商品，赶紧去首页挑选吧~
			</view>
		</view>
	</view>
</template>

<script>
	import uniNumberBox from "@/components/uni-number-box.vue"
	import uniPopup from "@/components/uni-popup.vue"
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		data() {
			return {
				selectAll: false,
				editOrder: false,
				showPop: false,
				goodsList: [],
				totalMoney: 0,
				modelSourceIndex:0,
				modelSource:null,
				selectModel:null,
				editCarBol:true
			};
		},
		computed: mapState([
			'memberInfo'
		]),
		onLoad() {
			if(this.memberInfo){
				this.getList()
			}else{
				uni.showToast({
					title: '请登录',
					mask: false,
					icon:'none',
					duration: 1500
				});
			}
		},
		onShow() {
      if(this.memberInfo){
        this.getList()
      }else{
        uni.showToast({
          title: '请登录',
          mask: false,
          icon:'none',
          duration: 1500
        });
      }
		},
		mounted(){

		},
		onPullDownRefresh() {
		    if(this.memberInfo){
		    	this.getList()
		    }else{
		    	uni.showToast({
		    		title: '请登录',
		    		mask: false,
		    		icon:'none',
		    		duration: 1500
		    	});
		    }
		    setTimeout( ()=>{
				 uni.stopPullDownRefresh();
		    }, 1000);
		},
		methods: {
			goProductDetail(item){
				console.log(item);
				if(item.enable){
					uni.navigateTo({
						url:'../product/product-detail?id='+item.productId
					})
				}
			},
			//下单
			check(){
				let arr = [];
				this.goodsList.forEach(item=>{
					if(item.select){
						item.type=2;
						item.shoppingCartIds = item.id;
						arr.push(item)
					}
				})
				if(arr.length){
					//商品是否已下架处理
					let bol = false;
					arr.forEach(item=>item.enable?'':bol=true)
					if(bol){
						uni.showToast({
							title:'不能提交已下架商品',
							icon:'none',
							duration:1500
						})
						return
					}
					//商品是否已下架处理
					uni.setStorage({
						key:'payingProduct',
						data:arr,
						success: () => {
							uni.navigateTo({
								url:'/pages/order/fillOrder/fillOrder?type=2'
							})
						}
					})
				}else{
					uni.showToast({
						title:'请选择至少一项商品',
						icon:'none',
						duration:2000
					})
				}
			},
			//更改型号
			confirmModel(){
				if (this.modelSource.mulType) {
					//多型号
					let arr = this.modelSource.attributeKeyList;
					let num = 0;
					arr.forEach(item => {
						item.valueList.forEach(subitem => {
							subitem.active ? num++ : ''
						})
					})
					if (num < arr.length) {
						uni.showToast({
							icon: 'none',
							duration: 2000,
							title: '请选择型号规格'
						})
						return
					}
				}
				//submit
				let data = {
					id: this.goodsList[this.modelSourceIndex].id,
					amount:this.goodsList[this.modelSourceIndex].amount
				}
				this.modelSource.mulType?data.modelId = this.selectModel.id:data.modelId =this.modelSource.productModelList[0].id

				this.apiUrl.editShoppingcar({
					data
				}).then(res => {
					if(res.data.status==1){
						uni.showToast({
							icon: 'none',
							duration: 2000,
							title: '修改成功'
						});
						this.showPop=!this.showPop;
						this.getList();
					}

				});
			},
			//获取详情
			getProduct(id){
				this.apiUrl.getGoodsdetail({data:{
					id
				}}).then(res=>{
					if(res.data.status!=1) return
					this.modelSource= res.data.data;
					this.showPop=!this.showPop;

				})
			},
			//弹出窗口 规格
			selectAttr(subitem,pIndex, sIndex) {
				let arr = this.modelSource.attributeKeyList[pIndex];
				arr.valueList.forEach(item => item.active = false);
				arr.valueList[sIndex].active = true;
				this.modelSource.attributeKeyList.splice(pIndex, 1, arr);
				//点击 查询 选择规格
				this.initSelectModel();
				//更换不同model图片
				if (subitem.imageUrl) {
					this.attibuteImg = subitem.imageUrl;
				}
			},
			initSelectModel() {
				// 筛选 用户选择的组合
				let arr = this.modelSource.attributeKeyList;
				let idsArr = [];
				arr.forEach(item => {
					item.valueList.forEach(subitem => {
						subitem.active ? idsArr.push(subitem.id) : ''
					})
				})
				console.log(idsArr);
				let targetGoods = null;

				let pmArr = this.modelSource.productModelList;
				for (let i = 0; i < pmArr.length; i++) {
					let bol = true
					for (let y = 0; y < idsArr.length; y++) {
						if (pmArr[i].valueIds.indexOf(idsArr[y]) == -1) {
							bol = false;
							break
						}
					}
					if (bol && idsArr.length === arr.length) {
						console.log(pmArr[i])
						targetGoods = pmArr[i];
					}
				}
				this.selectModel = targetGoods;
			},
			//选择列表商品
			selectProductModel(product,index){
				this.modelSourceIndex = index;
				this.getProduct(product.productId);
			},
			//car 选择 数量
			changeGoodsAmount(e, index) {
				if(!this.editCarBol) return
				this.editCarBol = false
				this.apiUrl.editShoppingcar({data:{
					amount:e,
					id:this.goodsList[index].id,
					modelId:this.goodsList[index].modelId
				}}).then(res=>{
					this.editCarBol = true
					let arr = this.goodsList;
					let num = arr[index].amount;
					res.data.status==1?arr[index].amount = e:arr[index].amount = num;
					this.goodsList = arr;
					this.initTotalMoney();
					if(res.data.status!=1){
						console.log(res)

						uni.showToast({
							icon:'none',
							duration:2000,
							title:res.data.message
						})
					}
				})
			},
			//选择商品
			selectGoods(index) {
				let arr = this.goodsList;
				arr[index].select = !arr[index].select;
				this.goodsList = arr;
				
				//是否全选
				this.selectAll =  arr.every(item=>item.select == true);
				this.initTotalMoney();
			},
			//删除车
			delShoppingCar(id) {
				let arr = this.goodsList;
				let idarr = [];
				arr.forEach(item => {
					item.select ? idarr.push(item.id) : ''
				})
				this.apiUrl.delShoppingCar({
					data: {
						id: idarr.join(',')
					}
				}).then(res => {
					if (res.data.status == 1) {
						uni.showToast({
							icon: 'success',
							duration: 2000,
							title: '删除成功'
						})
						this.getList();
					}
				})
			},
			getList() {
				this.apiUrl.getShoppingCarList({
					data: {
						memberId: this.memberInfo.id
					}
				}).then(res => {
					if (res.data.status == 1) {
						console.log(res)
						if(res.data.data.length){
							let arr = res.data.data[0].shoppingCartList;
							arr.forEach(item => item.select = false);
							arr = this.setImgSize(arr,'200x200','imageUrl');
							this.goodsList = arr;
						}else{
							this.goodsList = []
						}
					}
				})
			},
			//计算总价
			initTotalMoney() {
				let m = 0;
				this.goodsList.forEach(item => {
					if (item.select) {
						m += item.price * item.amount
					}
				})
				this.totalMoney = m;
			},
			buyAll() {
				this.selectAll = !this.selectAll;
				let arr = this.goodsList;
				arr.forEach(item => item.select = this.selectAll);
				this.goodsList = arr;
				this.initTotalMoney();
			}
		},
		components: {
			uniNumberBox,
			uniPopup
		}
	}
</script>

<style lang="less" scoped>
	.emptyCar{
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%,-50%);
		image{
			width:300upx;
		}
	}
	.cart-op{
		>text{
			color: rgb(1, 122, 231);
			display: inline-block;
			border: 1px solid rgb(1, 122, 231);
			border-radius: 40upx;
				width: 100upx;
				text-align: center;
				height: 40upx;
				line-height: 40upx;
		}

	}
	.edit {
		width: 25upx;
		margin-left: 20upx;
	}

	.def-circle {
		width: 30upx;
		height: 30upx;
	}

	.car-money {
		position: fixed;
		bottom: 0;
		/* #ifdef H5 */
		bottom: 100upx;
		/* #endif */
		left: 0;
		width: 100%;
		z-index: 10;
		background:rgba(255,255,255,1);
		border-top:1px solid rgba(229,229,229,1);
		.left {
			width: 70upx;
		}

		.right {
			flex: 2;
			padding-bottom: 10upx;
		}

		.paybtn {
			width: 200upx;
			height: 80upx;
			background:rgba(249,83,26,1);
			border-radius:40px;
		}

		.delbtn {
			background-color: #eb4847;
			background-image: none;
			width:260upx;
			height:80upx;
			background:rgba(249,83,26,1);
			border-radius:40upx;
			color: white;
			font-size: 36upx;
		}
	}

	.car {
		padding-bottom: 110upx;

		.car-item {
			display: flex;

			.left {
				width: 90upx;
			}

			.right {
				flex: 1;
			}
			.active {
				border: none;
				background: #FC4E29;
				color: white;
			}
		}
	}

	.goods-list.list-inline {
		margin-left: 0;
	}

	.list-img{
		position: relative;
		height: auto!important;
		image{
			width: 100%;
			height: auto;
			border-radius:12upx
		}
		.mask{
			position: absolute;
			background: rgba(0, 0, 0, 0.5);
			color: white;
			width: 100%;
			height: 100%;
			left: 0;
			top:0;
			>view{
				position: absolute;
				background: rgba(0, 0, 0, 0.7);
				color: white;
				width: 100%;
				left: 0;
				bottom:0;
				text-align: center;
			}
		}
	}
</style>
