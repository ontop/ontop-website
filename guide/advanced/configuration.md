# Configuration keys

Here is a list of the configuration keys which can be set in the properties file.

<json-table v-bind:json="json"/>

<script>
    export default {
        data() {
            return {
                json : {}
            }
        },
        async created() {
            const response = await fetch("https://raw.githubusercontent.com/ontop/ontop/feature/property-description-with-type/documentation/property_description.json");
            const responseJson = await response.json();
            this.json = responseJson;
        }
    }
</script>
