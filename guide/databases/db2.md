# DB2

Through the IBM [DB2](https://www.ibm.com/products/db2) connector, Ontop is able to construct VKGs on DB2 databases.


## Limitations & Exceptions

- SPARQL _UUID_ and _hash_ functions are not supported for DB2.
- Nested data types and the [flatten lens](/guide/advanced/lenses#flattenlens) are not supported for DB2

## Database Connection

The following shows the content of a sample `.properties` file that can be used to connect Ontop to DB2:

```bash
jdbc.url = jdbc:db2://localhost:50000/defaultdatabase
jdbc.user = user
jdbc.password = password
jdbc.driver = com.ibm.db2.jcc.DB2Driver
```

## Nested Type Support

Nested data types and the [flatten lens](/guide/advanced/lenses#flattenlens) are not supported for DB2.