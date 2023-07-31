# How to deploy your Knowledge Graph in a graph database with Ontop

In this tutorial, we present two ways to materialize your Knowledge Graph using Ontop.

## How to materialize data into a graph database using Ontop

1.  ### Materialize in RDF files and load into a triplestore

For the first solution, you will need the following prerequisites:

- Access to a relational database (in our example PostgreSQL)
- [Mapping](../glossary/#mapping) ([R2RML](../glossary/#r2rml) or [OBDA](../glossary/#obda_mapping_format) files)
- [Ontop](https://ontop-vkg.org/guide/cli.html#setup-ontop-cli)

Using the CLI command _ontop-materialize_ ([https://ontop-vkg.org/guide/cli#ontop-materialize](https://ontop-vkg.org/guide/cli#ontop-materialize)), you can [materialize](../glossary/#materialization) your KG into one or multiple files. For simplicity, we keep the default option and only materialize it into one file.


```bash
./ontop materialize -m mapping.ttl -p credentials.properties -f turtle -o materialized-triples.ttl
```

After running the command, we have all the content of our KG copied to the file _materialized-triples.ttl_.

Now we load this file in the triplestore of our choice, in this case, we use [GraphDB](https://www.ontotext.com/products/graphdb/download/). This graph database offers [several ways to load files](https://graphdb.ontotext.com/documentation/10.2/loading-and-updating-data.html). Here, since our file is only 200 MB, we go for the simplest option and load it directly from the UI.

Once this is done, we can query this KG using GraphDB.

2.  ### Deploy a VKG and fetch its content from the graph database

For the second solution, we make use of the concept of KG virtualization.

We deploy the KG as a virtual KG first and then query it from the graph database. In this way, you can retrieve the triples and store them locally in the graph database.

Triples are directly streamed to the graph database: no intermediate file storage is involved, making this solution more direct than the previous one.

let’s deploy the KG as a virtual KG using the _ontop-endpoint_ command:

```bash
./ontop endpoint -m mapping.ttl -p credentials.properties
```

Now Ontop is deployed as a [SPARQL endpoint](../glossary/#sparql_endpoint) available at [http://localhost:8080/sparql](http://localhost:8080/sparql).

Let’s go now to GraphDB. To fetch and insert all the triples from the VKG exposed by Ontop, we run the following SPARQL INSERT query from GraphDB itself:

```sparql
INSERT {
  ?s ?p ?o
}
WHERE {
  SERVICE <http://localhost:8080/sparql> {
   ?s ?p ?o
  }
}
```

This query materializes the same triples as with the first approach.

## Choosing the Right Approach for Your Use Case

1\. **Small Dataset, Easy Communication:** If your dataset isn't large and you can easily set up communication between the Ontop SPARQL endpoint and the graph database, go with solution #2. It avoids dealing with files and intermediate storage.

2\. **Large Dataset, Efficient Loading:** For very large datasets, choose the most efficient loading solution supported by the triplestore, even if it requires more effort to set up.

3\. **Materializing Fragments of the KG:** Solution #2 allows easy materialization of specific fragments of the Knowledge Graph by adapting the SPARQL query. You can have hybrid KGs with some parts stored in the graph database and the rest kept virtual.

4\. **Advantage of Keeping Data Virtual:** Keeping data virtual is great for large volumes of sensor data that constantly update. It's better to keep this part virtual while storing rich contextual information in the graph database.

## Ontology Usage

If you're familiar with Ontop, you might have noticed that we didn't use an ontology in this example. Providing an ontology to Ontop can result in a significantly larger KG due to the reasoning capabilities embedded in Ontop. However, GraphDB also has reasoning capabilities, allowing reasoning to be done later in GraphDB, making materialization simpler and faster. If your graph database doesn't support reasoning, Ontop can handle it.
