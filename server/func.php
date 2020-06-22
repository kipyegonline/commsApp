<?php

function sendFeedback($a,$b){
    $res=[];
    $res["status"]=$a;
    $res["msg"]=$b;
    return json_encode($res);
}