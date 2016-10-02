
Parse.Cloud.define('hello', function(req, res) {
  res.success('Hello');
});

Parse.Cloud.define('syncData', function(req, response){
	var PersonClass = Parse.Object.extend("Person");
var person = new PersonClass();

person.set("age",25);

person.save(null,{
  success:function(person) { 
    response.success(person);
  },
  error:function(object, res) {
    response.error(res);
  }
});
	//var Class = Parse.Object.extend(req.params.parseClass);
	//var parseClass = new Class();
	//parseClass.set("batchName":"test");
	// parseClass.save(null, {
	// 	success: function(parseClass){
	// 		response.success(parseClass);
	// 	},
	// 	error: function(error){
	// 		response.error(error);
	// 	}
	// });

	//response.success('succes...');
});