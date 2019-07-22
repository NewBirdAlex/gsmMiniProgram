<template>
	<view class="pageBg colTopBottom">
		<view class="">
			<view class="pd20 flex fs30 background-white bdb">
				<view class="w200 fs30 title-black">原支付密码</view>
				<view class="flex-box" style="flex:2;">
					<input type="text" style="flex:2;" v-model="oldPassword" :password="!showPassword" placeholder="请输入原支付密码"  />
					<text class="password-mode" @tap="showPassword=!showPassword">{{showPassword? '隐藏':'显示'}}</text>
				</view>
			</view>
			<view class="pd20 flex fs30 background-white bdb">
				<view class="w200 fs30 title-black">新支付密码</view>
				
				<view class="flex-box" style="flex:2;">
					<input type="text"  style="flex:2;" v-model="paypwd" :password="!showPassword2" placeholder="请输入新支付密码"  />
					<text class="password-mode" @tap="showPassword2=!showPassword2">{{showPassword2? '隐藏':'显示'}}</text>
				</view>
			</view>
		</view>
		<view class=" mgb20 blue-btn primary-background" @tap="submitSafepsw">
			确认修改
		</view>
	</view>
</template>

<script>
	import {mapState,mapMutations} from 'vuex'

	export default {
		data() {
			return {
				oldPassword:'',
				paypwd	:'',
				showPassword:false,
				showPassword2:false,
				showPassword3:false
			};
		},
		computed: mapState([
			'memberInfo'
		]),
		methods:{
			submitSafepsw(){
				if(!this.oldPassword||!this.paypwd){
					uni.showToast({
						icon:'none',
						duration:2000,
						title:'请输入完整信息'
					})
				}else if(!this.checkPswString(this.paypwd)){
					uni.showToast({
						icon:'none',
						duration:2000,
						title:'密码只能是6-16位数字或数字和字母的组合  '
					})
				}else {
					uni.showLoading({
						title:'请稍候',
						mask:true
					})
					this.apiUrl.resetSafePsw({
						data:{
							mobilePhone:this.memberInfo.mobilePhone,
							oldPassword:this.oldPassword,
							paypwd:this.paypwd	
						}
					}).then(res=>{
						uni.hideLoading();
						if(res.data.status&&res.data.status==1){
							uni.showToast({
								icon:'none',
								duration:2000,
								title:'修改成功'
							})
							setTimeout(()=>{
								uni.navigateBack()
							},1500)
						}
					})
				}
			}
		}
	}
</script>

<style lang="less">

</style>
