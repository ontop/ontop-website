<template>
  <table>
    <thead>
      <tr>
        <th>Key</th>
        <th>Description</th>
      </tr>
    </thead>

    <tbody>
        <tr v-for="(value, propertyName) in json">
          <td>{{ propertyName }}</td>
          <td>{{ value }}</td>
        </tr>
    </tbody>
  </table>

</template>

<script>
export default {
  props: ['json'],
  name: "json-table"
}
</script>

<style scoped>

</style>
