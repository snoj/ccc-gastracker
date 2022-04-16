<template>
  <div>Daily Fees Total</div>
  <!--<data-table :rows='gasfees' :columns='columns' sortable />-->
  <data-table :dtid="dt-dailyfees" :data="gasfees" :columns="dtColumns" :options="dtOptions" />
</template>
<script>
import { defineComponent } from 'vue'
// import { DataTable } from '@jobinsjp/vue3-datatable'
import querystring from 'querystring'
import '@jobinsjp/vue3-datatable/dist/style.css'
import DataTable from './DataTable.vue'
// import $ from 'jquery'

export default defineComponent({
  components: { DataTable },
  data () {
    return {
      columns: {
        dayid: 'Day',
        from: 'Batch',
        totalGasFees: 'Gas (in AVAX)'
      },
      dtOptions: {
        order: [[0, 'desc']]
      },
      dtColumns: [
        { title: 'Day', data: 'dayid', render: (d) => `<a href="#/dailyfees?dayid=${d}">${d}</a>` },
        { title: 'Gas (in AVAX)', data: 'totalGasFees' }
      ],
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
  },
  async unmounted () {
    console.log('unmounted dailyfees')
  }
})
</script>
