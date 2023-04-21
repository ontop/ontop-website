# Union Lens

Unions lenses can be used to concatenate multiple relations with the same schema into one. Additionally, a *provenance* field can be added to each row, determining the source relation the row originates from.

For this example, we will look at the tables `nature_exhibits`, `historical_exhibits` and `art_exhibits` from the DuckDB database. We want to combine them into a single relation containing all exhibits.

The tables `nature_exhibits` and `historical_exhibits` have the following schema:

column | type |
----- | ------- |
exhibit_id | integer
name | string
museum_id | integer

The table `art_exhibits` has the following schema:

column | type |
----- | ------- |
exhibit_id | integer
name | string
artist_name | string
museum_id | integer

For each table, `exhibit_id` is a primary key and `museum_id` is a foreign key, referencing the table `museums`.

## Relations with the same schema

This concatenation can be achieved using a union lens. However, as all base relations of a union lens must have the exact same columns, we will only be working on the tables `nature_exhibits` and `historical_exhibits` at first.

The union lens has the following structure:

```json
{
    "name": [String],
    "unionRelations": [[String]],
    "makeDistinct": boolean,
    "provenanceColumn": String,
    "type": "UnionLens"
}
```

Here, `unionRelations` is a list of relations that should be concatenated, `makeDistinct` indicates if a distinct constraint should be enforced on the result, and `provenanceColumn` is an optional parameter, indicating the name of the provenance column in the result, which tells us what relation each row originated from.

As the tables `nature_exhibits` and `historical_exhibits` have the same set of columns, we can reference them from a union lens to create a new, concatenated view.

::: warning
The columns of all tables used by a union lens must be *exactly* equal. Their columns must have *the same names* and the **exact** *same data types*. The order of the columns does not matter.
:::

```json
{
    "relations": [
        {
            "name": ["lenses", "all_exhibits"],
            "unionRelations": [
                ["historical_exhibits"],
                ["nature_exhibits"]
            ],
            "provenanceColumn": ...,
            "makeDistinct": ...,
            "type": "UnionLens"
        }
    ]
}
```

The remaining fields are `provenanceColumn` and `makeDistinct`. As we do not expect the entries of any of the tables to be equal, we can just neglect the `makeDistinct` parameter. To preserve the source of each entry, we want to include a provenance column. We can call it `exhibit_type`. This results in the following `lenses.json` file:

```json
{
    "relations": [
        {
            "name": ["lenses", "all_exhibits"],
            "unionRelations": [
                ["historical_exhibits"],
                ["nature_exhibits"]
            ],
            "provenanceColumn": "exhibit_type",
            "type": "UnionLens"
        }
    ]
}
```

:::tip NOTE
If the `provenanceColumn` field is not provided, then no information on the source relation will be preserved for the concatenated rows. If the field `makeDistinct` is not provided, its default value is assumed to be `false`.
:::

:::tip NOTE
Including a `provenanceColumn` in a UnionLens where each of the source relations is distinct will render the `makeDistinct` field redundant. This is because, under a union, the composite uniqueness constraint `(provenanceColumns, childUniquenessConstraint)` will always hold. On the other hand, if no provenance column is included, then uniqueness constraints from the base relations will be lost, as there is no guarantee that a specific value does not appear again in a different table.
:::

### Mapping

Now, let us use this lens definition in our mapping. Starting from the mapping template file, add the following mapping entry:

```obda
mappingId	MAPID-exhibits
target		data:exhibit/{exhibit_id} a :Exhibit ; :name {name} ; :displayedIn data:museum/{museum_id} ; :exhibitType {exhibit_type} .
source		SELECT exhibit_id, name, museum_id, exhibit_type FROM lenses.all_exhibits;
```

Starting the Ontop SPARQL endpoint using this mapping and lens file, we can now run the SPARQL query:

```SPARQL
PREFIX : <http://example.org/museum_kg/>
SELECT ?name ?type WHERE {
    ?exhibit a :Exhibit .
    ?exhibit :name ?name .
    ?exhibit :exhibitType ?type .
}
```

This should result in a set of exhibit names that have the values `historical_exhibits` and `nature_exhibits` as their exhibit type.

## Relations with different schemas

If we further want to include the table `art_exhibits` to the union lens, we cannot just add it to the list of `unionRelations`. This is because it has one additional column, `artist_name`, that does not appear in the other tables.
To work around this issue, we can take advantage of basic lenses, putting them "underneath" the union lens, to ensure the equality of columns.

There are two possibilities to achieve this:
1. Hide the conflicting column(s) from its/their table(s)
2. Add the conflicting column(s) to the tables that do not include them.

To retain a maximum of information, we will choose the second approach for this example. That means, that we have to construct basic lenses to add the column `artist_name` to the tables `historical_exhibits` and `nature_exhibits`. One possible way to achieve this is by adding new columns that have `NULL` as their expressions.

```json
{
    "relations": [
        {
            "name": ["lenses", "historical_exhibits_extended"],
            "baseRelation": ["historical_exhibits"],
            "columns": {
                "added": [
                    {
                        "name": "artist_name",
                        "expression": "'None'"
                    }
                ],
                "hidden": []
            },
            "type": "BasicLens"
        }
    ]
}
```

After doing the same for the `nature_exhibits` table, referencing the new extended lenses from the union lens, and adding `art_exhibits` as one of its union relations, get the following lens file:

```json
{
    "relations": [
        {
            "name": ["lenses", "historical_exhibits_extended"],
            "baseRelation": ["historical_exhibits"],
            "columns": {
                "added": [
                    {
                        "name": "artist_name",
                        "expression": "'None'"
                    }
                ],
                "hidden": []
            },
            "type": "BasicLens"
        },
        {
            "name": ["lenses", "nature_exhibits_extended"],
            "baseRelation": ["nature_exhibits"],
            "columns": {
                "added": [
                    {
                        "name": "artist_name",
                        "expression": "'None'"
                    }
                ],
                "hidden": []
            },
            "type": "BasicLens"
        },
        {
            "name": ["lenses", "all_exhibits"],
            "unionRelations": [
                ["lenses", "historical_exhibits_extended"],
                ["lenses", "nature_exhibits_extended"],
                ["art_exhibits"]
            ],
            "provenanceColumn": "exhibit_type",
            "type": "UnionLens"
        }
    ]
}
```

### Mapping 

We can now extend the mapping file to also include artist names:

```obda
mappingId	MAPID-exhibits
target		data:exhibit/{exhibit_id} a :Exhibit ; :name {name} ; :displayedIn data:museum/{museum_id} ; :exhibitType {exhibit_type} ; :artistName {artist_name} .
source		SELECT exhibit_id, name, museum_id, exhibit_type, artist_name FROM lenses.all_exhibits;
```

Now, running this slightly modified SPARQL query:


```SPARQL
PREFIX : <http://example.org/museum_kg/>
SELECT ?name ?type ?artist WHERE {
    ?exhibit a :Exhibit .
    ?exhibit :name ?name .
    ?exhibit :exhibitType ?type .
    ?exhibit :artistName ?artist
}
```

we will once again get all earlier results, in addition to all exhibits contained in the `art_exhibit` table. While the earlier results will have the value `None` as their artist name, the `art_exhibits` entries will include the name of their artists.

---

As a further exercise, notice how the values of `:exhibitType` are rather ugly: `"art_exhibits"`, `"lenses.historical_exhibits_extended"`, and `"lenses.nature_exhibits_extended"`. Try adding a new basic lens over the union lens that transforms these into the values `"art"`, `"historical"`, and `"nature"` instead. 

*Hint: Look at the SQL function `REPLACE`. Could it be used in the `expression` field of an added column to get rid of the `_exhibits`, `_extended`, and `lenses.` part?*

Notice how the union lens allowed you to perform this operation on all three of its base relations by just defining it once. Without the union lens, you would have required three such basic lenses, one for each table, with the exact same contents.