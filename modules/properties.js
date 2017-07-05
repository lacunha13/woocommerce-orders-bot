
const extend = require('lodash/extend');
const path = require('path');
const properties = require ("properties");
const props = {};

properties.parse(path.join(__dirname, '../config/application.properties'),
    {
        path: true,
        sections: true,
        namespaces: true
    },
    function(error, obj) {
        if (error) return console.error (error);
        extend(props, obj);
});

module.exports = props;

console.info("properties.js: module loaded!");

