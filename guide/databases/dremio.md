# Dremio

Through the [Dremio](https://dremio.com) connector, Ontop is able to construct VKGs on Dremio databases.
Ontop can connect to normal Dremio instances, as well as Dremio Cloud databases.

## Limitations & Exceptions

:::warning
Dremio does not provide information about integrity constraints. Please provide this information manually in order to avoid very inefficient queries. 
We recommend using [lenses](/guide/advanced/lenses) for this purpose.
:::

- The `position` argument for the [_Flatten Lens_](../guide/advanced/lenses.md#flattenlens) cannot be used with Dremio.
- When using a Dremio version below 21.0.0, some larger queries that employ `UNION`s may fail. This can be solved by adding `ontop.maxNbChildrenLiftingDBFS=0` to the properties

## Database Connection

The following shows the content of a sample `.properties` file that can be used to connect Ontop to Dremio for each supported JDBC:

- `com.dremio.jdbc.Driver`
```bash
jdbc.url = jdbc:dremio:direct=localhost:31010
jdbc.user = user
jdbc.password = password
jdbc.driver = com.dremio.jdbc.Driver
```

- `org.apache.arrow.driver.jdbc.ArrowFlightJdbcDriver`
```bash
jdbc.url = jdbc:arrow-flight-sql://localhost:32010
jdbc.user = dremio
jdbc.password = password
jdbc.driver = org.apache.arrow.driver.jdbc.ArrowFlightJdbcDriver
```

## Nested Type Support

Ontop implements explicit compatibility with the Dremio array type `LIST` which can be used with the [_Flatten Lens_](../guide/advanced/lenses.md#flattenlens). However, it cannot infer the type of the flattened result column.

To use a _Flatten Lens_ on a JSON-encoded array stored in the database, it first has to be converted to a `LIST`.

:::warning
The `position` argument for _Flatten Lenses_ cannot be used with Dremio.
:::

### Struct Access:
 Individual struct objects can be accessed by SQL expressions in the dialect's default way:
```
SELECT my_struct['my_attribute'] FROM ...
```
