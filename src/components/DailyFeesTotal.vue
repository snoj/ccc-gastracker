<template>
  <div>Daily Fees Total</div>
  <!--<data-table :rows='gasfees' :columns='columns' sortable />-->
  <data-table :dtid="dt-dailyfees" :dtData="gasfees" :columns="dtColumns" :options="dtOptions" />
</template>
<script>
import { defineComponent } from 'vue'
// import { DataTable } from '@jobinsjp/vue3-datatable'
// import querystring from 'querystring'
import '@jobinsjp/vue3-datatable/dist/style.css'
import DataTable from './DataTable.vue'
// import $ from 'jquery'
import _ from 'lodash'

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
      return _.filter(this.tmpGasfees || [], this?.$route?.query || null)
    }
  },
  methods: {
    async initData () {
      this.tmpGasfees = (await (await fetch('/gasfeestotal')).json())?.data || []
    }
  },
  async beforeMount () {
    await this.initData()
  }
})
</script>
