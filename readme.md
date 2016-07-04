[![Build Status](https://travis-ci.org/webRunes/WRIO-InternetOS.svg?branch=master)](https://travis-ci.org/webRunes/WRIO-InternetOS)

#WRIO <sup>Internet OS</sup>
WRIO - webRunes Input/Output.
(coming soon)


##Official Hub
[wrioos.com](https://wrioos.com)

###Multilingual support
Esperanto and English are primary languages. Yet, since the project is developed by natives of the former USSR, the third language is Russian. To write issues you can choose any of them.
https://
[more coming soon]

# Description

Main front end repository, compiled files are start.js and main.js 

Example html file, using start.js script:
```
<!DOCTYPE html>
<html>
    <head>
        <title>webRunes example</title>
        <script type="application/ld+json">....</script>
        <script type="application/ld+json">....</script>
        <script type="application/ld+json">....</script>
    </head>
    <body>
        <script type="text/javascript" src="https://wrioos.com/start.js"></script>
    </body>
</html>
```

Скрипт start.js размещается в конце html файла, он загружает JSON-LD описание страницы из секций ```<script type="application/ld+json">```, обрабатывает JSON-LD и динамически генерирует страницу.
Каждый html файл может содержать до 3х JSON-LD секций.

start.js является загрузчиком, он проверяет браузер на совместимость, производит предварительные проверки а затем загружает main.js, в котором находится основной код.

# Contributing

To start development theese are few useful links 

[How to setup development process on local machine] (https://github.com/webRunes/WRIO-local-dev)
[Описание инфраструктуры](https://github.com/webRunes/WRIO-InternetOS/wiki/Infrastructure)

Powered by [Open Copyright](https://opencopyright.wrioos.com)
