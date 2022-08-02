var express = require('express');
var mongoose = require('mongoose');
Schema = mongoose.Schema;


var EventSchema = new Schema(
    {
        Title: String,
        Summary: String,
        Category: String,
        Author: String,
        Host:String,
        startDate: {
            type: Date,
            required: true 
        },
        endDate: {
            type: Date,
            required: true 
        },
        Location:String,
        Reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
        Likes: { type: Number, default: 0 }

    }
)
module.exports = mongoose.model('EventForm', EventSchema);