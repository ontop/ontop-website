# Denodo

Through the [Denodo](https://www.denodo.com/en) connector, Ontop is able to construct VKGs on Denodo databases.

## Limitations & Exceptions

- SPARQL _UUID_ and _hash_ functions are not supported for Denodo.
- Nested data types and the [flatten lens](/guide/advanced/lenses#flattenlens) are not supported for Denodo.

## Database Connection

The following shows the content of a sample `.properties` file that can be used to connect Ontop to Denodo:

```bash
# For Denodo >= 8
jdbc.url = jdbc:denodo://localhost:9999/
# For Denodo < 8
#jdbc.url = jdbc:vdb://localhost:9999/books
jdbc.user = admin
jdbc.password = ${denodo.password}
jdbc.driver = com.denodo.vdp.jdbc.Driver
```

## Nested Type Support

Nested data types and the [flatten lens](/guide/advanced/lenses#flattenlens) are not supported for Denodo.
