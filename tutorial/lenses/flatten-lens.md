# Flatten Lens

Flattening or unnesting an array is the process of transforming a nested array into an array of lower dimensionality, by "pulling" each nested entry into its "outer" entry. In databases, specifically, it represents a function that takes a column containing an array and transforms it into a table that has each of the *outer-most* elements as one of its rows.

Flattening is need when we want to map values inside arrays.

In Ontop, a flatten lens is a type of lens over a single base relation that takes as an input the column that should be flattened, the names of columns that should be retained after flattening, and the name of the column that should be added containing the flattened output. Additionally, the name for a *position* column can be passed to the lens. When flattening, the *position* column will hold the index of the current row's flattened element in the original array.

For this example, we will first look at the table `workers`. This table has the following schema:

column | type |
----- | ------- |
worker_id | integer
full_name | string
role | string
museum_id | integer
titles | array of strings
access_level | integer

The column `titles` is an array of strings that contains all the degrees and titles the employee has received. Our goal is to populate the datatype properties `:hasTitle` defined from the `:Worker` class to any number of string literals taken from the table, and `:preferredTitle`, defined from the `:Worker` class to a single literal, which is the first entry of the `titles` array. To do so efficiently, we need to flatten the `titles` column.

The flatten lens has the following structure:
```json
{
    "name": [String],
    "baseRelation": [String]
    "flattenedColumn": {
        "name": String,
        "datatype": String
    },
    "columns": {
        "kept": [String],
        "new": String,
        "position": String
    },
    "type": "FlattenLens"
}
```

The field `kept` takes a list of column names from the original table that should be retained after flattening. The field `new` takes the name of the column that contains the flattened output and the field `position` takes the name of the column that contains the index of the current output. The flattened column takes two arguments: `name` determines the name of the column that should be flattened, and `datatype` indicates the column's type. Depending on the SQL dialect, this can vary from `ARRAY<T>` or `T[]` where `T` is a different SQL data type to `JSON` or `VARCHAR` if arrays are represented and flattened in JSON format.

In DuckDB, the array data type is defined as `T[]`, so in our specific case, the field `datatype` will take the value `STRING[]`.

A possible `lenses.json` file for this task may look like this:

```json
{
    "relations": [
        {
            "name": ["lenses", "flattened_titles"],
            "baseRelation": ["workers"],
            "flattenedColumn": {
                "name": "titles",
                "datatype": "STRING[]"
            },
            "columns": {
                "kept": [
                    "worker_id"
                ],
                "new": "title",
                "position": "index"
            }
        }
    ]
}
```

As we just need to assign a title to a `:Worker` individual, the only column that has to be kept is `worker_id`.

### Mapping

Now, we can already define the mapping entries for the wanted properties:

```obda
mappingId	MAPID-has-title
target		data:worker/{worker_id} :hasTitle {title} .
source		SELECT worker_id, title FROM lenses.flattened_titles;

mappingId	MAPID-preferred-title
target		data:worker/{worker_id} :preferredTitle {title} .
source		SELECT worker_id, title FROM lenses.flattened_titles WHERE index = 1;
```

:::tip NOTE
Instead of using a source query with a `WHERE` condition in the second mapping, we could also wrap a basic lens around the flatten lens that performs the filter operation, but we kept it like this for the sake of simplicity.
:::

Let us now run a SPARQL query over the Ontop endpoint to test our mappings and lenses.

```SPARQL
PREFIX : <http://example.org/museum_kg/>
SELECT ?name ?title ?prefTitle WHERE {
    ?worker a :Worker .
    ?worker :name ?name .
    ?worker :hasTitle ?title .
    ?worker :preferredTitle ?prefTitle
}
```

This should result in a list of all employees, together with their titles and their preferred title.

### Flattening other types of arrays

The flatten lens works on all types of arrays, and, depending on the capabilities of the dialect, can infer the output type of the flattened column. As a further exercise, try looking at the table `museums`.

column | type |
----- | ------- |
museum_id | integer
name | string
address | string
yearly_income | integer
yearly_spendings | integer
ratings | array of floats

The field `ratings` is an array of floating point numbers between 1 and 10. Try creating a flatten lens that can unnest this array to populate the datatype property `:hasRating`! Ontop will be able to automatically detect that the flattened column has the type `FLOAT`. Keep in mind that we do not necessarily need a "position" column for this use case.

:::warning
When arrays in a given dialect are defined as `ARRAY<T>`, `T[]`, or similarly, Ontop is able to infer the data type of the output column after flattening. However, when this is not the case (either the array was provided as JSON or the array data type of the dialect is simply called `ARRAY` or similarly), Ontop cannot perform this inference. In those cases, it is suggested to put a basic lens over the flatten lens that explicitly performs a `CAST` on the output, to allow Ontop to know the column type once again.
:::

:::warning
The level of support for the flatten lens depends strongly on the dialect. Please consult the [flatten lens documentation page](../../guide/advanced/lenses.md) for more info on each supported dialect.
:::
