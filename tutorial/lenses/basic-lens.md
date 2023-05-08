# Basic Lens

Basic lenses can be used on one base relation, over which we can apply a filter, an extended projection, and additional constraints.

## Projection

For this section, we first look at the table `museums` from the DuckDB database. This table has the following schema:

column | type |
----- | ------- |
museum_id | integer
name | string
address | string
yearly_income | integer
yearly_spendings | integer
ratings | array of floats

The column `museum_id` is a primary key.  

Now, we make two decisions:
1. The `ratings` column is not important to us, so we want to remove it.
2. The columns `yearly_income` and `yearly_spendings` are not interesting, but we would like to know the yearly profit (*income - spendings*)

Both of these goals can be achieved using a single basic lens. The basic lens has the following structure:
```json
{
    "name": [String],
    "baseRelation": [String],
    "columns": {
        "added": [{
            "name": String,
            "expression": String
        }],
        "hidden": [String]
    },
    "filterExpression": String,
    "type": "BasicLens"
}
```

We can prepare our `lenses.json` file like this:
```json
{
    "relations": [
        {
            "name": ["lenses", "museum_projection"],
            "baseRelation": ["museums"],
            "columns": {
                "added": ..., 
                "hidden": ...
            },
            "type": "BasicLens"
        }
    ]
}
```
As we do not require a filter, we do not need the field `filterExpression`.
The field `columns` can be used to list existing columns that should be removed and new columns that should be added.

Above, we decided that the fields `ratings`, `yearly_income` and `yearly_spendings` are not interesting to us. We can easily hide them by including their names in the `hidden` list.

To add a new `yearly_profit` field, we have to add one entry to the `added` list, using `yearly profit` as its name, and using the expression `yearly_income - yearly_spendings` in its `expression` field.

::: tip NOTE
Even though we have decided to hide the columns `yearly_income` and `yearly_spendings`, we can still use them for expressions within the same lens.
:::

After making these changes, the full `lenses.json` file should look like this:
```json
{
    "relations": [
        {
            "name": ["lenses", "museum_projection"],
            "baseRelation": ["museums"],
            "columns": {
                "added": [
                    {
                        "name": "yearly_profit",
                        "expression": "CAST(yearly_income - yearly_spendings as INTEGER)"
                    }
                ],
                "hidden": ["ratings", "yearly_income", "yearly_spendings"]
            },
            "type": "BasicLens"
        }
    ]
}
```

:::tip NOTE
In the expression for `yearly_profit`, we cast the result of the subtraction to an `INTEGER`. This way, Ontop is guaranteed to know that the column will be of type `INTEGER`.
:::

### Mapping
Now that we have created a basic lens to re-format the input table, we can use the lens in a mapping. For this, we start with the mapping template provided in the tutorial files. This template already contains basic mappings that define individuals of the classes `:Museum` and `:Worker`. 

We now want to set the `:yearlyProfit` datatype property for all museums. We can achieve that by adding the following mapping:

```obda
mappingId	MAPID-museum-profit
target		data:museum/{museum_id} :yearlyProfit {yearly_profit} .
source		SELECT museum_id, yearly_profit FROM lenses.museum_projection;
```

After doing that, we can copy the `lenses.json` and `mapping.obda` files into the Ontop endpoint `input` directory, as described in the [setup page](setup.md) and start the endpoint. Once the endpoint is started, we can open the SPARQL query editor at [http://localhost:8080](http://localhost:8080) and run the following query to test it:

```SPARQL
PREFIX : <http://example.org/museum_kg/>
SELECT ?name ?profit WHERE {
    ?museum a :Museum .
    ?museum :name ?name .
    ?museum :yearlyProfit ?profit .
}
```

If the lenses and mappings were constructed correctly, this query should return a list of museum names, together with different values for their yearly profit.

::: tip NOTE
Notice how by changing the source query by adding `ratings`, `yearly_income`, or `yearly_spendings` to it, the execution of the mapping fails, stating that the columns were not found. This is because they were hidden by the lens. 
:::

## Filter

Another use case of basic lenses is to filter out some specific rows from the input table. As an example, we will look at the table `workers`. This table has the following schema:

column | type |
----- | ------- |
worker_id | integer
full_name | string
role | string
museum_id | integer
titles | array of strings
access_level | integer

The column `worker_id` is a primary key. The column `museum_id` is a foreign key that references the table `museums`.

The column `role` is a string that indicates the name of the worker's role. It can take the following three values: `"manager"`, `"guide"`, and `"guard"`. For our VKG, we decide that we want to designate all managers as individuals of the class `:Manager`. One way to achieve this is to use the filter feature of basic lenses.

We can prepare our `lenses.json` file like this:
```json
{
    "relations": [
        {
            "name": ["lenses", "managers_filter"],
            "baseRelation": ["workers"],
            "filterExpression": ...,
            "type": "BasicLens"
        }
    ]
}
```

The `columns` field can be removed, as it is not required for this example. Now, we just need to define a value for the field `filterExpression` that ignores all rows for which the column `role` is not equal to `"manager"`. The `filterExpression` is defined as a SQL expression in the same style as SQL `WHERE` clauses.

After making this change, the full `lenses.json` file should look like this:
```json
{
    "relations": [
        {
            "name": ["lenses", "managers_filter"],
            "baseRelation": ["workers"],
            "filterExpression": "role = 'manager'",
            "type": "BasicLens"
        }
    ]
}
```

### Mapping
We can once again use the generated lens in our mapping file. For this, we will again extend the mapping template with one new mapping:

```obda
mappingId	MAPID-worker-managers
target		data:worker/{worker_id} a :Manager .
source		SELECT worker_id FROM lenses.managers_filter;
```

Then, we start the Ontop endpoint and open the SPARQL editor to run the following query:

```SPARQL
PREFIX : <http://example.org/museum_kg/>
SELECT ?name WHERE {
    ?worker a :Manager .
    ?worker :name ?name .
}
```

This should result in a list of *3* manager names.

:::warning
All examples in the lens sections are compatible with each other. However, all lenses referenced in the mapping file need to be included in `lenses.json`. If you wish to continuously extend the mapping file throughout the tutorial,
you will also need to keep all previous lenses in the `relations` list of the lenses file, otherwise, Ontop will throw an error. Alternatively, you can always start each of the sections from a new mapping template file. This way, only the lenses of the current exercise have to be included.
:::

As an extension to this exercise, you can now try to define similar lenses and mappings for the `"guide"` and `"guard"` roles, assigning them to the classes `:Guide` and `:Guard`, respectively.

## Adding Constraints

Another valuable feature of lenses is adding further constraints to relations. This feature is supported for **all** types of lenses, but we will cover it in this section only. 

Generally, Ontop can infer many constraints from the base relation used by a lens. For instance, the field `museum_id` in the table `museumS` is a primary key, so it is *unique* and *not null*. Our previously defined lens will be able to infer that the output relation is still unique and not null. On the other hand, for composite primary keys, if one part of the composite key is hidden by a lens, then Ontop knows that the remaining part is no longer guaranteed to be unique.

In many instances, however, expert knowledge can be used to define further constraints for lenses. A full list of all supported constraints and how they can be defined can be found in the [documentation of lenses](../../guide/advanced/lenses.md).

For this section, we want to use our expert knowledge of the table `workers` to provide the following constraints:
1. The name of a worker is *unique* and *not null*.
2. The role of a worker is *not null*
3. There is a functional dependency from *role* to *access_level*.
4. The column `museum_id` is a foreign key that references the table `museums` (DuckDB does not have a notion of foreign keys, so it is useful to add it explicitly).
5. The `role` column is *IRI-safe* (all possible values of the column can be safely included in an IRI without further encoding).
    
We can create a basic lens over the table `workers` to define these constraints, following the guidelines from the [documentation of lenses](../../guide/advanced/lenses.md). A possible solution could look like this:
```json
{
    "relations": [
        {
            "name": ["lenses", "workers_constraints"],
            "baseRelation": ["workers"],
            "uniqueConstraints": {
                "added": [
                    {
                        "name": "uc",
                        "determinants": ["full_name"]
                    }
                ]
            },
            "nonNullConstraints": {
                "added": [
                    "full_name",
                    "role"
                ]
            },
            "otherFunctionalDependencies": {
                "added": [
                    {
                        "determinants": ["role"],
                        "dependents": ["access_level"]
                    }
                ]
            },
            "foreignKeys": {
                "added": [
                    {
                        "name": "fk",
                        "from": ["museum_id"],
                        "to": {
                            "relation": ["museumS"],
                            "columns": ["museum_id"]
                        }
                    }
                ]
            },
            "iriSafeConstraints": {
                "added": [
                    "role"
                ]
            },
            "type": "BasicLens"
        }
    ]
}
```

**Lenses can reference each other!** As a further exercise, you can try using this newly created lens as the `baseRelation` of the managers filter from before. Once that is done, you can query it again - the results should be the same as before.

:::tip NOTE
We could also have added all of these constraints to the same `managers_filter` lens from the previous section to achieve the same results. This has the advantage of reducing the work required for the lens setup and reducing the total number of relations accessible by Ontop, but it is less flexible, as we would have to copy all the constraints to the `guides_filter` and `guard_filter` lenses as well, resulting in a lot of duplication.

Generally, the optimal solution depends on the specific scenario.
:::
