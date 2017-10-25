var express = require('express');
var router = express.Router();
const jsonData = require('../data/data.json');

const admin = require("firebase-admin");

const serviceAccount = require("../keys.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://testlogin-584db.firebaseio.com"
});

const db = admin.database();

/*
Get Ship Data by ID
Service to get shipment by user entered shipment
Takes in id of shipment as param
*/
router.get('/getshipdata/:id', function(req, res) {
    let response = {};
    let shipInfo = {};

    const id = (req.params.id).toString();//get param to data type in object

    //find the shipment
    findId=(shipments)=>{
         return shipments.booking_number === id;
    };

    shipInfo = jsonData.find(findId) || {};

    response.success = false;

    //make sure we have info in our object
    if(Object.keys(shipInfo).length !==0){

        //form the object to use on front end -- this is assuming vessel, dest and eta are most accurate from the most recent update (need to confirm this logic)
        response.success = true;
        response.blnum = shipInfo.booking_number;
        response.steamLine = shipInfo.steamship_line;
        response.origin = shipInfo.origin;
        response.destination = shipInfo.destination;
        response.vessel = shipInfo.updates[0].vessel;
        response.voyage = shipInfo.updates[0].destination;
        response.eta = shipInfo.updates[0].vessel_eta;
        response.containers = shipInfo.containers;
        response.updates = shipInfo.updates;
    }

    res.json(response);
});

/*
Save Booking Route
Service to save a booking shipment id
Takes param of booking id and saves to firebase
*/
router.post('/savebooking/:id', function(req, res) {
    //check if already in database first
    const id = req.params.id;

    db.ref('/id').orderByChild('id').equalTo(id).once('value', (snapshot)=>{
        if(snapshot.val() === null){
            saveData(id);
            res.json({isDup: false})
        }else{
            res.json({isDup: true})
        }
        
    })

    saveData=(id)=>{
        db.ref('/id').push({
            id: id
        });
    }

});

/*
Get All Bookings
Service to get all saved bookings
*/
router.get('/getsavedbookings', function(req, res) {
    let savedInfo = [];
    db.ref('/id').once('value',(snapshot)=>{
        let snap = snapshot.val();
        let obj = {};
        //build object to store hashkey to easily delete later
        //in retrospect, using mongo would have been a much simpler choice :()
        for(var key in snap){
            obj.id = snap[key].id;
            obj.hashKey = key;
            savedInfo.push(obj);
        };
        
        res.json(savedInfo);
    });
  });

/*
Delete Booking Ids
Service to delete one or all bookings and takes in a string of id or 'all' for delete all
*/
router.post('/deletebooking/:id', function(req, res) {
    const id = req.params.id;

    if(id.toLowerCase() === 'all')
        db.ref('/id').remove();
    else
        db.ref('/id/' + id).remove();
    res.json(200);
});


module.exports = router;