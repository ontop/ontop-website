# AWS Athena

Through the [Athena](https://aws.amazon.com/athena/) connector, Ontop is able to construct VKGs on AWS Athena databases using the [Simba Athena JDBC Driver](https://docs.aws.amazon.com/athena/latest/ug/connect-with-jdbc.html).

## Limitations & Exceptions

- The extraction of integrity constraints from Athena is not supported. Certain optimizations can, therefore, not be performed.
- The Simba Athena JDBC does not support the use of default databases when connecting to Athena.
- Accessing object fields with the "dot operator" is not supported (see below).

## Database Connection

The following shows the content of a sample `.properties` file that can be used to connect Ontop to Athena:

```bash
jdbc.url = jdbc:awsathena://AwsRegion=eu-central-1;S3OutputLocation=s3://result-location
jdbc.user = user
jdbc.password = password
jdbc.driver = com.simba.athena.jdbc.Driver
```

## Nested Type Support

Ontop implements explicit compatibility with the Athena array type `ARRAY<T>`. When used with the [_Flatten Lens_](../guide/advanced/lenses.md#flattenlens), it is able to automatically infer the type of the result column.

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