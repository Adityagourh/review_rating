let server = require("../index");
let chaiHTTP = require("chai-http");
var chai = require("chai");
const userSchema = require("../models/userSchema");
const userRoutes = require("../routes/userRoutes");
const randomEmail = require('random-email');

chai.should();
chai.use(chaiHTTP);

describe("POST /api/users", () => {
  it("It should return login user detail :", (done) => {
    const data = {
      userEmail: "aditya4@gmail.com",
      userPassword: "Aditya@123",
    };
    chai
      .request(server)
      .post("/user/login")
      .send(data)
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.a("object");
        res.body.should.have.property("success").eq(true);
        res.body.should.have
        .property("message")
        .eq("Login sucessfully");
      });
    done(); 
  });
    //To test invalid user if password is incorrect
    it("It should return login error message:", (done) => {
      const data = {
        userEmail: "aditya4@gmail.com",
        userPassword: "Aditya@",
      };
      chai
        .request(server)
        .post("/user/login")
        .send(data)
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a("object");
          res.body.should.have.property("success").eq(false);
          res.body.should.have
          .property("message")
          .eq("Invalid user email or password");
        });
      done();
    });

    //To test invalid user if email and password is incorrect
    it("It should return login error message:", (done) => {
      const data = {
        userEmail: "aditya4@gmail.com",
        userPassword: "Aditya123",
      };
      chai
        .request(server)
        .post("/user/login")
        .send(data)
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a("object");
          res.body.should.have.property("success").eq(false);
          res.body.should.have
            .property("message")
            .eq("Invalid user email or password");
        });
      done();
  });
});

//Create user  Cases
describe("POST /api/users", () => {
  it("It should be add new user ", (done) => {
    const user = {
      userName: "Aditya21",
      userPassword: "Acb@123",
      userEmail: randomEmail(),
      userPhone: "9000000000",
      userState: "M.P.",
      userCity: "Indore",
      userRole: "admin",
    };
    chai
      .request(server)
      .post("/user/create")
      .set("Content-Type", "application/x-www-form-urlencoded")
      .field(user)
      .attach(
        "profilePic",
        "C:/Users/adity/Downloads/Pc Hd Wallpaper 4K Free Download Ideas.jpeg"
      )
      .end((err, res) => {
        res.should.have.status(201);
        res.should.be.a("object");
        res.body.should.have.property("success").eq(true);
        res.body.should.have.property("message").eq("User added Successfully");
      });
    done();
  });
    //If user is already exist
    it("It should return login error message:", (done) => {
      const user = {
      userName: "Aditya21",
      userPassword: "Acb@123",
      userEmail: "aditya3232@gmail.com",
      userPhone: "9000000000",
      userState: "M.P.",
      userCity: "Indore",
      userRole: "admin",
    };
    chai
    .request(server)
    .post("/user/create")
    .set("Content-Type", "application/x-www-form-urlencoded")
    .field(user)
    .attach(
      "profilePic","C:/Users/adity/Downloads/Pc Hd Wallpaper 4K Free Download Ideas.jpeg"
    )
    .end((err, res) => {
      res.should.have.status(401);
      res.should.be.a("object");
      res.body.should.have.property("success").eq(false);
      res.body.should.have.property("message").eq("User is already registered with this email");
    });
    done();
 });
});
