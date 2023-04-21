# SQL Lens

SQL lenses are a special type of lens that can generate virtual views over any number of base relations through an arbitrary SQL query. While this allows for more flexibility, as any SQL functionalities can be used by this lens, it risks to obfuscate the inner workings towards Ontop as it may not be handled by the Ontop's SQL parser, preventing it from performing any meaningful inference and optimization.

One major use case for SQL lenses is to perform complex operations that are currently not supported by other Ontop lenses. For this example, we will look at the table `art_exhibits`. This table has the following schema:

column | type |
----- | ------- |
exhibit_id | integer
name | string
artist_name | string
museum_id | integer

We now want to gather more information on artists. Including how many exhibits they created and in how many museums their works appear. In SQL, this can be achieved easily by running aggregate functions on a `GROUP BY` query, but there is no corresponding lens for aggregate functions in Ontop. We, therefore, have to take advantage of the SQL lens.

This lens has the following structure:
```json
{
    "name": [String],
    "query": String,
    "type": "SQLLens"
}
```

Here, the `query` field is a single SQL query that projects all attributes that are of interest to us. In our example, we want to group all artists' names and count their number of exhibits and **distinct** museums. A corresponding SQL lens could look like this:

```json
{
    "name": ["lenses", "artists"],
    "query": "SELECT artist_name, COUNT(exhibit_id) as exhibits, COUNT(DISTINCT museum_id) as museums FROM art_exhibits GROUP BY artist_name",
    "type": "SQLLens"
}
```

This will now create a virtual relation inside Ontop, that has the columns `artist_name`, `exhibits`, and `museums`. 

### Mapping

Finally, we just need to create a mapping entry for the artist, extending our mapping template:

```obda
mappingId	MAPID-artists
target		data:artist/{artist_name} a :Artist ; :name {artist_name}^^xsd:string ; :exhibitCount {exhibits}^^xsd:integer ; :museumCount {museums}^^xsd:integer.
source		SELECT artist_name, exhibits, museums FROM lenses.artists;
```

:::tip NOTE
In the `target` clause of the mapping, our datatype properties have to be marked by their individual types. This is because Ontop can no longer infer the types of the columns we are using, as they are obfuscated by the SQL lens.
:::

To test our lenses and mapping, let us run the Ontop endpoint, copying the `lenses.json` and `mapping.obda` files into the endpoint's directory. 
Then, we can run the following SPARQL query:

```SPARQL
PREFIX : <http://example.org/museum_kg/>
SELECT ?name ?exhibits ?museums WHERE {
    ?artist a :Artist .
    ?artist :name ?name .
    ?artist :exhibitCount ?exhibits .
    ?artist :museumCount ?museums .
}
```

If everything was done correctly, you should get a list of three artists with the number of their exhibits and the number of museums they are featured in.

### Adding Unique Constraints

Ontop cannot infer unique constraints from the expressions used in SQL lenses. However, as the user, it is clear to us that the field `artist_name` will be *unique*, as it is used by the `GROUP BY` clause. In such cases, explicitly adding unique constraints is a useful feature. Similarly to how it was shown in the [basic lens section](basic-lens.md), we can achieve this by adding an additional field to the lens:

```json
{
    "relations": 
    [
        {
            "name": ["lenses", "artists"],
            "query": "SELECT artist_name, COUNT(exhibit_id) as exhibits, COUNT(DISTINCT museum_id) as museums FROM art_exhibits GROUP BY artist_name",
            "type": "SQLLens",
            "uniqueConstraints": {
                "added": [
                    {
                        "name": "uc",
                        "determinants": ["artist_name"]
                    }
                ]
            }
        }
    ]
}
```

While this will not change the output of the sample query, it may help Ontop optimize its queries in specific instances (see [primary key](../mapping/primary-keys.md)).

:::warning
It is advised to be cautious when using SQL lenses. Generally, they should not refer to other lenses if the SQL expression is complex, and they may not be able to infer integrity constraints. For more information, please visit the [documentation page of lenses](../../guide/advanced/lenses.md).
:::
