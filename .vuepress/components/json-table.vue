<template>
  <table>
    <thead>
      <tr>
        <th class="properties-table-key-header">Key</th>
        <th class="properties-table-type-header">Type</th>
        <th class="properties-table-description-header">Description</th>
      </tr>
    </thead>

    <tbody>
        <tr v-for="(value, propertyName) in json">
          <td class="properties-table-key-header"><code>{{ propertyName }}</code></td>
          <td class="properties-table-key-header">{{ value.type }}</td>
          <td class="properties-table-description-header">
            <component v-if="dynamicComponent" :is="dynamicComponent" :content="value.description"></component>
          </td>
        </tr>
    </tbody>
  </table>

</template>

<script>
export default {
  props: ['json'],
  name: "json-table",
  data() {
    return {
      dynamicComponent: null
    }
  },
  mounted () {
    import('markdown-it-vue').then(module => {
      this.dynamicComponent = module.default
    })
  }
}
</script>

<style scoped>

.properties-table-key-header {
  max-width: 17rem;
  white-space: pre-line;
  overflow-wrap: break-word;
}

.properties-table-description-header {

}

</style>
