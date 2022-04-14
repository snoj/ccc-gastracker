/* eslint-disable */
const { Sequelize, Op, Model, DataTypes } = require('sequelize')

const db = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false
})

const sttx = db.define('sttx', {
  _id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  blockNumber: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  timeStamp: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  transactionHash: {
    type: DataTypes.STRING
  },
  blockHash: {
    type: DataTypes.STRING
  },
  nonce: {
    type: DataTypes.INTEGER
  },
  transactionIndex: {
    type: DataTypes.INTEGER
  },
  from: {
    type: DataTypes.STRING
  },
  to: {
    type: DataTypes.STRING
  },
  value: {
    type: DataTypes.BIGINT
  },
  gas: {
    type: DataTypes.BIGINT
  },
  gasPrice: {
    type: DataTypes.BIGINT
  },
  isError: {
    type: DataTypes.STRING
  },
  input: {
    type: DataTypes.STRING
  },
  contractAddress: {
    type: DataTypes.STRING
  },
  cumulativeGasUsed: {
    type: DataTypes.BIGINT
  },
  gasUsed: {
    type: DataTypes.BIGINT
  }
}, {
  indexes: [
    { name: 'fromBlock', fields: ['blockNumber', 'from', 'to', 'nonce', 'transactionHash', 'transactionIndex'], unique: true }
  ]
})

const viewopts = {
  freezeTableName: true,
  timestamps: false,
  createdAt: false,
  updatedAt: false
}

const views = {
  feesByday: db.define('feesByDay', {
    dayid: { type: DataTypes.STRING, primaryKey: true },
    from: DataTypes.STRING,
    totalGasFees: DataTypes.FLOAT,
    txs: DataTypes.INTEGER,
    min: DataTypes.BIGINT,
    max: DataTypes.BIGINT
  }, viewopts),
  totalFeesByDay: db.define('totalFeesByDay', {
    dayid: { type: DataTypes.STRING, primaryKey: true },
    totalGasFees: DataTypes.FLOAT,
    txs: DataTypes.INTEGER,
    min: DataTypes.BIGINT,
    max: DataTypes.BIGINT
  }, viewopts)
}

module.exports = {
  db,
  sttx,
  views,
  initFinished: Promise.all([sttx.sync({ logging: false })])
}
