<template>
	<view class="pageBg colTopBottom">
		<view class="pd20 flex fs30 background-white bdb">
			<view class="w200 fs30 title-black">昵称</view>
			<input type="text" v-model="newName" placeholder="请输入昵称" />
		</view>
		<view class=" mgt40 blue-btn primary-background mgb20" @tap='changename'>
			确认修改
		</view>
	</view>
</template>

<script>
	import {mapState,mapMutations} from 'vuex'

	export default {
		data() {
			return {
				newName:''
			};
		},
		onLoad() {
			this.newName = this.memberInfo.userName
		},
		computed: mapState([
			'memberInfo'
		]),
		methods:{
			strlen(str){
				var len = 0;  
				for (var i=0; i<str.length; i++) {   
				 var c = str.charCodeAt(i);   
				//单字节加1   
				 if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {   
				   len++;   
				 }   
				 else {   
				  len+=2;   
				 }   
				}   
				return len;  
			},
			changename(){
				console.log(this.newName.length);
				let len = this.strlen(this.newName);
				if(len>16){
					uni.showToast({
						title:'昵称最多为8个中文字符或者16个英文字符',
						icon:'none',
						duration:1500
					})
					return
				}
				if(!this.newName){
					uni.showToast({
						icon:'none',
						duration:2000,
						title:'昵称不能为空'
					})
					return
				} 
				uni.showLoading({
					title:'请稍候',
					mask:true
				})
				this.apiUrl.editMemberInfo({data:{
					userName:this.newName,
					id:this.memberInfo.id
				}}).then(res=>{
					uni.hideLoading();
					if(res.data.status==1){
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
</script>

<style lang="less">

</style>
