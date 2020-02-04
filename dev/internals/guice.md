# Guice Conventions

Each module contains a folder `src/main/java/` and a module `it.unibz.inf.ontop.injection/filename.properties` (e.g., `mapping-default.properties`).

The file specifies to which implementation each interface needs to be instantiated. For instance, `mapping-default.properties` contains the following lines

~~~
##########################################
# Default implementations
##########################################

it.unibz.inf.ontop.spec.OBDASpecificationExtractor =  it.unibz.inf.ontop.spec.impl.DefaultOBDASpecificationExtractor
it.unibz.inf.ontop.spec.mapping.transformer.MappingTransformer = it.unibz.inf.ontop.spec.mapping.transformer.impl.DefaultMappingTransformer
...
~~~

`DefaultOBDASpecificationExtractor` is an implementation for the interface `OBDASpecificationExtractor`. The constructor, private, is injected, that is it has the `@Inject` tag at its beginning.

~~~
@Inject
    private DefaultOBDASpecificationExtractor(MappingExtractor mappingExtractor, MappingTransformer mappingTransformer,
                                              OntopMappingSettings settings) {
        this.mappingExtractor = mappingExtractor;
        this.mappingTransformer = mappingTransformer;
    }
}
~~~

The `@Inject` means that the arguments to the constructor will be provided by the injection mechanism. For instance, the constructor for the second parameter is:

~~~
@Inject
    private DefaultMappingTransformer(MappingVariableNameNormalizer mappingNormalizer,
                                      MappingSaturator mappingSaturator,
                                      ABoxFactIntoMappingConverter inserter,
                                      MappingMerger mappingMerger,
                                      OntopMappingSettings settings,
                                      MappingSameAsInverseRewriter sameAsInverseRewriter,
                                      SpecificationFactory specificationFactory,
                                      RDF rdfFactory,
                                      MappingDistinctTransformer mappingDistinctTransformer) {
        this.mappingNormalizer = mappingNormalizer;
        this.mappingSaturator = mappingSaturator;
        this.factConverter = inserter;
        this.mappingMerger = mappingMerger;
        this.settings = settings;
        this.sameAsInverseRewriter = sameAsInverseRewriter;
        this.specificationFactory = specificationFactory;
        this.rdfFactory = rdfFactory;
        this.mappingDistinctTransformer = mappingDistinctTransformer;
    }
~~~

And a constructor, let's say, for `RDFFactory` is

~~~
public class SimpleRDF implements RDF {

  public SimpleRDF() {
  }
  ...
~~~

As you see, in the end we reach a constructor without parameters.

In `IntelliJ`, the name of the properties file binding a specific interface can also be retrieved through the `find usages` functionality.
