<?php
require_once("../db.php");
require_once("../func.php");

class Departments{
   public $name;
    public static $desc="The damn function is not working";
   
    public function __construct($name){
         global $connection;
       $this->name=$name;
       //initialize mysql conne tion to the class
       $this->connection=$connection;
       return true;
    }
        public function insertDepartMents($department,$altName,$altId){
       
        $sql="INSERT INTO comms_departments (department,altName,alt_id) 
        VALUES( :department,:altName, :altId)";
        $stmt=$this->connection->prepare($sql);
        $stmt->execute(Array(
            ":department"=>$department,
            ":altName"=>$altName, 
            ":altId"=>$altId));
        //check if it was added
        $id=$this->connection->lastInsertId();
        if($id>0){
            echo sendFeedBack(200,"Added successfully");
        }else{
            echo sendFeedBack(201,"Error adding..Try again"); 
        }
    }
    public function fetchDepts(){
       
    $query="SELECT * FROM comms_departments ORDER BY department";
        $stmt=$this->connection->query($query);
        if($stmt){
        $data=$stmt->fetchAll(PDO::FETCH_ASSOC);
        if(count($data)){
        echo json_encode($data);
   
        }else{
              echo json_encode([]);
   
        }
  
        }else{
            echo sendFeedBack(201,"Error fetching data from department tables");
        }
    }

public function deleteItem($id){
    
     $sql="DELETE FROM comms_departments where id={$id} LIMIT 1";
   
     
    $stmt=$this->connection->exec($sql);
    if($stmt){
          echo sendFeedBack(200,"Added successfully");
        /*
        $rowCount=$stmt->rowCount();
    if($rowCount>0){
        echo sendFeedBack(200,"Added successfully");
    }else{
        echo sendFeedBack(201,"Error adding..Try again"); 
    }
*/

    }
    

}
private function makeSomeNoise(){
    echo "Making Noise";
}


public function updateDepts($department,$altName, $id){
    $sql="UPDATE comms_departments 
    SET 
    department=:dept,
    altName=:altName 
    WHERE id=:id 
    LIMIT 1";  
    $stmt=$this->connection->prepare($sql);
    if($stmt){
  $stmt->execute(Array(":dept"=>$department,":altName"=>$altName, ":id"=>$id));
    $rowCount=$stmt->rowCount();
  echo sendFeedBack(200,"Updated successfully");
  
    }else{
  echo sendFeedBack(201,"Updated department on $rowCount");
    }
  
}

}
