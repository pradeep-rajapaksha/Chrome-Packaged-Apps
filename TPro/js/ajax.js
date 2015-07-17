function function_login (username, password, callback) {

	var options='<option>Select Project</option>';
	var member_id;
	$.ajax({
		url: base_api_url+'/apiLogin',
		type: 'POST',
		cache: false,
	    async: true,
	    crossdomain: true,
		dataType: 'json',
		data: {username: username, password: password},
		success:function(response){
			if (response.query_status=='success') { // check user login process is success and if yes, set all user data into view.

				chrome.storage.local.set({"member_id"	: response.user.member_id});
				chrome.storage.local.set({"member_code"	: response.user.member_code});
				chrome.storage.local.set({"user_fname"	: response.user.user_fname});
				chrome.storage.local.set({"user_lname"	: response.user.user_lname});
				
				for (var i = 0; i < response.projects.length; i++) {
					options += '<option value="'+response.projects[i].project_id+'">'+response.projects[i].project_name+'</option>' 
				};
				callback(true, options);

			}else if(response.query_status=='invalid'){
				callback(false, response.error_msg);
			};
	    },
	    error:function(jqXHR,textStatus,errorThrown){
	    	callback(false, 'Something went Wrong!');
	    }
	});
	
}

/*function get_project_list (member_code, member_id ) {
	$.ajax({
		url: base_api_url+'/apiLogin',
		type: 'POST',
		cache: false,
	    async: true,
	    crossdomain: true,
		dataType: 'json',
		data: {member_code: member_code, member_id: member_id},
		success:function(response){	
			console.log(response);
		},
		error:function(jqXHR,textStatus,errorThrown){
	    	console.log(jqXHR);
	    }
	});
}*/

function get_project_task_list (member_id, project_id, callback) {
	var options='<option>Select Task</option>';
	$.ajax({
		url: base_api_url+'/apiTaskList',
		type: 'POST',
		cache: false,
	    async: true,
	    crossdomain: true,
		dataType: 'json',
		data: {member_id: member_id, project_id: project_id},
		success:function(response){	
			// console.log(response);
			if (response.query_status=='success') {

				chrome.storage.local.set({"task_data" : response.tasks});

				for (var i = 0; i < response.tasks.length; i++) {
					options += '<option value="'+response.tasks[i].task_id+'">'+response.tasks[i].task_name+'</option>' 
				};

				callback(true, options);
			} else{
				callback(false, response.error_msg);
			};
		},
		error:function(jqXHR,textStatus,errorThrown){
	    	callback(false, 'Something went Wrong!');
	    }
	});
}

function get_member_sui (member_id, callback) {
	
	$.ajax({
		url: base_api_url+'/apiDailySUI',
		type: 'POST',
		cache: false,
	    async: true,
	    crossdomain: true,
		dataType: 'json',
		data: {member_id: member_id},
		success:function(response){	
			// console.log(response);
			if (response.query_status=='success') {

				if (response.DailySUI.DailySUI<10) { response.DailySUI.DailySUI = '0'+response.DailySUI.DailySUI; };
				if (response.SUI.SUI<10) { response.SUI.SUI = '0'+response.SUI.SUI; };

				callback(true, response);
			} else{
				callback(false, response)
			};
		},
		error:function(jqXHR,textStatus,errorThrown){
	    	callback(false, 'Something went Wrong!');
	    }
	});
}

function get_task_data (task_id, callback) {
	
	chrome.storage.local.get('task_data', function (obj) {
        // console.debug(obj.task_data);
        
		for (var i = 0; i < obj.task_data.length; i++) {
			if (obj.task_data[i].task_id==task_id) {

				callback(true, obj.task_data[i]);
				break;
			};
		};
    });
}



