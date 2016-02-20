<?php
/**
* Ajax_quiz.php
*
* File who display some information about quiz from the database
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
//Db::getInstance()->Insert_ID(); get last insered id;
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
	default:
	break;
}