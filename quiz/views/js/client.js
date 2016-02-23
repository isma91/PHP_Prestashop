/*jslint browser: true, node : true*/
/*jslint devel : true*/
/*global $, document, this*/
$(document).ready(function () {
	var id_quiz, user_id, user_firstname, user_lastname, module_path, list_question, list_response, object_question_response, compteur_question, current_question_id, obj_question_response, id_question, id_response, score_response, list_image;
	compteur_question = 0;
	object_question_response = {};
	obj_question_response = {};
	$('.go_in_quiz').click(function() {
		id_quiz = $(this).attr('id').substr(14);
		user_id = $(this).attr('user_id');
		user_lastname = $(this).attr('user_lastname');
		user_firstname = $(this).attr('user_firstname');
		module_path = $(this).attr('module_path');
		$('#quiz_modal').openModal();
		if (user_id === "") {
			$('#quiz_title').html('<h1>You must be connected to participate the survey !!</h1>');
		} else {
			$('#quiz_title').html('<h1>Hello ' + user_lastname + ' ' + user_firstname + ' !! Thanks you to participate the survey !!</h1>');
			$.post(module_path + 'ajax_quiz.php', {action: 'get_quiz_user_history', id_quiz: id_quiz, id_user: user_id}, function (data, textStatus) {
				if (textStatus === "success") {
					data = JSON.parse(data);
					if (data.error === null) {
						if (data.data === null) {
							$.post(module_path + 'ajax_quiz.php', {action: 'get_quiz_all_question_response', id_quiz : id_quiz}, function (data, textStatus) {
								if (textStatus === "success") {
									data = JSON.parse(data);
									if (data.error === null) {
										list_question = '';
										$.each(data.data.question, function (id, question) {
											list_question = list_question + '<div class="question" id="question_id_' + id + '"><span class="span_question">Question :</span> ' + question + '<div id="list_response_question_id_' + id + '"></div></div>';
											object_question_response["question_id_" + id] = '<div class="question" id="question_id_' + id + '"><span class="span_question">Question :</span> ' + question + '<div id="list_response_question_id_' + id + '"></div></div>';
										});
										$.each(data.data.response, function (id_question, array_response) {
											list_response = '';
											$.each(array_response, function (id, response) {
												list_response = list_response + '<label class="radio-inline"><input type="radio" class="response_radio" id="response_id_' + id + '" name="response_for_question_id_' + id_question + '">' + response + '</label>';
											});
											list_response = list_response + '</select></div>';
											object_question_response["response_for_question_id_" + id_question] = list_response;
										});
										$.each(data.data.score, function (id_response, score) {
											object_question_response["score_for_response_id_" + id_response] = score;
										});
										object_question_response["array_question_id"] = data.data.question_id;
										object_question_response["question_length"] = data.data.question_length;
										current_question_id = object_question_response["array_question_id"][compteur_question];
										$('#quiz_question_response').html(object_question_response["question_id_" + current_question_id]);
										$('#list_response_question_id_' + current_question_id).html(object_question_response["response_for_question_id_" + current_question_id]);
										$('#validate_response').click(function() {
											id_question = '';
											id_response = '';
											id_question = $('.response_radio:checked').parent('label').parent('div').attr('id').substr(26);
											id_response = $('.response_radio:checked').attr('id').substr(12);
											obj_question_response[id_question] = id_response;
											id_question = '';
											id_response = '';
											compteur_question++;
											current_question_id = object_question_response["array_question_id"][compteur_question];
											$('#quiz_question_response').html(object_question_response["question_id_" + current_question_id]);
											$('#list_response_question_id_' + current_question_id).html(object_question_response["response_for_question_id_" + current_question_id]);
											$('#validate_response').attr('disabled', 'true');
											if (compteur_question === object_question_response["question_length"] - 1) {
												$('#validate_response').html("End the quiz");
											}
											if (compteur_question === object_question_response["question_length"]) {
												score_response = 0;
												$.each(obj_question_response, function (id_question, id_response) {
													score_response = parseInt(score_response) + parseInt(object_question_response['score_for_response_id_' + id_response]);
												});
												$('.question').remove();
												$.post(module_path + 'ajax_quiz.php', {action: 'display_list_product', id_quiz: id_quiz, score: score_response, question_response: obj_question_response, id_language: $('#id_language').text()}, function (data, textStatus) {
													if (textStatus === "success") {
														data = JSON.parse(data);
														if (data.error === null) {
															$('#quiz_score').html('<p class="info">We propose you this list of product !!</p>');
															list_image = '';
															$.each(data.data.list_image, function (product_path, img_path) {
																list_image = list_image + '<a href="' + product_path + '" ><img src="' + img_path + '" class="img-circle img-thumbnail"  /></a>';
															});
															$('#quiz_score').html('<p class="info">We propose you this list of product !!</p><div id="list_image">' + list_image + '</div>');
															$.post(module_path + 'ajax_quiz.php', {action: 'quiz_history', id_quiz: id_quiz, id_user: user_id, score: score_response, question_response: obj_question_response, product_id: data.data.product_id.join('|')}, function () {});
														}
													}
												});
											}
										});
									} else {
										$('#quiz_question_response').html('<p class="error">Can\'t find question and response of the quiz !! Contact the admin for more detail !!</p>');
									}
								}
							});
						} else {
							list_image = '';
							$.each(data.data, function (product_path, img_path) {
								list_image = list_image + '<a href="' + product_path + '" ><img src="' + img_path + '" class="img-circle img-thumbnail"  /></a>';
							});
							$('#quiz_score').html('<p class="info">We propose you this list of product !!</p><div id="list_image">' + list_image + '</div>');
						}
					}
				}
			});
			$(document.body).on('change', '.response_radio', function () {
				if ($('.response_radio:checked').size() === 1) {
					$('#validate_response').removeAttr('disabled');
				} else {
					$('#validate_response').attr('disabled', 'true');
				}
			});
		}
	});
});