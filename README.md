The source code of the demo for external protocol flooding **vulnerability**. Allows arbitrary websites to gather information about installed applications on a victim's computer in order to perform reliable tracking across different desktop browsers.

This repository is created for **research** and **educational** purposes only.
Consider reading the [original article](http://fingerprint.com/blog/external-protocol-flooding/) about research.

## Target Browsers

The demo was successfuly tested on the following browsers and operating systems:

- **Chrome** 90 (Windows 10, macOS Big Sur)
- **Firefox** 88.0.1 (Ubuntu 20.04, Windows 10, macOS Big Sur)
- **Safari** 14.1 (macOS Big Sur)
- **Tor Browser** 10.0.16 (Ubuntu 20.04, Windows 10, macOS Big Sur)
- **Brave** 1.24.84 (Windows 10, macOS Big Sur)
- **Yandex Browser** 21.3.0 (Windows 10, macOS Big Sur)
- **Microsoft Edge** 90 (Windows 10, macOS Big Sur)

The vulnerability can already be fixed by the time you find this repository.

## Technical overview

The scheme flooding vulnerability allows an attacker to determine which applications you have installed. In order to generate a 32-bit cross-browser device identifier, a website can test a list of 32 popular applications and check if each is installed or not. On average, the identification process takes a few seconds and works across desktop Windows, Mac and Linux operating systems.

To check if an application is installed, browsers can use built-in custom URL scheme handlers. You can see this feature in action by entering `skype://` in your browser address bar. If you have Skype installed, your browser will open a confirmation dialog that asks if you want to launch it. This feature is also known as deep linking and is widely used on mobile devices, but is available within desktop browsers as well. Any application that you install can register its own scheme to allow other apps to open it.

To make this vulnerability possible, the following steps are required:

- Prepare a list of application URL schemes that you want to test. The list may depend on your goals, for example, if you want to check if some industry or interest-specific applications are installed.
- Add a script on a website that will test each application from your list. The script will return an ordered array of boolean values. Each boolean value is `true` if the application is installed or `false` if it is not.
- Use this array to generate a permanent cross-browser identifier.
- Optionally, use machine learning algorithms to guess your website visitors’ occupation, interests, and age using installed application data.

The actual implementation of the exploit varies by browser, however the basic concept is the same. It works by asking the browser to show a confirmation dialog in a popup window. Then the JavaScript code can detect if a popup has just been opened and detect the presence of an application based on that.

## Authors

* https://github.com/spalt08

⚡ **Join our team to work on exciting research in online security: [work@fingerprintjs.com](mailto:work@fingerprintjs.com)**

This repository is MIT licensed.

Copyright 2021 FingerprintJS, Inc
