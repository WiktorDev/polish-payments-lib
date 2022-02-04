<?php
class HashCalculator {

  private $signatureKey = "adfd3c8c-5112-4719-9a73-def142721a3d";

  public function calculateHmac($data) {
    return base64_encode(hash_hmac("sha256", $data, $this->signatureKey, true));
  }
}


$paymentData = [
  'amount' => '100',
  'currency' => 'PLN',
  'externalId' => 'test',
  'description' => 'Payment description',
  'buyer' => [
      'email' => 'customer@domain.com'
  ]
];

$hashCalculator = new HashCalculator();
$calculatedHash = $hashCalculator->calculateHmac(json_encode($paymentData));
echo json_encode($paymentData);