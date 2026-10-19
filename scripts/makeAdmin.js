// Promote an existing user to admin: node scripts/makeAdmin.js user@example.com
// Bootstrap only — once one admin exists, roles are managed from the admin panel.
require("dotenv").config();
const mongoose = require("mongoose");
const userSchema = require("../models/userSchema");

const email = process.argv[2];
if (!email) {
  console.error("Usage: node scripts/makeAdmin.js <userEmail>");
  process.exit(1);
}

mongoose
  .connect(process.env.URL)
  .then(() => userSchema.findOneAndUpdate({ userEmail: email }, { userRole: "admin" }, { new: true }))
  .then((user) => {
    console.log(user ? `${user.userEmail} is now an admin` : `No user found with email ${email}`);
    process.exitCode = user ? 0 : 1;
  })
  .catch((err) => {
    console.error(err.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
