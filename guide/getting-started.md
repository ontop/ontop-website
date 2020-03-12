# Getting started

## Tutorial

If you are new to Ontop and Virtual Knowledge Graphs, we encourage you to have a look [at the official tutorial](/tutorial).


## Using Ontop

Ontop is distributed under various forms. They can be downloaded on [Github](https://github.com/ontop/ontop/releases), [Docker Hub](https://hub.docker.com/r/ontop/ontop-endpoint), [Sourceforge](http://sourceforge.net/projects/ontop4obda/files/) and in the Protégé plugin repository.

### Mapping designer

For editing and testing your mappings, you can use our plugin of the [Protégé ontology editor](https://protege.stanford.edu/). You can download the latest stable release directly from Protégé. Alternatively, pre-releases can be found on [Github](https://github.com/ontop/ontop/releases) and [Sourceforge](http://sourceforge.net/projects/ontop4obda/files/).


### Deployment

Once your mappings and your ontology are ready, you can deploy your VKG as a SPARQL endpoint. The Ontop endpoint is available both as a CLI command (`ontop endpoint`) and as a [Docker image](https://hub.docker.com/r/ontop/ontop-endpoint).

You can also use the Ontop endpoint during development as it embeds [a nice YASGUI client](https://about.yasgui.org/) and an optional portal (since 4.0-beta-1) containing pre-defined queries.


### Command Line Interface

Want to materialize your VKG, convert your mappings into R2RML, bootstrap your mappings or start a SPARQL endpoint? You can use the CLI for that. It can be found on on [Github](https://github.com/ontop/ontop/releases) and [Sourceforge](http://sourceforge.net/projects/ontop4obda/files/).

### Former solutions

Historically, Ontop has been made available under other means that we don't recommend anymore.

#### Java API (not recommended)

It remains possible to use Ontop as a Java API through [RDF4J](https://rdf4j.org/) although we recommend the HTTP SPARQL endpoint as a first option (think of a microservice). Why? Because such a Java API would add many dependencies to your project and constraint you to use certain versions of Java.

Ontop-rdf4j is available on [Maven Central](https://search.maven.org/artifact/it.unibz.inf.ontop/ontop-rdf4j).

#### RDF4J workbench (not recommended)

Our first solution for deploying Ontop as SPARQL endpoint has been through the RDF4J workbench. It has several UX issues, mainly because Ontop is working with files (for the mapping and the ontology) while the normal use cases of RDF4J workbench do not.

We recommend you use the Ontop endpoint as a first option. Two bundles of RDF4J workbench with Jetty or Tomcat are available on [Github](https://github.com/ontop/ontop/releases) and [Sourceforge](http://sourceforge.net/projects/ontop4obda/files/).



