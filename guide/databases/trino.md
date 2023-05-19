# Trino

Through the [Trino](https://trino.io) connector, Ontop is able to construct VKGs on Trino databases.

## Limitations & Exceptions

- The extraction of integrity constraints from Trino is not supported. Certain optimizations can, therefore, not be performed.
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

Ontop implements explicit compatibility with the Trino array type `array(t)`. When used with the [_Flatten Lens_](../guide/advanced/lenses.md#flattenlens), it is able to automatically infer the type of the result column.

The _Flatten Lens_ cannot be used on arrays stored as JSON-encoded columns in the database. For such use cases, the column first has to be converted to an array type.

### Struct Access:
 Individual `MAP` objects can be accessed by SQL expressions in the dialect's default way:
```
SELECT my_struct['my_attribute'] FROM ...
```

`ROW` objects, can also be accessed using the `[key]` operator. Please note, that in this case, `key` must be an integer index instead of the name of the field:
```
SELECT my_struct[1] FROM ...
```

:::warning
Accessing object fields using the "dot operator" is not supported. Please use the `[]` operator instead.
:::