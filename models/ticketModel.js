const mongoose = require('mongoose');
const { STATUS_TYPE } = require("../helpers/constant");

const getEnumArray = obj => {
    return Object.keys(obj).map(key => obj[key]);
}

var tickets = new mongoose.Schema({
    //user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user_details' }, // for specific userwise record
    state_type: {
        type: Number,
        default : 1,
        enum: getEnumArray(STATUS_TYPE)
    },
    description: {
        type: String,
        default : '',
        required : true
    },
    state_id : { type: mongoose.Schema.Types.ObjectId, ref: 'states' },
    story_points: {
        type: Number,
        default : 0
    },
    is_deleted : {      
        type: Boolean,
        default : false
    }                   
},{
    versionKey: false,
    timestamps: true
})

tickets.index({ createdAt: -1 });
tickets.index({ state_id: 1 });
tickets.index({ is_deleted: 1 });

module.exports = mongoose.model('tickets',tickets);