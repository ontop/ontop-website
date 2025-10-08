# TDengine
*Supported since 5.4.0.*

Through the [TDengine](https://tdengine.com) connector, Ontop is able to construct VKGs on TDengine databases.

## Limitations & Exceptions
- As a time-series database, TDengine expects that  all tables have a timestamp as their first column which is also used as a primary key.
- TDengine has limited support regarding date/time types. In particular, it does not support the `TIMESTAMP WITH TIME ZONE`, `DATE`, and `TIME` types and instead only uses `TIMESTAMP`
- Some data types, mainly `DECIMAL` and the `UNSIGNED` variants of integer types, are only supported through the WebSocket connection and are not currently supported by Ontop.

## Database Connection
There are three ways to connect Ontop to a TDengine database using the JDBC driver:
- **Native connection**: depends on the client driver (libtaos.so on Linux, taos.dll on Windows, and libtaos.dylib on macOS). Below is an example of a `.properties` file that can be used to connect Ontop to TDengine using the native driver:

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

## Nested Type Support

TDengine has some limited support for JSON data through the `JSON` data type. The main limitation is that the JSON data type can only be used in tag columns of supertables, and it cannot have a nested structure (i.e., arrays or objects inside the JSON are not allowed). 

Ontop does not support nested data types or [flatten lenses](/guide/advanced/lenses#flattenlens) for TDengine.