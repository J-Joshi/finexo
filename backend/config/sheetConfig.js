module.exports = {
  defaultRules: {
    validationRules: {
      requiredFields: ["Name", "Amount", "Date", "Verified"], // Required fields
      allowPastDates: false, // Only allow current month dates
      allowZero: false, // Amount must be greater than zero
      duplicateColumns: [],
    },
  },

  sheets: {
    SalesData: {
      columnMapping: {
        Name: "name",
        Amount: "amount",
        Date: "date",
        Verified: "verified",
      },
      validationRules: {
        requiredFields: ["Name", "Amount", "Date", "Verified"],
        allowPastDates: false, // Dates must be in the current month
        allowZero: false, // Amount must be greater than zero
        duplicateColumns: [],
      },
    },
  },
};
