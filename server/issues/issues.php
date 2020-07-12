<?php
include ("../db.php");
include("../func.php");
$res=[];
if(isset($_GET["addissue"]) && $_GET["addissue"]=="true"){
$issue=$_POST["issue"];
$altId=$_POST["altId"];
if(empty($issue) || empty($altId)){
     $res["status"]=201;
    $res["msg"]="Arguments not seen";
    echo json_encode($res);

}else{
$sql="INSERT INTO comms_issues (issue,altId) VALUES('$issue','$altId')";
$connection->exec($sql);
$id=$connection->lastInsertId();
if($id>0){
    $res["status"]=200;
    $res["msg"]="Added successfully";
    echo json_encode($res);

}else{
     $res["status"]=201;
    $res["msg"]="Error adding issue";
    echo json_encode($res);
}

}//if valid
}

if(isset($_GET["fetchissues"]) && $_GET["fetchissues"]=="true"){

    $sql="SELECT * FROM comms_issues ORDER BY issue";
    $stmt=$connection->query($sql);
    if($stmt){
        $data=$stmt->fetchAll(PDO::FETCH_ASSOC);
        if(count($data)>0){
            echo json_encode($data);
        }else{
            echo json_encode([]);
        }
    }
    
}
if(isset($_GET["deleteissue"]) && $_GET["deleteissue"]=="true"){
    $id=$_GET["id"];
    if($id){
        $q="DELETE FROM comms_issues WHERE altId='$id' LIMIT 1";
        $stmt=$connection->exec($q);
        if($stmt){
             $res["status"]=200;
            $res["msg"]="Deleted successfully";
           echo json_encode($res);

        }else{
             $res["status"]=201;
    $res["msg"]="Error deleting that";
    echo json_encode($res);

        }

    }else{
         $res["status"]=201;
    $res["msg"]="Empty id";
    echo json_encode($res);
    }
}
