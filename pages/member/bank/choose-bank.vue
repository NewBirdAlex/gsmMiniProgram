<template>
	<view class="choosebank  background-white">
		<radio-group @change="radioChange">
			<view class="cardlist" v-for="(item,index) in carddata" :key="index" @click="radioChange" :data-id="item.id">
				<view class="card" :data-id='index' >
					<view class="bankName">
						<text class="md" v-if="item.type!=2">{{item.bankName||item.depositBank}}</text>
						<text class="md" v-if="item.type==2">支付宝</text>
					</view>
					<view class="mgt20">
						<text class="sm">{{item.userName}}</text>
						<text class="sm">{{item.startNum}} **** **** **** {{item.lastNum}}</text>
					</view>
				</view>
				<view class="choose">
					<radio color="#FC4E29" :value="item.id" :checked=" item.id== current" />
				</view>
			</view>
		</radio-group>
		<view class="choosecard">
			<text class="add" @tap="addCar">添加银行卡</text>
			<text class="sure" @tap="pickbank">确定</text>
		</view>
	</view>
</template>
<script>
export default{
	data(){
		return {
			current:0,
			carddata:[]
		}
	},
	onShow() {
		this.getList()

	},
	onLoad() {
	},
	methods:{
		addCar(){
			uni.navigateTo({
				url:'add-bank'
			})
		},
		pickbank(){
			if(!this.current){
				uni.showToast({
					title: '请选择银行卡',
					mask: false,
					icon:"none",
					duration: 1500
				});
				return
			}
			let bank ;
			this.carddata.forEach(item=>{
				item.id == this.current? bank = item:''
			})
			uni.setStorage({
				key:'pickBank',
				data:bank,
				success: (res) => {
					uni.navigateBack()
				}
			})
		},
		getList(){
			this.apiUrl.getBankList().then(res=>{
				if(res.data.status==1){
					let arr = res.data.data;
					arr.forEach(item=>{
						let len = item.cartNO.length;
						item.startNum = item.cartNO.slice(0,4);
						item.lastNum = item.cartNO.slice(len-4);
					})
					this.carddata=arr;
				}
			})
		},
		radioChange: function(evt) {
			console.log(evt);
			let data = evt.detail.value||evt.currentTarget.dataset.id;
			console.log(data)
            for (let i = 0; i < this.carddata.length; i++) {
                if (this.carddata[i].id === data) {
                    this.current = data;
                    break;
                }
            }
        }
	},
}
</script>
<style lang='less' scoped>
	.choosebank{
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		box-sizing: border-box;
		padding: 20upx 30upx 116upx 0;
		min-height: 90vh;
		.choosecard{
			display: flex;
			flex-direction: column;
			
			text{
				width: 650upx;
				height: 80upx;
				display: flex;
				justify-content: center;
				align-items: center;
				margin-top: 40upx;
			}
			.add{
				background-color: #ffffff;
				border-radius: 40px;
				border: solid 2upx #FC4E29;
				color: #FC4E29;
			}
			.sure{
				background-color: #FC4E29;
				border-radius: 40px;
				color: white
			}
		}
		.cardlist{
			width: 100%;
			position: relative;
			display: flex;
			flex-direction: row-reverse;
			align-items: center;
			margin-bottom: 30upx;
		
			.card{
				height: 180upx;
				width: 90%;
				box-sizing: border-box;
				padding: 36upx;
				background-image: linear-gradient(90deg, #FC4E29 0%, #FC4E29 100%);
				box-shadow: 0px 5px 10px 0px  rgba(11, 32, 55, 0.35);
				border-radius: 8px;
				display: flex;
				flex-direction: column;
				color: white;
				position: relative;
				z-index: 2;
				.sm{
					font-size: 30upx;
					margin-right: 40upx;
				}
				.md{
					font-size: 35upx;
				}
			}
		}
	}

</style>