PongJS
======

This project is a simple Multiplayer Pong in order to understand how to make network communication in video game development.

Why NodeJS
----------

In this project I chose to use NodeJS for the Backend development. This choice was made because NodeJS is designed for aynchronous communication that feet perfectly with our needs. Indeed, the network communication for a videogame is based on this feature. So, using events based programming on the bottom level we have a very fast and clean way of making everything work.

Why Socket.IO
-------------

Socket.IO is an overlying layer of NodeJS offering the possibility to use easily Websockets. This feature is necessary in our case because we need a realtime communication between our clients in order to synchronize all the mechanics of the game. Websockets offers this feature and more. The only drawback is that it is not totally supported by all browsers like Internet Explorer for example.

Why ExpressJS
-------------

ExpressJS is a framework working on top of NodeJS in order to ease all web related development thanks to middlewares and useful functions. It is very similar to Django for Python, Rail for Ruby or Zend Framework for PHP without the Object Related Manager features. In our case this framework is useful for complexe web mechanics like sessions management, csrf protection and more.

How to install
--------------

Fork/Clone the game repository :

```
git clone https://github.com/FlyersWeb/PongJS.git
```

Next install all necesarry modules :

```
cd PongJS && npm install
```

And launch the server :

```
node web.js
```

And that's it :)

Contact
-------

@flyersweb

http://www.flyers-web.org


