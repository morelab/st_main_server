'use strict';

const Influx = require('influx');

const influx = new Influx.InfluxDB({
  host: 'www.st-influxdb.apps.openshift.deustotech.eu/',
  database: 'sentient',
  schema: [
    {
      measurement: 'consumption',
      fields: {
        value: Influx.FieldType.FLOAT,
      },
      tags: [
        'sentient_user_id',
      ],
    },
  ],
});


module.exports = influx;
