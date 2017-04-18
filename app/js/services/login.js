angular.module('myApp')
.factory('adminSever', function($http,$q,API_SERVER,API_PARMS,$cookieStore,$rootScope) {
	var service = {}
    service.getLogin = function(obj){
    	if($cookieStore.get("userInfo")){
    		$cookieStore.remove("userInfo");
    	}
    	var deferred = $q.defer();
    	$http({
		    method:'post',
		    url:API_SERVER+'/sysUser/login',
		    data:API_PARMS(obj)
		  }).then(function(data){
			deferred.resolve(data.data);
			if(data.data.status === 200){
				var userInfo = {
					'loginName':data.data.data.mobile,
					'token':data.data.data.token,
				}
				$cookieStore.put("userInfo", userInfo);
			}else if(data.data.status ===202 || data.data.status ===700){
				$rootScope.$state.go('login');
			}	
		  }).catch(function(data){
		    deferred.reject('登录错误');	
		    $rootScope.$state.go('login');
		  })
		return deferred.promise;  
    }
    return service;
});
