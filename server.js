/* eslint-disable */

Promise.delay = function (timeout) {
  return Promise(function (r) {
    setTimeout(r.bind(null, timeout), timeout)
  })
}

const conf = {
  keys: require('./constants/keys.json')
}

const querystring = require('querystring')

const _ = global.ld = require('lodash')
const { default: axios } = require('axios')

const { db, sttx, views: dbViews, initFinished } = require('./models')
const { Queue } = require('./queue')

const batches = _.keys(require('./constants/huntBatchPool.json'))

const express = require('express')
const serveStatic = require('serve-static')

const JobQueue = new Queue()

const app = express()

/**
 *
 * @param {string} targetAddress
 */
async function fetchTransactions (targetAddress) {
  const cleanTargetAddress = targetAddress.toLowerCase()
  return new Promise(async function (masterResolve, masterReject) {
    const lastKnownBlock = ((await sttx.max('blockNumber', {
      where: {
        from: cleanTargetAddress
      }
    }, { logging: false })) || 10855480) + 1

    let qs = querystring.stringify({
      module: 'account',
      action: 'txlist',
      address: targetAddress,
      startblock: lastKnownBlock,
      apikey: process.env.SNOWTRACEKEY || conf?.keys?.snowtrace
    })
    
    const url = `https://api.snowtrace.io/api?${qs}`

    console.log(targetAddress, lastKnownBlock, url)
    const reqresult = await axios.get(url).catch(() => ({ data: { result: [] } }))

    const fixed = _.map(_.filter(reqresult.data.result, ['from', cleanTargetAddress]), d => {
      d.transactionHash = d.hash
      return d
    })
    console.log(`axios finished for ${targetAddress} ${reqresult?.data?.result?.length || 0} ${fixed.length}`)

    return await sttx.bulkCreate(fixed, { logging: false }).catch((err) => {
      console.log('herm, failed...trying backup method')
      return Promise.allSettled(_.map(fixed, d => sttx.upsert(d, { logging: false })))
    }).finally(() => console.log(`done with ${targetAddress}`)).finally(masterResolve)
  })
}

function updateGasStats (once) {
  console.log('updating gas stats')
  _.each(batches, (b) => {
    console.log(`enqueuing ${b}`)
    JobQueue.enqueue(fetchTransactions.bind(null, b))
  })

  JobQueue.runTilDone().finally(() => once || setTimeout(updateGasStats, 10000))
}

initFinished.then(() => updateGasStats())

app.get('/triggerupdate', function (req, res) {
  initFinished.then(() => updateGasStats(true))
  res.send({ status: 'OK', msg: 'Updating database...' })
})

app.get('/gasfees', function (req, res) {
  const where = {}

  req?.query?.dayid && (where.dayid = req?.query?.dayid)
  req?.query?.from && (where.from = req?.query?.from)

  /*
    This is vestigial from a poorly conceived idea that it would provide some insight
    on what gas prices might be.  However since the database only knows about our stuff,
    it's not too helpful in figuring out if delaying a transaction might be worthwile.
    */
  // req?.query?.year && (where.year = req?.query?.year);
  // req?.query?.month && (where.month = req?.query?.month);
  // req?.query?.day && (where.day = req?.query?.day);
  // req?.query?.hour && (where.hour = req?.query?.hour);

  dbViews.feesByday.findAll({ where }).then(data => res.send({ data }))
})

app.get('/gasfeestotal', function (req, res) {
  const where = {}

  req?.query?.dayid && (where.dayid = req?.query?.dayid)

  dbViews.totalFeesByDay.findAll({ where }).then(data => res.send({ data }))
})

app.use(serveStatic('dist', { index: ['index.html'] }))
app.listen(process.env.PORT || 8080)
