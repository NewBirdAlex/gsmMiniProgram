<template>
	<view class="pd-detail " v-if="goodsDetail">
		<view class="swiper">
			<swiper class="detail_swiper" :indicator-dots="true" indicator-color="#ad7e6c" indicator-active-color="white" :autoplay="true" :interval="3000" :duration="1000">
				<swiper-item v-for="(item, index) in goodsDetail.productImageList" :key="index">
					<view class="swiper-item"><image :src="item.imageUrl" mode="widthFix" class="w100"></image></view>
				</swiper-item>
			</swiper>
			<!-- #ifdef APP-PLUS -->
			<view class="share flex-box"><image src="/static/img/public_icon_share_white@2x.png" mode="widthFix" class="" @tap="sharePage"></image></view>
			<!-- #endif -->
		</view>
		<view class="detail_info">
			<view class="countdown  background-orange betweenBox" v-if="goodsDetail.type === 0">
				<detail-countdown
					font-color="#000"
					bgr-color="white"
					borderColor="white"
					@activeOver="activeOver"
					:startTime="goodsDetail.productBatch.proxyEndTime"
					:endTime="goodsDetail.productBatch.saleEndTime"
					:now="currentTime"
					:inProduct="true"
				></detail-countdown>
			</view>
			<view class="countdown  background-yellow betweenBox" v-if="goodsDetail.type === 1">
				<detail-countdown
					font-color="#fff"
					bgr-color="black"
					@activeOver="activeOver"
					:startTime="goodsDetail.productBatch.proxyStartTime"
					:endTime="goodsDetail.productBatch.proxyEndTime"
					:now="currentTime"
					:inProduct="true"
				></detail-countdown>
			</view>
			<view class="pd40">
				<view class="betweenBox">
					<view class="" v-if="goodsDetail.type!=1">
						<!-- 零售普通价格 -->
						<text class="fs30 orange">¥</text>
						<text class="price orange">{{ goodsDetail.price }}</text>
					</view>
					<view v-else>
						<view class="" v-if="goodsDetail.type==1&&!selectedPifa">
							<!-- 批发价格 -->
							<text class="fs30 orange">¥</text>
							<text class="price orange">{{goodsDetail.productProxyPackageList.length>1? goodsDetail.productProxyPackageList[0].wholesalePrice:goodsDetail.price }}</text>
							<view class="inline" v-if="goodsDetail.productProxyPackageList.length>1">
								<text class="orange">~</text>
								<text class="price orange">{{ goodsDetail.productProxyPackageList[goodsDetail.productProxyPackageList.length-1].wholesalePrice }}</text>
							</view>
						</view>
						
						<view class="" v-if="goodsDetail.type==1&&selectedPifa">
							<!-- 批发价格 -->
							<text class="fs30 orange">¥</text>
							<text class="price orange">{{ selectedPifa.wholesalePrice }}</text>
						</view>
						<view class="">
							零售价：{{goodsDetail.price}}
						</view>
					</view>
					
					<view class="gray fs26" v-if="goodsDetail.coupon">可用优惠卷 {{ goodsDetail.coupon }}</view>
				</view>
				<!-- <view >
					<text class="gray fs30 originPrice" v-if="goodsDetail.initialPrice">¥{{goodsDetail.initialPrice}}</text>
				</view> -->
				<view class="name pd-name mgb20">{{ goodsDetail.productname }}</view>
				<view class="yellow fs26 point" v-if="goodsDetail.type == 2 && goodsDetail.points">购买商品赠送积分 {{ goodsDetail.points }}</view>
				<view class="express betweenBox">
					<view class="gray">
						运费：
						<text v-if="activeAddress">￥{{ expressFee || 0 }}元</text>
						<view style="display: inline-block;" v-else class="blue">
							<text v-if="!memberInfo">免费</text>
							<navigator v-else style="display: inline-block;" url="../addressManage/addressManage">点击设置地址</navigator>
						</view>
					</view>
					<view class="gray" v-if="goodsDetail.type != 0">库存 {{ goodsDetail.stock }} 件</view>
					<view class="gray" v-else-if="systemInfo.retailInventoryHidden == 'false'">库存 {{ goodsDetail.stock }} 件</view>
				</view>
				<view class="red" v-if="goodsDetail.type==0&&goodsDetail.giveFrozenMoney">
					赠送 {{goodsDetail.giveFrozenMoney}} 批发卷
				</view>
				<view class="agreement " v-if="goodsDetail.type==0">
					<view @tap="agree = !agree">
						<image v-if="agree" src="/static/img/login/treaty_box_selected@2x.png" mode="widthFix"></image>
						<image v-else src="/static/img/login/treaty_box_unselected@2x.png" mode="widthFix"></image>
						<!-- <uni-icon v-if="agree" type="checkbox-filled" color="#388ceb" size="24"></uni-icon> -->
					</view>
					<view>
						<navigator url="/pages/login/agreements/agreements?type=4"><text class="txt">我已阅读并同意《零售协议》</text></navigator>
					</view>
				</view>
			</view>
		</view>

		<image
			:src="staticImgResource+'common/pic_share_accelerate@2x.png'"
			v-if="goodsDetail.shareAccelerate.basicSwitch == 1"
			style="display: block;width: 692upx;height: 71upx;margin: 0 auto 60upx;"
		></image>

		<!-- 批发卷 -->
		<view class="pd-package fs30 background-white " v-if="productProxyPackageList && productProxyPackageList.length">
			<view class="bigTitle pd20">选择套餐</view>
			<view class="mgl20 mgr20">
				<view class="package-wrap ">
					<view class="">套餐</view>
					<view class="tac">所需批发劵</view>
					<view class="tac">剩余数量</view>
				</view>
				<view class="package-wrap gray" v-for="(item, index) in productProxyPackageList" :key="index" :class="{ active: item.active }" @tap="choosePackage(index)">
					<view class="">{{ item.packageType }}</view>
					<view class="tac">{{ item.wholesaleCoupon }}张</view>
					<view class="tac">{{ item.stock }}</view>
				</view>
			</view>
			<view class="buy-num mgt20 pd20">
				<view class="">
					<text class="fs30">购买数量</text>
					<text class="gray fs24 mgl20" v-if="selectedPifa">(每人限购 {{ selectedPifa.buyLimit }}件)</text>
				</view>
				<view class="">
					<uni-number-box :min="1" :max="selectedPifa && selectedPifa.buyLimit ? selectedPifa.buyLimit : 10000" :value="pifaNum" @change="changePifaNum"></uni-number-box>
				</view>
			</view>
			<view class=" betweenBox mgl20 mgr20">
				<view class="gray">合计所需批发劵</view>
				<view class="orange fs36 ">{{ totalSelectedPifa }}</view>
			</view>
			<view class=" betweenBox mgt10 mgl20 mgr20" v-if="memberInfo">
				<view class="gray ">剩余批发劵</view>
				<view class=" fs36 ">{{ memberInfo.frozenMoney || 0 }}</view>
			</view>
			<view class=" betweenBox mgt10 mgl20 mgr20" >
				<view class="gray ">需要支付</view>
				<view class=" fs36  red">¥ {{ pifaSelectTotalMoney }}</view>
			</view>
			<view class="agreement mgl20">
				<view @tap="agree = !agree">
					<image v-if="agree" src="/static/img/login/treaty_box_selected@2x.png" mode="widthFix"></image>
					<image v-else src="/static/img/login/treaty_box_unselected@2x.png" mode="widthFix"></image>
					<!-- <uni-icon v-if="agree" type="checkbox-filled" color="#388ceb" size="24"></uni-icon> -->
				</view>
				<view>
					<navigator url="/pages/login/agreements/agreements?type=5"><text class="txt">我已阅读并同意《批发协议》</text></navigator>
				</view>
			</view>
		</view>
		<view class="detail-wd fs30 title-black background-white">
			<view class="wd mgt40">商品详情</view>
			<view class="line"></view>
		</view>
		<view class="pd20 background-white pdt20" v-if="goodsDetail.shortDescription">
			<rich-text class="richText" :nodes="goodsDetail.shortDescription"></rich-text>
			<!-- <view class="detail-wrap" v-html="goodsDetail.shortDescription"></view> -->
		</view>
		<view class="buy tac">
			<view class="server pdl20 pdr20 " @tap="service">
				<view class=""><image src="/static/img/public_icon_onchat@2x.png" mode="widthFix" class=""></image></view>
				<view class="fs22 gray">客服</view>
			</view>
			<view class="server pdl20 pdr20 ">
				<navigator url="../cart/cart" open-type="switchTab">
					<view class=""><image src="/static/img/public_icon_shop_car@2x.png" mode="widthFix" class=""></image></view>
					<view class="fs22 gray">购物车</view>
				</navigator>
			</view>
			<view class="" v-if="goodsDetail.type == 2">
				<view class="addToCar fs30" @tap="takeOrder(0)" v-if="goodsDetail.type === 2">
					<!-- <image src="/static/img/car2.png" mode="widthFix"></image> -->
					<view class="flex-box">加入购物车</view>
				</view>
				<view class="buynow fs30 white" @tap="takeOrder(1)" :class="{ forbid: !allowBuy }"><view class="flex-box">{{goodsDetail&&goodsDetail.stock?'立即购买':'售罄'}}</view></view>
				
			</view>
			<view class="" v-if="goodsDetail.type != 2" >
				<view class="flex-box bigBtn background-blue"  @tap="takeOrder(1)" v-if="goodsDetail.type==1&&!activeStart">下期爆款</view>
				<view class="flex-box bigBtn" :class="{ forbid: !allowBuy }" @tap="takeOrder(1)" v-else>立即抢购</view>
			</view>
		</view>
		<!-- 购物车弹窗 -->
		<view class="car-pop" v-if="showPop">
			<view class="content">
				<view class="close-icon"><uni-icon type="closeempty" size="30" @click="showPop = false"></uni-icon></view>
				<view class="top-img ">
					<view class="left"><image :src="attibuteImg || goodsDetail.image" mode="widthFix" class="w100"></image></view>
					<view class="right" v-if="goodsDetail.mulType">
						<view class="red fs36" v-if="selectModel">￥{{ selectModel.price }} 元</view>
						<view class="gray fs24 mgt10" v-if="selectModel && goodsDetail.type != 0">库存 {{ selectModel.stock }} 件</view>
						<view class="gray fs24 mgt10" v-else-if="systemInfo.retailInventoryHidden == 'false'">库存 {{ selectModel.stock }} 件</view>
						<view class="mgt10">请选择规格数量</view>
					</view>
					<view class="right" v-else>
						<view class="red fs36">￥{{ goodsDetail.price }} 元</view>
						<view class="gray fs24 mgt10" v-if="goodsDetail.type != 0">库存 {{ goodsDetail.stock }} 件</view>
						<view class="gray fs24 mgt10" v-else-if="systemInfo.retailInventoryHidden == 'false'">库存 {{ goodsDetail.stock }} 件</view>
						<view class="mgt10">请选择购买数量</view>
					</view>
				</view>
				<!-- 是否多个型号 -->
				<view class="pdl20 pdr20 ">
					<view class="" v-if="goodsDetail.mulType" v-for="(item, index) in attributeKeyList" :key="index">
						<view class="mgb10">选择{{ item.keyName }}</view>
						<view class="size-choose">
							<view
								class="size-btn"
								v-for="(subitem, subindex) in item.valueList"
								:key="subindex"
								:class="{ 'active-btn': subitem.active }"
								@tap="selectAttr(index, subindex, subitem)"
							>
								{{ subitem.valueName }}
							</view>
						</view>
					</view>
					<view class="buy-num mgb20 pdt20">
						<view class="">
							<text class="fs30">购买数量</text>
							<text class="gray fs24" v-if="goodsDetail.buyLimit">(每人限购{{ goodsDetail.buyLimit }}件)</text>
						</view>
						<view class="">
							<uni-number-box
								:min="1"
								v-if="goodsDetail.buyLimit"
								:max="goodsDetail.buyLimit > goodsDetail.stock ? goodsDetail.stock : goodsDetail.buyLimit"
								:value="chooseNumber"
								@change="chooseGoodsNumber"
							></uni-number-box>
							<uni-number-box
								:min="1"
								v-else
								:max="selectModel ? selectModel.stock : goodsDetail.stock"
								:value="chooseNumber"
								@change="chooseGoodsNumber"
							></uni-number-box>
						</view>
					</view>
					<view class="buy-btn" @tap="buyNow">{{ addToShoppingCar ? '加入购物车' : '立即购买' }}</view>
				</view>
			</view>
		</view>
		<!-- <agree-pop v-if="agreementType" :type="agreementType"></agree-pop> -->
	</view>
</template>
<script>
import uniNumberBox from '@/components/uni-number-box.vue';
import detailCountdown from '@/components/detail-countdown.vue';
import uniCountdown from '@/components/uni-countdown.vue';
import agreePop from '@/components/agreement-pop.vue';
import { mapState, mapMutations } from 'vuex';
import graceRichText from '@/common/richText.js';
import {staticImgResource,H5Domain} from '@/common/req.js'
import math from '@/common/math.js'

export default {
	data() {
		return {
			showPop: false,
			chooseNumber: 1,
			goodsDetail: null,
			addToShoppingCar: false,
			attributeKeyList: null,
			selectModel: null,
			productProxyPackageList: [],
			pifaNum: 1,
			selectedPifa: null,
			expressFee: null,
			agreementType: null,
			allowBuy: true,
			attibuteImg: null,
			currentTime: '',
			productId:null,
			staticImgResource:'',
			activeStart:false,
			agree:true
		};
	},
	computed: {
		...mapState(['memberInfo', 'activeAddress', 'systemInfo']),
		totalSelectedPifa () {
		  return this.selectedPifa ? math.multiply(this.selectedPifa.wholesaleCoupon, this.pifaNum) : 0
		},
		pifaSelectTotalMoney(){
			return this.selectedPifa ? math.multiply(this.selectedPifa.wholesalePrice, this.pifaNum) : 0
		}
	},
	onShow() {},
	onShareAppMessage(res) {
		return {
			title: this.goodsDetail.productname
		};
	},
	onPullDownRefresh(e) {
		this.getGoodsDetai(this.productId);
		this.$store.dispatch('getMemberInfo')
		setTimeout(() => {
			uni.stopPullDownRefresh();
		}, 1000);
	},
	onLoad(e) {
		this.staticImgResource = staticImgResource;
		e.id?this.productId = e.id:'';
		this.getGoodsDetai(e.id);
		this.forwardMiniProgram();
		//发票
		uni.removeStorage({
			key: 'receiptInfo'
		})
	},
	watch: {
		activeAddress: function(val, oldVal) {
			this.getExpress();
		}
	},
	methods: {
		sharePage() {
			console.log('enter');
			uni.share({
				provider: 'weixin',
				scene: 'WXSceneSession',
				type: 0,
				href: H5Domain,
				title: this.goodsDetail.productname,
				summary: '一起来选购吧',
				imageUrl: this.goodsDetail.image,
				success: function(res) {
					console.log('success:' + JSON.stringify(res));
				},
				fail: function(err) {
					console.log('fail:' + JSON.stringify(err));
				}
			});
		},
		//批发零售活动结束
		activeOver() {
			uni.showToast({
				title: '该活动已经结束，即将退出本次活动，谢谢您的支持',
				mask: false,
				icon: 'none',
				duration: 2000
			});
			setTimeout(() => {
				uni.switchTab({
					url: '../index/index'
				});
			}, 2000);
		},
		service() {
			uni.showModal({
				title: '提示',
				content: '需要客服，请拨打电话 ' + this.systemInfo.phone,
				success: function(res) {
					if (res.confirm) {
						console.log('用户点击确定');
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			});
		},
		// 过滤复文本特殊符号
		filterSpecialSymbol(str) {
			// str = str.replace(/\<img/gi, '<img style="max-width:100%;height:auto" ');
			str = graceRichText.format(str);
			return str;
		},
		//get express
		getExpress() {
			if (!this.goodsDetail) return;
			this.apiUrl
				.getExpress({
					data: {
						cityId: this.activeAddress.city||'',
						productId: this.goodsDetail.id
					}
				})
				.then(res => {
					if (res.data.status == 1) {
						this.expressFee = res.data.data.fee;
					}
				});
		},
		changePifaNum(e) {
			this.pifaNum = e;
			//批发商品数量限制
			if (this.selectedPifa) {
				e > this.selectedPifa.stock ? (this.pifaNum = this.selectedPifa.stock) : '';
			}
		},
		// 选择套餐
		choosePackage(index) {
			let arr = [...this.productProxyPackageList];
			arr.forEach(item => (item.active = false));
			arr[index].active = true;
			this.selectedPifa = arr[index]; //select package
			this.productProxyPackageList = arr;

			this.pifaNum = 1; //init buy num
		},
		getGoodsDetai(id) {
			uni.showLoading({
				title: '加载中'
			});
			this.apiUrl
				.getGoodsdetail({
					data: {
						id: id
					}
				})
				.then(
					res => {
						uni.hideLoading();
						if (res.data.data) {
							let str = res.data.data.shortDescription;
							res.data.data.shortDescription ? (res.data.data.shortDescription = this.filterSpecialSymbol(str)) : ''; //handle rich text
							this.goodsDetail = res.data.data;
							if (this.goodsDetail.type == 2) {
								if (res.data.data.attributeKeyList) {
									let arr = res.data.data.attributeKeyList;
									//初始化 active model 选择
									arr.forEach(item => {
										item.valueList.forEach(subitem => (subitem.active = false));
									});
									this.attributeKeyList = arr;
								}
								this.goodsDetail.mulType ? '' : (this.selectModel = this.goodsDetail.productModelList[0]);
							}
							
							//套餐选择
							if (this.goodsDetail.type == 1) {
								let arr2 = res.data.data.productProxyPackageList;
								arr2.forEach(item => (item.active = false));
								this.productProxyPackageList = arr2;
								//默认选择第一个套餐
								arr2[0].active = true;
								this.selectedPifa = arr2[0]; //select package
								this.productProxyPackageList = arr2;
								
								//批发活动是否开始
								if(res.data.now<res.data.data.productBatch.proxyStartTime){
									this.activeStart = false;
								}else{
									this.activeStart = true;
								}
							}
							if (this.activeAddress) this.getExpress();
							//批发零售活动未开始不许购买
							let now = new Date().getTime();
							if (this.goodsDetail.type == 1) {
								this.agreementType = 5; //批发协议
								this.goodsDetail.productBatch.proxyStartTime - now > 0 ? (this.allowBuy = false) : '';
							}
							if (this.goodsDetail.type == 0) {
								this.agreementType = 4; //零售协议
								this.goodsDetail.productBatch.proxyStartTime - now > 0 ? (this.allowBuy = false) : '';
							}
							//if (!this.goodsDetail.stock) this.allowBuy = false;
							this.currentTime = res.data.now;
						}
					},
					err => {}
				);
		},
		takeOrder(type) {
			
			
			if (!this.memberInfo) {
				uni.showToast({
					title: '请先登录再购买，谢谢',
					duration: 1500,
					icon: 'none'
				});
				setTimeout(() => {
					uni.setStorageSync('pagefromDetail', this.goodsDetail.id);
					uni.navigateTo({
						url: '../login/login'
					});
				}, 1500);
				return;
			}
			if (!this.allowBuy) {
				uni.showToast({
					title: '该商品还未开始售卖，请留意开售时间',
					duration: 1500,
					icon: 'none'
				});
				return;
			}
			if (!this.goodsDetail.stock) {
				uni.showToast({
					title: '该商品已卖完，请选择其他商品',
					duration: 1500,
					icon: 'none'
				});
				return;
			}
			
			if(!this.agree){
				uni.showToast({
					title: '购买该商品需要同意购买协议，请勾选',
					duration: 1500,
					icon: 'none'
				});
				return;
			}
			if (this.goodsDetail.type == 0) {
				//普通
				this.showPop = !this.showPop;
			}
			//批发 //零售
			if (this.goodsDetail.type == 1) {
				let bol = false;
				this.productProxyPackageList.forEach(item => {
					item.active ? (bol = true) : '';
				});
				if (!bol) {
					uni.showToast({
						title: '请选择套餐',
						duration: 1500,
						icon: 'none'
					});
					return;
				}
				//是否足够批发卷
				if (this.memberInfo.frozenMoney < math.multiply(this.selectedPifa.wholesaleCoupon,this.pifaNum)) {
					uni.showToast({
						title: '您的批发券不足，不能购买该商品',
						duration: 1500,
						icon: 'none'
					});
					return;
				}
				this.goodsDetail.productProxyPackageList = this.productProxyPackageList;
				this.goodsDetail.amount = this.pifaNum;
				this.goodsDetail.selectModel = this.selectedPifa;
				uni.setStorage({
					key: 'payingProduct',
					data: this.goodsDetail,
					success: e => {
						uni.navigateTo({
							url: '../order/fillOrder/fillOrder?type=' + this.goodsDetail.type
						});
					}
				});
				return;
			}
			if (this.goodsDetail.type == 2) {
				type ? (this.addToShoppingCar = false) : (this.addToShoppingCar = true);
				this.showPop = true;
			}
		},
		selectAttr(pIndex, sIndex, subitem) {
			let arr = this.attributeKeyList[pIndex];
			arr.valueList.forEach(item => (item.active = false));
			arr.valueList[sIndex].active = true;
			this.attributeKeyList.splice(pIndex, 1, arr);
			//点击 查询 选择规格
			this.initSelectModel();
			//更换不同model图片
			if (subitem.imageUrl) {
				this.attibuteImg = subitem.imageUrl;
			}
		},
		chooseGoodsNumber(e) {
			this.chooseNumber = e;
		},
		changeStatus() {
			this.showPop = !this.showPop;
		},
		// 筛选 用户选择的组合

		initSelectModel() {
			let arr = this.attributeKeyList;
			let idsArr = [];
			arr.forEach(item => {
				item.valueList.forEach(subitem => {
					subitem.active ? idsArr.push(subitem.id) : '';
				});
			});
			let targetGoods = null;

			let pmArr = this.goodsDetail.productModelList;
			for (let i = 0; i < pmArr.length; i++) {
				let bol = true;
				for (let y = 0; y < idsArr.length; y++) {
					if (pmArr[i].valueIds.indexOf(idsArr[y]) == -1) {
						bol = false;
						break;
					}
				}
				if (bol && idsArr.length === arr.length) {
					targetGoods = pmArr[i];
				}
			}
			this.selectModel = targetGoods;
		},
		buyNow() {
			if (this.goodsDetail.type == 0) {
				//零售
				this.goodsDetail.amount = this.chooseNumber;
				uni.setStorage({
					key: 'payingProduct',
					data: this.goodsDetail,
					success: e => {
						uni.navigateTo({
							url: '../order/fillOrder/fillOrder?type=' + this.goodsDetail.type
						});
					}
				});
				return;
			} else if (this.goodsDetail.type == 1) {
				//批发
			} else {
				//普通
				if (this.goodsDetail.mulType) {
					let arr = this.attributeKeyList;
					let num = 0;
					arr.forEach(item => {
						item.valueList.forEach(subitem => {
							subitem.active ? num++ : '';
						});
					});
					if (num < arr.length) {
						uni.showToast({
							icon: 'none',
							duration: 2000,
							title: '请选择型号规格'
						});
						return;
					}
					if (!this.chooseNumber) {
						uni.showToast({
							icon: 'none',
							duration: 2000,
							title: '请选择数量'
						});
						return;
					}
				}
				if (!this.selectModel.stock) {
					uni.showToast({
						icon: 'none',
						duration: 2000,
						title: '所选商品已售完，请选择其他产品'
					});
					return;
				}
				if (this.addToShoppingCar) {
					//添加购物车
					let data = {
						memberId: this.memberInfo.id, //is login?
						amount: this.chooseNumber,
						productId: this.goodsDetail.id
					};
					this.goodsDetail.mulType ? (data.modelId = this.selectModel.id) : (data.modelId = this.goodsDetail.productModelList[0].id);

					this.apiUrl
						.addTocar({
							data
						})
						.then(res => {
							uni.showToast({
								icon: 'none',
								duration: 2000,
								title: '添加成功'
							});
							this.showPop = !this.showPop;
						});
				} else {
					//购买
					if (this.goodsDetail.mulType) {
						this.goodsDetail.selectModel = this.selectModel;
					} else {
						this.goodsDetail.selectModel = this.goodsDetail.productModelList[0];
					}
					this.goodsDetail.amount = this.chooseNumber;
					uni.setStorage({
						key: 'payingProduct',
						data: this.goodsDetail,
						success: e => {
							uni.navigateTo({
								url: '../order/fillOrder/fillOrder?type=' + this.goodsDetail.type
							});
						}
					});
				}
			}
		}
	},
	components: {
		uniNumberBox,
		uniCountdown,
		agreePop,
		detailCountdown
	}
};
</script>

<style lang="less">
/* #ifdef APP-PLUS */
.uni-page-head {
	display: none;
}
.share {
	position: absolute;
	right: 20upx;
	top: 20upx;
	width: 52upx;
	height: 52upx;
	border-radius: 50%;
	background: rgba(0, 0, 0, 0.5);
	image {
		width: 32upx;
		height: auto;
		float: left;
	}
}
/* #endif */

uni-page-head {
	display: none !important;
}
uni-swiper {
	height: 750upx !important;
}
swiper {
	height: 750upx;
}
.detail_swiper {
	height: 750upx;
}
.detail-wrap {
	display: flex;
	flex-direction: column;
	word-wrap: break-word;
}

.forbid {
	background: #bfbfbf !important;
}
.richText {
	overflow: hidden;
}
.bigTitle {
	font-size: 36upx;
	font-weight: 500;
	color: rgba(51, 51, 51, 1);
}
.pd-package {
	margin: 40upx;
	margin-top: 0;
	background: rgba(255, 255, 255, 1);
	box-shadow: 0px 4upx 20upx 0px rgba(210, 210, 210, 0.5);
	border-radius: 12upx;
	padding-bottom: 40upx;
	.package-wrap {
		display: flex;
		background: rgba(250, 250, 250, 1);
		border-radius: 10px;
		padding: 20upx 0;
		margin-bottom: 20upx;
		&:first-child {
			background: none;
		}
		> view {
			flex: 2;
			display: flex;
			justify-content: center;
		}
		&.active {
			background: rgba(84, 208, 23, 0.1);
			border-radius: 10upx;
			border: 2upx solid rgba(73, 212, 110, 1);
		}
	}
}

.pd-countdown {
	display: flex;
	justify-content: space-between;
	padding: 10upx 20upx;
	color: white;
	background-image: linear-gradient(90deg, #53b1fa 0%, #388ceb 100%);

	.price {
		display: flex;
		align-items: center;
		font-size: 50upx;
	}

	&.yellow-cd {
		background-image: linear-gradient(90deg, #ffb75a 0%, #e78e00 100%);
	}
}

.buy-num {
	display: flex;
	justify-content: space-between;
	align-items: center;
	border-top: 1px solid #eaeaea;
}
.pd-detail {
	padding-bottom: 100upx;
	overflow: hidden;
}
.buy {
	position: fixed;
	z-index: 10;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 100upx;
	display: flex;
	align-items: center;
	background: white;

	.server {
		width: 100upx;
		text-align: center;
		height: 100%;
		display: block;
		line-height: 0;
		image {
			margin-top: 20upx;
			width: 40upx;
		}
		view {
			line-height: 30upx;
		}
	}
	.bigBtn {
		width: 448upx;
		height: 80upx;
		background: rgba(252, 78, 41, 1);
		border-radius: 40upx;
		color: white;
		font-size: 32upx;
		&.background-blue{
			background: #388ceb;
		}
	}
	.addToCar {
		flex: 2;
		height: 100%;
		> view {
			width: 224upx;
			height: 80upx;
			background: rgba(51, 51, 51, 1);
			border-radius: 50upx 0upx 0upx 50upx;
			color: white;
		}
		image {
			width: 40upx;
			margin-right: 20upx;
		}
	}

	> view {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.buynow {
		flex: 2;
		height: 100%;
		> view {
			width: 224upx;
			height: 80upx;
			background: rgba(252, 78, 41, 1);
			border-radius: 0upx 45upx 45upx 0upx;
			color: white;
		}
	}
}

.detail-wd {
	text-align: center;
	line-height: 85upx;
	position: relative;

	.line {
		position: absolute;
		display: block;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 100upx;
		height: 5upx;
		background-image: linear-gradient(90deg, #53b1fa 0%, #388ceb 100%);
		border-radius: 3upx;
	}
}

.pd-info {
	.price {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.pd-name {
		line-height: 45upx;
		letter-spacing: 2upx;
	}
}
.pd40 {
	padding: 40upx;
}
.detail_info {
	width: 690upx;
	margin: 0 auto;
	background: rgba(255, 255, 255, 1);
	box-shadow: 0upx 4upx 20upx 0upx rgba(210, 210, 210, 0.5);
	border-radius: 12upx;
	position: relative;
	top: -60upx;
	box-sizing: border-box;
	overflow: hidden;
	.price {
		font-size: 50upx;
	}
	.name {
		font-size: 30upx;
		font-weight: 400;
		color: rgba(51, 51, 51, 1);
		margin-top: 20upx;
	}
	.point {
		margin: 20upx 0;
	}
	.express {
		border-top: 1px dashed #929292;
		padding: 20upx 0 10upx 0;
	}
}

</style>
