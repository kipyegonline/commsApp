<?php
include ("../db.php");
$res=[];
if(isset($_GET["adduser"]) && $_GET["adduser"]=="true"){

    $username= $_POST["username"];
    $userphone= $_POST["userphone"];
    $usertitle= $_POST["usertitle"];
    $useremail= $_POST["useremail"];
    $userdept= $_POST["userdept"];
    $userpassword= $_POST["userpassword"];
    $userAltId= $_POST["userAltId"];

    if(!empty($username) && !empty($userphone)
     && !empty($usertitle) && !empty($useremail)
      && !empty($userpassword)){
          $sql="INSERT INTO comms_users 
(username, usertitle,useremail, userdept, userpassword, userAltId, addedon)
VALUES(:username, :usertitle, :useremail, :userdept, :userpassword, :userAltId, NOW())";
$stmt=$connection->prepare($sql);
$stmt->execute(Array(   
   ":username"=>$username, 
   ":usertitle"=>$usertitle, 
   ":useremail"=>$useremail, 
   ":userdept"=>$userdept, 
   ":userpassword"=>$userpassword, 
   ":userAltId"=>$userAltId  
));
$id=$connection->lastInsertId();
if($id>0){
    $res["status"]=200;
          $res["msg"]="{$username} added successfully";
            echo json_encode($res);
     
}else{
        $res["status"]=201;
          $res["msg"]="Error adding users to table. Check fields and try again";
            echo json_encode($res);  
}


      }else{
          $res["status"]=201;
          $res["msg"]="Error adding users. Check fields and try again";
            echo json_encode($res);
      }
}
if(isset($_GET["edituser"]) && $_GET["edituser"]=="true"){

$res["status"]=200;
echo json_encode($res);
}
if(isset($_GET["fetchusers"]) && $_GET["fetchusers"]=="true"){

$sql="SELECT * FROM comms_users ORDER BY username";
$stmt=$connection->query($sql);
if($stmt){
    $data=$stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($data);
}
}


if(isset($_GET["deleteuser"]) && $_GET["deleteuser"]=="true"){
    $id=$_GET["userId"];
    if($id){
        $sql="DELETE FROM comms_users where id='{$id}' LIMIT 1";
        $stmt=$connection->exec($sql);
$res["status"]=200;
$res["msg"]="user deleted";
echo json_encode($res);

    }

}