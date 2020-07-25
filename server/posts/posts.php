<?php
require("./postsclass.php");
include("../func.php");
//initialize the post class
$post=new Post("myposts");
/*Add posts*/
if(isset($_GET['addposts']) && $_GET["addposts"]=="true"){
  
   //extract the data from POST
   $clientName=$_POST["clientName"];
   $clientEmail=$_POST["clientEmail"];
   $clientPhone=$_POST["clientPhone"];
   $clientOrg=$_POST["clientOrg"];   
   $message=$_POST["message"];
   $handler=$_POST["handler"];
   $subject=$_POST["subject"];
   $clientDept=$_POST["clientDept"];
   $addedBy=$_POST["addedBy"];
   $addedon=$_POST["addedon"];
   $status=0;

  
   // validate data and check empty fields
   if(empty($clientName) || empty($subject) || empty($message) || empty($clientDept) || empty($handler)){
       echo json_encode(["status"=>201, "msg"=>"Missing fields"]);
   }else{
     //insert posts to Database
    $postid= $post->insertPosts($clientName,$clientEmail, $clientPhone,$clientOrg,$message,$subject, $addedBy,$addedon,$status);
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
   echo json_encode(["status"=>201, "msg"=>"Error publishing posts...Try again later $postid"]);
 }
    
   }
}

/* FETCH POSTS*/
if(isset($_GET['fetchposts']) && $_GET["fetchposts"]=="true"){
     $uuid=$_GET["uuid"];
   if($uuid){
      $data=$post->fetchPosts($uuid);
   
   
     header("Content-Type: application/json; charset=utf-8");
     header("Set-Cookie: Julesyy");
      echo json_encode($data);
      
   }
}
/* set blue ticks*/
if(isset($_GET['setticks']) && $_GET["setticks"]=="true"){
   $id=$_GET["id"];
    $uuid=$_GET["uuid"];
   if(isset($uuid) && isset($id) ){
      $post->setTicks($id,$uuid);
   }
}

//FETCH BY STATE of resolution
if(isset($_GET['fetchbyStatus']) && $_GET["fetchbyStatus"]=="true"){
   $id=$_GET["id"];
    $uuid=$_GET["uuid"];
   if(isset($uuid)){
      $data=$post->fetchbyStatus($id,$uuid);
      echo json_encode($data);
   }
}
//FETCH BY nature of issues
if(isset($_GET['fetchbyIssues']) && $_GET["fetchbyIssues"]=="true"){
   $id=$_GET["id"];
    $uuid=$_GET["uuid"];
   if(isset($id) && isset($uuid)){
      $data=$post->fetchbyIssues($id,$uuid);
      if(count($data)>0){
 echo json_encode($data);
      }else{
        echo  sendFeedback(201,"You do not have posts regarding this issue");
      }
     
   }
}

//FETCH BY nature of issues
if(isset($_GET['handleSearch']) && $_GET["handleSearch"]=="true"){
   $keyword=$_GET["keyword"];
    $uuid=$_GET["uuid"];
   if(isset($keyword) && isset($uuid)){
      $post->fetchbySearch($id,$uuid);
   }
}

//FETCH BY dept users
if(isset($_GET['fetchbyusers']) && $_GET["fetchbyusers"]=="true"){
   $id=$_GET["id"];
    $uuid=$_GET["uuid"];
   if(isset($id) && isset($uuid)){
     $data= $post->fetchbyUsers($id);
     if(count($data)>0){
      echo json_encode($data);
      }else{
        echo  sendFeedback(201,"You do not have posts regarding this issue");
      }
   }
}
//fetch recent posts
if(isset($_GET['fetchrecentpost']) && $_GET["fetchrecentpost"]=="true"){
 $uuid=$_GET["uuid"];
if(isset($uuid)){
$post->fetchRecentPosts($uuid);
}
   

 
}
//handleResolution
if(isset($_GET['resolveissue']) && $_GET["resolveissue"]=="true"){
   $uuid=$_GET["uuid"];
   $issueId=$_GET["issue"];
   $status=$_GET["status"];
   if(isset($uuid) && isset($issueId)&& isset($status)){
      $post->resolveIssue($uuid,$issueId,$status);
   }
}

/****** Commenst section */
//fetch comments
if(isset($_GET['fetchComments']) && $_GET["fetchComments"]=="true"){
 
   $uuid=$_GET["uuid"];
   $postId=$_GET["postId"];
   if(isset($uuid) && isset($postId)){
      $post->fetchComments($postId,$uuid);
   }

}

//add commet
if(isset($_GET['addComment']) && $_GET["addComment"]=="true"){
   $id=$_GET["id"];
   $uuid=$_GET["uuid"];

}

//delete comment

if(isset($_GET['deleteComment']) && $_GET["deleteComment"]=="true"){
   $id=$_GET["id"];
   $uuid=$_GET["uuid"];
   if(isset($id) && isset($uuid)){
$post->deleteComment($id,$uuid);
   }

}
//Edit
if(isset($_GET['editComment']) && $_GET["editComment"]=="true"){

}