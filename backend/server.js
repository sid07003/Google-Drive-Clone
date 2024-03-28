require('dotenv').config({ path: './.env' });
const express = require("express");
const path = require("path");
const bodyParser = require('body-parser');
const app = express();

const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

let dbinstance;

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(cookieParser());

const { MongoClient, ObjectId } = require('mongodb');
MongoClient.connect("mongodb+srv://SiddharthSharma:siddharth@cluster0.gacgrpw.mongodb.net/")
    .then((client) => {
        dbinstance = client.db("google-drive-clone");
        console.log("MongoDB connected");
    })
    .catch((err) => {
        console.log(err);
    });


// --------------------------------- Token Verification middleware --------------------------------------

const verifyToken = (req, res, next) => {
    const token = req.cookies.drive_token;

    if (!token) {
        console.log("unauthorized")
        return res.status(401).json({ error: "Unauthorized" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        req.userId = new ObjectId(decoded.id);
        next();
    });
};

// --------------------------------- check Authentication -----------------------------------------------

app.get("/checkAuth", (req, res) => {
    const token = req.cookies.drive_token;

    if (!token) {
        console.log("unauthorized")
        res.status(401).json({ error: "Unauthorized" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            res.status(401).json({ error: "Unauthorized" });
        }
        else {
            res.status(200).json({ message: "authorized" });
        }
    });
})

// ---------------------------------- Authentication End Points ------------------------------------------
app.post("/login", async (req, res) => {
    try {
        const loginData = req.body;

        const result = await dbinstance.collection("user_data").findOne({ email: loginData.email });

        if (!result) {
            console.log("reached2")
            return res.status(400).json({ error: "User Not found" });
        }

        bcrypt.compare(loginData.password, result.password, (err, response) => {
            if (err || !response) {
                return res.status(400).json({ error: "Invalid credentials" });
            }

            const accessToken = jwt.sign({ id: result._id, email: result.email }, process.env.JWT_SECRET, { expiresIn: 24 * 60 * 60 * 1000 });

            res.cookie("drive_token", accessToken, {
                maxAge: 24 * 60 * 60 * 1000,
                httpOnly: true,
                path: "/"
            });
            res.status(200).json({ success: true });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/logout", (req, res) => {
    res.clearCookie("drive_token", { path: "/" });
    res.status(200).json({ success: true, message: "Logged out successfully" });
})

app.post("/signup", (req, res) => {
    const user = req.body;

    if (user.password !== user.confirmPassword) {
        res.status(400).json({ error: "passwords not matching" });
    }
    else {
        bcrypt.hash(user.password, 2, (err, hash) => {
            const userInfo = {
                "email": user.email,
                "password": hash
            }

            dbinstance.collection("user_data").insertOne(userInfo)
                .then((result) => {
                    res.status(200).json({ "message": "User created successfully" });
                })
                .catch((err) => {
                    res.status(500).json({ error: "Internal Server Error" });
                })
        })
    }
})


// --------------------------------------------------------------------------------------------------

app.listen(3001, (err) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log("Server Activated")
    }
})