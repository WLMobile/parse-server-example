Parse.Cloud.define('hello', function(req, res) {
	res.success('Hello');
});

Parse.Cloud.define('updateArray', updateArray);
Parse.Cloud.define('updateData', updateData);

Parse.Cloud.define('syncData', syncData);

Parse.Cloud.define('SyncArray', syncArray);
Parse.Cloud.define('listArray', listArray);

function updateData(req, response) {
	//var CC = Parse.Object.extend(req.params.parseClass);
	var query = new Parse.Query(req.params.parseClass);
	console.log('OK');
	query.equalTo("oid", req.params.data.oid);
	query.first({
		sessionToken : req.user.getSessionToken(),
		success : function(obj) {
			if (obj) {
				obj.set(req.params.data);
				obj.save(null, {
					sessionToken : req.user.getSessionToken(),
					success : function(parseClass) {
						response.success(parseClass);
					},
					error : function(data, error) {
						response.success("Object not saved");
					}
				});
			} else {
				var CC = Parse.Object.extend(req.params.parseClass);
				var parseClass = new CC();
				var newACL = new Parse.ACL();
				newACL.setPublicReadAccess(false);
				newACL.setPublicWriteAccess(false);
				newACL.setReadAccess(req.params.data.userId, true);
				newACL.setWriteAccess(req.params.data.userId, true);
				parseClass.setACL(newACL);
				parseClass.set(req.params.data);
				parseClass.save(null, {
					success : function(parseClass) {
						response.success('Object not existing. Creating a new one');
					},
					error : function(data, error) {
						response.error(error);
					}
				});
			}

		},
		error : function(obj, error) {
			response.success("No result found");
		}
	});

}

function listArray(req, response){
	listObjects(req.params).then(function(results){
		response.success(results);
	},
	function(error){
		response.error(error);
	});
	
}

function findObject(obj){
	var query = new Parse.Query(obj.parseClass);
	query.equalTo("oid", obj.oid);
	return query.first();
}

function listObjects(array){
	var promisesArray = [];
	for(var i =0; i< array.length; i++){
		promisesArray.push(findObject(array[i]));
	}
	return Parse.Promise.when(promisesArray);
}

function syncArray(req, response) {
	var modelArray = [];
	var newACL = new Parse.ACL();
	newACL.setPublicReadAccess(false);
	newACL.setPublicWriteAccess(false);
	newACL.setReadAccess(req.params.userId, true);
	newACL.setWriteAccess(req.params.userId, true);
	var dataArray = req.params.data;

	for (var i = 0; i < dataArray.length; i++) {
		var CC = Parse.Object.extend(dataArray[i].parseClass);
		var parseClass = new CC();
		parseClass.set(dataArray[i].data);
		parseClass.setACL(newACL);
		modelArray[i] = parseClass;
	}

	Parse.Object.saveAll(modelArray, {
		success : function(list) {
			// All the objects were saved.
			response.success("ok ");
			//saveAll is now finished and we can properly exit with confidence :-)
		},
		error : function(error) {
			// An error occurred while saving one of the objects.
			response.error("failure on saving list ");
		},
	});
}

function syncData(req, response) {
	var CC = Parse.Object.extend(req.params.parseClass);
	//Parse.Cloud.useMasterKey();
	var parseClass = new CC();
	var newACL = new Parse.ACL();
	newACL.setPublicReadAccess(false);
	newACL.setPublicWriteAccess(false);
	newACL.setReadAccess(req.params.data.userId, true);
	newACL.setWriteAccess(req.params.data.userId, true);
	parseClass.setACL(newACL);
	parseClass.set(req.params.data);
	parseClass.save(null, {
		success : function(parseClass) {
			response.success(parseClass);
		},
		error : function(data, error) {
			response.error(error);
		}
	});
}