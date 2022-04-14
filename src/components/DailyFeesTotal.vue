<template>
    <div>Daily Fees Total</div>
  <data-table :rows='gasfees' :columns='columns' sortable />
</template>
<script>
import { defineComponent } from 'vue'
import { DataTable } from '@jobinsjp/vue3-datatable'
import querystring from 'querystring'
import '@jobinsjp/vue3-datatable/dist/style.css'

export default defineComponent({
  components: { DataTable },
  data () {
    return {
      columns: {
        dayid: 'Day',
        from: 'Batch',
        totalGasFees: 'Gas (in AVAX)'
      },
      tmpGasfees: [] // (await fetch('/gasfees')).json()
    }
  },
  computed: {
    gasfees: function () {
      return this.tmpGasfees || []
    }
  },
  methods: {
    async initData () {
      window.that = this

      this.tmpGasfees = (await (await fetch(`/gasfeestotal?${querystring.stringify(this.$route.query)}`)).json())?.data || []
    }
  },
  async beforeMount () {
    await this.initData()
  }
})
</script>
