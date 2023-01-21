require("dotenv").config();

module.exports = {
  name: "Oracle Lottery",
  version: "1.0.0",
  extra: {
    infuraKey: process.env.INFURA_KEY,
  },
};
