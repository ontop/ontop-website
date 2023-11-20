# Trino
*Supported since 5.0.2.*

Through the [Trino](https://trino.io) connector, Ontop is able to construct VKGs on Trino databases.

## Limitations & Exceptions

:::warning
Trino does not provide information about integrity constraints. Make sure to provide this information in order to avoid very inefficient queries. 
We recommend using [lenses](/guide/advanced/lenses) for this purpose.
:::

- Accessing struct fields with the "dot operator" is not supported (see below).

## Database Connection

The following shows the content of a sample `.properties` file that can be used to connect Ontop to Trino:

```bash
jdbc.url = jdbc:trino://localhost:8080/defaultdatabase
jdbc.user = user
jdbc.password = password
jdbc.driver = io.trino.jdbc.TrinoDriver
```

In case Trino is set up without authentication, the `jdbc.user` and `jdbc.password` lines can also be left out.

## Nested Type Support

Ontop implements explicit compatibility with the Trino array type `array(t)`. When used with the [flatten lens](/guide/advanced/lenses#flattenlens), it is able to automatically infer the type of the result column.

The flatten lens cannot be used on arrays stored as JSON-encoded columns in the database. For such use cases, the column first has to be converted to an array type.

### Struct Access
 Individual [`MAP`](https://trino.io/docs/current/language/types.html#map) objects can be accessed by SQL expressions in the dialect's default way:
```
SELECT my_struct['my_attribute'] FROM ...
```

[`ROW`](https://trino.io/docs/current/language/types.html#row) objects, can be accessed using the `[position]` operator. `position` must be an integer index starting from 1:
```
SELECT my_struct[1] FROM ...
```

:::warning
Accessing object fields using the "dot operator" is not supported. Please use the `[]` operator instead.
:::
