import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
import apiUrl from '@/common/apiUrl.js'
const store = new Vuex.Store({
	state: {
		memberInfo:null,
		//使用的地址
		activeAddress:null,
		systemInfo:null,
		wholeCity:null

	},
	mutations: {
		delAddress(state){
			state.activeAddress=null;
		},
		//all city
		saveCity(state,citys){
			state.wholeCity = citys;
		},
		logOut(state){
			state.memberInfo = null;
			state.activeAddress = null;
			uni.removeStorage({
				key:'member'
			})
			uni.removeStorage({
				key:'activeAddress'
			})
		},
		//save address
		saveAddress(state, obj){
			state.activeAddress = obj;
		},
		//save member information
		saveMember(state, obj) {
			state.memberInfo = obj;
			uni.setStorage({
				key:'member',
				data:state.memberInfo
			})
		},
		// save member from storage
		saveStorageMember(state){
			uni.getStorage({
				key:'member',
				success:(e)=> {
					state.memberInfo = e.data;
					this.dispatch('getMemberInfo')
				}
			})
		},
		saveSystemInfo(state,obj){
			state.systemInfo = obj;
		}
	},
	actions: {
		//地址
		async getAddressInfo({
			commit,
			state
		}){
			apiUrl.getAddressList().then(res=>{
				if(res.data.status==1){
					let arr = res.data.data;
					arr.length==0?this.state.activeAddress = null:''
					arr.length==1?this.state.activeAddress = arr[0]:''
					if(arr.length>1){
						arr.forEach(item=>{
							item.isDefault?this.state.activeAddress = item:''
						})
					}
					return
				}
			})
		},
		//系统设置
		async getSystemInfo({
			commit,
			state
		}){
			apiUrl.getsystemInfo({data:{}}).then(res=>{
				if(res.data.status==1){
					res.data.data.now = res.data.now;
					this.commit('saveSystemInfo',res.data.data);
					this.memberInfo?this.dispatch('getAddressInfo'):'';
					return
				}
			})
		},
		//会员信息
		async getMemberInfo({
			commit,
			state
		}){
			if(state.memberInfo){
				//已经登陆过
				apiUrl.getMemberInfo({data:{
					id:state.memberInfo.id
				}}).then(res=>{
					if(res.data.status==1){
						commit('saveMember',res.data.data);
						this.dispatch('getAddressInfo')
						return
					}
					let message=null;
					if(res.data.status==0) message = '手机号不存在';
					if(res.data.status==2) message = '密码错误';
					if(res.data.status==3) message = '会员被禁用';
					uni.showToast({
						icon:'none',
						duration:2000,
						title:message
					})
					uni.navigateTo({
						url:'/pages/login/login'
					})
				})
			}else{
				//未登录过
				uni.navigateTo({
					url:'/pages/login/login'
				})
			}
		}
	}
})

export default store
