#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
int a,b,k=0,c=0,check1=0,check2=0;
String flag = "0";
 
const char* ssid = "NETGEAR71";
const char* password =  "cleverwindow601";
 
void setup() {
 
  pinMode(32,INPUT);
  pinMode(33,INPUT);
  pinMode(4,OUTPUT);
  pinMode(17,OUTPUT);
  digitalWrite(4,HIGH);
  digitalWrite(17,HIGH);
  Serial.begin(115200);
  delay(4000);
  WiFi.begin(ssid, password);
 
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi..");
  }
 
  Serial.println("Connected to the WiFi network");
 
}
 
void loop()
{ 
    a = analogRead(32);
    b = analogRead(33);
    if((k==0)&&(c>=1300)&&(abs(a-b)>=1300))
      {
        k=1;
        if ((WiFi.status() == WL_CONNECTED)) { //Check the current connection status
        HTTPClient http;
        http.begin("http://192.168.1.3/api/gotblink"); //Specify the URL
        int httpCode = http.GET();                                        //Make the request
//        if (httpCode > 0)
//        { //Check for the returning code
//             String payload = http.getString();
//            Serial.println(httpCode);
//            Serial.println(payload);
//        }
//        else 
//        {
//          Serial.println("Error on HTTP request");
//        } 
        http.end(); //Free the resources
        }
      }
    if(c==0)
      k=0;
    c = abs(a-b);
    Serial.println(abs(a-b));


  if (WiFi.status() == WL_CONNECTED) { //Check WiFi connection status
 
    StaticJsonBuffer<300> JSONbuffer;   //Declaring static JSON buffer
    JsonObject& JSONencoder = JSONbuffer.createObject(); 
 
    JSONencoder["Value"] = a;
    char JSONmessageBuffer[300];
    JSONencoder.prettyPrintTo(JSONmessageBuffer, sizeof(JSONmessageBuffer));
    //Serial.println(JSONmessageBuffer);

    HTTPClient http;//Declare object of class HTTPClient

    http.begin("http://192.168.1.3/api/switching");      //Specify request destination
    http.addHeader("Content-Type", "application/json");  //Specify content-type header
 
    int httpCode1 = http.POST(JSONmessageBuffer);   //Send the request
    String payload1 = http.getString();                                        //Get the response payload
    
    //Serial.println(httpCode1);   //Print HTTP return code
    //Serial.println(payload1);    //Print request response payload




    if(payload1 == flag){
      digitalWrite(17,HIGH);
    }
    else {
      digitalWrite(17,LOW);
      }
    
    http.end();  //Close connection    
    http.begin("http://192.168.1.3/api/switching2");      //Specify request destination
    http.addHeader("Content-Type", "application/json");  //Specify content-type header
 
    int httpCode2 = http.POST(JSONmessageBuffer);   //Send the request
    String payload2 = http.getString();                                        //Get the response payload
    
    //Serial.println(httpCode2);   //Print HTTP return code
    //Serial.println(payload2);    //Print request response payload

    if(payload2 == flag){
      digitalWrite(4,HIGH);
    }
    else {
      digitalWrite(4,LOW);
      }
      http.end();  //Close connection   
  
  } 
//  else {
//    Serial.println("Error in WiFi connection");
//  }
}

