# FAQ

Some Frequently Asked Questions

## General

### Which mapping syntaxes are supported?
We support [R2RML](https://www.w3.org/TR/r2rml/) and our own mapping syntax (which can be automatically converted into R2RML).

### Is it open source?
Yes! Ontop is available under the Apache License, Version 2.0.

### How can I report a bug or ask other questions?
You can get in touch with us through [our support channels](/community/support) and [contribute to the project](/community/contributing/)
by, for instance, filing a [bug report](/community/contributing/bug-report).

## Protégé
### No suitable driver found for .. (driver)

You need to download and install the right driver in Protégé.  See
[Setting up JDBC Drivers](https://github.com/ontop/ontop/wiki/ontopProInstallation#setting-up-the-jdbc-drivers-in-protege)
and [JDBC Information](https://github.com/ontop/ontop/wiki/ObdalibPluginJDBC).

### No "JDBC drivers" tab in the preferences
You probably can see the following message in the Protégé console:
```
org.osgi.framework.BundleException: Activator start error in bundle org.protege.osgi.jdbc.prefs [20].)
org.protege.osgi.jdbc.RegistryException: java.lang.ClassNotFoundException: org.h2.Driver
```

Please go to the *Preferences* and click on *"Reset preferences"*.

### Protégé does not show the Ontop tabs
To see the tabs go to *Windows-> tabs-> Ontop Mappings and Ontop SPARQL*.

## RDF4J workbench

### Why RDF4J Workbench refuse to delete some repositories?

For deleting metadata about a repository, the RDF4J Workbench should be able to create an instance of this repository. However, if the repository configuration is invalid (due to, for instance to bad mapping and ontology files), such an instance cannot be created.
To avoid this situation, the configuration is validated in depth when a new repository is added to the Workbench. However, if the mapping and ontology files are changed afterwards, we offer no protection.    One workaround is to create a valid repository with the same name and then to delete it. Another workaround is to delete it from the RDF4J console.
