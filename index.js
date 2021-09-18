const { Datastore } = require("@google-cloud/datastore");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const datastore = new Datastore();

app.get("/staff", async (req, res) => {
    const query = datastore.createQuery("Staff");
    const [data, metaInfo] = await datastore.runQuery(query);
    res.send(data);
});

app.get("/staff/:email/verify", async (req, res) => {
    const key = datastore.key(["Staff", req.params.email]);
    const staff = await datastore.get(key);
    if (staff[0] === undefined) {
        res.status(404);
        res.send("Email NOT FOUND");
    } else {
        res.status(200);
        res.send("Email FOUND");
    }
});

app.patch("/staff/login", async (req, res) => {
    const body = req.body;
    const query = datastore.createQuery("Staff").filter("password", "=", body.password).filter("email", "=", body.email);
    const [data, metaInfo] = await datastore.runQuery(query);
    if (data[0] === undefined) {
        res.status(404);
        res.send("INVALID email/password combination");
    } else {
        const result = { fname: data[0].fname, lname: data[0].lname };
        res.send(result);
    }
});

app.put("/staff/login", async (req, res) => {
    const body = req.body;
    const key = datastore.key(["Staff", body.email]);
    await datastore.merge({ key: key, data: body });
    res.send("Info UPDATED, login with updated info")
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
    console.log(`Wedding Planner Authentication APP started on PORT ${PORT}`);
})

