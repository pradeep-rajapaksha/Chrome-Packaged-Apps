var base_url 	= 'http://tpro.openarc.lk/index.php';
var base_api_url= 'http://tpro.openarc.lk/index.php/api/mobileapi';
$(document).ready(function() {

	if(typeof($.cookie('user_name')) != "undefined" && $.cookie('user_name') !== null) {

		get_user_data ($.cookie('user_name'))

	}else{
		$('#login-msgs').removeClass('alert-danger').addClass('alert-success').html('<strong>Hello!</strong> Welcome to mini access.')
	}

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
				        // console.debug(obj.member_id);
				        get_member_sui(obj.member_id, function (status, resp) {
				        	if (status) {
					        	// console.log(resp.DailySUI.DailySUI);
					        	$('#d_sui').text(resp.DailySUI.DailySUI+'%');
					        	// console.log(resp.SUI.SUI);
					        	$('#c_sui').text(resp.SUI.SUI+'%');
				        	};
				        });
				    });

					$('#login_window').css('display', 'none');
					$('#main_window').css('display', 'block');
				}else{
					console.log(resp);
					// debugger;
				};
				// debugger;
			});
		}
	});

	$(document).on('click', '#main-button', function (event) {
		if ($(this).attr('status')=="start") {

			$(this).removeClass('btn-primary').addClass('btn-danger');
			$(this).css('border', '3px solid rgb(255, 152, 152)');
			$(this).html('<p id="run">Stop</p><p id="timer">07:50:50 Hr</p>');
			$(this).attr('status', 'run');
		}
		else if ($(this).attr('status')=="run") {

			$(this).removeClass('btn-danger').addClass('btn-success');
			$(this).css('border', '3px solid rgb(133, 231, 134)');
			$(this).html('<p id="run">submit</p><p id="timer">07:50:50 Hr</p>');
			$(this).attr('status', 'run');
		};
	});

	$(document).on('change', '#project', function(event) {
		event.preventDefault();
		if ($(this).val()!='') {
			var project_id = $(this).val();
			chrome.storage.local.get('member_id', function (obj) {
		        // console.debug(obj.member_id);
				get_project_task_list(obj.member_id, project_id, function (status, resp) {
					if (status) {
						$('#task_id').html(resp);
					};
				});
		    });
		};
	});

	$(document).on('change', '#task_id', function(event) {
		event.preventDefault();
		if ($(this).val()!='') {
			var task_id = $(this).val();
			get_task_data(task_id, function (status, resp) {
				if (status) {
					
					// console.debug(resp)
					$('#task_desc').attr("disabled", 'disabled');
					$('#task_desc').prop("disabled", true);
					
					$('#allocated_time').html(resp.allocated_time+' hrs');
					$('#time_taken').html(resp.time_taken+' hrs');
				};
			});
		};
	});
});

var p = document.getElementById("percentage"),
    res = document.getElementById("percentage_val");

p.addEventListener("input", function() {
    res.innerHTML = p.value + '%';
}, false); 

