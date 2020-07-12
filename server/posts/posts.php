<?php
require("./postsclass.php");
include("../func.php");
//initialize the post class
$post=new Post("myposts");

if(isset($_GET['addposts']) && $_GET["addposts"]=="true"){
  
   //extract the data from POST
   $clientName=$_POST["clientName"];
   $clientEmail=$_POST["clientEmail"];
   $clientOrg=$_POST["clientOrg"];
   $message=$_POST["message"];
   $handler=$_POST["handler"];
   $subject=$_POST["subject"];
   $clientDept=$_POST["clientDept"];
   $addedBy=$_POST["addedBy"];
   $addedon=$_POST["addedon"];
   $status=$_POST["status"];
   // validate data and check empty fields
   if(empty($clientName) || empty($subject) || empty($message) || empty($clientDept) || empty($handler)){
       echo json_encode(["status"=>201, "msg"=>"Missing fields"]);
   }else{
     //insert posts to Database
    $postid= $post->insertPosts($clientName,$clientEmail, $clientOrg, $message,$subject, $addedBy, $addedon,$status);
 if($postid>0){
   
    //extract handlers from the post string as an array
     $handlers=explode("*", $handler);
     $depts=explode("*",$clientDept);
     // add departments concerned, by looping and inserting the handlers and departments to linkin table,
     
     foreach($depts as $dept){
         
       $id1= $post->insertpostdepts($postid,$dept);
       
    }
    //users
    foreach($handlers as $handle){
         
        $id2=$post->insertpostusers($postid,$handle);
        
        
    }

//finally tell the user the process was successfu;;
      echo  sendFeedback(200,"Post published successfully ");
   
 }else{
    //if the post was not added to the table
   echo json_encode(["status"=>201, "msg"=>"Error publishing posts...Try again later"]);
 }
    
   }
}

