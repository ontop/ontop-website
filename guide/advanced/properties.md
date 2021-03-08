# Properties


### Top-level keys

<json-table v-bind:json="json"/>

<script>
    export default {
        data() {
            return {
                json : {}
            }
        },
        async created() {
            const response = await fetch("https://jsonplaceholder.typicode.com/posts/1/comments");
            const responseJson = await response.json();
            this.json = responseJson;
        }
    }
</script>
