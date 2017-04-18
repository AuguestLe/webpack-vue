angular.module('myApp')
 .factory('HttpInterceptor', ['$cookieStore','$q', HttpInterceptor]);
 
function HttpInterceptor($cookieStore,$q) {
 return {
  // 请求发出之前，可以用于添加各种身份验证信息
  request: function(config){
   if($cookieStore.get("userInfo").token) {
    config.headers.token = $cookieStore.get("userInfo").token;
    config.headers.userName = $cookieStore.get("userInfo").userName;
   }
   return config;
  },
  // 请求发出时出错
  requestError: function(err){
    if($cookieStore.get("userInfo").token) {
      $cookieStore.remove("userInfo");
    }
   return $q.reject(err);
  },
  // 成功返回了响应
  response: function(res){
   return res;
  },
  // 返回的响应出错，包括后端返回响应时，设置了非 200 的 http 状态码
  responseError: function(err){
   return $q.reject(err);
  }
 };
}