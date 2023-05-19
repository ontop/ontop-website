# Snowflake

Through the [Snowflake](https://snowflake.com) connector, Ontop is able to construct VKGs on cloud-based Snowflake databases.

## Limitations & Exceptions

:::warning
Integrity constraints are often missing in Snowflake. Make sure to specify the missing ones in order to avoid very inefficient queries. 
We recommend using [lenses](/guide/advanced/lenses) for this purpose.
:::

- Due to an issue in the JDBC, quotation marks cannot always be used when defining an alias. Because of this, it is recommended to choose column names without special characters where possible.
- Accessing struct fields with the "colon operator" is not supported (see below).

## Database Connection

The following shows the content of a sample `.properties` file that can be used to connect Ontop to Snowflake:

```bash
jdbc.url = jdbc:snowflake://dummyuser.snowflakecomputing.com/?warehouse=dummywarehouse&db=dummydb&schema=dummyschema
jdbc.user = user
jdbc.password = password
jdbc.driver = net.snowflake.client.jdbc.SnowflakeDriver
```

## Nested Type Support

Ontop implements explicit compatibility with the `ARRAY` type, which can be used with the [flatten lens](/guide/advanced/lenses#flattenlens). However, it is not able to automatically infer the type of the resulting column.

:::warning
Due to an issue mentioned above, using special characters inside the `output` and `position` fields of the flatten lens for Snowflake will fail. Furthermore, these fields will always be case-insensitive. 
:::

### Struct Access
 Individual object fields can be accessed by SQL expressions in the dialect's default way:
```
SELECT my_object['my_field'] FROM ...
```

:::warning
Accessing object fields using the "colon operator" is not supported. Please use the `[]` operator instead.
:::
