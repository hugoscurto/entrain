#include <Adafruit_NeoPixel.h>
#ifdef __AVR__
 #include <avr/power.h> // Required for 16 MHz Adafruit Trinket
#endif

#define LED_PIN   6
// How many NeoPixels are attached to the Arduino?
#define LED_COUNT 56

const int NUM_LIGHTS = 8;
const int NUM_LEDS_PER_LIGHT = 7;
const int NUM_CLIENTS = 8;

// protocol can be:
//    0 => normal
//    1 => hightlight
//    2 => solo
int protocol = 0;
// for highlight protocol
int highlightList[NUM_CLIENTS];

// for solo protocol
int soloIndex = 0;
int soloHasBeat = 0; // 1 if playing

int TRIGGER_DURATION = 20; // ms
boolean newData = false;

// luminosity
int brightness = 255;

Adafruit_NeoPixel pixels(LED_COUNT, LED_PIN, NEO_RGBW + NEO_KHZ800);

uint32_t colors[NUM_CLIENTS] = {
  pixels.Color(0, 255, 0),
  pixels.Color(255, 0, 85),
  pixels.Color(62, 2, 255),
  pixels.Color(255, 255, 0),
  pixels.Color(2, 216, 255),
  pixels.Color(255, 0, 245),
  pixels.Color(2, 255, 121),
  pixels.Color(145, 255, 0)
};

void setup() {
  Serial.begin(9600);
  Serial.print("setup: ");
  Serial.println(LED_PIN);
  Serial.println(pixels.numPixels());
  // pinMode(LED, OUTPUT);
  pixels.begin(); // INITIALIZE NeoPixel strip object (REQUIRED)
  pixels.show();            // Turn OFF all pixels ASAP
  pixels.setBrightness(brightness);
}

void loop() {
  receiveData();

  if (newData) {
    switch (protocol) {
      case 0: // normal
        triggerNormalBeat();
        break;
      case 1: // highlight
        triggerHighlightBeat();
        break;
      case 2: // solo
        triggerSoloBeat();
        break;
      case 3:
        pixels.setBrightness(brightness);
        pixels.show();
        break;  
    } 

    newData = false;
  }

  delay(20);
}

int receivedIndex = 0;          // current index of data buffer

void receiveData() {
  static char endMarker = '\n'; // message separator
  char receivedChar;     // read char from serial port
  int receivedInt;

  // read while we have data available and we are still receiving the same message.
  while(Serial.available() > 0) {
    receivedChar = Serial.read();

    if (receivedChar == endMarker) {
      // Serial.println("endMessage");
      // data[index] = '\0'; // end current message
      receivedIndex = 0;
      newData = true;
      return;
    }

    receivedInt = receivedChar - '0';

    if (receivedIndex == 0) {
      protocol = receivedInt;
    }

    switch (protocol) {
      case 1: // highlight
        if (receivedIndex > 0) {
          // 0 is off
          // 1 is on with client color at client index
          // 2 is same as one with flash
          highlightList[receivedIndex - 1] = receivedInt;
        }
        break;
      case 2: // solo
        if (receivedIndex == 1) {
          soloIndex = receivedInt;
        } else if (receivedIndex == 2) {
          soloHasBeat = receivedInt;
        }
        break;
      case 3: // brightness
        brightness = floor((receivedInt / 9.0) * 255.0);
        Serial.print("update brightness: ");
        Serial.println(brightness);
        break;
    }


    receivedIndex++;
    delay(4);
  }
}

void triggerNormalBeat() {
  // Serial.println("BEAT");
  uint32_t white = pixels.Color(0, 0, 0, 1);

  for (int i = 0; i < pixels.numPixels(); i++) {
    pixels.setPixelColor(i, white);
  } 

  pixels.show();
}

void triggerHighlightBeat() {
  // Serial.println("HIGHLIGH");
  // for (int i = 0; i < NUM_CLIENTS; i++) {
  //   Serial.print(highlightList[i]);
  //   Serial.print(", ");
  // }
  // Serial.println("");
  // override with highlighted clients
  for (int i = 0; i < NUM_CLIENTS; i++) {
    int ledStartIndex = i * 7;
    int state = highlightList[i];
    uint32_t color;
    if (state == 0) {
      color = pixels.Color(0, 0, 0, 0); // nothing
    } else if (state == 1) {
      color = colors[i];
    } else if (state == 2) {
      color = pixels.Color(0, 0, 0, 255);
    }

    for (int j = ledStartIndex; j < ledStartIndex + 7; j++) {
      pixels.setPixelColor(j, color);
    }
  }

  pixels.show();

  for (int i = 0; i < NUM_CLIENTS; i++) {
    int ledStartIndex = i * 7;
    int state = highlightList[i];

    if (state == 2) {
      delay(TRIGGER_DURATION);
      // back to client color after flash
      uint32_t color = colors[i];
      for (int j = ledStartIndex; j < ledStartIndex + 7; j++) {
        pixels.setPixelColor(j, color);
      }
    }
  }

  pixels.show();
}


void triggerSoloBeat() {
  // Serial.println("SOLO");
  uint32_t soloColor = colors[soloIndex];
  uint32_t white = pixels.Color(0, 0, 0, 255);

  if (soloHasBeat == 0) {
    for (int i = 0; i < pixels.numPixels(); i++) {
      pixels.setPixelColor(i, soloColor);
    }
    pixels.show();
  } else {
    // paint everything in white
    for (int i = 0; i < pixels.numPixels(); i++) {
      pixels.setPixelColor(i, white);
    }

    pixels.show();

    delay(TRIGGER_DURATION);

    for (int i = 0; i < pixels.numPixels(); i++) {
      pixels.setPixelColor(i, soloColor);
    }
    
    pixels.show();
  }
}
