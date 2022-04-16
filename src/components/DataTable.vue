<template>
  <table v-bind:id="elementId"></table>
</template>

<script>
// Bootstrap and jQuery libraries
import 'bootstrap/dist/css/bootstrap.min.css'
import 'jquery/dist/jquery.min.js'
// Datatable Modules
import 'datatables.net-dt/js/dataTables.dataTables'
import 'datatables.net-dt/css/jquery.dataTables.min.css'
import $ from 'jquery'
import _ from 'lodash'

export default {
  props: {
    dtid: { type: String, required: false },
    data: { type: Array, required: false },
    options: { type: Object, required: false },
    columns: { type: Array, require: false }
  },
  data () {
    return {
      generatedElementId: _.uniqueId('dt'),
      table: null
    }
  },

  computed: {
    elementId () {
      return this.dtid || this.generatedElementId
    }
  },

  setup () {
    // this.generatedElementId = _.uniqueId('dt')
  },

  updated () {
    if (this.table?.destroy != null) {
      this.table.destroy()
    }
    const o = _.defaults(this.options, { columns: this.columns }, { data: this.data })
    this.table = $(`#${this.elementId}`).DataTable(o)
  }
}
</script>
