const TicketModel = require('../models/ticketModel');


const printCustomMsgApi = (type, msg, statusCode, value = {}) => {
    let json = { 'status': type, 'message': msg, 'status_code': statusCode, 'response': value }
    return json;
}

exports.CreateTicket = async (req, res) => {
    try {

        if(req.body.story_points < 1 || req.body.story_points > 100){
            return res.send(printCustomMsgApi(false, "Story points should be between 1-100 only.", 422));
        }

        let ticketObj = {};
        ticketObj.description = req.body.description;
        ticketObj.story_points = req.body.story_points;

        let new_task = new TicketModel(ticketObj);
        await new_task.save();

        return res.send(printCustomMsgApi(true,"Your ticket has been raised successfully.",200));
     
    } catch (error) {
        console.log(error.message);
        return res.send(printCustomMsgApi(false, "Some Technical Issue.", 500));
    }
}

exports.updateTicketStatus = async (req, res) => {
    try {
        let state_type = 0;
        let ticketDetail = await TicketModel.findOne({_id :req.body.ticket_id }).lean().exec();
        if(!ticketDetail){ 
            return res.send(printCustomMsgApi(false, "No such ticket found", 422));
        }

        if(ticketDetail.state_type == 1 && req.body.type == 'dec'){
            return res.send(printCustomMsgApi(false, "Ticket is open and status cannot be decreased further.", 422));
        }
        if(ticketDetail.state_type == 4 && req.body.type == 'inc'){
            return res.send(printCustomMsgApi(false, "Ticket is closed and status cannot be increased further.", 422));
        }

        if(req.body.type == "inc"){
            state_type = +1;
        } else if(req.body.type == "dec"){
            state_type = -1;
        } else {
            return res.send(printCustomMsgApi(false, "Invalid type entered.", 422));
        }

        let story_points = (req.body.story_points) ? req.body.story_points : 1;

        await TicketModel.updateOne({_id :req.body.ticket_id },
            { 
                $set: {story_points : story_points },
                $inc: {state_type: state_type}
            }
        );
        
        return res.send(printCustomMsgApi(true,"Ticket status has been updated successfully.",200));
     
    } catch (error) {
        console.log(error.message);
        return res.send(printCustomMsgApi(false, "Some Technical Issue.", 500));
    }
}

exports.singleTicketDetails = async (req, res) => {
    try {
        let ticketDetail = await TicketModel.findOne({_id :req.query.ticket_id }).lean().exec();
        if(!ticketDetail){ 
            return res.send(printCustomMsgApi(false, "No such ticket found", 422));
        }

        return res.send(printCustomMsgApi(true,"Ticket details loaded successfully.",200,ticketDetail));
     
    } catch (error) {
        console.log(error.message);
        return res.send(printCustomMsgApi(false, "Some Technical Issue.", 500));
    }
}

exports.getAllTickets = async (req, res) => {
    try {
        let query = {}
        let currentDate = new Date();

        if(req.body.story_points < 1 || req.body.story_points > 100){
            return res.send(printCustomMsgApi(false, "Story points should be between 1-100 only.", 422));
        }

        if(req.body.type1 == "date"){
            query.createdAt  = {
                $gte : req.body.start_date || currentDate, 
                $lte : req.body.end_date || currentDate
            }
        }  
        if(req.body.type2 == "state"){

            query.state_type  = req.body.state_type;

        }  
        if(req.body.type3 == "point"){

                if(req.body.sort_type == "gt"){
                    query.story_points = {  $gt : req.body.story_points}
                } else if(req.body.sort_type == "lt"){
                    query.story_points = {  $lt : req.body.story_points}
                } else {
                    query.story_points  = req.body.story_points;
                }

        } 
        if(req.body.type1 != "date" && req.body.type2 != "state" && req.body.type3 != "point") {
            return res.send(printCustomMsgApi(false, "Invalid type chosen", 422));
        }
        
        console.log("query",query)
        let ticketDetail = await TicketModel.find(query).lean().exec();
        if(ticketDetail.length == 0){ 
            return res.send(printCustomMsgApi(false, "No tickets found", 422));
        }

        return res.send(printCustomMsgApi(true,"Ticket details loaded successfully.",200,ticketDetail));
     
    } catch (error) {
        console.log(error.message);
        return res.send(printCustomMsgApi(false, "Some Technical Issue.", 500));
    }
}