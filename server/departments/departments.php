<?php
require("./departmentClass.php");
//instantiate the damn method
$dept=new Departments("Vince");

if(isset($_GET["adddept"]) && $_GET["adddept"]==true){
$department=$_POST["department"];
$altName=$_POST['altName'];
$altId=$_POST["altId"];
//validate
if(!empty($department) || !empty($altName)){
   $dept->insertDepartMents($department,$altName,$altId);


}else{
    //send back an error message
    echo sendFeedBack(201,"Some details are missing");
}
}

if(isset($_GET["fetchdepts"]) && $_GET["fetchdepts"]==true){
    
    
    $dept->fetchDepts();
}
if(isset($_GET["deletedept"]) && $_GET["deletedept"]==true){
    $id=$_GET["id"];
    $dept->deleteItem($id);
   // echo sendFeedback(200,"Deleted");
    

}

if(isset($_GET["editdept"]) && $_GET["editdept"]==true){
    $department=$_POST["department"];
$altName=$_POST['altName'];
$id=$_POST["id"];

   if(empty($department)){
  echo sendFeedBack(201,"Click department to edit");
   }
   else{
      $altName= empty($altName)? $department :$altName;
 $dept->updateDepts($department,$altName, $id);
   }
  


}




