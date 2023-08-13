<?php
/*
  Authors : THE MESD TECHNOLOGY
  Website : https://mesdtech.com/
  App Name : MESD FOOD DELIVERY
  Created : 05/02/2020
  Copyrigt © 2020-present The MESD Technology.
*/ defined('BASEPATH') OR exit('No direct script access allowed');
class Razorpay extends CI_Controller
{
    function  __construct() {
        parent::__construct();
        $this->load->helper('url');

    }
     
    function index(){
        $data = array(
            'key' => $_GET['key'],
            'amount' => $_GET['amount'],
            'email' => $_GET['email'],
            'logo'=> $_GET['logo'],
            'callback' => base_url().'razorpay/success?id='
        );
        $this->load->view('RazorPay/razorpay',$data);
    }

    function success(){
        $this->load->view('RazorPay/success');
    }
    
}