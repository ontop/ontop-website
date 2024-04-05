# MySQL

Through the [MySQL](https://mysql.com) connector, Ontop is able to construct VKGs on MySQL databases.

## Limitations & Exceptions

- String literals have to be encased in _single quotes_ (`'`). Double quote string literals (`"`) are not supported.
- Accessing JSON object fields with the "dot operator" is not supported (see below).
- MySQL 5.x comes with some limitations (e.g. no anonymous bnode support, no regexp replace, no nested data support). MySQL 5.x reached its end-of-life, so please consider upgrading.

## Database Connection

The following shows the content of a sample `.properties` file that can be used to connect Ontop to MySQL:

```bash
jdbc.url = jdbc:mysql://localhost:3306/defaultdatabase?useCursorFetch=true
jdbc.user = user
jdbc.password = password
jdbc.driver = com.mysql.cj.jdbc.Driver
```

:::warning
The parameter `useCursorFetch=true` needs to be added to the JDBC URL for streaming to be enabled. Otherwise, the JDBC driver will block until the full result set is fetched, which may cause out-of-memory exceptions when materializing or running large queries.
:::


## Nested Type Support

Ontop implements explicit compatibility with the MySQL type `JSON` which can be used with the [flatten lens](/guide/advanced/lenses#flattenlens). However, it cannot infer the type of the flattened result column.

In case the flattened column is still a nested structure after the flatten operation is performed (e.g. for arrays of objects), [MySQL's JSON functions](https://dev.mysql.com/doc/refman/8.0/en/json-functions.html) can be used to further work with them.

:::warning
Accessing object fields using the "arrow operator" is not supported.
:::

:::warning
Nested type only supported for MySQL >= 8.0
:::
