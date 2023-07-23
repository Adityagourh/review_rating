// let server = require("../index");
// let chaiHTTP = require("chai-http");
// var chai = require("chai");
// const companySchema = require("../models/companySchema");
// const userRoutes = require("../routes/companyRoute");
// const randomEmail = require("random-email");

// chai.should();
// chai.use(chaiHTTP);

// // Create Company  Cases
// describe("POST /api/company", () => {
//   it("It should be add new company ", (done) => {
//     const company = {
//       companyName: randomEmail(),
//       companyCity: "Indore",
//       companyLocation: "Indore",
//     };
//     chai
//       .request(server)
//       .post("/company/create")
//       .set("Content-Type", "application/x-www-form-urlencoded")
//       .field(company)
//       .attach(
//         "profilePic",
//         "C:/Users/adity/Downloads/Pc Hd Wallpaper 4K Free Download Ideas.jpeg"
//       )
//       .end((err, res) => {
//         res.should.have.status(201);
//         res.should.be.a("object");
//         res.body.should.have.property("success").eq(true);
//         res.body.should.have
//           .property("message")
//           .eq("Company added successfully");
//           done();
//       });
//   });
//   //If company is already exist
//   it("It should be check company is already exist", (done) => {
//     const user = {
//       companyName: "CodellrsID",
//       companyCity: "Indore",
//       companyLocation: "Indore",
//     };
//     chai
//       .request(server)
//       .post("/company/create")
//       .set("Content-Type", "application/x-www-form-urlencoded")
//       .field(user)
//       .attach(
//         "profilePic",
//         "C:/Users/adity/Downloads/Pc Hd Wallpaper 4K Free Download Ideas.jpeg"
//       )
//       .end((err, res) => {
//         res.should.have.status(401);
//         res.should.be.a("object");
//         res.body.should.have.property("success").eq(false);
//         res.body.should.have.property("message").eq("Company is already exist");
//         done();
//       });
//   });
// });


// // //Find company by letters
// // describe("GET /api/company", () => {
// //     it("should check the company list and return success", (done) => {
// //       const company = {
// //         companyName: "a",
// //       };
// //       chai
// //         .request(server)
// //         .post("/company/findcompanies")
// //         .send(company)
// //         .end((err, res) => {
// //           res.should.have.status(200);
// //           res.should.be.a("object");
// //           res.body.should.have.property("success").eq(true);
// //           res.body.should.have.property("message")
// //           .eq("Company found successfully");
// //           done(); 
// //       });
// //     });
  
// //     it("should check the company list and return failure for non-existing companies", (done) => {
// //       const companyName = {
// //         companyName: "CodersId",
// //       };
// //       chai
// //         .request(server)
// //         .post("/company/findcompanies")
// //         .send(companyName)
// //         .end((err, res) => {
// //           res.should.have.status(404); // Corrected the status code to 404
// //           res.should.be.a("object");
// //           res.body.should.have.property("success").eq(false);
// //           res.body.should.have.property("message")
// //           .eq("Companies are not found"); // Corrected the error message
// //           done(); 
// //       });
// //     });
// //   });