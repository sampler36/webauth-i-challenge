const router = require("express").Router();
const bcrypt = require("bcrypt");

const Users = require("../users/users-model");

// for endpoints beginning with /api/auth
router.post("/register", (req, res) => {
    let user = req.body;
    const hash = bcrypt.hashSync(user.password, 10); // 2 ^ n
    user.password = hash;

    Users.add(user)
        .then((saved) => {
            res.status(201).json(saved);
        })
        .catch((error) => {
            res.status(500).json(error);
        });
});

router.post("/login", (req, res) => {
    let { username, password } = req.body;

    Users.findBy({ username })
        .first()
        .then((user) => {
            if (user && bcrypt.compareSync(password, user.password)) {
                req.session.user = user;
                res.status(200).json({
                    message: `Welcome ${user.username}!`
                });
            } else {
                res.status(401).json({ message: "Invalid Credentials" });
            }
        })
        .catch((error) => {
            res.status(500).json(error);
        });
});

router.get("/logout", (req, res) => {
    if (req.session) {
        req.session.destroy((error) => {
            if (error) {
                res.send("you can do that but what what");
            } else {
                res.send("good bye my friend");
            }
        });
    } else {
        res.end();
    }
});

module.exports = router;
