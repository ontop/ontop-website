# MariaDB
*Supported since 5.0.0.*

Through the [MariaDB](https://mariadb.com) connector, Ontop is able to construct VKGs on MariaDB databases.

## Limitations & Exceptions

- String literals have to be encased in _single quotes_ (`'`). Double quote string literals (`"`) are not supported.

## Database Connection

The following shows the content of a sample `.properties` file that can be used to connect Ontop to MariaDB:

```bash
jdbc.url = jdbc:mariadb://localhost:3306/defaultdatabase
jdbc.user = user
jdbc.password = password
jdbc.driver = org.mariadb.jdbc.Driver
```

## Nested Type Support

Ontop implements explicit compatibility with the MariaDB type `JSON` which can be used with the [flatten lens](/guide/advanced/lenses#flattenlens). However, it cannot infer the type of the flattened result column.

In case the flattened column is still a nested structure after the flatten operation is performed (e.g. for arrays of objects), [MariaDB's JSON functions](https://mariadb.com/kb/en/json-functions/) can be used to further work with them.