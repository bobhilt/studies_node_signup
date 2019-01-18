const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
require('dotenv').config()
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
    var firstName = req.body.firstName,
        lastName = req.body.lastName,
        email = req.body.email;

    const MAILCHIMP_KEY = process.env.MAILCHIMP_KEY;
    const MAILCHIMP_LIST = process.env.MAILCHIMP_LIST;
    const MAILCHIMP_SERVER = process.env.MAILCHIMP_SERVER;
    const MAILCHIMP_BASE_URL = "api.mailchimp.com/3.0/lists/"

    var url = "https://" + MAILCHIMP_SERVER + "." + MAILCHIMP_BASE_URL + MAILCHIMP_LIST;

    var data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }
        }]
    };
    jsonData = JSON.stringify(data);

    var options = {
        url: "https://us20.api.mailchimp.com/3.0/lists/25416e2e44",
        method: "POST",
        headers: {
            "Authorization": "StudyList " + MAILCHIMP_KEY
        },
        body: jsonData
    }

    request(options, function(error, response, body) {
        if (error) {
            console.log(error);
            res.sendFile(__dirname + "/failure.html");
        } else {
            if (response.statusCode == 200) {
                res.sendFile(__dirname + "/success.html");
            } else {
                res.sendFile(__dirname + "/failure.html");
            }
            console.log(response.statusCode);
        }
    });
});

app.post("/failure", function(req, res) {
    res.redirect("/");
})
app.post("/success", function(req, res) {
    res.redirect("/");
})
app.listen(3000, function() {
    console.log("Newsletter Sign Up listening on localhost:3000");
});