#include <Adafruit_NeoPixel.h> //install Adafruit NeoPixel library first

#define PIN 9   // to DIN / DataIN pin on first board
#define NUMPIXELS 32  // total number of pixels for two boards

Adafruit_NeoPixel pixels(NUMPIXELS, PIN, NEO_GRB + NEO_KHZ800); //init

const uint32_t matrixColors[32] = {
  0xFF0000, 0xFBAD28, 0xFBF428, 0x60FB28, 0x2895FB, 0x60FB28, 0xFBF428, 0xFBAD28, 0xFBF428, 
  0x60FB28, 0x2895FB, 0x001EFF, 0x7300FF, 0x001EFF, 0x2895FB, 0x60FB28, 0xFFFFFF, 0x00FFE1, 
  0xFFFFFF, 0x00FFE1, 0xFFFFFF, 0x00FFE1, 0xFFFFFF, 0x00FFE1, 0xFFFFFF, 0x00FFE1, 0xFFFFFF, 
  0x00FFE1, 0x000000, 0x000000, 0x000000, 0x000000
};  // colour matrix for 32 LEDs

void setup() {
  pixels.begin();
  pixels.setBrightness(5); // low brightness to prevent blindness
}

void loop() {
  for (int i = 0; i < 32; i++) {
    pixels.setPixelColor(i, matrixColors[i]); //assign colours to all LEDs
  }
  pixels.show(); //display on Neo16
}