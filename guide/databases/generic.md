# Generic JDBC

::: warning
***There is no good Generic JDBC support in Ontop***
:::

Ontop provides a generic implementation, that is used as default for any JDBC. While part of the functionality may work right out of the box with this default implementation, there is no guarantee that Ontop will be able to handle any database setup and SPARQL queries correctly, especially once special limitations and exceptions come into play.

However, Ontop also provides dialect-specific implementations for a variety of different database management systems and SQL dialects. The following documents describe the process of connecting Ontop to each of them, as well as special points and caveats for specific cases.

In this section, we provide general information and important points for each of the supported systems.

::: tip NOTE
If your SQL dialect of interest is not included in this list, you can implement a connector for it easily yourself, following [this guide](/dev/db-adapter.md).
:::

::: tip NOTE
To use Ontop with **ANY** database system, its corresponding JDBC is required in the `jdbc` directory, which is passed to the Ontop instance as described in the [setup guide](/guide/cli#ontop-endpoint). 
:::

