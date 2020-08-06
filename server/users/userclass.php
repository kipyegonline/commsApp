<?php
include ("../db.php");
include("../func.php");

class Users{
    public function __construct($name){
        global $connection;
        $this->name=$name;
        $this->connection=$connection;
    }
public function insertUsers($username,$userphone,$usertitle,$useremail, $userdept, $userpassword,$userAltId){
    //hash password
   $userpassword= $this->hashPassword($userpassword);   
    //insert to table
  $sql="INSERT INTO comms_users 
(username,userphone, usertitle,useremail, userdept, userpassword, userAltId, addedon)
VALUES(:username,:userphone ,:usertitle, :useremail, :userdept, :userpassword, :userAltId, NOW())";
$stmt=$this->connection->prepare($sql);
$stmt->execute(Array(   
   ":username"=>$username, 
   ":userphone"=>$userphone,
   ":usertitle"=>$usertitle, 
   ":useremail"=>$useremail, 
   ":userdept"=>$userdept, 
   ":userpassword"=>$userpassword, 
   ":userAltId"=>$userAltId  
));
$id=$this->connection->lastInsertId();
if($id>0){
 echo sendFeedBack(200, "{$username} added successfully");
     
}else{
         
             echo sendFeedBack(201, "Error adding users to table. Check fields and try again");
}

    }
    //send users
 public function fetchUsers(){
  $sql="SELECT 
a.id, a.username, a.usertitle, a.useremail,
 b.department as dept,a.userdept, a.userphone, a.userAltId, b.department
 FROM comms_users a 
 INNER JOIN comms_departments b on a.userdept= b.id
  ORDER BY username";
$stmt=$this->connection->query($sql);
if($stmt){
    $data=$stmt->fetchAll(PDO::FETCH_ASSOC);
    if(count($data)>0){
    echo json_encode($data);
    }
}
    }
//update users
public function editUsers($username, $userphone, $usertitle, $useremail, $userdept,
 $id){
        $sql="UPDATE `comms_users`
 set username='{$username}',
 userphone='{$userphone}',
  usertitle='{$usertitle}',
 useremail='{$useremail}',
 userdept='{$userdept}',

 addedon=NOW()
 WHERE id={$id} LIMIT 1";

 $stmt=$this->connection->exec($sql);
 if($stmt){
 $res["status"]=200;
    $res["msg"]="{$username} updated";
    echo json_encode($res);

 }else{
      $res["status"]=201;
    $res["msg"]="Eror updating  $username, $userphone, $usertitle, $useremail, $userpassword, $userdept and $id";
    echo json_encode($res);

 }

    }
    // fetch users by departments
public function fetchByDept($id){
        $sql="SELECT 
a.id, a.username, a.usertitle, a.useremail, b.department as dept, a.userdept, a.userphone, a.userAltId, b.department
 FROM comms_users a 
  INNER JOIN comms_departments b on a.userdept= b.id 
  where a.userdept='$id'
 ORDER BY username";

$stmt=$this->connection->query($sql);
if($stmt){
    $data=$stmt->fetchAll(PDO::FETCH_ASSOC);
    if(count($data)>0){
    echo json_encode($data);
    }else{
        echo json_encode([]);
    }
}

    }
// delete user
public function deleteUser($id){
$sql="DELETE FROM comms_users where id='{$id}' LIMIT 1";
 $stmt=$this->connection->exec($sql);
 if($stmt){
     echo sendFeedback(200, "$id deleted");
 }else{
     echo sendFeedback(201, "Couldn't delete $id ");
 }

    }

public function searchUser($keyword){
    $sql="SELECT 
a.id, a.username, a.usertitle, a.useremail, b.department as dept, a.userdept, a.userphone, a.userAltId, b.department
 FROM comms_users a 
  INNER JOIN comms_departments b on a.userdept= b.id 
  where 
  a.userdept LIKE '%$keyword%' 
  OR a.username LIKE '%$keyword%'  
  OR a.useremail LIKE '%$keyword%' 
  OR a.userphone LIKE '%$keyword%' 
 ORDER BY username";
 $stmt=$this->connection->query($sql);
if($stmt){
    $data=$stmt->fetchAll(PDO::FETCH_ASSOC);
    if(count($data)>0){
    echo json_encode($data);
    }else{
        echo json_encode([]);
    }
}
 
}
public function  getSelectedUser($id){
     $sql="SELECT 
a.id, a.username, a.usertitle, a.useremail, b.department as dept,a.userdept, a.userphone, a.userAltId, b.department
 FROM comms_users a 
  INNER JOIN comms_departments b on a.userdept= b.id 
  where a.userdept='$id'
 ORDER BY username";
     $stmt=$this->connection->query($sql);
if($stmt){
    $data=$stmt->fetchAll(PDO::FETCH_ASSOC);
    if(count($data)>0){
    echo json_encode($data);
    }else{
        echo json_encode([]);
    }
}
}
public function fetchStats(){
    $query="SELECT b.department as dept , 
    count(a.userdept)  as members 
    FROM  comms_users a inner join comms_departments b 
    on a.userdept=b.id  GROUP BY dept ORDER BY members";

    $stmt=$this->connection->query($query);
    if($stmt){
        $data=$stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($data);
    }
}
    
private function hashPassword($password){
    return password_hash($password,PASSWORD_DEFAULT, ["cost"=>15]);
}
private function verifyPassword($password,$email){
    $query="SELECT COUNT(*) from comms_users where useremail='$email'";
    $stmt=$this->connection->query($query);
    if($stmt){
        $row=$stmt->fetchColumn();
        if($row>0){
            $data=$stmt->fetch(PDO::FETCH_ASSOC);
            if(password_verify($password,$data["userpassword"])){
                return true;
            }
            return false;
        }else{
             echo json_encode(["status"=>201,"msg"=>"Invalid email/password"]);
             exit;
        }
        
    }
return false;
}
}
