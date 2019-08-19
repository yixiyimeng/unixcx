<template>
	<view class="loginbox">
		<div class="topnav">
			<div class="close"><image mode="widthFix" src="/static/images/reback.png"></image></div>
		</div>
		<!-- title -->
		<div class="title">注册</div>
		<p class="subtitle">欢迎来到祭祀文化网</p>
		<div class="from-group">
			<div class="from-row">
				<label>手机号</label>
				<div class="flex flex-align-center from-input">
					<span class="num">+86</span>
					<input type="text" value="" class="flex-1" placeholder="请输入手机号" />
					<i class="icon clear"></i>
				</div>
			</div>
			<div class="from-row">
				<label>验证码</label>
				<div class="flex flex-align-center">
					<div class="flex flex-align-center from-input flex-1">
						<input type="text" value="" class="flex-1" placeholder="请输入短信验证码" />
						<i class="icon clear"></i>
					</div>
					<span class="getcode">获取验证码</span>
				</div>
			</div>
			<div class="loginbtn">下一步</div>
		</div>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	methods: {}
};
</script>

<style>
@import '../../common/login.css';
uni-view {
	line-height: 1;
}
</style>
