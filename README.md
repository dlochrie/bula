bulajs
============

_Bula_ means _hello_ in Fijian. **Bula!**

## DB

Example config:

    mysql> CREATE DATABASE bula;
    mysql> GRANT ALL PRIVILEGES ON bula.* TO "bula"@"localhost" IDENTIFIED BY "bulapass";
    mysql> FLUSH PRIVILEGES;
    mysql> EXIT

## Test

### Installed Application

    npm test


## Troubleshooting

If you get `Error: req.flash() requires sessions`, it most likely means that
the server cannot connect to `redis`.



