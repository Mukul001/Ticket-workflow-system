var express = require('express')
var router = express.Router()
const BasicController = require('../controllers/basicController');

router.route('/create-ticket').post(BasicController.CreateTicket);
router.route('/update-ticket').put(BasicController.updateTicketStatus);
router.route('/get-ticket-details').get(BasicController.singleTicketDetails);
router.route('/get-all-tickets').post(BasicController.getAllTickets);


module.exports = router;