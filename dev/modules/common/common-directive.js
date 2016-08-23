var myApp=myApp.directive('preCode', function($timeout){
    return {
      restrict: 'AE',
      replace: true,
      scope:{name:"@"},
      template:"<pre class='preCode prettyprint'>sadas</pre>",
      link:function($scope, element) {
        $timeout(function() {
        $('[data-behavior="sample_code"').each(function(){ 
          var container = $(this);
          
          //var target = container.closest('.preCode'); 
          //if we have a target
          
            // get the sample's html
            var sample_html = container.html();
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
        });
      }


      }; 
});

/* For background images in the modal pop-up */

myApp.directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element) {
            element.bind("change", function (changeEvent) {  
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.fileread = loadEvent.target.result;
                    });
                };
                reader.readAsDataURL(changeEvent.target.files[0]);
            });
        }
    };
}]);


//Directive for adding buttons on click that show an alert on click
myApp.directive("addmodules", function($compile){
   
  return {
    restrict: 'EA',
   scope: {
    
    name: '@' ,
    module:"@"        },
    link: function (scope, element, attrs) { 
      element.bind("click", function(){
          
        angular.element(this).replaceWith($compile("<"+scope.name+" name='"+scope.module+"' /> ")(scope));
      });
    } //DOM manipulation
    
  };
});
