"use strict";

const express = require('express');
const moment = require('moment');

module.exports = function(config) {
  const router = express.Router();
  function validateParams(req, res, next) {
    // make sure that the request has both "from" and "to" params
    let { from, to } = req.query;
    let error = null;

    if (from && to) {
      try {
        from = moment(from);
        to = moment(to);
        if (from <= to) {
          res.locals.from = from;
          res.locals.to = to;
        } else {
          error = "'from' date must be before 'to' date";
        }
      } catch (err) {
        console.error(err);
        error = "invalid date format for parameters from or to. expecting format 'YYYY-MM-DD'.";
      }
    } else {
      error = "parameter 'from' and 'to' required";
    }

    if (!error) {
      next();
    } else {
      res.status(400).send({error});
    }
  }

  /**
   * @param {moment.Moment} from 
   * @param {moment.Moment} to 
   * @param {number} median 
   * @param {number} variation 
   */
  function generateRandomValues(from, to, base, variation) {
    let result = [];
    // QUESTION: Possibly it will be more clear to user if we return to him also the data for date "to".
    // At the moment the data for date "to" is excluded? but the data for date "from" is included.
    while (from < to) {
      let randomV = Math.floor(variation * Math.random()) * (Math.random() >= 0.5 ? -1 : 1);
      result.push({
        "date" : from.format('MM/DD'),
        "count" : base + randomV
      });
      from.add(1, 'day');
    }
    return result;
  }

  router.get('/api/reports/optins.json', validateParams, (req, res) => {
    const { from, to } = res.locals;
    res.json(generateRandomValues(from, to, 500, 25));
  });

  router.get('/api/reports/recipients.json', validateParams, (req, res) => {
    const { from, to } = res.locals;
    res.json(generateRandomValues(from, to, 300, 150));
  });

  return router;
}