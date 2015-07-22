Number.prototype.padLeft = function(base,chr){
   var  len = (String(base || 10).length - String(this).length)+1;
   return len > 0? new Array(len).join(chr || '0')+this : this;
}
function get_time_now () {

    var d = new Date,
        dformat = [ d.getFullYear(),
        			(d.getMonth()+1).padLeft(),
                    d.getDate().padLeft()].join('-')+
                    ' ' +
                  [ d.getHours().padLeft(),
                    d.getMinutes().padLeft(),
                    d.getSeconds().padLeft()].join(':');
     return dformat;
}

function function_login (username, password, callback) {

	var options='<option value="">Select Project</option>';
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

function get_project_task_list (member_id, project_id, callback) {
	var options='<option value="">Select Task</option>';
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
				options += '<option value="ad-hoc">Ad-hoc Task</option>';
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

function disable_elements (task_id, task_name, timer_button, percentage) {

	// console.log(timer_button);
	$('#task_id').prop("disabled", task_id);
	$('#task_desc').prop("disabled", task_name);
	$('button#main-button').prop("disabled", timer_button);
	$('#percentage').prop("disabled", percentage);
}

function reset_button_n_timer () {

	$('button#main-button').attr('status', 'start'); // turn button status to 'start'.
	$('button#main-button').removeClass('btn-danger').removeClass('btn-success').addClass('btn-primary');
	$('button#main-button').css('border', '3px solid #357ebd');
	$('button#main-button').find('#button_text').text('Start');
	// $('button#main-button').find('#timer_display').text('');
	$('button#main-button').find('#timer_display').text('00:00:00');
	$('button#main-button').find('#task_duration').val('');

	stop_timer();
	clear_timer();

	$('#task_start_time').val('0000-00-00 00:00:00');
	$('#task_end_time').val('0000-00-00 00:00:00');
	$('#task_duration').val('00:00:00');
	$('#percentage').val(0);
	$('#percentage_val').text('0%');
}

function update_task (data, callback) {
	if (data.length!=0) {
		// console.log(data);

		$.ajax({
			url: base_api_url+'/apiTaskUpdate',
			type: 'POST',
			cache: false,
		    async: true,
		    crossdomain: true,
			dataType: 'json',
			data: data,
			success:function(response){	
				// console.log(response);
				if (response.query_status=='success') {
					console.log(response);

					callback(true, response);
				} else{
					callback(false, response)
				};
			},
			error:function(jqXHR,textStatus,errorThrown){
		    	callback(false, 'Something went Wrong!');
		    }
		});
	};
}

function ad_ad_hoc_task (data, callback) {
	if (data.length!=0) {
		// console.log(data);

		$.ajax({
			url: base_api_url+'/apiAddAdhocTask',
			type: 'POST',
			cache: false,
		    async: true,
		    crossdomain: true,
			dataType: 'json',
			data: data,
			success:function(response){	
				// console.log(response);
				if (response.query_status=='success') {
					// console.log(response);
					callback(true, response);

				} else{

					callback(false, response);
				};
			},
			error:function(jqXHR,textStatus,errorThrown){
		    	callback(false, 'Something went Wrong!');
		    }
		});
	};
}

