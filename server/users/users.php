<?php
include ("../db.php");
include("./userclass.php");

$user=new Users("");

if(isset($_GET["adduser"]) && $_GET["adduser"]=="true"){

    $username= $_POST["username"];
    $userphone= $_POST["userphone"];
    $usertitle= $_POST["usertitle"];
    $useremail= $_POST["useremail"];
    $userdept= $_POST["userdept"];
    $userpassword= $_POST["userpassword"];
    $userAltId= $_POST["userAltId"];

    //validate 
    if(!empty($username) && !empty($userphone)
     && !empty($usertitle) && !empty($useremail)
      && !empty($userpassword)){

          //check if email exists
          $checker="SELECT COUNT(*) FROM comms_users where useremail='$useremail'";
          if(verifyEmail($checker)){
        
            echo sendFeedback(201,"{$useremail} already exists on the system");
          }else{
          $user->insertUsers($username,$userphone,$usertitle,$useremail, $userdept, $userpassword,$userAltId);
          }       


      }else{
         //if some values are missing
            echo sendFeedback(201,"Some fields are missing. Check and try again");
      }
}

if(isset($_GET["edituser"]) && $_GET["edituser"]=="true"){
     $username= $_POST["username"];
    $userphone= $_POST["userphone"];
    $usertitle= $_POST["usertitle"];
    $useremail= $_POST["useremail"];
    $userdept= $_POST["userdept"];
    $userpassword= $_POST["userpassword"];
    $userAltId= $_POST["userAltId"];
    $id=$_POST["id"];

$user->editUsers($username, $userphone, $usertitle, $useremail, $userdept, $id);
   


}
if(isset($_GET["fetchusers"]) && $_GET["fetchusers"]=="true"){

//send fdata
$user->fetchUsers();
}

if(isset($_GET["getdeptusers"]) && $_GET["getdeptusers"]=="true"){
$id=$_GET["deptId"];
if($id){
//send isers
$user->fetchByDept($id);
}else{
     echo json_encode([]);
}

}
if(isset($_GET["getdeptsearch"]) && $_GET["getdeptsearch"]=="true"){
$id=$_GET["keyword"];
if($id){
//send isers
$user->searchUser($id);
}

}


if(isset($_GET["deleteuser"]) && $_GET["deleteuser"]=="true"){
    $id=$_GET["userId"];
    if($id){
       //delete users
       $user->deleteUser($id);
    }

}

if(isset($_GET["fetchSelectedUsers"]) && $_GET["fetchSelectedUsers"]=="true"){
    $id=$_GET["id"];
    if($id){
       //delete users
       $user->getSelectedUser($id);
    }

}
if(isset($_GET["fetchuserdeptstats"]) && $_GET["fetchuserdeptstats"]=="true"){
    $user->fetchStats();
}


//helpers
function verifyEmail($query){
    global $connection;
   $stmt=$connection->query($query);
   if($stmt){
       $rows=$stmt->fetchColumn();
       if($rows>0){
           return true;
       }
       return false;
   }

}