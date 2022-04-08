<?php

function generate_token($payload, $secret = 'magique') {	
	$payload_encoded = base64_encode(json_encode($payload));
	
	$signature = hash_hmac('SHA256', "$payload_encoded", $secret, true);
	$signature_encoded = base64_encode($signature);
	
	$token = "$payload_encoded.$signature_encoded";
	
	return $token;
}

function is_token_valid($token, $secret = 'magique') {
	// split the jwt
	$tokenParts = explode('.', $token);
	$payload = base64_decode($tokenParts[0]);
	$signature_provided = $tokenParts[1];

	// build a signature based on the header and payload using the secret
	$base64_payload = base64_encode($payload);
	$signature = hash_hmac('SHA256', $base64_payload, $secret, true);
	$base64_signature = base64_encode($signature);

	// verify it matches the signature provided in the jwt
	$is_signature_valid = ($base64_signature === $signature_provided);
	
	if ($is_signature_valid) {
		return true;
	} else {
		return false;
	}
}

function get_username_from_token($token) {
  $tokenParts = explode('.', $token);
  $username = base64_decode($tokenParts[0]);
  return $username;
}

