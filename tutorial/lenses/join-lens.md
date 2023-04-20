# Join Lens

Join lenses can be used to combine multiple relations into one. Additionally, a filter expression can be provided as a join condition.

For this example, we will look at the tables `museums` and `workers` from the DuckDB database. For each individual of the `:Worker` class, we want to set its property `:workAddress` to the address of the museum they work at.
The tables have the following schemas:

*museums*
column | type |
----- | ------- |
museum_id | integer
name | string
address | string
yearly_income | integer
yearly_spendings | integer
ratings | array of floats

*workers*
column | type |
----- | ------- |
worker_id | integer
full_name | string
role | string
museum_id | integer
titles | array of strings
access_level | integer

Notably, the table `workers` has the column `museum_id` which references the primary key of the table `museums`. In SQL, we can run a `JOIN` query over these two tables to combine all rows of `worker` with their corresponding museums. In Ontop, we can instead create a join lens, that can be referenced by the mapping.

The join lens has the following structure:

```json
{
    "name": [String],
    "join": {
        "relations": [[String]],
        "columnPrefixes": [String]
    },
    "columns": {
        "added": [{
            "name": String,
            "expression": String
        }],
        "hidden": [String]
    },
    "filterExpression": String,
    "type": "JoinLens"
}
```

The `join` field takes an object consisting of a list of relation references and a list of *column prefixes*. For each relation, its corresponding column prefix will be prepended to the names of all of its columns.

The fields `columns` and `filterExpression` work exactly the way they worked for [basic lenses](basic-lens.md), with the only reference being that now, column names have to be combined with the individual relation's prefix when referencing them in expressions.

In this example, the relations we use are `museums` and `workers`, and we choose the prefixes `m_` and `w_` for them respectively. Since we want to perform a `JOIN` operation, rather than a cross-product, we also have to supply the filter expression `m_museum_id = w_museum_id`. After including these values, the `lenses.json` file should look like this:

```json
{
    "relations": [
        {
            "name": ["lenses", "museums_workers"],
            "join": {
                "relations": [
                    ["museums"],
                    ["workers"]
                ],
                "columnPrefixes": [
                    "m_",
                    "w_"
                ]
            },
            "columns": ...,
            "filterExpression": "m_museum_id = w_museum_id",
            "type": "JoinLens"
        }
    ]
}
```

The only remaining field is `columns`. As mentioned earlier, this field is handled analogously to the basic lens `columns` field, allowing the user to add and remove specific columns. For this example, we want to set the property `:workAddress` for each `:Worker` individual. Because of that, we only require the column `worker_id` from `workers` and `address` from `museums` - all other columns can be hidden, and no column has to be added:

```json
{
    "relations": [
        {
            "name": ["lenses", "museum_workers"],
            "join": {
                "relations": [
                    ["museums"],
                    ["workers"]
                ],
                "columnPrefixes": [
                    "m_",
                    "w_"
                ]
            },
            "columns": {
                "added": [],
                "hidden": [
                    "m_museum_id",
                    "m_name",
                    "m_yearly_income",
                    "m_yearly_spendings",
                    "m_ratings",
                    "w_full_name",
                    "w_role",
                    "w_museum_id",
                    "w_titles",
                    "w_access_level"                   
                ]
            },
            "filterExpression": "m_museum_id = w_museum_id",
            "type": "JoinLens"
        }
    ]
}
```

### Mapping
Now that the lens file is created, we can construct our mapping. For this, we once again start from the mapping template file provided with the tutorial files. 

We can add a mapping entry to it, referencing the newly created lens.

```obda
mappingId	MAPID-museum-worker-address
target		data:worker/{w_worker_id} :workAddress {m_address} .
source		SELECT w_worker_id, m_address FROM lenses.museum_workers;
```

Now, we can test the lens and mapping, by copying the corresponding files to the Ontop endpoint directory and running the following query:

```SPARQL
PREFIX : <http://example.org/museum_kg/>
SELECT ?name ?address WHERE {
    ?worker a :Worker .
    ?worker :name ?name .
    ?worker :workAddress ?address .
}
```

If everything was prepared correctly, this should result in a list of employee names, together with the address of the museum they work at.