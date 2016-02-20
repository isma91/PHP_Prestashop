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
		if (parent::install() && $this->registerHook('displayBackOfficeHeader')){
			Db::getInstance()->execute('CREATE TABLE IF NOT EXISTS `' . _DB_PREFIX_ . 'quiz` (`id` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY, `quiz_name` TEXT NOT NULL)ENGINE = InnoDB CHARACTER SET utf8 COLLATE utf8_general_ci;');
			Db::getInstance()->execute('CREATE TABLE IF NOT EXISTS `' . _DB_PREFIX_ . 'quiz_question` (`id` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY, `id_quiz` INT(11) NOT NULL, `question` TEXT NOT NULL)ENGINE = InnoDB CHARACTER SET utf8 COLLATE utf8_general_ci;');
			Db::getInstance()->execute('CREATE TABLE IF NOT EXISTS `' . _DB_PREFIX_ . 'quiz_response` (`id` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY, `response` TEXT NOT NULL,`id_question` INT(11) NOT NULL) ENGINE = InnoDB CHARACTER SET utf8 COLLATE utf8_general_ci;');
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
			$this->unregisterHook('displayBackOfficeHeader');
			return true;
		}
		return false;
	}
	public function getContent()
	{
		//$html = $html . '<script src="' . $this->_path . 'views/js/jquery-2.1.4.min.js" type="text/javascript" ></script>';
		$html = '';
		$html = $html . '<link href="' . $this->_path . 'views/css/style.css" rel="stylesheet" type="text/css" media="all" />';
		$html = $html . '<script src="' . $this->_path . 'views/js/admin.js" type="text/javascript" ></script>';
		$html = $html . '<div class="container" id="the_body">';
		$html = $html . '<div class="jumbotron" id="div_title">';
		$html = $html . '<h1>Welcome to Quiz module !!</h1>';
		$html = $html . '<h2>Create a survey for you customers to display the better products !!</h2></div>';
		$html = $html . '<p id="module_path">' . $this->_path . '</p>';
		$html = $html . '</div>';
		return $html;
	}
}