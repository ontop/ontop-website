# Oracle

Through the [Oracle](https://www.oracle.com/database/) connector, Ontop is able to construct VKGs on external Oracle databases.

## Limitations & Exceptions

- Ontop cannot perform inference based on nested data types in Oracle.
- Ontop represents the "big integer" datatype as `NUMBER(19)`.

## Database Connection

The following shows the content of a sample `.properties` file that can be used to connect Ontop to Oracle:

```bash
jdbc.url = jdbc:oracle:thin:@//localhost:49161/defaultcontainer
jdbc.user = user
jdbc.password = password
jdbc.driver = oracle.jdbc.OracleDriver
```

## Nested Type Support

Ontop does not implement explicit compatibility with nested datatypes in Oracle.
However, Ontop allows the usage of the [flatten lens](/guide/advanced/lenses#flattenlens) over string columns that contain JSON-encoded arrays. The output type of the flattened result column cannot be inferred. 

To use the flatten lens with Oracle array types, they must first be converted to JSON strings.

In case the flattened column is still a nested structure after the flatten operation is performed (e.g. for arrays of objects), [Oracle's JSON functions](https://docs.oracle.com/en/database/oracle/oracle-database/21/adjsn/query-json-data.html#GUID-119E5069-77F2-45DC-B6F0-A1B312945590) can be used to further work with them.

:::warning
Accessing object fields using the "dot operator" is not supported. Please use SQL JSON functions instead.
:::