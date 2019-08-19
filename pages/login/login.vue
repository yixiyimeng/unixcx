<template>
	<view class="loginbox">
		<div class="topnav">
			<div class="close"><image mode="widthFix" src="/static/images/loginclose.png"></image></div>
		</div>
		<!-- title -->
		<div class="title">登录</div>
		<p class="subtitle">
			还没有账号，请
			<navigator url="">注册</navigator>
		</p>
		<div class="from-group">
			<div class="from-row">
				<label>手机号</label>
				<div class="flex flex-align-center from-input">
					<span class="num">+86</span>
					<input ref="telphone" v-focus="picFocusStatus" type="text" v-model.lazy="telphone" class="flex-1" placeholder="请输入手机号" />
					<i class="icon clear" v-if="telphone.length > 0" @click="clear"></i>
				</div>
			</div>
			<div class="from-row">
				<label>密码</label>
				<div class="flex flex-align-center from-input">
					<input :type="!showpwd ? 'password' : 'text'" value="" class="flex-1" placeholder="请再次确认您的密码" />
					<i class="icon eye" @click="showpwd = !showpwd" :class="{ open: showpwd }"></i>
				</div>
			</div>
			<div class="link"><navigator url="">忘记密码</navigator></div>
			<div class="loginbtn">登录</div>
			<div class="other">
				<div>其他登录方式</div>
				<div class="otherlink">
					<navigator url=""><image src="../../static/images/weixin.png" mode="widthFix"></image></navigator>
					<navigator url=""><image src="../../static/images/shouji.png" mode="widthFix"></image></navigator>
				</div>
			</div>
			<p class="tip">我们不会向微信发布任何内容或向您的手机发送无效短信</p>
		</div>
	</view>
</template>

<script>
export default {
	data() {
		return {
			telphone: '',
			showpwd: false,
			picFocusStatus: true
		};
	},
	directives: {
		focus: {
			inserted: function(el, { value }) {
				if (value) {
					el.focus();
				}
			}
		}
	},
	methods: {
		clear() {
			this.telphone = '';
			this.picFocusStatus = true;
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
