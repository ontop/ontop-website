# Ontop views
*Since 4.2.0 (was experimental in 4.1.x)*


## Example


## Document root


```json
{ 
    "relations": [ViewDefinition]
}
```

## `ViewDefinition`

### Common fields
```json
{
    "name": [String],
    "uniqueConstraints": {
        "added": [UniqueConstraint]
    },
    "otherFunctionalDependencies": {
        "added": [OtherFunctionalDependency]
    },
    "foreignKeys": {
        "added": [ForeignKey]
    },
    "nonNullConstraints": {
        "added": [String]
    },
    "type": String
}
```

| Key                | Type      | Description                                     |
| ------------------ | --------- | ---------------------------------------------   |
| `name`          | Array of Strings | View name components (with correct quoting) |
| `uniqueConstraints` | JSON Object | Optional
| `uniqueConstraints.added` | Array of `UniqueConstraint` | |
| `otherFunctionalDependencies` | JSON Object | Optional |
| `otherFunctionalDependencies.` `added` | Array of `OtherFunctionalDependency`-s | |
| `foreignKeys` | JSON Object | Optional
| `foreignKeys.added` | Array of `ForeignKey`-s | |
| `nonNullConstraints` | JSON Object | Optional
| `nonNullConstraints.added` | Array of Strings | Names of non-null columns (with correct quoting). One string per column |
| `type` | String | Either `BasicViewDefinition`, `JoinViewDefinition` or `SQLViewDefinition`

### `BasicViewDefinition`

The most basic form of views.

In addition to the common attributes, basic view definitions accept the following ones:
```json
{
    "baseRelation": [String],
    "columns": {
        "added": [AddedColumn]
    },
    "filterExpression": String,
    "type": "BasicViewDefinition"
}
```

| Key                | Type      | Description                                     |
| ------------------ | --------- | ---------------------------------------------   |
| `baseRelation`          | Array of Strings | Name components of the parent relation (with correct quoting) |
| `columns` | JSON Object |
| `columns.added` | Array of `AddedColumn` | |
| `filterExpression` | String | Expression expressed in the SQL dialect of the data source. Can be empty |

#### `AddedColumn`

```json
{
    "name": String,
    "expression": String
}
```

| Key                | Type      | Description                                     |
| ------------------ | --------- | ---------------------------------------------   |
| `name`          | String | New column name (with correct quoting) |
| `expression` | String | SQL expression defining the column. Can only refer to columns from the parent relations, not to newly created columns |

### `JoinViewDefinition`

In addition to the common attributes, join view definitions accept the following ones:
```json
{
    "join": {
        "relations": [[String]],
        "columnPrefixes": [String]
    },
    "columns": {
        "added": [AddedColumn]
    },
    "filterExpression": String,
    "type": "JoinViewDefinition"
}
```

| Key                | Type      | Description                                     |
| ------------------ | --------- | ---------------------------------------------   |
| `join`          | JSON Object | |
| `join.relations`          | Array of arrays of Strings | Arrays of the name components of each parent relation (with correct quoting)|
| `join.columnPrefixes`       | Array of Strings | Prefix for each parent relation to be applied on its column names. Follows the same order as `join.relations`. |
| `columns` | JSON Object |
| `columns.added` | Array of `AddedColumn` | |
| `filterExpression` | String | Expression expressed in the SQL dialect of the data source. Can be empty |


### `SQLViewDefinition`

In addition to the common attributes, SQL view definitions accept the following ones:
```json
{
    "query": String,
    "type": "JoinViewDefinition"
}
```

| Key                | Type      | Description                                     |
| ------------------ | --------- | ---------------------------------------------   |
| `query` | String | SQL query |



## Constraints

### `UniqueConstraint`

```json
{
    "name": String,
    "determinants": [String]
}
```

| Key                | Type      | Description                                     |
| ------------------ | --------- | ---------------------------------------------   |
| `name` | String | Name of the unique constraint |
| `determinants` | Array of Strings | Column names (with correct quoting) |

### `OtherFunctionalDependency`

Useful for dealing with denormalized data, where unique constraints cannot be applied.

```json
{
    "determinants": [String],
    "dependents": [String]
}
```

| Key                | Type      | Description                                     |
| ------------------ | --------- | ---------------------------------------------   |
| `determinants` | Array of Strings | Column names (with correct quoting) that determine the values of dependent columns |
| `dependents` | Array of Strings | Column names (with correct quoting) whose values are determined by determinant columns |


### `ForeignKey`

```json
{
    "name": String,
    "from": [String],
    "to": {
        "relation": [String],
        "columns": [String]
    }
}
```

| Key                | Type      | Description                                     |
| ------------------ | --------- | ---------------------------------------------   |
| `name` | String | Name of the foreign key |
| `from` | Array of Strings | Source columns (with correct quoting) |
| `to`   | JSON Object | |
| `to.relation` | Array of Strings | Name components of the target relation (with correct quoting) |
| `to.columns` | Array of Strings | Target columns (with correct quoting). Same order as for the source columns |