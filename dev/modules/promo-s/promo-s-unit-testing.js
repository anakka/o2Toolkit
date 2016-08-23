describe('Full spec directive', function() {
  var element, scope,name="View Full Specifications";

  beforeEach(module('myApp'));

  beforeEach(inject(function($rootScope, $compile) {
    scope = $rootScope.$new();

    element =
        '<full-spec name="'+name+'"></full-spec>';   

    element = $compile(element)(scope);
    scope.$digest();
  }));

  
  it("should compute the size to create other values", function() {
    expect(element.html()).toContain("View Full Specifications");   
    
  });

   it("Specifications Click Handler", function() {
    $(element).triggerHandler('click');
    
  });
 

});

