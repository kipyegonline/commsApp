<?php
require("../db.php");

$mainQuery="select 
a.id as id, 
a.clientName as clientName,
a.clientEMail as clientEMail, 
a.clientPhone,
a.clientOrg as clientOrg, 
a.message as message,
 a.subject as subject, 
 a.createdon,
 a.addedBy as adder,
 (SELECT username from comms_users where id=a.addedBy) as addedBy,
 a.addedon as addedon,
 a.status as status,
 b.user_id as handler_id,
 b.seen as seen,
 (select issue from comms_issues where id=b.issueId) as issue,
 c.username as handler
 from comms_posts a
 inner join comms_posts_users b on a.id =b.post_id 
 inner join comms_users c on b.user_id = c.id
 ";

class Post{

public  function __construct($name){
   global $connection;
  $this->name=$name;
  $this->connection=$connection;
    }
/// adding posts themselves
public function insertPosts($clientName,$clientEmail,$clientPhone, $clientOrg, $message,$subject, $addedBy, $addedon,$status){
  $sql="INSERT INTO 
  `comms_posts` 
  (`clientName`,
  `clientEmail`, 
  `clientPhone`,
  `clientOrg`, 
  `message`, 
 `subject`,  
  `addedBy`, 
  `addedon`,  
  `status`) 
VALUES
(:clientName,
:clientEmail, 
:clientPhone,
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
          ":clientPhone"=>$clientPhone,
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
  $seen=0;
  $userIssue=explode("-",$userid); 

  $user=$userIssue[0];
  $issue=$userIssue[1];

$query="INSERT INTO comms_posts_users (`post_id`, `user_id`,`issueId`,`seen`,`addedon`, `seenOn`) VALUES(:postid,:userid,:issueId, $seen, NOW(),NULL)";
try{
  $stmt=$this->connection->prepare($query);
  if($stmt){
    
$stmt->execute(Array(":postid"=>$postid, ":userid"=>$user, ":issueId"=>$issue));
$id=$this->connection->lastInsertId();

return $id;
}
}
catch(PDOException $e){
  throw new Exception($e->getMessage(), 1);
  

}


}

public function insertpostdepts($postid,$userdept){
    $query="INSERT INTO comms_posts_dept (`post_id`, `dept_id`, `addedon`) VALUES(:postid,:userdept, NOW())";
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
private static function fetchQuery($ext){
  return "select 
a.id as id, 
a.clientName as clientName,
a.clientEMail as clientEMail, 
a.clientPhone,
a.clientOrg as clientOrg, 
a.message as message,
 a.subject as subject, 
 a.createdon,
 a.addedBy as adder,
 (SELECT username from comms_users where id=a.addedBy) as addedBy,
 a.addedon as addedon,
 a.status as status,
 b.user_id as handler_id,
 b.seen as seen,
 (select issue from comms_issues where id=b.issueId) as issue,
 c.username as handler
 from comms_posts a
 inner join comms_posts_users b on a.id =b.post_id 
 inner join comms_users c on b.user_id = c.id  " . $ext;
}
public function fetchposts($id){
 $query=" where b.user_id={$id} ORDER BY a.id desc " ;
  $sql=Post::fetchQuery($query);
 //

  try{

    $stmt=$this->connection->query($sql);

    if($stmt){
      $data=[];
      while($row=$stmt->fetch(PDO::FETCH_ASSOC)){
        
        $data[]=$row;
      }
      return $data;
    }
  }
  catch(PDOException $e){
   echo $e->getMessage();
    
  }
  

}
public function fetchbyStatus($id,$uuid){
  //concat query to static fetch query method
  $query= "where b.user_id={$uuid} and a.status='{$id}' ORDER BY a.id desc"  ;
  $sql=Post::fetchQuery($query);
 //

  try{

    $stmt=$this->connection->query($sql);

    if($stmt){
      $data=[];
      while($row=$stmt->fetch(PDO::FETCH_ASSOC)){
        //$data["key"]=$id;
        $data[]=$row;
      }
      return $data;
    }
  }
  catch(PDOException $e){
   echo $e->getMessage();
    
  }
}

public function setTicks($id,$uuid){
  $query="UPDATE comms_posts_users set seen=1 where post_id=$id AND  user_id=$uuid LIMIT 1";
  $stmt=$this->connection->exec($query);
 
}
public function fetchbyIssues($id,$uuid){

  $query="where b.user_id={$uuid} and b.issueId='{$id}' ORDER BY a.id desc"  ;
  $sql=Post::fetchQuery($query);
 //

  try{

    $stmt=$this->connection->query($sql);

    if($stmt){
      $data=[];
      while($row=$stmt->fetch(PDO::FETCH_ASSOC)){
        //$data["key"]=$id;
        $data[]=$row;
      }
      return $data;
    }
  }
  catch(PDOException $e){
   echo $e->getMessage();
    
  }

}
public function fetchbyUsers($id){
    //concat query to static fetch query method  
  $query= "where b.user_id='{$id}' ORDER BY a.id desc";
  $sql=Post::fetchQuery($query);
 //
  try{

    $stmt=$this->connection->query($sql);

    if($stmt){
      $data=[];
      while($row=$stmt->fetch(PDO::FETCH_ASSOC)){
        //$data["key"]=$id;
        $data[]=$row;
      }
      return $data;
    }
  }
  catch(PDOException $e){
   echo $e->getMessage();
    
  }
  
}

}//class