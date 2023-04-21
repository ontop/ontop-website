# Presentation

In this tutorial, we will see how to design a Virtual Knowledge Graph (VKG) specification, how to deploy it as a SPARQL endpoint, how to consume it and further more advanced topics.

## Requirements

* [Java 11](http://www.oracle.com/technetwork/java/javase/downloads/index.html)
* Latest version of Ontop from [GitHub](https://github.com/ontop/ontop/releases) or [SourceForge](https://sourceforge.net/projects/ontop4obda/files/)
* H2 with preloaded datasets [h2.zip](h2.zip)
* [Git](https://git-scm.com/)

## Clone this repository

Before start, please clone this repository in order to download all the files

```console
git clone https://github.com/ontop/ontop-tutorial.git
cd ontop-tutorial
```

## Program

1. [Basics of VKG Modeling](basic/setup.md)
    * [Mapping the first data source](basic/university-1.md)
    * [Mapping the second data source](basic/university-2.md)
2. [Deploying an Ontop SPARQL endpoint](endpoint)
    * [Using Ontop CLI](endpoint/endpoint-cli.md)
    * [Using Ontop Docker image](endpoint/endpoint-docker.md) 
3. [Interacting with an Ontop SPARQL endpoint](interact/cli.md)
    * [Command Line Tools (curl, http)](interact/cli.md)
    * [Python and Jupyter Notebook](interact/jupyter.md)
4. [Mapping Engineering](mapping)
    * [Role of primary keys](mapping/primary-keys.md)
    * [Role of foreign keys](mapping/foreign-keys.md)
    * [Choice of the URI templates](mapping/uri-templates.md)
    * [Bonus: existential reasoning](mapping/existential.md)
5. [Lenses](lenses)
    * [Basic Lens](lenses/basic-lens.md)
    * [Join Lens](lenses/join-lens.md)
    * [SQL Lens](lenses/sql-lens.md)
    * [Union Lens](lenses/union-lens.md)
    * [Flatten Lens](lenses/flatten-lens.md)
6. [Federating multiple databases](federation)
    * [Ontop with Dremio](federation/dremio/README.md)
    * [Ontop with Denodo](federation/denodo/README.md)
7. [External tutorials](external-tutorials)
