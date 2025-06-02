<?php
require 'openRouter.php';
require 'vendor/autoload.php';

use GuzzleHttp\Client;

$client = new Client();

$response = $client->get('https://openrouter.ai/api/v1/models/qwen/qwen3-235b-a22b/endpoints');

$data = json_decode($response->getBody(), true);

echo "<pre>";
print_r($data);
echo "</pre>";
