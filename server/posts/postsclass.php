<?php
require("../db.php");
class Post{

public  function __construct($name){
   global $connection;
  $this->name=$name;
  $this->connection=$connection;
    }
/// adding posts themselves
public function insertPosts($clientName,$clientEmail, $clientOrg, $message,$subject, $addedBy, $addedon,$status){
  $sql="INSERT INTO 
  `comms_posts` 
  (`clientName`,
  `clientEmail`, 
  `clientOrg`, 
  `message`, 
 `subject`,  
  `addedBy`, 
  `addedon`,
  `status`) 
VALUES
(:clientName,
:clientEmail, 
:clientOrg, 
:message, 
 :subject,  
 :addedBy, 
 :addedon,
 :status)";
try{
   $stmt=$this->connection->prepare($sql);
  if($stmt){
      $stmt->execute(Array(
          ":clientName"=>$clientName,
          ":clientEmail"=>$clientEmail, 
          ":clientOrg"=>$clientOrg, 
          ":message"=>$message,           
           ":subject"=>$subject,           
            ":addedBy"=>$addedBy, 
            ":addedon"=>$addedon,
            ":status"=>$status

      ));
      $id=$this->connection->lastInsertId();
      return $id;
  }else{
     throw new PDOException( "Encountered a problem adding posts..Try again later", 1);
  }

}
catch(PDOException $e){
  throw new PDOException( $e.getMessage(), 1);
  
}
 



}

public function insertpostusers($postid, $userid){
$query="INSERT INTO comms_posts_users (`post_id`, `user_id`) VALUES(:postid,:userid)";
try{
  $stmt=$this->connection->prepare($query);
  if($stmt){
    
$stmt->execute(Array(":postid"=>$postid, ":userid"=>$userid));
$id=$this->connection->lastInsertId();

return $id;
}
}
catch(PDOException $e){
  throw new Exception($e->getMessage(), 1);
  

}


}

public function insertpostdepts($postid,$userdept){
    $query="INSERT INTO comms_posts_dept (`post_id`, `dept_id`) VALUES(:postid,:userdept)";
    try{
$stmt=$this->connection->prepare($query);
if($stmt){
$stmt->execute(Array(":postid"=>$postid,":userdept"=>$userdept));
$id=$this->connection->lastInsertId();

return $id;
    
}

    }
    catch(PDOException $e){
       throw new Exception($e->getMessage(), 1);
  
    }

}
}//class