// var base_api_url= 'http://tpro.openarc.lk/index.php/api/mobileapi';
var base_api_url= 'http://192.168.50.62/tpro/index.php/api/mobileapi';
$(document).ready(function() {

	$(document).on('submit', '#login-form', function(event) {
		event.preventDefault();

		if($('#username').val()=='' || $('#password').val()==''){  // check login form is filled or not 
			// if not send error msg
		}
		else{ // if yes send processing msg and call to login function
			function_login($('#username').val(), $('#password').val(), function (status, resp) {
				if (status) {

					$('#project').html(resp);

					chrome.storage.local.get('member_id', function (obj) {
				        get_member_sui(obj.member_id, function (status, resp) {
				        	if (status) {
					        	$('#d_sui').text(resp.DailySUI.DailySUI+'%');
					        	$('#c_sui').text(resp.SUI.SUI+'%');
				        	};
				        });
				    });

					$('#login_window').css('display', 'none');
					$('#main_window').css('display', 'block');
				}else{
					console.log(resp);
				};
			});
		}
	});

	$(document).on('click', 'button#main-button', function (event) {
		// button status attr hold 'satrt' when before start the task. 
		//So, that staus==start itmer can start and butoon styles changed. and status turn to 'run'
		if ($(this).attr('status')=="start") {

			start_timer();
			$('#task_start_time').val(get_time_now());

			$(this).removeClass('btn-primary').addClass('btn-danger');
			$(this).css('border', '3px solid #BD3535');
			$(this).find('#button_text').text('Stop');
			$(this).attr('status', 'run'); // turn button status to 'run'.
			$('#cancel_button').css('visibility', 'visible');
		}
		// button status attr hold 'run' when after start the task.
		// on clik, if status=='run' timer appear to stop and button style changed. after that user can set complete percentage and staus turn to 'stop'.
		else if ($(this).attr('status')=="run") {

			stop_timer();
			$('#task_end_time').val(get_time_now());

			// #task_id, #task_desc, #main-button ,#percentage
			disable_elements(false, true, false, false);

			$(this).removeClass('btn-danger').addClass('btn-success');
			$(this).css('border', '3px solid #4cae4c');
			$(this).find('#button_text').text('Submit');
			$(this).attr('status', 'stop'); // turn button status to 'stop'.
		}
		// button status attr hold 'stop' when after stop the timer.
		// here user able to subit the task, before submit user should set the complete percentage
		else if ($(this).attr('status')=="stop") {

			// console.log($('#task_form').serializeArray());
			// $(this).css('border', '3px solid #357ebd');

			var project_id 			= $('#project').val();
			var task_id 			= $('#task_id').val();
			var task_name 			= $('#task_desc').val();
			var sesstion_start_time = $('#task_start_time').val();
			var sesstion_end_time 	= $('#task_end_time').val();
			var sesstion_duration 	= $('#task_duration').val();
			var complete_percentage = $('#percentage').val();

			chrome.storage.local.get('member_id', function (obj) {

				var data = {
					member_id			: 	obj.member_id,
					project_id 			: 	project_id,
					task_id 			: 	task_id,
					task_name 			: 	task_name,
					sesstion_start_time : 	sesstion_start_time,
					sesstion_end_time 	: 	sesstion_end_time,
					sesstion_duration 	: 	sesstion_duration,
					complete_percentage : 	complete_percentage
				}

				// clear the timer
				clear_timer();

				// console.log(data);
				if (task_name!='' && task_id=='ad-hoc' && isNaN(task_id)) {
					
					// call to ad_ad_hoc_task() function to add aad-hoc task
					ad_ad_hoc_task(data, function (status, resp) {
						if (status) {
							// console.log(status);

							$('button#main-button').removeClass('btn-danger').removeClass('btn-success').addClass('btn-primary');
							$('button#main-button').css('border', '3px solid #357ebd');
							$('button#main-button').find('#button_text').text('Start');
							// $('button#main-button').find('#timer_display').text('');
							$('button#main-button').find('#timer_display').text('00:00:00');
							$('button#main-button').find('#task_duration').val('');
							$('button#main-button').attr('status', 'start'); // turn button status to 'start'.

							// #task_id, #task_desc, #main-button ,#percentage
							disable_elements(true, true, true, true);
							// reset the button and timer properties 
							reset_button_n_timer();

							$('#task_id').val('');
							$('#project').val('');
							$('#task_desc').val('');
							$('#task_start_time').val('0000-00-00 00:00:00');
							$('#task_end_time').val('0000-00-00 00:00:00');
							$('#task_duration').val('00:00:00');
							$('#percentage').val(0);
							$('#percentage_val').text('0%');

						}else{

							console.log(status);
						};
					});

				}else if(task_id!='' && !isNaN(task_id) && task_name==''){
					
					// call to update_task() function to update a task
					update_task(data, function (status, resp) {
						if (status) {
							// console.log(status);

							$('button#main-button').removeClass('btn-danger').removeClass('btn-success').addClass('btn-primary');
							$('button#main-button').css('border', '3px solid #357ebd');
							$('button#main-button').find('#button_text').text('Start');
							// $('button#main-button').find('#timer_display').text('');
							$('button#main-button').find('#timer_display').text('00:00:00');
							$('button#main-button').find('#task_duration').val('');
							$('button#main-button').attr('status', 'start'); // turn button status to 'start'.

							// #task_id, #task_desc, #main-button ,#percentage
							disable_elements(true, true, true, true);
							// reset the button and timer properties 
							reset_button_n_timer ();

							$('#project').val('');
							$('#task_id').val('');
							$('#task_desc').val('');
							$('#task_start_time').val('0000-00-00 00:00:00');
							$('#task_end_time').val('0000-00-00 00:00:00');
							$('#task_duration').val('00:00:00');
							$('#percentage').val(0);
							$('#percentage_val').text('0%');

						}else{

							console.log(status);
						};
					});
				};

		    });


		};
	});

	$(document).on('change', '#project', function(event) {
		event.preventDefault();

		// reset the button and timer properties 
		reset_button_n_timer ();

		if ($(this).val()!='') {
			var project_id = $(this).val();

			$('#task_desc').val('');
			
			$('#allocated_time').html('00:00:00 hr');
			$('#time_taken').html('00:00:00 hr');
			
			$('#percentage_val').html('0%');
			$('#percentage').val(0);

			// #task_id, #task_desc, #main-button ,#percentage
			disable_elements(false, true, true, true);
			// reset the button and timer properties 
			reset_button_n_timer ();

			// access chrome local storage and get stored member_id
			chrome.storage.local.get('member_id', function (obj) {
				// call to get_project_task_list() function to get task list
				get_project_task_list(obj.member_id, project_id, function (status, resp) {
					if (status) {
						// render html to task list drop down
						$('#task_id').html(resp);
					};
				});
		    });
		}else{

			$('#task_id').html('<option value="">Select Task</option>');

			// #task_id, #task_desc, #main-button ,#percentage
			disable_elements(false, true, true, true);
			// reset the button and timer properties 
			reset_button_n_timer ();
		};
	});

	$(document).on('change', '#task_id', function(event) {
		event.preventDefault();

		if ($(this).val()!='' && $(this).val()!='ad-hoc') {
			var task_id = $(this).val();

			get_task_data(task_id, function (status, resp) {

				if (status) {
					// console.debug(resp)
					// #task_id, #task_desc, #main-button ,#percentage
					disable_elements(false, true, false, true);
					// reset the button and timer properties 
					reset_button_n_timer ();

					$('#allocated_time').html(resp.allocated_time+' hr');
					$('#time_taken').html(resp.time_taken+' hr');

					if (resp.complete_percentage==null || resp.complete_percentage==0) {
						// $('#percentage_val').html('0%');
						$('#percentage_val').html('0%');
						$('#percentage').val(0);
					}
					else{
						$('#percentage_val').html(resp.complete_percentage+'%');
						$('#percentage').val(resp.complete_percentage);
					};

				};
			});

		}else if($(this).val()!='' && $(this).val()=='ad-hoc'){

			// #task_id, #task_desc, #main-button ,#percentage
			disable_elements(false, false, true, true);
			// reset the button and timer properties 
			reset_button_n_timer ();

			$('#allocated_time').html('00:00:00 hr');
			$('#time_taken').html('00:00:00 hr');
			
			$('#percentage_val').html('0%');
			$('#percentage').val(0);
		
		}else{

			// #task_id, #task_desc, #main-button ,#percentage
			disable_elements(false, true, true, true);
			// reset the button and timer properties 
			reset_button_n_timer ();

			$('#allocated_time').html('00:00:00 hr');
			$('#time_taken').html('00:00:00 hr');

			$('#percentage_val').html('0%');
			$('#percentage').val(0);
		};
	});

	$(document).on('change, blur', '#task_desc', function(event) {
		event.preventDefault();
		if ($(this).val()!='') {
			// #task_id, #task_desc, #main-button ,#percentage
			disable_elements(false, false, false, true);
		}else{
			// #task_id, #task_desc, #main-button ,#percentage
			disable_elements(false, false, true, true);
		};
	});

	$(document).on('click', 'button#cancel_button', function(event) {
		event.preventDefault();
		
		$(this).css('visibility', 'hidden');
		$('#project').val('');
		$('#task_id').val('');
		$('#task_desc').val('');
		$('#task_start_time').val('0000-00-00 00:00:00');
		$('#task_end_time').val('0000-00-00 00:00:00');
		$('#task_duration').val('00:00:00');
		$('#percentage').val(0);
		$('#percentage_val').text('0%');

		disable_elements(true, true, true, true);
		reset_button_n_timer();
	});

});

// input rang value showing
var p = document.getElementById("percentage"),
    res = document.getElementById("percentage_val");
p.addEventListener("input", function() {
    res.innerHTML = p.value + '%';
}, false); 

// timer functions
var seconds = 0, minutes = 0, hours = 0, t, time;
function add() {
	    seconds++;
	    if (seconds >= 60) {
	        seconds = 0;
	        minutes++;
	        if (minutes >= 60) {
	            minutes = 0;
	            hours++;
	        }
	    }
	    time = (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);
	    // console.log(time);
	    $('#task_duration').val((hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds));
	    $('#timer_display').text(time);
	    timer();
}
function timer() {

    t = setTimeout(add, 1000);
}
/* Start timer */
function start_timer() {
	// console.log('start_timer');
    timer();
}
/* Stop timer */
function stop_timer() {
	// console.log('stop_timer');
    clearTimeout(t);
}
/* Clear timer */
function clear_timer() {

    seconds = 0; minutes = 0; hours = 0;
}



    