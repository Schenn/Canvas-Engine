<?php
$data =[
  "jsonrpc"=>"2.0",
  "method"=>"generateIntegers",
  "params"=>[
    "apiKey"=>"e9d089da-8131-4270-b8f7-5f0dbb64cfa7",
    "n"=>1200,
    "min"=>1,
    "max"=>255,
  ],
  "id"=>115
];
$data_string = json_encode($data);


$ch = curl_init('https://api.random.org/json-rpc/1/invoke');
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    'Content-Type: application/json',
    'Content-Length: ' . strlen($data_string))
);

$result = curl_exec($ch);

echo $result;

