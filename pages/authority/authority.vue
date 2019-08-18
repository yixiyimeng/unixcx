<template>
	<view>
		<view class="wrap">
			<view class="header">
				<view class="logo"><image src="/static/images/logo.png" mode="widthFix"></image></view>
				<view class="name">世纪墓园网</view>
			</view>
			<view class="authority_administration">
				<text class="tit">登陆后开发者将获取一些权限</text>
				<text class="list">· 获取你的公开信息（昵称、头像等）</text>
				<button class="sure_but" @click="appLogin">微信登录</button>
			</view>
			<uni-popup :show="show" position="middle" mode="fixed" @hidePopup="togglePopup('')" :h5-top="true">
				<view class="cu-dialog">
					<view class="cu-bar flex flex-justify-end flex-align-center">
						<view class="content">绑定手机号</view>
						<text class="colse" @click="show = !show">跳过</text>
					</view>
					<view class="cu-form-list">
						<view class="cu-form-group"><input placeholder="输入手机号" v-model="telNumber" maxlength="11" /></view>
						<view class="cu-form-group flex">
							<input class="flex-1" placeholder="输入验证码" name="input" v-model="yzmCode" />
							<view class="getcode" v-if="timeDown">{{ timeDown }}s</view>
							<view class="getcode" v-else @click="getCode">获取验证码</view>
						</view>
						<button @click="updateBut" class="cu-btn lg">绑定</button>
					</view>
				</view>
			</uni-popup>
		</view>
	</view>
</template>

<script>
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import network from '@/public/request/request.js';
export default {
	data() {
		return {
			telNumber: '',
			yzmCode: '',
			show: true,
			timeDown: '',
			setInter: null
		};
	},
	components: {
		uniPopup
	},
	methods: {
		togglePopup() {
			this.show = false;
		},
		appLogin: function() {
			var that = this;
			uni.getProvider({
				service: 'oauth',
				success: function(res) {
					console.log(res.provider);
					//支持微信、qq和微博等
					if (~res.provider.indexOf('weixin')) {
						uni.login({
							provider: 'weixin',
							success: function(loginRes) {
								console.log('-------获取openid(unionid)-----');
								console.log(JSON.stringify(loginRes));
								// 获取用户信息
								uni.getUserInfo({
									provider: 'weixin',
									success: function(infoRes) {
										console.log('-------获取微信用户所有-----');
										console.log(JSON.stringify(infoRes.userInfo));
										var obj = {};
										obj.avatarUrl = infoRes.userInfo.avatarUrl;
										obj.city = infoRes.userInfo.city;
										obj.country = infoRes.userInfo.country;
										obj.gender = infoRes.userInfo.gender;
										obj.language = 'zh_CN';
										obj.nickName = infoRes.userInfo.nickName;
										obj.province = infoRes.userInfo.province;
										obj.openid = infoRes.userInfo.openId;
										obj.unionid = infoRes.userInfo.unionId;
										
										uni.setStorageSync('userInfo', obj); //存储openid
										that.useradd(obj);
									}
								});
							}
						});
					}
				}
			});
		},
		getCode: function() {
			if (!/^1[34578]\d{9}$/.test(this.telNumber)) {
				uni.showToast({
					title: '手机号码格式不正确',
					icon: 'none'
				});
				return false;
			}
			var that = this;
			var Token = uni.getStorageSync('Token');
			network.POST({
				url: 'GetVerCode',
				params: { Mobile: that.telNumber, Type: 'ModifyMobile' },
				success: function(res) {
					console.log(res);
					if (res.data.Code == 0) {
						that.timeDown = 60;
						var timestamp = Date.parse(new Date());
						timestamp = timestamp / 1000;
						uni.setStorageSync('telYzmCode', 60);
						uni.setStorageSync('telYzmCodeTime', timestamp);
						uni.setStorageSync('telYzmCodeTel', that.telNumber);
						that.timeDownFunc();
					}
				},
				fail: function() {},
				complete: function() {
					uni.hideLoading();
				}
			});
		},
		timeDownFunc() {
			var that = this;
			that.setInter = setInterval(function() {
				let time = that.timeDown;
				if (time > 0) {
					time--;
					that.timeDown = time;
					uni.setStorageSync('telYzmCode', time);
				} else {
					uni.removeStorageSync('telYzmCodeTime');
					uni.removeStorageSync('telYzmCodeTel');
					clearInterval(that.setInter);
				}
			}, 1000);
		},
		updateBut() {
			/* 邦定帐号 */
			var that = this;
			var Token = uni.getStorageSync('Token');
			network.POST({
				url: 'UpdateUserInfo',
				params: { mobile: that.telNumber, Token: Token, vercode: that.yzmCode },
				success: function(res) {
					if (res.data.Code == 0) {
						(that.timeDown = ''), (that.yzmCode = ''), (that.telNumber = '');
						uni.removeStorageSync('telYzmCode');
 						uni.removeStorageSync('telYzmCodeTime');
						uni.removeStorageSync('telYzmCodeTel');
						clearInterval(that.setInter);

						uni.showToast({
							title: '绑定成功',
							icon: 'success'
						});
						that.goback();
					}
				},
				fail: function() {},
				complete: function() {
					uni.hideLoading();
				}
			});
		},
		/* 手机注册 */
		
		useradd: function(obj) {
			console.log(obj);
			var that = this;
			network.POST({
				url: 'WXUserReg',
				params: obj,
				success: function(res) {
					console.log(res);
					if (res.data.Code == 0) {
						that.Token = res.data.Token;
						uni.setStorageSync('Token', res.data.Token); //存储openid
						if (res.data.Mobile == 0) {
							console.log('无手机号');
							that.show = true;
						} else {
							that.goback();
						}
					} else {
						console.log(res.data.Msg);
					}
				},
				fail: function(e) {}
			});
		},
		goback() {
			var intoType = uni.getStorageSync('intoType');
			switch (intoType) {
				case 2:
					var url = '/pages/cemetery/index?id=' + uni.getStorageSync('intoCemeId');
					break;
				case 3:
					var url = '/pages/home/order/watchLive?id=' + uni.getStorageSync('intoLiveId');
					break;
				case 4:
					var url = '/pages/memorialHall/myCemetery/myCemeteryInfo?id=' + uni.getStorageSync('intoMemorId');
					break;
				case 5:
					var url = '/pages/monument/details/index?id=' + uni.getStorageSync('intoMonuId');
					break;
				default:
					var url = '/pages/index/index';
					break;
			}

			uni.redirectTo({
				url: url
			});
		}
	}
};
</script>

<style>
.wrap {
	width: 100%;
	height: 100%;
	position: fixed;
	left: 0;
	top: 0;
	right: 0;
	background: #fff;
}

.header {
	width: 90%;
	margin: 0 5%;
	border-bottom: 1rpx solid #eee;
}
.logo {
	width: 30%;
	padding-bottom: 30%;
	height: 0;
	overflow: hidden;
	border-radius: 50%;
	margin: 100rpx 35% 20rpx 35%;
	/* border:5rpx solid #707070; */
}
.logo image {
	width: 100%;
}
.name {
	text-align: center;
	font-size: 28rpx;
	font-weight: bold;
	line-height: 80rpx;
	color: #666;
}

.authority_administration {
	width: 90%;
	margin: 50rpx 5%;
	overflow: hidden;
	background: #fff;
}
.tit {
	height: 50rpx;
	line-height: 50rpx;
	font-size: 28rpx;
	color: #000;
	width: 90%;
	padding: 0 5%;
	display: inline-block;
}
.list {
	padding: 0 10%;
	height: 80rpx;
	line-height: 80rpx;
	font-size: 24rpx;
	color: #666;
	width: 90%;
	display: inline-block;
}

button::after {
	border: none;
}
.sure_but {
	width: 90%;
	box-sizing: border-box;
	float: left;
	font-size: 28rpx;
	text-align: center;
	height: 80rpx;
	line-height: 80rpx;
	background: #fff;
	border-radius: 0;
	margin: 50rpx 5%;
	color: #fff;
	background: rgba(19, 174, 18, 1);
	border-radius: 10rpx;
	font-weight: bold;
}
.cu-dialog {
	width: 525upx;
}

.cu-dialog .cu-bar .colse {
	color: #eee;
	margin-right: 20upx;
}
.cu-uni-popup {
	width: 70%;
}
.cu-form-group {
	border-bottom: 1px solid #eeeeee;
	padding: 7px 4px;
}
.cu-form-group input {
	font-size: 25upx;
}
.getcode {
	font-size: 10px;
	color: #0486ff;
}
.cu-btn {
	width: 70%;
	background: #6d91f6;
	margin: 30px auto;
	display: block;
	line-height: 8px;
	color: #fff;
	border-radius: 0;
}
.cu-form-list {
	text-align: left;
	background: #fff;
	padding: 40rpx;
}
</style>
