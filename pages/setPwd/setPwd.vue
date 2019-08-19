<template>
	<view class="loginbox">
		<div class="topnav">
			<div class="close"><image mode="widthFix" src="/static/images/reback.png"></image></div>
		</div>
		<!-- title -->
		<div class="title">确认密码</div>
		<div class="from-group">
			<div class="from-row">
				<label>设置密码</label>
				<div class="flex flex-align-center from-input">
					<input :type="!showpwd?'password':'text'" value="" class="flex-1" placeholder="请设置6-20位密码" />
					<i class="icon eye" @click="showpwd=!showpwd" :class="{open:showpwd}"></i>
				</div>
			</div>
			<div class="from-row">
				<label>确认密码</label>
				<div class="flex flex-align-center from-input">
					<input :type="!showcompwd?'password':'text'" value="" class="flex-1" placeholder="请再次确认您的密码" />
					<i class="icon eye" @click="showcompwd=!showcompwd" :class="{open:showcompwd}"></i>
				</div>
			</div>
			<div class="loginbtn">完成</div>
		</div>
	</view>
</template>

<script>
export default {
	data() {
		return {
			showpwd:false,
			showcompwd:false
		};
	},
	methods: {
		openPwd(type){
		
		}
	}
};
</script>

<style>
@import '../../common/login.css';
uni-view {
	line-height: 1;
}
</style>
