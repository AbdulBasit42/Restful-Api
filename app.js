//Abdul Basit
//Restful API to maintain address book

const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const { title } = require("process");
const app = express();
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


///Database hosted on AWS RDS connection

var con = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT,
    database: process.env.DATABASE
});

////Table Creation

con.connect(function (err) {
    if (err) throw err;
    var createTable = "CREATE TABLE IF NOT EXISTS contacts(idname INT NOT NULL AUTO_INCREMENT,name VARCHAR(50),contact VARCHAR(15),PRIMARY KEY(idname), UNIQUE INDEX idarticles_UNIQUE (idname ASC) VISIBLE)";

    con.query(createTable, function (err) {
        if (err) throw err;
    });


});

///////Requests targeting all contacts

app.route("/contacts")

    .get(function (req, res) {

        var getAll = "SELECT name,contact FROM contacts ORDER BY name";
        con.query(getAll, function (err, selectAll) {
            // console.log(selectAll);
            if (!err) {
                res.send(selectAll);
            } else {
                res.send(err);
            }

        });
    })

    .post(function (req, res) {
        console.log(req.body.name);
        console.log(req.body.contact);
        var insertData = "INSERT INTO contacts(name,contact) values ?";
        var values = [
            [req.body.name, req.body.contact]
        ];
        con.query(insertData, [values], function (err, result) {
            if (!err) {
                res.send("Added contact successfully");
            } else {
                res.send(err);
            }
        });

    });


////////Requests targeting Specific contacts

app.route("/contacts/:contactsName")
    .get(function (req, res) {

        var getOne = "SELECT name,contact FROM contacts WHERE name = ?";
        var contactsName = req.params.contactsName;
        console.log(contactsName);

        con.query(getOne, [contactsName], function (err, selectOne) {
            if (!err) {
                res.send(selectOne);
            } else {
                res.send(err);
            }
        })
    })

    // Updating a given contact

    .put(function (req, res) {

        var updateRow = `UPDATE contacts SET name = ? , contact = ? WHERE name = ?`;
        var contactsName = req.params.contactsName;
        con.query(updateRow, [req.body.name, req.body.contact, contactsName], function (err, updateOne) {
            if (!err) {
                res.send(updateOne);
            } else {
                res.send(err);
            }
        })


    })

    //Deleting a particular contact

    .delete(function (req, res) {
        var deleteOne = "DELETE FROM contacts WHERE name = ?";
        var values = req.params.contactsName;
        con.query(deleteOne, [values], function (err, result) {
            if (!err) {
                res.send("Deleted the contact successfully");
            } else {
                res.send(err);
            }
        });

    });


///////////For adding contacts in bulk

app.post("/contactsbulk", function (req, res) {
    console.log(req.body.name);
    console.log(req.body.contact);
    var values = [];
    values.push(req.body.name, req.body.contact);

    console.log(values);
    var insertData = "INSERT INTO contacts(name,contact) values ?";

    con.query(insertData, [values], function (err, result) {
        if (!err) {
            res.send("Added multiple contacts successfully");
        } else {
            res.send(err);
        }
    });

});

app.listen(process.env.PORT || 3000, function () {
    console.log("Server started");
});