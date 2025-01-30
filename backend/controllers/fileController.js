const xlsx = require("xlsx");
const fs = require("fs");
const FileModel = require("../models/File");
const sheetConfig = require("../config/sheetConfig"); // ✅ Import dynamic config

// Function to Convert Excel Serial Numbers to a Proper Date Format (DD-MM-YYYY)
const convertExcelDate = (dateValue) => {
  if (!dateValue || dateValue === "") return null; // Return null if empty

  // Case 1: If it's already a valid date string (e.g., "2024-01-30"), return it
  if (!isNaN(Date.parse(dateValue)))
    return new Date(dateValue).toISOString().split("T")[0];

  // Case 2: If it's an Excel serial number, convert it
  if (!isNaN(dateValue) && dateValue > 40000) {
    const convertedDate = new Date((dateValue - 25569) * 86400000);
    if (!isNaN(convertedDate.getTime())) {
      return convertedDate.toISOString().split("T")[0];
    }
  }

  // Case 3: If it's neither a serial number nor a valid date string, return null
  return null;
};

// Function to Validate Row Data Based on Sheet Rules
const validateRow = (row, sheetRules) => {
  let errors = [];
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  console.log("🔍 Validating Row:", row);

  // Check Required Fields
  sheetRules.requiredFields.forEach((field) => {
    if (!(field in row) || row[field] === "" || row[field] === null) {
      errors.push(`${field} is required`);
    }
  });

  // Validate Amount (must be numeric and > 0)
  if ("Amount" in row && row["Amount"] !== "") {
    const amount = Number(row["Amount"]);
    if (isNaN(amount) || amount <= 0) {
      errors.push("Amount must be a valid number greater than zero");
    }
  }

  // Validate and Convert Date (must be within current month)
  if ("Date" in row && row["Date"] !== "") {
    let date = convertExcelDate(row["Date"]);
    if (!date) {
      errors.push("Invalid Date format");
    } else {
      const rowDate = new Date(date);
      if (
        rowDate.getMonth() !== currentMonth ||
        rowDate.getFullYear() !== currentYear
      ) {
        errors.push("Date must be within the current month");
      }
      row["Date"] = date; // Store converted date
    }
  }

  // Validate Verified Field (must be Yes or No)
  if (
    "Verified" in row &&
    row["Verified"] !== "Yes" &&
    row["Verified"] !== "No"
  ) {
    errors.push('Verified must be "Yes" or "No"');
  }

  console.log("Row Errors:", errors);
  return errors;
};

// Function to Apply Column Mapping
const applyColumnMapping = (row, sheetName) => {
  const mapping = sheetConfig.sheets[sheetName]?.columnMapping || {};
  let mappedRow = {};

  Object.keys(row).forEach((col) => {
    const mappedCol = mapping[col] || col; // Use mapping, fallback to original
    mappedRow[mappedCol] = row[col];
  });

  return mappedRow;
};

// Upload & Validate Excel File
const uploadFile = (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const workbook = xlsx.readFile(req.file.path);
    let sheetsData = {};
    let errors = [];

    workbook.SheetNames.forEach((sheetName) => {
      const sheetRules =
        sheetConfig.sheets[sheetName]?.validationRules ||
        sheetConfig.defaultRules.validationRules;

      console.log(` Processing Sheet: ${sheetName}`);
      console.log("Using Validation Rules:", sheetRules);

      const sheet = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], {
        defval: "",
        raw: false,
      });
      sheetsData[sheetName] = [];

      sheet.forEach((row, index) => {
        const mappedRow = applyColumnMapping(row, sheetName);
        let rowErrors = validateRow(mappedRow, sheetRules);

        if (rowErrors.length > 0) {
          errors.push({ sheet: sheetName, row: index + 1, issues: rowErrors });
        } else {
          sheetsData[sheetName].push(mappedRow);
        }
      });
    });

    fs.unlinkSync(req.file.path); // ✅ Delete temp file after processing

    console.log(" Final Error List:", errors);
    res.json({ data: sheetsData, errors });
  } catch (error) {
    console.error(" Backend Error:", error);
    res.status(500).json({ error: "Error processing file" });
  }
};

// Import Valid Data into MongoDB
const importData = async (req, res) => {
  try {
    await FileModel.insertMany(req.body.data);
    res.json({ message: "Data imported successfully!" });
  } catch (error) {
    console.error(" Import Error:", error);
    res.status(500).json({ error: "Error importing data" });
  }
};

module.exports = { uploadFile, importData };
