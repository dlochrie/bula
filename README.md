bulajs
============

## Bula!

_Bula_ means _hello_ in Fijian. **Bula!**

Bula is a ready-made express-based application using MySQL. There is plenty more
to come soon, but the idea is to have an installable application using MySQL,
Redis, and Angular, complete with tests and docs. Hence, _more to come_.

### Install

#### Quick Install

The following:

    node bin/bula.js -a 'My Application' -p ~/Desktop

Gets you:

    ~/Desktop/my-application

So:

    node bin/bula.js -a 'My Application' -p ~/Desktop
    cd ~/Desktop/my-application
    npm install
    source ./config/variables.txt*
    node app

...installs the app, its dependencies, and starts it.

*Make sure that you set up the environmental variables. See below for more
information.


### Environmental Variables

Bula assumes 3 different environments:

`dev`, `test`, and `prod`, but you can name them whatever you want. During installation,
the installer provides a basic template for your enviromental vars: 

    config/variables.txt  

This file contains a basic setup for your environmental variables. Replace the 
configuration with those that suit your preferences. You can either source them from 
the file directly,or store them wherever your OS stores its environmental variables. See 
[this link](http://daniellochrie.com/blog/fun-with-environmental-variables) for more 
info concerning Environmental Variables.


### DB

Example config:

    mysql> CREATE DATABASE bula;
    mysql> GRANT ALL PRIVILEGES ON bula.* TO "bula"@"localhost" IDENTIFIED BY "bulapass";
    mysql> FLUSH PRIVILEGES;
    mysql> EXIT

### Test

To run the `bula` test:

    // To be written.

To run the locally installed application's tests:
(requires that create a `test` database)

    npm test

### Troubleshooting

#### `Error: req.flash() requires sessions`

If you get `Error: req.flash() requires sessions`, it most likely means that
the server cannot connect to `redis`.
