# Key concepts

## Virtual Knowledge Graph (VKG)

A Knowledge Graph (KG) is, in our terminology, a graph using the RDF data model. 

A Virtual KG (VKG) is a virtual representation in RDF of non-RDF data, which is generally relational data.
With a VKG, the data remains in the data sources in its original format but can be virtually represented as an RDF graph.

## RDF
The [Resource Description Framework (RDF)](https://www.w3.org/TR/rdf11-concepts/) 
is one of the two main data models for graphs (together with [property graphs](http://graphdatamodeling.com/Graph%20Data%20Modeling/GraphDataModeling/page/PropertyGraphs.html)). 
RDF mainly targets **data integration** applications while property graphs are used for building graph databases.

In RDF, data is modelled using classes and properties.

Starting from 3.0, Ontop supports [RDF 1.1](https://www.w3.org/TR/rdf11-concepts/).

## SPARQL query

[SPARQL](https://www.w3.org/TR/sparql11-query/) is the standard query language for RDF graphs. 

Ontop is capable of answering SPARQL queries expressed over the VKG.
Ontop translates these SPARQL queries into SQL queries, which are then executed over the relational data sources.

Ontop supports a large fragment of [SPARQL 1.1](https://www.w3.org/TR/sparql11-query/).

## Mappings

Mappings specify the correspondence between the data models of the relational data sources and the RDF graph.
Ontop supports the [R2RML standard mapping language](https://www.w3.org/TR/r2rml/) and the Ontop mapping language, which is fully interoperable with R2RML.

## Ontology

An ontology specifies the formal relations between the classes and properties used by the RDF graph. It is mainly used for enriching the RDF graph by, for instance, taking account of class hierarchies.

Ontop supports lightweight ontologies expressed in [RDFS](https://www.w3.org/TR/rdf-schema/) or in the slightly more expressive [OWL 2 QL](https://www.w3.org/TR/owl2-profiles/#OWL_2_QL) fragment of OWL.

## VKG specification

VKG specifications are composed of mappings and optionally of ontologies.

## SPARQL endpoint

A [SPARQL endpoint](https://www.w3.org/TR/2013/REC-sparql11-protocol-20130321/) is a standardized HTTP-based Web API. 
It makes the RDF graph queryable by any HTTP client.

Ontop enables VKG specifications to be deployed as SPARQL endpoints.


