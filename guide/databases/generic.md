# Generic JDBC (not recommended)

::: warning
***Don't rely on generic JDBC support. It isn't sufficient for any data source.***
:::

Ontop provides a generic implementation, that is used as default for any JDBC. While part of the functionality may work right out of the box with this default implementation, there is no guarantee that Ontop will be able to handle any database setup and SPARQL queries correctly, especially once special limitations and exceptions come into play.

However, Ontop also provides dialect-specific implementations for a variety of different database management systems and SQL dialects. The following documents describe the process of connecting Ontop to each of them, as well as special points and caveats for specific cases.

In this section, we provide general information and important points for each of the supported systems.

::: tip NOTE
If your SQL dialect of interest is not included in this list, it is possible to implement a connector for it, following [this guide](/dev/db-adapter.md).
:::

::: tip NOTE
To use Ontop with **any** database system, its corresponding JDBC driver is required in the `jdbc` directory, which is passed to the Ontop instance as described in the [setup guide](/guide/cli#ontop-endpoint). 
:::

