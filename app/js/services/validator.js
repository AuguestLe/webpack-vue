angular.module('myApp')
.directive('userValidator', ['$log', function($log) {
      return {
          restrict: 'A',
          require: 'ngModel',
          link: function($scope, $element, $attrs, $ngModelCtrl) {
              var verifyRule = (/^1[34578]\d{9}$/);
              var verify = function(input) {
                return verifyRule.test(input);   
              };
              $ngModelCtrl.$parsers.push(function(input) {
                  var validity = verify(input);
                  $ngModelCtrl.$setValidity('defined', validity);
                  return validity ? input : false ;
              });
          }
    }
  }])
  .directive('namevalidator', ['$log', function($log) {
      return {
          restrict: 'A',
          require: 'ngModel',
          link: function($scope, $element, $attrs, $ngModelCtrl) {
              var verifyRule = /^[\u4e00-\u9fa5]{2,5}$/;
              var verify = function(input) {
                return verifyRule.test(input);   
              };
              $ngModelCtrl.$parsers.push(function(input) {
                  var validity = verify(input);
                  $ngModelCtrl.$setValidity('defined', validity);
                  return validity ? input : false ;
              });
          }
    }
  }])
  .directive('namevaguvalidator', ['$log', function($log) {
      return {
          restrict: 'A',
          require: 'ngModel',
          link: function($scope, $element, $attrs, $ngModelCtrl) {
              var verifyRule = /^[\u4e00-\u9fa5]{1,5}$/;
              var verify = function(input) {
                return verifyRule.test(input);   
              };
              $ngModelCtrl.$parsers.push(function(input) {
                  var validity = verify(input);
                  $ngModelCtrl.$setValidity('defined', validity);
                  return validity ? input : false ;
              });
          }
    }
  }])
  .directive('passwordvalidator', ['$log', function($log) {
      return {
          restrict: 'A',
          require: 'ngModel',
          link: function($scope, $element, $attrs, $ngModelCtrl) {
              var verifyRule =  /^(?!(?:\d+|[a-zA-Z]+)$)[\da-zA-Z]{6,8}$/; // 必须字母数字混合
              //var verifyRule =  /[a-zA-Z\d]{6,8}/;
              var verify = function(input) {
                return verifyRule.test(input);   
              };
              $ngModelCtrl.$parsers.push(function(input) {
                  var validity = verify(input);
                  $ngModelCtrl.$setValidity('defined', validity);
                  return validity ? input : false ;
              });
          }
    }
  }])
.directive('alertBar',[function(){
  return {
    restrict: 'EA',
    templateUrl: 'dist/views/messagetip.html',
    scope : {
      message : "=",
      type : "="
    },
    link: function(scope, element, attrs){
      scope.hideAlert = function() {
        scope.message = null;
        scope.type = null;
      };

    }
  };
}]);  