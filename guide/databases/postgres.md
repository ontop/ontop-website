# PostgreSQL

Through the [PostgreSQL](https://postgresql.org) connector, Ontop is able to construct VKGs on external Postgres databases.

## Limitations & Exceptions

- Accessing JSON object fields with the "arrow operator" is not supported (see below).

## Database Connection

The following shows the content of a sample `.properties` file that can be used to connect Ontop to PostgreSQL:

```bash
jdbc.url = jdbc:postgresql://localhost:5432/database
jdbc.user = admin
jdbc.password = password
jdbc.driver = org.postgresql.Driver
``` 

## Nested Type Support

Ontop implements explicit compatibility with the PostgreSQL array type `T[]`. When used with the [flatten lens](/guide/advanced/lenses#flattenlens), it is able to automatically infer the type of the result column.

Furthermore, the flatten lens can also be used with the `JSON` and `JSONB` datatypes, which are both recognized by Ontop. For these types, however, Ontop cannot infer the output type of the flattened column.

### Struct Access
 In PostgreSQL, individual struct objects can be accessed by SQL expressions using the "dot operator" on the struct column. In Ontop, this feature is not currently supported. 

Should any of their elements still be required, then a workaround can be performed by first transforming the struct into a JSON object and then accessing it using JSON functions. 

Example:

 `my_struct.my_attribute` $\rightarrow$ `JSON_EXTRACT_PATH(TO_JSON(my_struct), '$.my_attribute')`

:::warning
The "arrow operators" used to access JSON objects in PostgreSQL are not supported in Ontop. Please use JSON functions instead.
:::