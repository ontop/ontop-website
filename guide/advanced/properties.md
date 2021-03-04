# Configuration properties

Ontop is mainly configured by through entries in a [properties file](https://en.wikipedia.org/wiki/.properties). 
This page lists the available properties except those used for binding an implementation to an interface. 

<script>

export default {
    data() {
        return {
            json : {}
        }
    },
    async created() {
        const response = await fetch("https://raw.githubusercontent.com/ontop/ontop/feature/property-description/documentation/property_description.json");
        const responseJson = await response.json();
        this.json = responseJson;
    }
}
</script>

<vue-json-to-table :data="json"></vue-json-to-table>
