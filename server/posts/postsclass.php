<?php
require("../db.php");



class Post{

public  function __construct($name){
   global $connection;
  $this->name=$name;
  $this->connection=$connection;
    }
/// adding posts themselves
public function insertPosts($clientName,$clientEmail,$clientPhone, $clientOrg, $message,$subject, $addedBy, $addedon,$altId,$status){

  $sql="
  INSERT INTO 
  comms_posts
  (
  clientName,
  clientEmail, 
  clientPhone,
  clientOrg, 
  message, 
  subject,  
  addedBy, 
  addedon,  
  altId,
  status,
  resolvedby) 
VALUES
(:name,
:email,
:phone,
:org,
:msg,
:subject,
:addedby,
:addedon,
:altId,
:status,
:resolvedby)";

   $stmt=$this->connection->prepare($sql);
  if($stmt){
    $stmt->execute(Array(
":name"=>$clientName,
":email"=>$clientEmail,
":phone"=>$clientPhone,
":org"=>$clientOrg,
":msg"=>$message,
":subject"=>$subject,
":addedby"=>$addedBy,
":addedon"=>$addedon,
":altId"=>$altId,
":status"=>$status,
":resolvedby"=>0
    ));

  $id=$this->connection->lastInsertId();
return $id;
  }else{

     throw new PDOException( "Encountered a problem adding posts..Try again later", 1);
     
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
a.altId as altId,
a.clientName as clientName,
a.clientEmail as clientEmail, 
a.clientPhone,
a.clientOrg as clientOrg, 
a.message as message,
 a.subject as subject, 
 a.createdon,
 a.addedBy as adder,
 a.resolvedby as resolver,
(SELECT username from comms_users where id=a.resolvedby) as resolvedBy,
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
 $query=" where b.user_id={$id} ORDER BY a.status, a.id desc " ;
  $sql=self::fetchQuery($query);
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
  $id=$id>0 ? $id :0;
  
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
public function fetchRecentPosts($uuid,$current){
  $id=$this->fetchId($current);
  $query=" where  b.user_id={$uuid} AND (a.status=0 OR a.status=1) AND a.id !=$id ORDER BY a.id desc LIMIT 5" ;
  $sql=self::fetchQuery($query);
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
public function fetchRelatedIssues($uuid){
  $query=" select a.issue as issue ,count(b.post_id) as issuecount, a.id as issueId  from
comms_issues a inner join comms_posts_users b on a.id=b.issueId where b.user_id=$uuid  GROUP BY a.id
 order by issuecount";

 try{

    $stmt=$this->connection->query($query);

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

public function addComment($altId,$postId,$comment,$uuid,$addedon){
$query="INSERT INTO 
`comms_comments` (altId,post_id,comment,addedBy,addedon,createdon) 
VALUES(:altId, :postId,:comment,:uuid,:addedon,NOW())";
$stmt=$this->connection->prepare($query);
if($stmt){
  $stmt->execute(Array(
    ":altId"=>$altId,
     ":postId"=>$postId,
     ":comment"=>$comment,
     ":uuid"=>$uuid,
     ":addedon"=>$addedon
  ));
  $id= $this->connection->lastInsertId();
 return $id;

  
 
}else{
  echo json_encode([
    ["status"=>201,
    "msg"=>"Error adding comment.try again"]
    ]);
}


}

public function resolveIssue($uuid,$issueId,$status){
  $query="UPDATE comms_posts SET status=$status,resolvedby=$uuid where altId='$issueId' LIMIT 1";
  $stmt=$this->connection->exec($query);
  if($stmt){
 return 1;
  }
  return 0;
  
}
//fetch comments
public function fetchComments($postId,$uuid){
  $id=$this->fetchId($postId);
  $sql=" SELECT 
  a.altId as altId,
  a.post_id as post_id,
  a.comment as comment,
  a.addedBy as handler_id,
  a.addedon as addedEn,
  a.createdon as createdon,
  b.username as addedBy 
  FROM comms_comments a INNER JOIN comms_users b 
  ON a.addedBy=b.id
  WHERE a.post_id =$id ORDER BY a.comment_id desc";
  $stmt=$this->connection->query($sql);
  if($stmt){
    $data=$stmt->fetchALL(PDO::FETCH_ASSOC);
  return $data;
  }

  
  
}
//delete comments
public function deleteComment($id,$uuid){
   $query="DELETE FROM  comms_comments where altId='$id' LIMIT 1";
  $stmt=$this->connection->exec($query);
  
  if($stmt){
 return 1;
  }
  return 0; 

}

public function handleEdit($altId,$addedon,$comment){
  $query="UPDATE comms_comments 
  set comment=:comment,
   addedon=:addedon, edited=1
   where altId=:altId LIMIT 1";
  $stmt=$this->connection->prepare($query);
  $stmt->execute(Array(":comment"=>$comment,"addedon"=>$addedon,":altId"=>$altId,));
  $id=$stmt->rowCount();
  return $id;

}
private function fetchId($id){
$q="Select id from comms_posts where altId='$id'";
$st=$this->connection->query($q);
if($st){
  $id=$st->fetch(PDO::FETCH_ASSOC);
  return $id["id"];

}


}

}//class