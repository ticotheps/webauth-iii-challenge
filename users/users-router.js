const router = require("express").Router();

const Users = require("./users-model.js");
const restricted = require("../auth/restricted-middleware.js");

// allows access to the database if the provided token is valid
router.get("/", restricted, (req, res) => {
  Users.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

// function withDepartment(department) {
//   return function(req, res, next) {
//     if (
//       req.decodedJwt &&
//       req.decodedJwt.department &&
//       req.decodedJwt.department.includes(department)
//     ) {
//       next();
//     } else {
//       res.status(403).json({ message: "You have no power here!" });
//     }
//   };
// }

module.exports = router;