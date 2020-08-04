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
   $altId=$_POST["altId"];
   $status=0;

  
   // validate data and check empty fields
   if(empty($clientName) || empty($subject) || empty($message) || empty($clientDept) || empty($handler)){
       echo json_encode(["status"=>201, "msg"=>"Missing fields"]);
   }else{
     //insert posts to Database
     $post->connection->beginTransaction();
    $postid= $post->insertPosts($clientName,$clientEmail,$clientPhone,$clientOrg,$message,$subject, $addedBy,$addedon,$altId,$status);
   
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
$post->connection->commit();
//finally tell the user the process was successfu;;
      echo  sendFeedback(200,"Post published successfully ");
   
 }else{
    $post->connection->rollBack();
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
      $data=$post->fetchbySearch($keyword,$uuid);
      if(count($data)>0){
      echo json_encode($data);
      }else{
        echo  sendFeedback(201,"No search results...");
      }
      
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
 $current=$_GET["current"];
if(isset($uuid) && isset($current)){
$data=$post->fetchRecentPosts($uuid,$current);
if(count($data)>0){
    echo json_encode($data);
}else{
 echo json_encode([]);  
}


}
   

 
}
//handleResolution
if(isset($_GET['resolveissue']) && $_GET["resolveissue"]=="true"){
   $uuid=$_GET["uuid"];
   $issueId=$_GET["issue"];
   $status=$_GET["status"];
   if(isset($uuid) && isset($issueId)&& isset($status)){
      
      $res=$post->resolveIssue($uuid,$issueId,$status);
      if($res>0){
         echo sendFeedback(200,"Resolved");
      }else{
 echo sendFeedback(200,"Error resolving that");
      }
   }
}
/**fetch relate */

if(isset($_GET['fetchRelatedIssues']) && $_GET["fetchRelatedIssues"]=="true"){
$uuid=$_GET["uuid"];

if(isset($uuid)){
   $data=$post->fetchRelatedIssues($uuid);
   if(count($data)>0){
    echo json_encode($data);
   }else{
    echo json_encode([]);
   }
   
}
}
/****** Commenst section */
//fetch comments
if(isset($_GET['fetchcomments']) && $_GET["fetchcomments"]=="true"){
 
   $uuid=$_GET["uuid"];
   $postId=$_GET["postId"];
   if(isset($uuid) && isset($postId)){
     $data= $post->fetchComments($postId,$uuid);
     echo json_encode($data);
   }

}

//add commet
if(isset($_GET['addcomment']) && $_GET["addcomment"]=="true"){
  
   $comment=$_POST["comment"];
   $altId=$_POST["altId"];
   $uuid=$_POST["uuid"];
   $postId=$_POST["post_id"];
   $addedon=$_POST["addedEn"];


if(!empty($comment) || !empty($uuid) || !empty($altId) || !empty($postId)){
 
$feedback=$post->addComment($altId,$postId,$comment,$uuid,$addedon);
if($feedback>0){
    echo sendFeedback(200,"Comment added");
}else{
  echo sendFeedback(201,"Error adding comment $feedback"); 
}
}else{
   echo sendFeedback(201,"No arguments provided");
}
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

   $comment=$_POST["edit"];
   $altId=$_POST["id"];
   $addedon=$_POST["addedEn"];
   if(!empty($comment) || !empty($altId)){
$id=$post->handleEdit($altId,$addedon,$comment);
if($id>0){
   echo sendFeedback(200,"Comment updated");
}else{
   echo sendFeedback(201,"Error updating comment.");
}
   }

}
/*
$analytics=["16-13","18-20",'19-20',"23-12","56-34"];
$res=array_search("18-20",$analytics);
if($res){
   echo "Iko";
}else{
   echo "Hamna";
}
echo "<br/>";

$st= implode("*",$analytics);
echo strlen($st);*/