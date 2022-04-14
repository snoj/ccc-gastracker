/* eslint-disable */
const { result, reject } = require('lodash')

class Queue {
  constructor (timeout) {
    this._stack = []
    this._timeout = timeout || 1000
    this._running = false
  }

  enqueue (fn) {
    this._stack.push(fn)
  }

  _promiser (obj) {
    if (typeof obj === 'function') {
      return this._promiser(obj())
    } else if (obj instanceof Promise) {
      return obj
    } else {
      return Promise.resolve(obj)
    }
  }

  _runTilDoneBody () {

  }

  _runTilDone (masterResolve, masterReject) {
    console.log(`dfasdgas ${this._stack.length}`)
    return new Promise((resolve, reject) => {
      masterResolve || (masterResolve = resolve)
      masterReject || (masterReject = reject)

      if (this._stack.length == 0) {
        this._running = null
        masterResolve()
        return
      }

      const next = this._runTilDone.bind(this, masterResolve, masterReject)

      this._promiser(this._stack.shift())
        .finally(() => setTimeout(next, this._timeout))
    })
  }

  // need to fix this, it doesn't iterate.
  // runTilDone(cbsuccess, cberror, cbfinally, forced) {
  runTilDone (cbsuccess, cberror, cbfinally, forced) {
    if (!this._running) { this._running = this._runTilDone() }

    return this._running

    /* if (this._running && !forced) return this._running;
        console.log(`dfasdgas ${this._stack.length}`);

        this._running = new Promise((resolve, reject) => {
            cbsuccess || (cbsuccess = () => { });
            cberror || (cberror = () => { });
            cbfinally || (cbfinally = () => { });

            let item = this._promiser(this._stack.shift());

            item.then(cbsuccess, cberror).finally(cbfinally);
            item.finally(() => setTimeout(this.runTilDone.bind(this, cbsuccess, cberror, cbfinally, true), this._timeout));
        });

        return this._running; */
  }
}

module.exports = {
  Queue
}
