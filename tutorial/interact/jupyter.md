
# Use Jupyter Notebook with an Ontop SPARQL endpoint

This tutorial shows how to use Python/Jupyter Notebook to interact with an Ontop SPARQL endpoint.

Link to the Jupyter Notebook: [ontop-jupyter.ipynb](ontop-jupyter.ipynb)

Assume that the endpoint is already set up and the URL is <http://localhost:8080/sparql>.


## SPARQLWrapper

You can use the SPARQLWrapper library <https://rdflib.github.io/sparqlwrapper/> to send SPARQL queries and get results. 
The following code gets the result as JSON documents and convert it to a Python dict object.  


```python
from SPARQLWrapper import SPARQLWrapper, JSON
sparql = SPARQLWrapper("http://localhost:8080/sparql")
q = """
PREFIX : <http://example.org/voc#>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>

SELECT ?lname ?title 
WHERE {

  ?attendee foaf:lastName ?lname ;
      :attends ?course .

  ?course :title ?title .
}
"""
sparql.setQuery(q)
sparql.setReturnFormat(JSON)
results = sparql.query().convert()
print(results)
```

    {'head': {'vars': ['lname', 'title']}, 'results': {'bindings': [{'lname': {'type': 'literal', 'value': 'Robards'}, 'title': {'type': 'literal', 'value': 'Data Mining'}}, {'lname': {'type': 'literal', 'value': 'Smith'}, 'title': {'type': 'literal', 'value': 'Operating Systems'}}, {'lname': {'type': 'literal', 'value': 'Doe'}, 'title': {'type': 'literal', 'value': 'Linear Algebra'}}, {'lname': {'type': 'literal', 'value': 'Combs'}, 'title': {'type': 'literal', 'value': 'Operating Systems'}}, {'lname': {'type': 'literal', 'value': 'Doe'}, 'title': {'type': 'literal', 'value': 'Analysis'}}, {'lname': {'type': 'literal', 'value': 'Hinkley'}, 'title': {'type': 'literal', 'value': 'Data Mining'}}, {'lname': {'type': 'literal', 'value': 'Robards'}, 'title': {'type': 'literal', 'value': 'Research Methods'}}, {'lname': {'type': 'literal', 'value': 'Smith'}, 'title': {'type': 'literal', 'value': 'Analysis'}}, {'lname': {'type': 'literal', 'value': 'Smith'}, 'title': {'type': 'literal', 'value': 'Linear Algebra'}}, {'lname': {'type': 'literal', 'value': 'Combs'}, 'title': {'type': 'literal', 'value': 'Linear Algebra'}}, {'lname': {'type': 'literal', 'value': 'Hinkley'}, 'title': {'type': 'literal', 'value': 'Theory of Computing'}}, {'lname': {'type': 'literal', 'value': 'Alfaro'}, 'title': {'type': 'literal', 'value': 'Introduction to programming'}}, {'lname': {'type': 'literal', 'value': 'Hinkley'}, 'title': {'type': 'literal', 'value': 'Software factory'}}, {'lname': {'type': 'literal', 'value': 'Mendez'}, 'title': {'type': 'literal', 'value': 'Software factory'}}, {'lname': {'type': 'literal', 'value': 'Mendez'}, 'title': {'type': 'literal', 'value': 'Software process management'}}, {'lname': {'type': 'literal', 'value': 'Moses'}, 'title': {'type': 'literal', 'value': 'Information security'}}, {'lname': {'type': 'literal', 'value': 'Moses'}, 'title': {'type': 'literal', 'value': 'Discrete mathematics and logic'}}]}}


## Pandas DataFrame

You might want to convert the SPARQL results to a pandas DataFrame for data analysis. 
The library `sparql-dataframe` <https://github.com/lawlesst/sparql-dataframe> is handy for this.


```python
import sparql_dataframe

endpoint = "http://localhost:8080/sparql"

q = """
    PREFIX : <http://example.org/voc#>
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
    
    SELECT ?lname ?course_title 
    WHERE {
    
      ?attendee foaf:lastName ?lname ;
          :attends ?course .
      ?course :title ?course_title .
    }
"""

df = sparql_dataframe.get(endpoint, q)
```


```python
df.head()
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>lname</th>
      <th>course_title</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>Robards</td>
      <td>Data Mining</td>
    </tr>
    <tr>
      <th>1</th>
      <td>Smith</td>
      <td>Operating Systems</td>
    </tr>
    <tr>
      <th>2</th>
      <td>Doe</td>
      <td>Linear Algebra</td>
    </tr>
    <tr>
      <th>3</th>
      <td>Combs</td>
      <td>Operating Systems</td>
    </tr>
    <tr>
      <th>4</th>
      <td>Doe</td>
      <td>Analysis</td>
    </tr>
  </tbody>
</table>
</div>




```python
df.describe()
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>lname</th>
      <th>course_title</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>count</th>
      <td>17</td>
      <td>17</td>
    </tr>
    <tr>
      <th>unique</th>
      <td>8</td>
      <td>11</td>
    </tr>
    <tr>
      <th>top</th>
      <td>Smith</td>
      <td>Linear Algebra</td>
    </tr>
    <tr>
      <th>freq</th>
      <td>3</td>
      <td>3</td>
    </tr>
  </tbody>
</table>
</div>




```python
df['course_title'].value_counts().plot(kind='bar')
```




    <matplotlib.axes._subplots.AxesSubplot at 0x11475ebd0>




![png](output_6_1.png)

