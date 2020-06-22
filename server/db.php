<?php
try{
    $connection=new PDO("mysql:host=localhost;dbname=commsApp","vince","//matata11");
   
}
catch(PDOException $e){
    echo "error connecting to the server ". $e->getMessage();
}