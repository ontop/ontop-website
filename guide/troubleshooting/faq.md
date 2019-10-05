# FAQ

Some Frequently Asked Questions

::: warning TODO
The FAQ needs to be refreshed
:::

## General

### Which mapping syntaxes are supported?
::: warning TODO
ADD CONTENT
:::

### What does Ontop support regarding SQL and SPARQL?
::: warning TODO
This could be reorganized
:::

See the [known issues and limitations](/guide/troubleshooting/known-issues).

### Is it open source?
Yes! Ontop is available under the Apache License, Version 2.0.

### How can I report a bug or ask other questions?
You can get in touch with us through [our support channels](/community/support) and [contribute to the project](/community/contributing/)
by for instance filing a [bug report](/community/contributing/bug-report).

## Databases

### Casing problems with SQL identifiers

::: warning Still relevant?
TODO: check the current status
:::

If you experience the following error message: "Error in identifying column name",
it may be due to casing problems with the SQL identifiers used in your mappings.
See [this dedicated page](Case-sensitivity-for-SQL-identifiers).

### MySQL Server does not support double quotes as identifiers
To use Ontop and Mysql Server ANSI_QUOTES mode should be enabled.
By default the " character can be used to enclose string literals just like ', while
in ANSI_QUOTES mode the " character can be used to enclose identifiers just like ` .


## Protégé
### No suitable driver found for .. (driver)

You need to download and install the right driver in Protege. See
[Setting up JDBC Drivers](ontopProInstallation#setting-up-the-jdbc-drivers-in-protege)
and [JDBC Information](ObdalibPluginJDBC)

### No "JDBC drivers" tab in the preferences
You probably can see the following message in the Protégé console:
```
org.osgi.framework.BundleException: Activator start error in bundle org.protege.osgi.jdbc.prefs [20].)
org.protege.osgi.jdbc.RegistryException: java.lang.ClassNotFoundException: org.h2.Driver
```

Please go to the Preferences and click on "Reset preferences".

### Protégé does not show the Ontop tabs
To see the tabs go to Windows-> tabs-> Ontop Mappings and Ontop SPARQL.

## RDF4J workbench

### Why RDF4J Workbench refuse to delete some repositories?

For deleting metadata about a repository, the RDF4J Workbench should be able to create an instance of this repository. However, if the repository configuration is invalid (due to, for instance to bad mapping and ontology files), such an instance cannot be created.
To avoid this situation, the configuration is validated in depth when a new repository is added to the Workbench. However, if the mapping and ontology files are changed afterwards, we offer no protection. Fortunately, there is [some easy workarounds](ObdalibIssues#Sesame_API_and_Workbench).
