# Introduction

Ontop is a Virtual Knowledge Graph system. 
It exposes the content of arbitrary relational databases as knowledge graphs. These graphs are virtual, which means that data remains in the data sources instead of being moved to another database. 

Ontop translates [SPARQL queries](https://www.w3.org/TR/sparql11-query/) expressed over the knowledge graphs into SQL queries executed by the relational data sources. It relies on [R2RML mappings](https://www.w3.org/TR/r2rml/) and can take advantage of lightweight ontologies.

Versions
--------
This documentation is for Ontop 3.0 and more recent versions.

For earlier versions, please refer to [our previous Wiki](https://github.com/ontop/ontop/wiki).


Main features
-------------

* Can be deployed as a SPARQL endpoint
* Supports the main SPARQL aggregation functions (since 4.0-beta-1)
* Uses RDF 1.1 as graph data model
* Supports RDFS and OWL 2 QL ontologies
* Supports R2RML and Ontop mappings
* Produces efficient SQL queries by applying many optimizations
* Supports the main database systems (PostgreSQL, MySQL, SQL server, Oracle and DB2)
* Supports database federators such as Dremio and Denodo (beta)
* Can [materialize virtual graphs](/guide/materialization) into RDF files
* Provides a plugin for editing and testing mappings in the [Protégé ontology editor](https://protege.stanford.edu/)

Licenses
--------

Ontop is available under the [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0) license.

All the documentation is licensed under the 
[Creative Commons (Attribution)](http://creativecommons.org/licenses/by/4.0/)
license.

Social
------

You can find us on the following social platforms:
- [Facebook (obdaontop)](https://www.facebook.com/obdaontop/)
- [Twitter (ontop4obda)](https://twitter.com/ontop4obda)
- [Google Group (ontop4obda)](https://groups.google.com/forum/#!forum/ontop4obda)
- [GitHub (ontop/ontop)](https://github.com/ontop/ontop/)