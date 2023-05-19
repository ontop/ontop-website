# MS SQLServer

Through the [MS SQLServer](https://www.microsoft.com/en-us/sql-server) connector, Ontop is able to construct VKGs on SQLServer databases.


## Limitations & Exceptions

- RegEx SPARQL functions are not supported.
- The `position` argument for the [Flatten Lens](/guide/advanced/lenses#flattenlens) cannot be used with SQLServer.

## Database Connection

The following shows the content of a sample `.properties` file that can be used to connect Ontop to SQLServer:

```bash
jdbc.url = jdbc:sqlserver://localhost:1433;databaseName=defaultdatabase
jdbc.user = user
jdbc.password = password
jdbc.driver = com.microsoft.sqlserver.jdbc.SQLServerDriver
```

## Nested Type Support

Nested data types are not supported by SQLServer. However, Ontop allows the usage of the [flatten lens](/guide/advanced/lenses#flattenlens) over string columns that contain JSON-encoded arrays. The output type of the flattened result column cannot be inferred. 

:::warning
The `position` argument for flatten lenses cannot be used with SQLServer.
:::

In case the flattened column is still a nested structure after the flatten operation is performed (e.g. for arrays of objects), [SQLServer's JSON functions](https://learn.microsoft.com/en-us/sql/t-sql/functions/json-functions-transact-sql?view=sql-server-ver16) can be used to further work with them.