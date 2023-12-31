<?php
/*
  Authors : THE MESD TECHNOLOGY
  Website : https://mesdtech.com/
  App Name : MESD FOOD DELIVERY
  Created : 05/02/2020
  Copyrigt © 2020-present The MESD Technology.
*/ defined('BASEPATH') OR exit('No direct script access allowed');
class Paypal extends CI_Controller
{
    function  __construct() {
        parent::__construct();
        $this->load->library('paypal_lib');
        // $this->load->model('product');
        $this->load->database();
    }
     
    function index(){
        echo base_url();
    }
     
    function buyProduct(){
        //Set variables for paypal form
        $returnURL = base_url().'paypal/success'; //payment success url
        $cancelURL = base_url().'paypal/cancel'; //payment cancel url
        $notifyURL = base_url().'paypal/ipn'; //ipn url
        $userID = $_GET['uid']; //current user id
        $itemName = $_GET['itemName'];
        $grandTotal = $_GET['grandTotal'];
        $dateTime = $_GET['dateTime'];
        $logo = $_GET['logo'];
         
        $this->paypal_lib->add_field('return', $returnURL);
        $this->paypal_lib->add_field('cancel_return', $cancelURL);
        $this->paypal_lib->add_field('notify_url', $notifyURL);
        $this->paypal_lib->add_field('item_name', $itemName);
        $this->paypal_lib->add_field('custom', $userID);
        $this->paypal_lib->add_field('item_number',  $dateTime);
        $this->paypal_lib->add_field('amount',  $grandTotal);        
        $this->paypal_lib->image($logo);
         
        $this->paypal_lib->paypal_auto_form();
    }
 
     function success(){        
        //pass the transaction data to view
        $this->load->view('paypal/success');
     }
      
     function cancel(){
        //if transaction cancelled
        $this->load->view('paypal/cancel');
     }
      
     function ipn(){
        $this->load->view('paypal/success');
    }
}