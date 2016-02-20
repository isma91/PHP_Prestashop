/*jslint browser: true, node : true*/
/*jslint devel : true*/
/*global $, document, this*/
$(document).ready(function () {
	var module_path, list_quiz, quiz_name_number_question, i, list_question, j, list_number_question, quiz_question_number, list_number_response, k, list_response, empty_field, arrary_validate_quizz, obj_quiz, response_id, question_id;
	obj_quiz = {};
	arrary_validate_quizz = [];
	empty_field = "false";
	module_path = $('#module_path').text();
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
	$.post(module_path + 'ajax_quiz.php', {action: 'get_all_quiz'}, function (data, textStatus) {
		if (textStatus === "success") {
			data = JSON.parse(data);
			if (data.error === null) {
				if (data.data === null) {
					$("#the_body").append('<p class="info">No quiz found !! Click on the button to create one !!</p>');
					$("#the_body").append('<div id="create_quiz"><button class="btn btn-lg btn-default" id="create_quiz_button">Create a quiz</button></div>');
				} else {
					$("#the_body").append('<p class="info">' + data.data.length + ' quiz found !!</p>');
					list_quiz = '<ul class="list-group">';
					$.each(data.data, function (number, object_quiz) {
						$.each(object_quiz, function (id, quiz_name) {
							list_quiz = list_quiz + '<li class="list-group-item list_quiz" id="' + id + '"><span class="list_quiz_name">' + quiz_name + '</span><span class="list_quiz_img"><img class="img-thumbnail img-circle modify" src="' + module_path + 'views/img/modify.png" alt="modify quiz" /><img class="img-thumbnail img-circle delete" src="' + module_path + 'views/img/delete.png" alt="delete quiz" /><img class="img-thumbnail img-circle go" src="' + module_path + 'views/img/go.png" alt="go quiz" /></span></li>';
						});
					});
					list_quiz = list_quiz + '</ul>';
					$('#the_body').append(list_quiz);
					$("#the_body").append('<div id="create_quiz"><button class="btn btn-lg btn-default" id="create_quiz_button">Create a quiz</button></div>');
				}
			}
		}
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
					$('#list_question').append('<p id="id_quiz">' + data.data + '</p>')
				} else {
					$('#quiz_name_error').html('<p class="error">' + data.error + '</p>')
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
					$('#the_body').html('<div id="div_title"><h1>Choose your listing product type</h1></div><div id="list_radio"><div class="radio"><label><input type="radio" name="radio_list_product">List the products against a predefined score</label></div><div class="radio"><label><input type="radio" name="radio_list_product">Add a list </label></div></div>');
				}
			}
		});
	});
});