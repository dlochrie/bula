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
    node app

...installs the app, its dependencies, and starts it.

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
