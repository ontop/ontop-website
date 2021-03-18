# Properties


### Top-level keys

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
            const response = await fetch("https://raw.githubusercontent.com/ontop/ontop/feature/property-description-with-type/documentation/property_description.json");
            const responseJson = await response.json();
            this.json = responseJson;
        }
    }
</script>
