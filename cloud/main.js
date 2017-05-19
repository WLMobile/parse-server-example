Parse.Cloud.define('hello', function(req, res) {
	res.success('Hello');
});

Parse.Cloud.define('updateData', updateData);
Parse.Cloud.define('syncData', syncData);
Parse.Cloud.define('syncArray', syncArray);
Parse.Cloud.define('listArray', listArray);
Parse.Cloud.define('checkSteps', checkSteps);
Parse.Cloud.define('getAllData', getAllData);
Parse.Cloud.define('getUpdates', getUpdates);
Parse.Cloud.define('getLastBatchUpdates', getLastBatchUpdates);
Parse.Cloud.define('updateAromaNames', updateAromaNames);
Parse.Cloud.define('updateACL', updateACL);
Parse.Cloud.define('deleteObjects', deleteObjects);

function updateAromaNames(req, response) {
	if(req.params.aromaName && req.params.aromaId){
		var query = new Parse.Query("aromatics");
		query.equalTo('aromaId', req.params.aromaId);
		query.notEqualTo('deleted', true);
		console.log('Updating aromas with aromaId '+ req.params.aromaId);
		query.find({
			sessionToken: req.user.getSessionToken(),
			success: function(results){
				var res = [];
				for(var i = 0, len = results.length; i < len; i++){
					results[i].set({
						"aromaName" : req.params.aromaName
					});
					results[i].save(null, {
						sessionToken: req.user.getSessionToken(),
						success: function(){
							response.success("OK");
						}
					});
				}
			}
		});
	}
}

function getUpdates(req, response) {
	return getAllData(req, response);

}

function checkSteps(req, response){
	if(req.params.batchId && req.params.stepDate){
		var query = new Parse.Query("step");
		query.equalTo('batchId', req.params.batchId);
	//	query.equalTo('done', 'false');
		query.find({
			sessionToken: req.user.getSessionToken(),
			success: function(results){
				for (var i = 0, len = results.length; i < len; i++) {
					results[i].set({
						'stepDate': req.params.stepDate,
						done: "true"
					});
					results[i].save(null,{
						sessionToken : req.user.getSessionToken(),
						success: function(){
							response.success("OK 123");
						}
					});
				}
				
			}
		})
	}
	

}

 function getAllData(req, response) {


	var promisesArray = [];
	var output = {};
	var classes = req.params.classes;
	classes.forEach(function(item){
		var query = new Parse.Query(item);
		query.limit(1000);
		
		if(req.params.lastUpdate){
			// Get latest updates
			var lastUpdate = new Date(req.params.lastUpdate)
			console.log('Got last update', req.params.lastUpdate);
			query.greaterThan('updatedAt', lastUpdate);
		} else {
			// Do not get deleted items when getting all data
			query.notEqualTo('deleted', true);
		}

		promisesArray.push(query.find({
  			sessionToken: req.user.getSessionToken()
  		}).then(function(results){
  			output[item] = results
  			return Parse.Promise.as({item: results});
  		}));


	});

	return Parse.Promise.when(promisesArray).then(function(items){
		response.success(output);
	}, function(error){
		response.success('An error occurred');
	});
}

function getLastBatchUpdates(req, response){
	var query = new Parse.Query("batch");
	//var date = new Date();
	console.log('...');
	console.log(req.params.date);
	query.greaterThanOrEqualTo('updatedAt', new Date(req.params.date));
	//query.ascending('createdAt');
	query.find({
		sessionToken: req.user.getSessionToken(),
		success: function(obj){
			if(obj){
				response.success(obj);
			}
		},
		error: function(){
			response.success("Got no result");
		}
	})

}

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
	//response.success("OK");
	listObjects(req.params.data, req.user.getSessionToken()).then(function(results){
		response.success(results);
	});
	
}

function findObject(obj, sessionToken, newACL){
	var query = new Parse.Query(obj.parseClass);
	console.log("parseClass" + obj.parseClass);
	console.log('session token '+ sessionToken);
	query.equalTo("oid", obj.data.oid);
	console.log("oid "+ obj.data.oid);
	return query.first({
		sessionToken: sessionToken
	}).then(function(result){
		if(result){
			result.set(obj.data);
			return Parse.Promise.as(result);
		} else {
			console.log('Object was not found during query ');
			console.log(obj);
			var CC = Parse.Object.extend(obj.parseClass);
			var parseClass = new CC();
			parseClass.set(obj.data);
			parseClass.setACL(newACL);
			return Parse.Promise.as(parseClass);
		}
		
	});
}

function listObjects(array, sessionToken){
	var promisesArray = [];
	for(var i =0; i< array.length; i++){
		promisesArray.push(findObject(array[i], sessionToken));
	}
	return Parse.Promise.when(promisesArray);
}

function deleteObjects(req, response){
	console.log(JSON.stringify(req));
	var query = new Parse.Query(req.params.parseClass);
	query.equalTo("oid", req.params.oid);
	var promisesArray = [];
	query.find({
			sessionToken: req.user.getSessionToken(),
			success: function(results){
				var res = [];
				for(var i = 0, len = results.length; i < len; i++){
					results[i].set({
						"deleted" : true
					});
					promisesArray.push(results[i].save(null, {
						sessionToken: req.user.getSessionToken(),
						success: function(){
							console.log("deleted");
						},
						error: function(){
							console.log("error deleting");
						}
					}));
				}
			}
		});
	return Parse.Promise.when(promisesArray).then(function(){
		response.success("ok");
	});

}


function syncArray(req, response) {
	//console.log(req.user);
	var modelArray = [];
	var newACL = new Parse.ACL();
	newACL.setPublicReadAccess(false);
	newACL.setPublicWriteAccess(false);
	newACL.setReadAccess(req.user.id, true);
	newACL.setWriteAccess(req.user.id, true);
	var dataArray = req.params.data;
	// data array has parseClass and data params
	
	getUpdatedObjects(dataArray, req.user.getSessionToken(), newACL).then(function(array){
		if(array && array.length >0){
			return Parse.Object.saveAll(array, {
				sessionToken:req.user.getSessionToken(),
				success : function(list) {
					// All the objects were saved.
					response.success(list);
				},
				error : function(obj, error) {
					// An error occurred while saving one of the objects.
					response.error(error);
				},
			});
		} else {
			console.log("No object was found");
		}
		
	});
	
}

function getUpdatedObjects(dataArray, sessionToken, newACL){
	var modelArray = [];
	for (var i = 0; i < dataArray.length; i++) {
		if(dataArray[i].data.isNew){
			var CC = Parse.Object.extend(dataArray[i].parseClass);
			var parseClass = new CC();
			parseClass.set(dataArray[i].data);
			parseClass.setACL(newACL);
			modelArray[i] = Parse.Promise.as(parseClass);
		} else {
			modelArray[i] = findObject(dataArray[i], sessionToken, newACL);
		}
		
	}
	return Parse.Promise.when(modelArray);
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

function updateACL(req, response){
	Parse.Cloud.useMasterKey();
	var query = new Parse.Query("Person");

	query.first().then(function(result){
		console.log("got result "+ JSON.stringify(result));
		var acl = result.getACL() || new Parse.ACL();

		console.log("got acl "+JSON.stringify(acl));
		acl.setReadAccess(req.params.userId, true);
		console.log("set read access, setting ACL");
		result.setACL(acl);

		result.save(null, {
			useMasterKey: true,
			success: function(){
				response.success("OK")
			},
			error: function(data, error){
				response.error(error);
			}
		});

	});

}