#include <Adafruit_NeoPixel.h>
#ifdef __AVR__
 #include <avr/power.h> // Required for 16 MHz Adafruit Trinket
#endif

#define LED_PIN   6
// How many NeoPixels are attached to the Arduino?
#define LED_COUNT 7

// protocol can be:
// 0 => normal
// 1 => hightlight
// 2 => solo
int protocol = 0;
// for highlight protocol
const int NUM_CLIENTS = 8;
int highlightNumber = 0;
int highlightList[NUM_CLIENTS];

// for solo protocol
int soloIndex = 0;
int soloHasBeat = 0; // 1 if playing

int TRIGGER_DURATION = 100; // ms
boolean newData = false;

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
  pixels.setBrightness(50);
}

void loop() {
  receiveData();

  if (newData) {
    switch (protocol) {
      case 0:
        triggerNormalBeat();
        break;
      case 1:
        triggerHighlightBeat();
        break;
      case 2:
        triggerSoloBeat();
        break;
    }

    newData = false;
  }

  delay(20);
}

void receiveData() {
  static char endMarker = '\n'; // message separator
  char receivedChar;     // read char from serial port
  int receivedInt;
  int index = 0;          // current index of data buffer

  // read while we have data available and we are still receiving the same message.
  while(Serial.available() > 0) {
    receivedChar = Serial.read();

    if (receivedChar == endMarker) {
      // data[index] = '\0'; // end current message
      newData = true;
      return;
    }

    receivedInt = receivedChar - '0';

    if (index == 0) {
      protocol = receivedInt;
    }

    switch (protocol) {
      case 1: // highlight
        if (index == 0) {
          highlightNumber = 0;
        } else {
          highlightList[highlightNumber] = receivedInt;
          highlightNumber += 1;
        }
        break;
      case 2:
        if (index == 1) {
          soloIndex = receivedInt;
        } else if (index == 2) {
          soloHasBeat = receivedInt;
        }
        break;
    }


    index++;
    delay(1);
  }
}

void triggerNormalBeat() {
  Serial.println("triggerNormalBeat");
  pixels.clear();

  // int color = floor(random(0.0, 1000.0) / 1000.0 * 256.0);
  // Serial.println(color);

  for (int i = 0; i < pixels.numPixels(); i++) {
    pixels.setPixelColor(i, pixels.Color(255, 255, 255));
  }

  pixels.show();
  delay(TRIGGER_DURATION);
  Serial.println("triggerNormalBeat::clear");

  for (int i = 0; i < pixels.numPixels(); i++) {
    pixels.setPixelColor(i, pixels.Color(0, 0, 0, 0));
  }

  pixels.show();
  pixels.clear();
}

void triggerHighlightBeat() {
  Serial.println("triggerHighlightBeat");
  pixels.clear();

  uint32_t white = pixels.Color(0, 0, 0, 255);
  // paint everything in white
  for (int i = 0; i < pixels.numPixels(); i++) {
    pixels.setPixelColor(i, white);
  }

  // override with highlighted clients
  for (int i = 0; i < highlightNumber; i++) {
    int clientIndex = highlightList[i];
    pixels.setPixelColor(clientIndex, colors[clientIndex]);
  }

  pixels.show();
  delay(TRIGGER_DURATION);

  for (int i = 0; i < pixels.numPixels(); i++) {
    pixels.setPixelColor(i, pixels.Color(0, 0, 0, 0));
  }

  pixels.show();
  // pixels.clear();
}


void triggerSoloBeat() {
  // soloIndex
  // soloHasBeat
  Serial.println("triggerSoloBeat");
  Serial.println(soloIndex);
  pixels.clear();

  uint32_t soloColor = colors[soloIndex];
  uint32_t white = pixels.Color(0, 0, 0, 255);

  Serial.println(soloColor);

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
