# Introduction

Ontop is a Virtual Knowledge Graph system. 
It exposes the content of arbitrary relational databases as knowledge graphs. These graphs are virtual, which means that data remains in the data sources instead of being moved to another database. 

Ontop translates [SPARQL queries](https://www.w3.org/TR/sparql11-query/) expressed over the knowledge graphs into SQL queries executed by the relational data sources. It relies on [R2RML mappings](https://www.w3.org/TR/r2rml/) and can take advantage of lightweight ontologies.

Versions
--------
This documentation is for Ontop 3.0 and more recent versions.

For earlier versions, please refer to [our previous Wiki](https://github.com/ontop/ontop/wiki).

Most recent version:
* Stable:  Ontop 4.0.2, released on September 3, 2020.

See [release notes](/guide/releases) for more details.


Main features
-------------

* Can be deployed as [a SPARQL endpoint](/guide/cli#ontop-endpoint)
* Supports the main SPARQL aggregation functions (since 4.0-beta-1)
* Uses RDF 1.1 as graph data model
* Supports RDFS and OWL 2 QL ontologies
* Supports R2RML and Ontop mappings
* Produces efficient SQL queries by applying many optimizations
* Supports the main database systems (PostgreSQL, MySQL, SQL server, Oracle and DB2)
* Supports database federators such as Denodo (beta)
* Can [materialize](/guide/cli#ontop-materialize) virtual graphs into RDF files
* Provides a plugin for editing and testing mappings in the [Protégé ontology editor](https://protege.stanford.edu/)

Organizations
-------------
Ontop is backed by the [Free University of Bozen-Bolzano](https://www.inf.unibz.it/krdb/in2data/) and [Ontopic s.r.l.](https://ontopic.biz). It also receives regular important contributions from [Birkbeck, University of London](http://www.bbk.ac.uk/). See the [community section](/community) for more details.

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

Citations
---------

* If you use Ontop in your work, please cite one of the following articles describing the system.
    * Guohui Xiao, Davide Lanti, Roman Kontchakov, Sarah Komla-Ebri, Elem Güzel-Kalayci, Linfang Ding, Julien Corman, Benjamin Cogrel, Diego Calvanese, and Elena Botoeva. [The Virtual Knowledge Graph System Ontop](https://research.bcgl.fr/pdfs/ontop-iswc20.pdf). In: International Semantic Web Conference (Resource Track), 2020. 
    * Diego Calvanese, Benjamin Cogrel, Sarah Komla-Ebri, Roman Kontchakov, Davide Lanti, Martin Rezk, Mariano Rodriguez-Muro, and Guohui Xiao. [Ontop: Answering SPARQL Queries over Relational Databases](http://www.semantic-web-journal.net/content/ontop-answering-sparql-queries-over-relational-databases-1).  In: Semantic Web Journal 8.3 (2017), pp. 471–487.

* If you want to cite the techniques behind Ontop, check [our publications](/research/publications).
