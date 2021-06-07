# Configuration keys

Here is a list of the configuration keys which can be set in the properties file.

<ClientOnly>
  <json-table v-bind:json="json"/>
</ClientOnly>


<script>
    export default {
        data() {
            return {
                json : {}
            }
        },
        async mounted() {
            const response = await fetch("https://raw.githubusercontent.com/ontop/ontop/version4/core/model/src/main/resources/property_description.json");
            const responseJson = await response.json();
            this.json = responseJson;
        }
    }
</script>
