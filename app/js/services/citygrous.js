angular.module('myApp')
.factory('cityServer', function($http,$q,$cookieStore,API_SERVER,API_PARMS,$rootScope) {
	var service = {}
    service.getCity = function(){
    	var deferred = $q.defer();
    	var userInfo = $cookieStore.get("userInfo");
    	$http({
		    method:'post',
		    url:API_SERVER+'/admin/area/getCityGroupList',
		    data:API_PARMS(userInfo)
		  }).then(function(data){
		  	if(data.data.status === 202 || data.data.status === 700){
		  		$rootScope.$state.go('login');
		  		$cookieStore.remove("userInfo");
		  	}else{
		  		deferred.resolve(data.data);
		  	}			
		  }).catch(function(data){
		    $cookieStore.remove("userInfo"); 
		    $rootScope.$state.go('login');
		  })
		return deferred.promise;  
    }
    return service;
});
