# MySQL

Through the [MySQL](https://mysql.com) connector, Ontop is able to construct VKGs on MySQL databases.

## Limitations & Exceptions

- String literals have to be encased in _single quotes_ (`'`). Double quote string literals (`"`) are not supported.
- Accessing JSON object fields with the "dot operator" is not supported (see below).

## Database Connection

The following shows the content of a sample `.properties` file that can be used to connect Ontop to MySQL:

```bash
jdbc.url = jdbc:mysql://localhost:3306/defaultdatabase
jdbc.user = user
jdbc.password = password
jdbc.driver = com.mysql.cj.jdbc.Driver
```

## Nested Type Support

Ontop implements explicit compatibility with the MySQL type `JSON` which can be used with the [flatten lens](/guide/advanced/lenses#flattenlens). However, it cannot infer the type of the flattened result column.

In case the flattened column is still a nested structure after the flatten operation is performed (e.g. for arrays of objects), [MySQL's JSON functions](https://dev.mysql.com/doc/refman/8.0/en/json-functions.html) can be used to further work with them.

:::warning
Accessing object fields using the "arrow operator" is not supported.
:::