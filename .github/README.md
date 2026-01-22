<div align="center">
  <img src="../docs/assets/social.png" width=600 alt="Dyslexia PDF Reader">  
  
  ![License](https://img.shields.io/github/license/threecatswink/dyslexia-pdf-reader)
  ![Stars](https://img.shields.io/github/stars/threecatswink/dyslexia-pdf-reader)
  ![Issues](https://img.shields.io/github/issues/threecatswink/dyslexia-pdf-reader)
</div>

# Dyslexia PDF Reader

A free, web-based PDF accessibility tool for people with reading disabilities such as dyslexia.
More can be found at the [about](https://threecatswink.github.io/Dyslexia-PDF-Reader/about) page.
The project largely uses React, Vite, Zustand, and PDF.js as dependencies to run.

## Get Started

1. Open the [website](https://threecatswink.github.io/Dyslexia-PDF-Reader/)
2. Press the folder button
3. Select the PDF you wish to view
4. Select your preferred readability settings
5. Enjoy

## Features

- OpenDyslexic Font Overlay
- Bolding the first half of every word
- Making every word's first letter a larger font size (accent)
- Text-to-Speech
- Page navigation
- Zoom navigation
- Save settings automatically
- Full ARIA Accessibility

## What It Does

It loads whatever your PDF document is. After enabling Dyslexia mode, the document will be overlaid with OpenDyslexic Font text.
There are other settings to modify the text further, whether you like having bigger letters at the beginning of the word to help track where you are,
or maybe you want the first half of the words to be bold to help read faster, this app does all of that, and uses your browser's TTS.
PWA allows your browser to remember what your preferred settings are so they are right there when you come back.

## Documentation

### Access Keys

The toolbar uses a variety of `accesskeys` that allow for quick use of the viewer by the user.
These include the following (combination of alt, shift, and option may depend on device or browser)

> [!NOTE]
> Combinations of CTRL, ALT, and SHIFT will depend on what browser you are using.

| Keybind    | Description                                                  |
| :--------- | :----------------------------------------------------------- |
| Access + o | Requests a PDF file input                                    |
| Access + [ | Presses the _previous page_ button                           |
| Access + p | Lets you enter a _page number_ to travel to in your document |
| Access + ] | Presses the _next page_ button                               |
| Access + - | Presses the _zoom out_ button                                |
| Access + = | Presses the _zoom in_ button                                 |
| Access + r | Toggles Text-to-Speech                                       |
| Access + s | Presses the _viewer settings_ button                         |
