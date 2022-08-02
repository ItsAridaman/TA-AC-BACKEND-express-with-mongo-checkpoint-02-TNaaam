var express = require('express');
var mongoose = require('mongoose');
Schema = mongoose.Schema;

var ReviewSchema = new Schema(
    {
        content: { type: String},
        EventId: String

    }
)
module.exports = mongoose.model('Review', ReviewSchema);