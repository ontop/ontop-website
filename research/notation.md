# Notation

::: warning
TODO: CHECK/UPDATE (2 years old and formatted in AsciiDocs)
:::

We assume a countably infinite domain D being queried,
a finite set P of predicates disjoint from D,
and an interpretation function ||.|| defined over P,
which to each predicate p in P associates a subset ||p|| of (D \union \{NULL\})^i^,
for some positive integer i.
The _signature_ sig(Q) of a (sub)query Q is a subset of P.
An the interpretation ||Q|| of Q is built inductively as usual,
out of all ||p|| such that p is sig(Q),
by application of RA operators.

In addition,
we assume a countably infinite set A of attribute names,
distinct from D and P.
If ||Q|| is the interpretation of (sub)query Q,
then the function att(||Q||) associates to ||Q|| a finite tuple ofn distinct elements of A,
and n is called the _arity_ of ||Q||.   



NOTE: It is also assumed in what follows that the algebraic expression corresponding to an intermediate query is syntactically valid,
according to standard requirements on RA operators.
For instance,
when a projection is performed,
the projected attributes must be a subset of the attributes of the argument relation.
Similarly,
the arguments of a union operator must have identical set of attributes (this is not natively the case of the UNION SPARQL operator,
but can be enforced with a straightforward normalization).
