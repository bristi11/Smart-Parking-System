#include <SPI.h>
#include <MFRC522.h>
#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266HTTPClient.h>
#include <MFRC522.h>
#include <Servo.h> 
#include <ArduinoHttpClient.h>

Servo s1;
// pinMode(D0, OUTPUT) ; //red
// pinMode(D1, OUTPUT) ; //green

const char *ssid = "MGLBRI 4G"; //Enter your WIFI ssid
const char *password = "mglbri1234"; //Enter your WIFI password
const char *server_url = "http://192.168.29.65:3000/postData";
String server = "http://192.168.29.65:3000/getMessage";
//http.begin();

WiFiClient Client;
HTTPClient http;

#define RST_PIN   D2   // Reset pin (GPIO 2)
#define SS_PIN    D8   // Slave Select pin (GPIO 15)

MFRC522 mfrc522(SS_PIN, RST_PIN);  // Create MFRC522 instance
int statuss = 0;
int out = 0;
String card="";
void setup() {
  Serial.begin(9600);  // Initialize serial communication
  SPI.begin();           // Initialize SPI bus
  mfrc522.PCD_Init();    // Initialize MFRC522 RFID reader
  s1.attach(0);
  pinMode(D0,OUTPUT);
  pinMode(D1,OUTPUT);
   WiFi.begin(ssid, password);
   while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
   }
   Serial.println("WiFi connected");
   delay(1000);
   http.begin(Client, server);
  Serial.println("Scan RFID card");
}

void loop() {
  pinMode(D0,LOW);
  pinMode(D1,LOW);
  // Check if a new card is detected
  if (mfrc522.PICC_IsNewCardPresent() && mfrc522.PICC_ReadCardSerial()) {
    // Print UID (Unique Identifier) of the card
    Serial.print("UID: ");
    for (byte i = 0; i < mfrc522.uid.size; i++) {
      Serial.print(mfrc522.uid.uidByte[i] < 0x10 ? "0" : "");
      Serial.print(mfrc522.uid.uidByte[i], HEX);
      card+=String(mfrc522.uid.uidByte[i], HEX);
    }
    Serial.println();

    mfrc522.PICC_HaltA();    // Halt the card
    mfrc522.PCD_StopCrypto1(); // Stop encryption on the card
    //content.toUpperCase();

    String res=datapost(card);
    delay(5000);
  Serial.print("ata holo tomar dake shara : "+res);
  
  //if dhukbe
  if(res=="1"){
    pinMode(D1,HIGH);
    pinMode(D1, HIGH) ;
    delay (1000) ;
    pinMode(D1, LOW) ;
    s1.write(0);  
    delay(1000);  
    s1.write(-200);  
    delay(2000); 
    s1.write(120);  
    delay(3000);
  }
  else{
    pinMode(D0,HIGH);
    delay(1000);
    pinMode(D0,LOW);
  }
  if (Serial.available()) {
    // Read the incoming data from Node.js
    char incomingData = Serial.read();
    
    Serial.println("The data is:"+incomingData);
  }
  Serial.println(http.getString());
  }
}

String datapost(String value){
  http.begin(Client, server_url);
    http.addHeader("Content-Type", "application/x-www-form-urlencoded");
   String data="&card=" + String(value);
   Serial.println(data);
    int httpCode = http.POST(data);
    String val=http.getString();

    if(httpCode > 0){
      if (httpCode == HTTP_CODE_OK || httpCode == HTTP_CODE_MOVED_PERMANENTLY) {
          String payload = http.getString();
          Serial.print("Response: ");//Serial.println(payload);
        }
    }else{
         Serial.printf("[HTTP] GET... failed, error: %s");
    }
    card="";
    http.end();
  return val;
}