import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "Project Tracker API",
    description: "API documentation",
  },
  host: "localhost:5000",
  schemes: ["http"],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./App.js"];

swaggerAutogen()(outputFile, endpointsFiles, doc);