/*jslint browser: true, node : true*/
/*jslint devel : true*/
/*global $, document, this*/
$(document).ready(function () {
	var module_path, id_language, list_quiz, quiz_name_number_question, i, list_question, j, list_number_question, quiz_question_number, list_number_response, k, list_response, empty_field, arrary_validate_quizz, obj_quiz, response_id, question_id, list_image, l, question_list, response_list, list_select_product, m, list_different_score, list_id_product, array_list_id_product, obj_end_quiz;
	array_list_id_product = [];
	obj_quiz = {};
	obj_end_quiz = {};
	arrary_validate_quizz = [];
	empty_field = "false";
	module_path = $('#module_path').text();
	id_language = $('#id_language').text();
	function check_duplicate_quiz_name (quiz_name, button_selector, error_selector) {
		"use strict";
		$.post(module_path + 'ajax_quiz.php', {action: 'check_duplicate_quiz_name', quiz_name: quiz_name}, function (data, textStatus) {
			if (textStatus === "success") {
				data = JSON.parse(data);
				if (data.error === null) {
					if (data.data.length === 0) {
						$(button_selector).removeAttr('disabled');
						$(error_selector).html('');
					} else {
						$(error_selector).html('<p class="error">Quiz name already taken !!</p>');
						$(button_selector).attr('disabled', "true");
					}
				}
			}
		});
	}
	function check_quiz_question_response_input (input_selector) {
		"use strict";
		if ($.trim($(input_selector).val()) ===  "") {
			$(input_selector).prop('validate', 'false');
			$(input_selector).css({
				'border-color': 'rgba(255, 0, 0, 0.8)',
				'box-shadow': '0 1px 1px rgba(0, 0, 0, 0.075) inset, 0 0 8px rgba(255, 0, 0, 0.6)',
				'outline': '0 none'
			});
			arrary_validate_quizz.push("false");
		} else {
			$(input_selector).prop('validate', 'true');
			$(input_selector).css({
				'border-color': 'rgba(126, 239, 104, 0.8)',
				'box-shadow': '0 1px 1px rgba(0, 0, 0, 0.075) inset, 0 0 8px rgba(126, 239, 104, 0.6)',
				'outline': '0 none'
			});
			arrary_validate_quizz.push("true");
		}
		empty_field = "false";
		$.each(arrary_validate_quizz, function (index, validate) {
			if (validate === "false") {
				empty_field = "true";
			}
		});
		if (empty_field === "true") {
			$('#validate_quiz').prop('disabled', 'true');
		} else {
			$('#validate_quiz').removeProp('disabled');
		}
	}
	function check_activate_quiz () {
		$.post(module_path + 'ajax_quiz.php', {action: 'check_activate_quiz'}, function (data, textStatus) {
			if (textStatus === "success") {
				data = JSON.parse(data);
				if (data.error === null) {
					if (data.data !== "empty") {
						$('.quiz_activate_id').html('');
						$('#activate_quiz_id_' + data.data).html(' (activate quiz)');
					} else {
						$('.quiz_activate_id').html('');
						$('#info').html('<p class="error">No quiz activated !!</p>');
					}
				}
			}
		});
	}
	function get_all_quiz () {
		$.post(module_path + 'ajax_quiz.php', {action: 'get_all_quiz'}, function (data, textStatus) {
			if (textStatus === "success") {
				data = JSON.parse(data);
				if (data.error === null) {
					if (data.data === null) {
						$("#list_quiz").html('<p class="info">No quiz found !! Click on the button to create one !!</p>');
						$("#list_quiz").append('<div id="create_quiz"><button class="btn btn-lg btn-default" id="create_quiz_button">Create a quiz</button></div>');
					} else {
						$("#list_quiz").html('<p class="info">Click here to disable quiz !! <button class="btn btn-lg btn-default" id="button_disable_quiz">Disable quiz</button></p>');
						$("#list_quiz").append('<p class="info">' + data.data.length + ' quiz found !!</p><span id="info"></span>');
						list_quiz = '<ul class="list-group">';
						$.each(data.data, function (number, object_quiz) {
							$.each(object_quiz, function (id, quiz_name) {
								list_quiz = list_quiz + '<li class="list-group-item list_quiz" id="' + id + '"><span class="list_quiz_name">' + quiz_name + '</span><span class="quiz_activate_id" id="activate_quiz_id_' + id + '"></span><span class="list_quiz_img"><img class="img-thumbnail img-circle display" src="' + module_path + 'views/img/display.png" id="display_quiz_id_' + id + '" alt="display quiz" /><img class="img-thumbnail img-circle delete" src="' + module_path + 'views/img/delete.png" alt="delete quiz" id="delete_quiz_id_' + id + '" /><img class="img-thumbnail img-circle go" src="' + module_path + 'views/img/go.png" alt="go quiz" id="go_quiz_' + id + '" /></span></li>';
							});
						});
						list_quiz = list_quiz + '</ul>';
						$('#list_quiz').append(list_quiz);
						$("#list_quiz").append('<div id="create_quiz"><button class="btn btn-lg btn-default" id="create_quiz_button">Create a quiz</button></div>');
					}
				}
			}
		});
	}
	get_all_quiz();
	check_activate_quiz();
	$(document.body).on('click', '.go', function () {
		$.post(module_path + 'ajax_quiz.php', {action: 'change_quiz_activate', id_quiz: $(this).attr('id').substr(8)}, function (data, textStatus) {
			if (textStatus === "success") {
				data = JSON.parse(data);
				if (data.error === null) {
					$('#info').html('<p class="success">Quiz activate successfully !!</p>');
					check_activate_quiz();
				} else {
					$('#info').html('<p class="error">Can\'t activate quiz !!</p>');
				}
			}
		});
	});
	$(document.body).on('click', '.delete', function () {
		$.post(module_path + 'ajax_quiz.php', {action: 'delete_quiz', id_quiz: $(this).attr('id').substr(15)}, function (data, textStatus) {
			if (textStatus === "success") {
				data = JSON.parse(data);
				if (data.error === null) {
					$('#info').html('<p class="success">Quiz deleted successfully !!</p>');
					get_all_quiz();
					check_activate_quiz();
				} else {
					$('#info').html('<p class="error">Can\'t deleted quiz !!</p>');
				}
			}

		});
	});
	$(document.body).on('click', '.display', function () {
		$.post(module_path + 'ajax_quiz.php', {action: 'get_quiz_history', id_quiz: $(this).attr('id').substr(16)}, function (data, textStatus) {
			if (textStatus === "success") {
				data = JSON.parse(data);
				if (data.error === null) {
					$('.list_group')
					$('#div_title').html('<h1>Here are the history of the quiz <span id="quiz_name">' + data.data.quiz_name + '</span></h1>');
					list_quiz = '';
					list_image = '';
					list_question_response = '';
					$.each(data.data.quiz_history, function (id_user, array_history) {
						$.each(array_history, function (key, value) {
							if (key === "list_product") {
								list_image = '';
								$.each(value, function (product_path, img_path) {
									list_image = list_image + '<a href="' + product_path + '" ><img src="' + img_path + '" class="img-circle img-thumbnail"  /></a>';
								});
							}
							if (key === "question_response") {
								list_question_response = '';
								$.each(value, function (question, response) {
									list_question_response = list_question_response + '<p><span class="question_response">Question : </span><span class="response_question">' + question + '</span></p>';
									list_question_response = list_question_response + '<p><span class="question_response">Response : </span><span class="response_question">' + response + '</span></p>';
								});
							}
							if (key === "user_lastname") {
								user_lastname = value;
							}
							if (key === "user_firstname") {
								user_firstname = value;
							}
							if (key === "score") {
								score = value;
							}
						});
						list_quiz = list_quiz + '<div class="list_history"><h2>Quiz completed by <span class="user">' + user_firstname + ' ' + user_lastname + '</span> with a score of <span class="score">' + score + '</span></h2><div class="list_history_img">' + list_image + '</div><div class="list_history_question_response">' + list_question_response + '</div></div>';
					});
					$('#list_quiz').html(list_quiz);
					console.log(data);
				}
			}
		});
	});
	$(document.body).on('click', '#button_disable_quiz', function () {
		$.post(module_path + 'ajax_quiz.php', {action: 'change_quiz_activate', id_quiz: 0}, function (data, textStatus) {
			if (textStatus === "success") {
				data = JSON.parse(data);
				if (data.error === null) {
					$('#info').html('<p class="success">Quiz disabled successfully !!</p>');
					get_all_quiz();
					check_activate_quiz();
				} else {
					$('#info').html('<p class="error">Can\'t disabled quiz !!</p>');
				}
			}
		});
	});
	$(document.body).on('click', '#create_quiz_button', function () {
		quiz_name_number_question = '';
		for (i = 3; i < 10; i = i + 1) {
			quiz_name_number_question = quiz_name_number_question + '<option value="' + i + '">' + i + '</option>';
		}
		$('#the_body').html('<div class="container" id="div_title"><h1>Please write the Quiz name !!</h1></div><div class="jumbotron" id="quiz_name_form"><div id="quiz_name_error"></div><div class="form-inline"><div class="form-group"><label for="quiz_name_input">Quiz name</label><input type="text" class="form-control" id="quiz_name_input" placeholder="Quiz name"><label for="quiz_name_number_question">How many question ?</label><select id="quiz_name_number_question" class="form-control">' + quiz_name_number_question + '</select></div><button id="quiz_name_button" class="btn btn-default" disabled="true">Validate Quiz Name</button></div></div>');
	});
	$(document.body).on('change paste keyup', '#quiz_name_input', function () {
		if ($.trim($(this).val()) !== "") {
			check_duplicate_quiz_name($.trim($(this).val()), "#quiz_name_button", "#quiz_name_error");
		} else {
			$('#quiz_name_error').html('<p class="error">Quiz name can\'t be empty !!</p>');
			$("#quiz_name_button").attr('disabled', "true");
		}
	});
	$(document.body).on('click', '#quiz_name_button', function () {
		$.post(module_path + 'ajax_quiz.php', {action: 'create_quiz_name', quiz_name: $.trim($('#quiz_name_input').val())}, function (data, textStatus) {
			if (textStatus === "success") {
				data = JSON.parse(data);
				if (data.error === null) {
					list_number_question = $("#quiz_name_number_question option:selected").text();
					list_number_question++;
					list_question = '';
					for (j = 1; j < list_number_question; j = j + 1) {
						list_question = list_question + '<div class="jumbotron" id="quiz_question_' + j + '"><div class="form-inline"><div class="form-group"><label for="quiz_question_input_' + j + '">Question</label><input type="text" class="form-control quiz_question_input" id="quiz_question_input_' + j + '" placeholder="Question"><label for="quiz_question_response_number_' + j + '">How many response ?</label><select id="quiz_question_response_number_' + j + '" class="form-control"><option value="2">2</option><option value="3">3</option><option value="4">4</option></select><button class="btn btn-lg btn-default quiz_question_button" id="quiz_question_button_' + j + '">Create Response</button></div></div><div id="quiz_question_response_' + j + '"></div>';
					}
					$('#the_body').html('<div class="jumbotron" id="div_title"><h1>Please write the question</h1><h2>Choose how many response you display, write them and submit !!</h2><div id="list_question"><div id="quiz_error"></div>' + list_question +'</div><div id="div_button_quiz"><button class="btn btn-lg btn-default quiz_button" id="validate_quiz" disabled="true">Create Quiz</button></div></div>');
					$('.quiz_button').hover(function () {
						$(this).css('background-color', '#AEAEAE');
						}, function () {
							$(this).css('background-color', '#FFFFFF');
						});
					$('.quiz_question_button').hover(function () {
						$(this).css('background-color', '#AEAEAE');
						}, function () {
							$(this).css('background-color', '#FFFFFF');
						});
					$('#list_question').append('<p id="id_quiz">' + data.data + '</p>');
				} else {
					$('#quiz_name_error').html('<p class="error">' + data.error + '</p>');
				}
			}
		});
	});
	$(document.body).on('click', '.quiz_question_button', function () {
		quiz_question_number = $(this).attr('id').substr(21);
		list_number_response = $('#quiz_question_response_number_' + quiz_question_number + ' option:selected').text();
		list_number_response++;
		list_response = '';
		for (k = 1; k < list_number_response; k = k + 1) {
			list_response = list_response + '<div class="form-group"><label for="quiz_question_' + quiz_question_number + '_response_input_' + k + '">Response number ' + k + '</label><input type="text" class="form-control quiz_question_response_input" id="quiz_question_' + quiz_question_number + '_response_input_' + k + '" placeholder="Response"></div>'
		}
		$('#quiz_question_response_' + quiz_question_number).html(list_response);
	});
	$(document.body).on('change paste keyup', '.quiz_question_response_input', function () {
		arrary_validate_quizz = [];
		$.each($('.quiz_question_input'), function (index, input) {
			check_quiz_question_response_input(input);
		});
		$.each($('.quiz_question_response_input'), function (index, input) {
			check_quiz_question_response_input(input);
		});
	});
	$(document.body).on('change paste keyup', '.quiz_question_input', function () {
		arrary_validate_quizz = [];
		$.each($('.quiz_question_input'), function (index, input) {
			check_quiz_question_response_input(input);
		});
		$.each($('.quiz_question_response_input'), function (index, input) {
			check_quiz_question_response_input(input);
		});
	});
	$(document.body).on('click', '#validate_quiz', function () {
		obj_quiz = {};
		$.each($('.quiz_question_input'), function (index, input) {
			question_id = $(input).prop('id').replace("quiz_", "");
			question_id = question_id.replace("_input", "");
			obj_quiz[question_id] = $.trim($(input).val());
		});
		$.each($('.quiz_question_response_input'), function (index, input) {
			response_id = $(input).prop('id').replace("quiz_", "");
			response_id = response_id.replace("_input", "");
			obj_quiz[response_id] = $.trim($(input).val());
		});
		$.post(module_path + 'ajax_quiz.php', {action: 'create_quiz', quiz: obj_quiz, id_quiz: $('#id_quiz').text()}, function (data, textStatus) {
			if (textStatus === "success") {
				data = JSON.parse(data);
				if (data.error === null) {
					$('#the_body').html('<div id="div_title"><h1>Choose your product list</h1></div><div id="list_question_response_score_product"><button id="product_list_go" class="btn btn-default">Go to the product list</button></div><p id="id_quiz">' + data.data + '</p><p id="list_id_product"></p><div id="div_validate_end_quiz"></div>');
				}
			}
		});
	});
	$(document.body).on('click', '#product_list_go', function () {
		$.post(module_path + 'ajax_quiz.php', {action: 'get_quiz', id_quiz: $('#id_quiz').text()}, function (data, textStatus) {
			if (textStatus === "success") {
				data = JSON.parse(data);
				if (data.error === null) {
					question_list = '';
					$.each(data.data.question, function (id_question, question) {
						question_list = question_list + '<div id="list_question_' + id_question + '"><p><span class="question">Question : </span><span id="question_' + id_question + '">' + question + '</span></p><div id="list_response_' + id_question + '"></div></div>';
					});
					$('#list_question_response_score_product').html(question_list);
					$.each(data.data.response, function (id_question, json_response) {
						response_list = '';
						$.each(json_response, function (id_response, response) {
							response_list = response_list + '<div class="form-inline"><div class="form-group"><label for="score_response_' + id_response + '">' + response + '</label><select class="form-control score_response_select" id="score_response_' + id_response + '"><option value="0">0</option><option value="10">10</option><option value="20">20</option><option value="30">30</option><option value="40">40</option><option value="50">50</option></select></div></div>';
						});
						$('#list_response_' + id_question).html(response_list);
					});
				}
			}
		});
		$.post(module_path + 'ajax_quiz.php', {action: 'get_all_products', id_quiz: $('#id_quiz').text(), id_language: id_language}, function (data, textStatus) {
			if (textStatus === "success") {
				data = JSON.parse(data);
				if (data.error === null) {
					list_image = '<div class="container" id="list_image">';
					list_id_product = '';
					$.each(data.data, function (id_product, img_path) {
						list_image = list_image + '<div class="list_image_product"><p>id of the product : ' + id_product + '</p><img src="http://' + img_path + '" alt="product number ' + id_product + '" class="img-circle img-thumbnail" id="' + id_product + '" /></div>';
						list_id_product = list_id_product + id_product + '|';
					});
					list_image + list_image + '</div>';
					$('#list_id_product').html(list_id_product);
					$('#list_question_response_score_product').append(list_image);
					$('#list_question_response_score_product').append('<label for="number_different_score">Choose the number of different score and therefore product list that you want to display</label><select class="form-group" id="number_different_score"><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option></select><button id="button_display_different_score" class="btn btn-default">Display different score</button><div id="list_different_score"></div>');
				}
			}
		});
	});
	$(document.body).on('click', '#button_display_different_score', function () {
		number_different_score = $("#number_different_score option:selected").val();
		number_different_score++;
		list_different_score = '';
		id_product_option = '';
		array_list_id_product = $('#list_id_product').text().split('|');
		for (n = 0; n < array_list_id_product.length; n = n + 1) {
			if (array_list_id_product[n] !== "" && $.isNumeric(array_list_id_product[n]) !== false) {
				id_product_option = id_product_option + '<option value="' + array_list_id_product[n] + '">' + array_list_id_product[n] + '</option>';
			}
		}
		for (m = 1; m < number_different_score; m = m + 1) {
			list_select_product = '<label for="select_different_score_' + m + '">Choose your product list (Hold CTRL to select multiple product)</label><select multiple="true" class="form-control select_different_score" id="select_different_score_' + m + '">' + id_product_option + '</select>';
			list_different_score = list_different_score + '<div id="div_different_score_' + m + '" class="form-inline">Between <div class="form-group"><input type="number" id="input_1_score_' + m + '" class="form-control score_input" onkeypress="return event.charCode >= 48 && event.charCode <= 57"></div> and <div class="form-group"><input type="number" id="input_2_score_' + m + '" class="form-control score_input" onkeypress="return event.charCode >= 48 && event.charCode <= 57"></div>' + list_select_product + '</div>';
		}
		$('#list_different_score').html(list_different_score);
		$('#div_validate_end_quiz').html('<button id="validate_end_quiz" class="btn btn-default">Complete the quiz</button>');
	});
	$(document.body).on('click', '#validate_end_quiz', function () {
		obj_end_quiz = {};
		$.each($('.select_different_score'), function (index, input) {
			obj_end_quiz[$(input).attr('id')] = $.trim($(input).val()).split(",");
		});
		$.each($('.score_input'), function (index, input) {
			obj_end_quiz[$(input).attr('id')] = $.trim($(input).val()).split(",");
		});
		$.each($('.score_response_select'), function (index, input) {
			obj_end_quiz[$(input).attr('id')] = $.trim($(input).val()).split(",");
		});
		$.post(module_path + 'ajax_quiz.php', {action: 'create_end_quiz', quiz: obj_end_quiz, id_quiz: $('#id_quiz').text()}, function (data, textStatus) {
			if (textStatus === "success") {
				data = JSON.parse(data);
				if (data.error === null) {
					$('#the_body').html('<div class="container" id="div_final">Your quiz have been created !! You can quit the quiz config now !!</div>');
				}
			}
		});
	});
});