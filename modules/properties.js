
'use strict';

const _ = require("lodash");
const path = require("path");
const properties = require ("properties");
const Promise = require("promise");

var props;

function logStatus() {
  console.info("=== Properties ===");
  console.info(props);
}
module.exports = function() {
    return new Promise(function (fulfill, reject){
        properties.parse(path.join(__dirname, "../config/application.properties"),
            {
                path: true,
                sections: true,
                namespaces: true
            },
            function(error, obj) {
                if (error) return reject (error);
                props = obj;
                fulfill(props);
                logStatus();
            });
    });
};
