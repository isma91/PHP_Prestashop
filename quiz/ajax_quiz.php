<?php
/**
* Ajax_quiz.php
*
* File who CRUD quiz from and to the database
*
* PHP 5.6.17-0+deb8u1 (cli) (built: Jan 13 2016 09:10:12)
*
* @category Controller
* @package  Controller
* @author   isma91 <ismaydogmus@gmail.com>
* @author   Raph <rbleuzet@gmail.com>
* @license  http://opensource.org/licenses/gpl-license.php GNU Public License
* @link     https://github.com/isma91/quiz/blob/master/ajax_quiz.php
*/
require_once(dirname(__FILE__) . '../../../config/config.inc.php');
require_once(dirname(__FILE__) . '../../../init.php');
function send_json ($error, $data) {
	echo json_encode(array('error' => $error, 'data' => $data));
}
function get_all_quiz () {
	$results = Db::getInstance()->ExecuteS('SELECT * FROM ' . _DB_PREFIX_ . 'quiz');
	if ($results) {
		$quiz_result = array();
		foreach ($results as $row) {
			array_push($quiz_result, array($row["id"] => $row["quiz_name"]));
		}
		send_json(null, $quiz_result);
	} else {
		send_json(null, null);
	}
}
function check_duplicate_quiz_name ($quiz_name) {
	if (!empty($quiz_name)) {
		$results = Db::getInstance()->ExecuteS('SELECT * FROM ' . _DB_PREFIX_ . 'quiz WHERE quiz_name = "' . $quiz_name . '"');
		send_json(null, $results);
	}
}
function create_quiz_name ($quiz_name) {
	if (!empty($quiz_name)) {
		$insert = Db::getInstance()->insert('quiz', array('quiz_name' => $quiz_name));
		if ($insert !== true) {
			send_json("Can't create a quiz !! Contact your admin !!", null);
		} else {
			$results = Db::getInstance()->ExecuteS('SELECT id FROM ' . _DB_PREFIX_ . 'quiz WHERE quiz_name = "' . $quiz_name . '"');
			foreach ($results as $row) {
				$id_quiz = $row['id'];
			}
			send_json(null, $id_quiz);
		}
	}
}
function create_quiz ($quiz, $id_quiz) {
	if (!empty($quiz) && !empty($id_quiz)) {
		$array_question = array();
		foreach ($quiz as $id => $val) {
			if (strlen($id) === 10) {
				$insert = Db::getInstance()->insert('quiz_question', array('id_quiz' => (int)$id_quiz, "question" => $val));
				if ($insert !== true) {
					send_json("Can't add question to the quiz !! Contact your admin !!", null);
				}
				$array_question[$id] = Db::getInstance()->Insert_ID();
			}
			if (strlen($id) === 21) {
				foreach ($array_question as $id_quiz_question => $id_question) {
					if (substr($id, 0, 10) === $id_quiz_question) {
						$insert = Db::getInstance()->insert('quiz_response', array("response" => $val, 'id_question' => (int)$id_question));
						if ($insert !== true) {
							send_json("Can't add response to the quiz !! Contact your admin !!", null);
						}
					}
				}
			}
		}
		send_json(null, $id_quiz);
	}
}
function get_all_products ($id_quiz, $id_language) {
	if (!empty($id_quiz) && !empty($id_language)) {
		$array_product_image = array();
		$productCore = new Product();
		$imageCore = new Image();
		$linkCore = new Link();
		$products = $productCore->getProducts($id_language, 0, 0, 'id_product', 'ASC', false, true, null);
		foreach ($products as $product) {
			$array_product_image[$product["id_product"]] = $linkCore->getImageLink($product["link_rewrite"], $product["id_product"]);
		}
		send_json(null, $array_product_image);
	}
}
function get_quiz ($id_quiz) {
	if (!empty($id_quiz)) {
		$array_question_response = array();
		$results_quiz_name = Db::getInstance()->ExecuteS('SELECT quiz_name FROM ' . _DB_PREFIX_ . 'quiz WHERE id = "' . $id_quiz . '"');
		$quiz_name = $results_quiz_name[0]["quiz_name"];
		$results_question = Db::getInstance()->ExecuteS('SELECT id, question FROM ' . _DB_PREFIX_ . 'quiz_question WHERE id_quiz = "' . $id_quiz . '"');
		foreach ($results_question as $row_question) {
			$results_response = Db::getInstance()->ExecuteS('SELECT id, response FROM ' . _DB_PREFIX_ . 'quiz_response WHERE id_question = "' . $row_question["id"] . '"');
			foreach ($results_response as $row_response) {
				$array_question_response["question"][$row_question["id"]] = $row_question["question"];
				$array_question_response["response"][$row_question["id"]][$row_response["id"]] = $row_response["response"];
			}
		}
		send_json(null, $array_question_response);
	}
}
function create_end_quiz ($quiz, $id_quiz) {
	if (!empty($quiz) && !empty($id_quiz)) {
		$array_score_product = array();
		$array_value = array();
		foreach ($quiz as $id => $array_score) {
			if (substr($id, 0, 15) === "score_response_") {
				if (count($array_score) === 1) {
					Db::getInstance()->ExecuteS('UPDATE ' . _DB_PREFIX_ . 'quiz_response SET score = "' . $array_score[0] . '" WHERE id = "' . substr($id, 15) . '"');
				}
			}
			if (substr($id, 0, 23) === "select_different_score_") {
				$array_score_product[substr($id, 23)] = implode("|", $array_score);
			}
			if (substr($id, 0, 6) === "input_") {
				if (count($array_score) === 1) {
					$array_score_product[substr($id, 14) . "_" . substr($id, 6, 1)] = $array_score[0];
				}
			}
		}
		foreach ($array_score_product as $id => $score) {
			array_push($array_value, $score);
		}
		for ($i = 0; $i < count($array_score_product) / 3; $i++) {
			$array_list_id_product[] = $array_value[$i];
		}
		array_splice($array_value, 0, count($array_score_product) / 3);
		$array_score_between = array_chunk($array_value, 2);
		if (count($array_list_id_product) === count($array_score_between)) {
			for ($j=0; $j < count($array_list_id_product); $j++) { 
				$array_all[$array_list_id_product[$j]] = $array_score_between[$j];
			}
		}
		foreach ($array_all as $id_list_product => $array_between_score) {
			if (count($array_between_score) === 2) {
				$insert = Db::getInstance()->insert('quiz_list_score_product', array('id_quiz' => $id_quiz, "id_list_product" => $id_list_product, "score_between" => $array_between_score[0] . '|' . $array_between_score[1]));
			}
		}
		Db::getInstance()->ExecuteS('UPDATE ' . _DB_PREFIX_ . 'quiz_activate SET id_quiz = "' . $id_quiz . '"');
		send_json(null, null);
	}
}
switch ($_POST["action"]) {
	case 'get_all_quiz':
	get_all_quiz();
	break;
	case 'check_duplicate_quiz_name':
	check_duplicate_quiz_name($_POST["quiz_name"]);
	break;
	case 'create_quiz_name':
	create_quiz_name($_POST["quiz_name"]);
	break;
	case 'create_quiz':
	create_quiz($_POST["quiz"], $_POST["id_quiz"]);
	break;
	case 'get_all_products':
	get_all_products($_POST["id_quiz"], $_POST["id_language"]);
	break;
	case 'get_quiz':
	get_quiz($_POST["id_quiz"]);
	break;
	case 'create_end_quiz':
	create_end_quiz($_POST["quiz"], $_POST["id_quiz"]);
	break;
	default:
	break;
}