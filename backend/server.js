require('dotenv').config({ path: './.env' });
const express = require("express");
const multer = require("multer");
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
const { userInfo } = require('os');
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


// -------------------------------------------- creating folder ------------------------------------------------------

app.post("/createFolder", verifyToken, (req, res) => {
    const userId = req.userId;
    const folderName = req.body.folderName;
    const parent = req.body.parent;

    const currentDate = new Date();
    const formattedDate = currentDate.toISOString();

    const isStarred=false;

    const obj = {
        "name": folderName,
        "parent": parent,
        "owner": userId,
        "sharedWith": [],
        "created_at": formattedDate,
        "isStarred": isStarred
    };

    dbinstance.collection("folders_data").findOne({ name: folderName, owner: userId })
        .then((data) => {
            if (data) {
                res.status(400).json({ error: "Folder already exist" });
            }
            else {
                dbinstance.collection("folders_data").insertOne(obj)
                    .then(() => {
                        res.status(200).json({ message: "Folder created successfully" });
                    })
                    .catch((err) => {
                        res.status(500).json({ error: "Internal server error" });
                    });
            }
        })
});

// ------------------------------------------------ data fetching endpoints ----------------------------------------

app.get("/fetchAllData", verifyToken, (req, res) => {
    const userId = req.userId;

    dbinstance.collection("folders_data").find({ owner: userId, parent: null }).sort({ name: 1 }).toArray()
        .then((data) => {
            dbinstance.collection("files_data").find({ owner: userId, parent: null }).sort({ name: 1 }).toArray()
                .then((result) => {
                    res.status(200).json({ foldersData: data, filesData: result });
                })
                .catch(() => {
                    res.status(500).json({ error: "Internal server error" });
                })
        })
        .catch(() => {
            res.status(500).json({ error: "Internal server error" });
        })
})


app.post("/fetchSpecificData", verifyToken, (req, res) => {
    const userId = req.userId;
    const folderId=req.body.folderId;

    dbinstance.collection("folders_data").find({ owner: userId, parent: folderId }).sort({ name: 1 }).toArray()
        .then((data) => {
            dbinstance.collection("files_data").find({ owner: userId, parent: folderId }).sort({ name: 1 }).toArray()
                .then((result) => {
                    res.status(200).json({ foldersData: data, filesData: result });
                })
                .catch(() => {
                    res.status(500).json({ error: "Internal server error" });
                })
        })
        .catch(() => {
            res.status(500).json({ error: "Internal server error" });
        })
})
// -------------------------------------------- upload files -------------------------------------------
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "f:\\My Projects\\Google-Drive-Clone\\frontend\\public\\uploads");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage }).array('files', 5);

app.post('/uploadFile', verifyToken, (req, res) => {
    upload(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ error: "Upload error" });
        } else if (err) {
            return res.status(500).json({ error: "Internal server error" });
        }

        const userId = req.userId;
        const files = req.files;
        const parent = req.body.parent;

        const currentDate = new Date();
        const formattedDate = currentDate.toISOString();

        try {
            for (const file of files) {
                const fileExtension = path.extname(file.originalname).toLowerCase();
                let fileTypeString;

                switch (fileExtension) {
                    case '.jpg':
                    case '.jpeg':
                    case '.png':
                    case '.gif':
                    case '.bmp':
                    case '.tiff':
                    case '.svg':
                        fileTypeString = 'image';
                        break;
                    case '.mp3':
                    case '.wav':
                    case '.ogg':
                    case '.aac':
                    case '.flac':
                    case '.wma':
                        fileTypeString = 'audio';
                        break;
                    case '.pdf':
                        fileTypeString = 'pdf';
                        break;
                    case '.ppt':
                    case '.pptx':
                    case '.key':
                        fileTypeString = 'presentation';
                        break;
                    case '.txt':
                    case '.doc':
                    case '.docx':
                    case '.rtf':
                        fileTypeString = 'documents';
                        break;
                    default:
                        return res.status(400).json({ error: `File type not supported for file ${file.originalname}` });
                }

                const obj = {
                    name: file.filename,
                    path: "../uploads/"+file.filename,
                    type: fileTypeString,
                    parent: parent || null,
                    owner: userId,
                    sharedWith: [],
                    uploaded_at: formattedDate,
                    isStarred: false
                };

                await dbinstance.collection("files_data").insertOne(obj);
            }

            res.status(200).json({ message: "Files uploaded successfully" });
        } catch (error) {
            res.status(500).json({ error: "Internal server error" });
        }
    });
});

app.post('/uploadFileInFolder', verifyToken, (req, res) => {
    upload(req, res, async (err) => {
        const { currentFolder } = req.body;

        if (err instanceof multer.MulterError) {
            return res.status(400).json({ error: "Upload error" });
        } else if (err) {
            return res.status(500).json({ error: "Internal server error" });
        }

        const userId = req.userId;
        const files = req.files;
        const parent = req.body.parent;

        const currentDate = new Date();
        const formattedDate = currentDate.toISOString();

        try {
            for (const file of files) {
                const fileExtension = path.extname(file.originalname).toLowerCase();
                let fileTypeString;

                switch (fileExtension) {
                    case '.jpg':
                    case '.jpeg':
                    case '.png':
                    case '.gif':
                    case '.bmp':
                    case '.tiff':
                    case '.svg':
                        fileTypeString = 'image';
                        break;
                    case '.mp3':
                    case '.wav':
                    case '.ogg':
                    case '.aac':
                    case '.flac':
                    case '.wma':
                        fileTypeString = 'audio';
                        break;
                    case '.pdf':
                        fileTypeString = 'pdf';
                        break;
                    case '.ppt':
                    case '.pptx':
                    case '.key':
                        fileTypeString = 'presentation';
                        break;
                    case '.txt':
                    case '.doc':
                    case '.docx':
                    case '.rtf':
                        fileTypeString = 'documents';
                        break;
                    default:
                        return res.status(400).json({ error: `File type not supported for file ${file.originalname}` });
                }

                const obj = {
                    name: file.filename,
                    path: "../uploads/"+file.filename,
                    type: fileTypeString,
                    parent:  currentFolder,
                    owner: userId,
                    sharedWith: [],
                    uploaded_at: formattedDate,
                    isStarred: false
                };

                await dbinstance.collection("files_data").insertOne(obj);
            }

            res.status(200).json({ message: "Files uploaded successfully" });
        } catch (error) {
            res.status(500).json({ error: "Internal server error" });
        }
    });
});


app.listen(3001, (err) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log("Server Activated")
    }
})