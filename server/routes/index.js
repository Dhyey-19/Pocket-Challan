const companyRoutes = require("./companyRoutes");
const registrationRoutes = require("./registrationRoutes");
const authRoutes = require("./authRoutes");
const partyRoutes = require("./partyRoutes");
const itemRoutes = require("./itemRoutes");
const salesPaymentRoutes = require("./salesPaymentRoutes");
const materialPaymentRoutes = require("./materialPaymentRoutes");
const challanSalesRoutes = require("./challanSalesRoutes");
const materialOutRoutes = require("./materialOutRoutes");
const materialInRoutes = require("./materialInRoutes");
const materialReportRoutes = require("./materialReportRoutes");
const backupRoutes = require("./backupRoutes");

module.exports = [
  companyRoutes,
  registrationRoutes,
  authRoutes,
  partyRoutes,
  itemRoutes,
  salesPaymentRoutes,
  materialPaymentRoutes,
  challanSalesRoutes,
  materialOutRoutes,
  materialInRoutes,
  materialReportRoutes,
  backupRoutes
];
