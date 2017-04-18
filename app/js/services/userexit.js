angular.module('myApp')
.factory('adminSeverExit', function($http,$q,API_SERVER,API_PARMS,$cookieStore,$rootScope) {
	var service = {}
    service.servLoginout = function(obj){
    	var deferred = $q.defer();
    	var userInfo = $cookieStore.get("userInfo");
    	$http({
		    method:'post',
		    url:API_SERVER+'/sysUser/logOut',
		    data:API_PARMS(userInfo)
		  }).then(function(data){
			deferred.resolve(data.data);
			if(data.data.status === 200){
				$cookieStore.remove("userInfo");
				$rootScope.$state.go('login');
			}else if(data.data.status === 202 || data.data.status === 700){
	            $rootScope.$state.go('login');
	            $cookieStore.remove("userInfo");
	        }	
		  }).catch(function(data){
		  	$cookieStore.remove("userInfo"); 
		    $rootScope.$state.go('login');
		  })
		return deferred.promise;  
    }
    return service;
});
