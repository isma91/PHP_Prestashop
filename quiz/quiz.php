<?php   
/**
* Quiz.php
*
* A PrestaShop 1.6 module to make a quiz
*
* PHP 5.6.17-0+deb8u1 (cli) (built: Jan 13 2016 09:10:12)
*
* @category Controller
* @package  Controller
* @author   isma91 <ismaydogmus@gmail.com>
* @author   Raph <rbleuzet@gmail.com>
* @license  http://opensource.org/licenses/gpl-license.php GNU Public License
* @link     https://github.com/isma91/quiz/blob/master/Quiz.php
*/
if (!defined('_PS_VERSION_')) {
	exit;
}
/**
*
* Class Quiz
*
* PHP Version 5.6.14-0+deb8u1 (cli) (built: Oct  4 2015 16:13:10)
*
* @category Controller
* @package  Controller
* @author   isma91 <ismaydogmus@gmail.com>
* @author   Raph <rbleuzet@gmail.com>
* @license  http://opensource.org/licenses/gpl-license.php GNU Public License
* @link     https://github.com/isma91/quiz/blob/master/Quiz.php
*/
class Quiz extends Module
{
	public function __construct()
	{
		$this->name = 'quiz';
		$this->tab = 'front_office_features';
		$this->version = '1.0.0';
		$this->author = 'Ismail Aydogmus, Raphael Bleuzet';
		$this->need_instance = 0;
		$this->ps_versions_compliancy = array('min' => '1.6');
		$this->bootstrap = true;
		parent::__construct();
		$this->displayName = $this->l('Quiz Module');
		$this->description = $this->l('A quiz to propose suitable products to your customers.');
		$this->confirmUninstall = $this->l('Are you sure you want to uninstall the Quiz module ?');
	}
	public function install()
	{
		if (parent::install() && $this->registerHook('displayBackOfficeHeader') && $this->registerHook('displayTop')){
			Db::getInstance()->execute('CREATE TABLE IF NOT EXISTS `' . _DB_PREFIX_ . 'quiz` (`id` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY, `quiz_name` TEXT NOT NULL);');
			Db::getInstance()->execute('CREATE TABLE IF NOT EXISTS `' . _DB_PREFIX_ . 'quiz_question` (`id` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY, `id_quiz` INT(11) NOT NULL, `question` TEXT NOT NULL);');
			Db::getInstance()->execute('CREATE TABLE IF NOT EXISTS `' . _DB_PREFIX_ . 'quiz_response` (`id` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY, `response` TEXT NOT NULL, `id_question` INT(11) NOT NULL, `score` INT(11) NOT NULL DEFAULT "0");');
			Db::getInstance()->execute('CREATE TABLE IF NOT EXISTS `' . _DB_PREFIX_ . 'quiz_list_score_product` (`id` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY, `id_quiz` INT(11) NOT NULL, `id_list_product` TEXT NOT NULL, `score_between` TEXT NOT NULL);');
			Db::getInstance()->execute('CREATE TABLE IF NOT EXISTS `' . _DB_PREFIX_ . 'quiz_activate` (`id` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY, `id_quiz` INT(11) NOT NULL);');
			Db::getInstance()->execute('CREATE TABLE IF NOT EXISTS `' . _DB_PREFIX_ . 'quiz_history` (`id` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY, `id_quiz` INT(11) NOT NULL, `id_user` INT(11) NOT NULL, `list_question_response` TEXT NOT NULL, `score` INT(11) NOT NULL);');
			Db::getInstance()->execute('INSERT INTO `' . _DB_PREFIX_ . 'quiz_activate`(`id`, `id_quiz`) VALUES (1,0)');
			return true;
		}
		return false;
	}
	public function uninstall()
	{
		if (parent::uninstall()){
			Db::getInstance()->execute('DROP TABLE IF EXISTS `' . _DB_PREFIX_ . 'quiz`');
			Db::getInstance()->execute('DROP TABLE IF EXISTS `' . _DB_PREFIX_ . 'quiz_question`');
			Db::getInstance()->execute('DROP TABLE IF EXISTS `' . _DB_PREFIX_ . 'quiz_response`');
			Db::getInstance()->execute('DROP TABLE IF EXISTS `' . _DB_PREFIX_ . 'quiz_list_score_product`');
			Db::getInstance()->execute('DROP TABLE IF EXISTS `' . _DB_PREFIX_ . 'quiz_activate`');
			$this->unregisterHook('displayBackOfficeHeader');
			$this->unregisterHook('displayTop');
			return true;
		}
		return false;
	}
	public function getContent()
	{
		$html = '';
		$html = $html . '<link href="' . $this->_path . 'views/css/style_admin.css" rel="stylesheet" type="text/css" media="all" />';
		$html = $html . '<script src="' . $this->_path . 'views/js/admin.js" type="text/javascript" ></script>';
		$html = $html . '<div class="container" id="the_body">';
		$html = $html . '<div class="jumbotron" id="div_title">';
		$html = $html . '<h1>Welcome to Quiz module !!</h1>';
		$html = $html . '<h2>Create a survey for you customers to display the better products !!</h2></div>';
		$html = $html . '<div id="list_quiz"></div><p id="module_path">' . $this->_path . '</p><p id="id_language">' . $this->context->language->id . '</p>';
		$html = $html . '</div>';
		return $html;
	}
	public function hookDisplayHeader ($param)
	{
		$this->context->controller->addCSS($this->_path . 'views/css/style_client.css', 'all');
		$this->context->controller->addJS($this->_path . 'views/js/materialize.min.js');
		$this->context->controller->addJS($this->_path . 'views/js/client.js');
	}
	public function hookDisplayTop ($param)
	{
		$result_activate_quiz = Db::getInstance()->ExecuteS('SELECT id_quiz FROM `' . _DB_PREFIX_ . 'quiz_activate`');
		if ($result_activate_quiz) {
			if (empty($result_activate_quiz[0]["id_quiz"])) {
				$quiz_activate = false;
			} else {
				$quiz_activate = true;
			}
		}
		if ($quiz_activate === true) {
			$result = Db::getInstance()->ExecuteS('SELECT ' . _DB_PREFIX_ . 'quiz.quiz_name FROM `' . _DB_PREFIX_ . 'quiz_activate` INNER JOIN ' . _DB_PREFIX_ . 'quiz ON ' . _DB_PREFIX_ . 'quiz.id = ' . _DB_PREFIX_ . 'quiz_activate.id_quiz');
			if (!empty($result)) {
				$quiz_name = $result[0]["quiz_name"];
			}
			$html = '';
			$html = $html . 'Click here to participate in the survey <button class="btn btn-lg btn-default go_in_quiz" user_id="' . $this->context->customer->id . '" user_lastname="' . $this->context->customer->lastname . '" user_firstname="' . $this->context->customer->firstname . '" module_path="' . $this->_path . '" id="go_in_quiz_id_' . $result_activate_quiz[0]["id_quiz"] . '">' . $quiz_name . '</button>';
			$html = $html . '<div id="quiz_modal" class="modal modal-fixed-footer"><div class="modal-content" id="quiz_content"><div id="quiz_title"></div><div id="quiz_question_response"></div><div id="quiz_score"></div><p id="id_language">' . $this->context->language->id . '</p></div><div class="modal-footer"><button class="modal-action modal-close btn btn-lg btn-default">Quit</button><button class="btn btn-lg btn-default" id="validate_response" disabled="true">Validate</button></div></div>';
			return $html;
		}
	}
	/*
	displayHeader	Called within the HTML <head> tags. Ideal location for adding JavaScript and CSS files.
	displayTop	Called in the page's header.
	displayLeftColumn	Called when loading the left column.
	displayRightColumn	Called when loading the right column.
	displayFooter	Called in the page's footer.
	displayHome	Called at the center of the homepage.
	*/
}