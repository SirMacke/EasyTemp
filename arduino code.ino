#include <ArduinoJson.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <AM2320.h>
#include <SH1106Wire.h>

#define ID 2

//button pin
const int button = 15;

const int postDelay = 10000;
const int screenDelay = 500;
const int screenOnTime = 20000;
const int sensorDelay = 2500;
unsigned long timerPost = 0;
unsigned long timerScreen = 0;
unsigned long timerScreenOnTime = 0;
unsigned long timerSensor = 0;

// starts the display and sensor
SH1106Wire display (0x3c, 14, 12, GEOMETRY_128_64, I2C_ONE, 100000);
AM2320 sensor;

//the json content
float temperature;
float humidity;


//WiFi info
const char* ssid = "ABB_Indgym_Guest";
const char* password = "Welcome2abb";

//Set url
String URL = "http://easytemp.herokuapp.com/room/";

//a bunch of http stuff
String data;
String prettyData;
String payload;

void setup() {
  initialize();
  wifi();
  pinMode(button, INPUT);
}

void loop() {
  if (digitalRead(button)) {
    timerScreenOnTime = millis();
  }

  //Serial.println(); //for debugging
  // Serial.println(timerScreenOnTime); //for debugging

  if (millis() - timerSensor > sensorDelay) {
    timerSensor = millis();
    sensorMeasure();
    }


  if (millis() - timerScreenOnTime < screenOnTime) {
    // Serial.println("on"); // for debugging
    if (millis() - timerScreen > screenDelay) {
      Serial.print(".");
      timerScreen = millis();
      draw();
    }
  }
  else {
    // Serial.print("off"); // for debugging
    display.clear();
    display.display();
  }
  if (millis() - timerPost > postDelay) {
    Serial.println("post");
    timerPost = millis();
    json();
    post();

  }
  // delay(100); // for debuggin, normally not nessecary since i use a custom nonbraking delay
}

void initialize() { // intializes the screen and sensor
  Serial.begin(115200);
  sensor.begin(14, 12);

  display.setFont(ArialMT_Plain_16);
  display.init();
  display.flipScreenVertically();
}

void wifi() { // connects to the wifi
  WiFi.begin(ssid, password);
  int tries = 1;
  while (WiFi.status() != WL_CONNECTED) {
    display.clear();
    delay(1000);
    Serial.print("Connecting... ");
    display.drawString(0, 0, "Connecting");
    display.drawString(0, 14, String(tries));
    display.display();
    tries += 1;
  }
}

void json() { // creates the json
  Serial.println("Starting JSON");
  data = "";
  prettyData = "";
  StaticJsonDocument<100> doc;
  //  char* json = "{\"arduinoId\":0,\"temperature\":0,\"humidity\":0}";
  //  deserializeJson(doc, json);
  doc["arduinoId"] = ID;
  doc["temperature"] = temperature;
  doc["humidity"] = humidity;
  serializeJson(doc, Serial);
  serializeJson(doc, data);
  serializeJsonPretty(doc, prettyData);
}

void post() { // posts the data string
  HTTPClient http;

  if (WiFi.status() == WL_CONNECTED) {
    //Specify request destination
    http.begin(URL);
    http.addHeader("Content-Type", "application/json");

    //Send the request
    int httpCode = http.POST(data);

    //Check the returning code
    if (httpCode > 0) {
      //Get the request response payload
      payload = http.getString();
      //Print the response payload
      Serial.println(payload);
    }
    //Close connection
    http.end();
  }
}

void sensorMeasure() { // updates the readings from the sensor
  sensor.measure();
  humidity = sensor.getHumidity();
  temperature = sensor.getTemperature();
  Serial.println("measure");
}

void draw() { // draws the things on screen, its in its own function since theres alot of them
  display.clear();
  display.setFont(ArialMT_Plain_10);
  display.drawString(-6, -12, String(prettyData));
  display.drawString(123, 0, String(10 - (millis() - timerPost) / 1000));
  display.drawString(0, 42, String(payload));
  display.drawString(108, 10, String(temperature));
  display.drawString(108, 20, String(humidity));
  display.drawString(117, 30, String((20-(millis() - timerScreenOnTime)/1000)));
  display.drawString(0, 54, String(millis()/1000));
  display.display();
}
