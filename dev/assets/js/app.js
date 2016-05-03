var myApp=angular.module('myApp', ['ui.router','ngSanitize']);

myApp.config(function($stateProvider, $urlRouterProvider) {   
    
    
    $stateProvider
        
        // HOME STATES AND NESTED VIEWS ========================================
        .state('promoM', {
            url: '/promoM',
            templateUrl: 'modules/promo-m/index.html'
        })
        
        // ABOUT PAGE AND MULTIPLE NAMED VIEWS =================================
        .state('promoS', {
             url: '/promoS',
            templateUrl: 'modules/promo-s/index.html'     
        })
        .state('/', {
            url: '/',
            templateUrl: 'modules/aboutToolkit/index.html'
        });

        $urlRouterProvider.otherwise("/");
        
});

myApp.service('modulesService', function($http){
    this.moduleData= function(){
        return $http.get('assets/data/modules.json');
    };   
});

myApp.controller('modulesController',['$scope','modulesService', function($scope,modulesService){
    modulesService.moduleData().then(function(httpData) {
        $scope.moduleData=httpData.data.modules;
        
    });

}]);



myApp.directive('fullSpec', function(){
    return {
      restrict: 'AE',
      replace: true,
      scope:{name:"@"},
      template:"<a href='javascript:void(0)' class='specsLink'>{{name}}</a>",
      link:function($scope, element, attrs) {
            angular.element('.fullSpecs').hide();
        element.bind('click',function() {
            angular.element(this).toggleClass('specActive').next().closest('.fullSpecs').slideToggle();
        });
      }

      }  
});

myApp.directive('preCode', function(){
    return {
      restrict: 'AE',
      replace: true,
      scope:{name:"@"},
      template:"<pre class='preCode prettyprint'>sadas</pre>",
      link:function($scope, element, attrs) {
        
        $('[data-behavior="sample_code"').each(function(){
          var container = $(this);
          
          var target = container.closest('.preCode');
          //if we have a target
          
            // get the sample's html
            var sample_html = container.parent().html();
            var white_space = "☺";
            // find how many spaces are before the part of the html
            try {
              white_space = sample_html.match(/\n+\s+\S/)[0].slice(0,(sample_html.match(/\n+\s+\S/)[0].length-3));
            } catch(err) {}
            // set up a regex to search for a white space string
            var re = new RegExp(white_space,"g");
            // replace white_space, < and > with &lt; and &gt; and remove the sample_code ref
            sample_html = sample_html.replace(re,"\n").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(' data-behavior="sample_code"','');
            // trim out any new lines at begining or end of string
            sample_html = $.trim(sample_html);
            // stick into target
             element.html("<code>"+sample_html+"</code>");
          
        });
      }

      }  
});

myApp.controller('formSearchController',function($scope,$state){

  $scope.selectedModule = "";
  $scope.modulesName = ["Promo M","Promo S","Promo XXL","Promo M Group"];
  $scope.clicker = function(){
    found = $.inArray($scope.selectedModule, $scope.modulesName) > -1
    if(found){
      if($scope.selectedModule == 'Promo M'){
        $state.go('promoM')
      }
      else if($scope.selectedModule == 'Promo S'){
        $state.go('promoS')
      }
    }
  }

});

myApp.directive('formSearch', function($timeout){
    return {
      restrict: 'AE',
      replace: true,
      controller: 'formSearchController',
      scope:{name:"@"},
      template:`<form autocomplete="off" action="" method="GET">
         <label for"search"="">Search for modules</label> 
         <div class="fieldandsubmitbar"> 
          <input type="text" list="modules" ng-model="selectedModule" ng-change="clicker()" name="query" placeholder="Keywords"> 
          <input type="submit" value="" >
          <datalist id="modules">
            <option ng-repeat="modules in modulesName">{{modules}}</option>
            <a ui-sref="promoM">Promo M</a>
          </datalist>
         </div> 
        </form>`,
      link:function(scope, element, attrs) {
        
        }

      };  
});


myApp.controller('deviceViewController',function($scope,$window){
   var openedwindow = '';
  $scope.viewshow = true; 

  if(getParameterByName('hidelinks')){
       $scope.viewshow = false; 
    }
  
  $scope.openwindow = function(view,orientation) {
    if (openedwindow != ''){
        openedwindow.close();
     }

    if(view == 'mobile'){
      if(orientation == 'portrait'){
        wd = '320';
        ht = '480';  
      }else{
        wd = '480';
        ht = '320'; 
      }
    }
    else{
      if(orientation == 'portrait'){
        wd = '768';
        ht = '1024'; 
      }
      else{
        wd = '1024';
        ht = '768'; 
      }
    }
      val = window.location.href;
        openedwindow = $window.open( val+ '?hidelinks=true','targetWindow','toolbar=no,location=no, status=no, menubar=no, scrollbars=yes,resizable=yes,width='+ wd + ', height='+ht);

    }

});

myApp.directive('deviceView',function(){

  return{

    restrict: 'AE',
    scope:{
        openwindow: '&'
    },
    templateUrl: 'templates/device-view.html' ,
    controller: 'deviceViewController',
    replace:true

  };

});

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)", "i"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

