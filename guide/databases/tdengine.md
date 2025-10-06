# TDengine
*Supported since 5.4.0.*

Through the [TDengine](https://tdengine.com) connector, Ontop is able to construct VKGs on TDengine databases.

## Limitations & Exceptions
- Being a time-series database, TDengine expects that all tables have as first column a timestamp which is also used as a primary key.
- TDengine has limited support regarding date/time types. In particular, it does not support the `TIMESTAMP WITH TIME ZONE`, `DATE` and `TIME` types and instead only uses `TIMESTAMP`
- Some data types, mainly `DECIMAL` and the `UNSIGNED` variants of integer types, are only supported through the WebSocket connection and are not currently supported by Ontop.

## Database Connection
There are three ways to connect Ontop to a TDengine database using the JDBC driver:
- **Native connection**: depends the client driver (libtaos.so on Linux, taos.dll on Windows and libtaos.dylib on macOS). Below is an example of a `.properties` file that can be used to connect Ontop to TDengine using the native driver:

    ```bash
    jdbc.url = jdbc:TAOS://hostname:6030/dbname
    jdbc.driver = com.taosdata.jdbc.TSDBDriver
    ```

- **WebSocket connection**: does not require any additional client driver. Below is an example of a `.properties` file that can be used to connect Ontop to TDengine using the WebSocket connection:

    ```bash
    jdbc.url = jdbc:TAOS-WS://hostname:6041/dbname
    jdbc.driver = com.taosdata.jdbc.ws.WebSocketDriver
    ```
- **Restful connection**: it is now recommended to use the WebSocket connection instead, as it achieves better performance. Nevertheless, it is still supported so below is an example of a `.properties` file that can be used to connect Ontop to TDengine using the Restful connection:

    ```bash
    jdbc.url = jdbc:TAOS-RS://hostname:6041/dbname
    jdbc.driver = com.taosdata.jdbc.rs.RestfulDriver
    ```

:::tip NOTE
While all three connection methods are supported, the WebSocket connection is the recommended one, as it provides the best performance without any client compatibility issues.
:::

<!-- ## Nested Type Support

Ontop implements explicit compatibility with the DuckDB array type `T[]`. When used with the [flatten lens](/guide/advanced/lenses#flattenlens), it is able to automatically infer the type of the result column.

The flatten lens cannot be used on arrays stored as JSON-encoded columns in the database. For such use cases, the column first has to be converted to an array type.

:::tip NOTE
Nested data types are only supported starting from version 0.7 of DuckDB.
:::

### Struct Access
 Individual struct objects can be accessed by SQL expressions in the dialect's default way:
```
SELECT my_struct['my_attribute'] FROM ...
```

:::warning
Accessing struct fields using the "dot operator" is not supported.
::: -->
