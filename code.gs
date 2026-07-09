function doGet(e) {
  try {
    var key = e.parameter.key;
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Database") || ss.insertSheet("Database");
    var data = sheet.getDataRange().getValues();
    
    var obj = {};
    for (var i = 0; i < data.length; i++) {
      if (data[i][0]) {
        try {
          obj[data[i][0]] = JSON.parse(data[i][1]);
        } catch(err) {
          obj[data[i][0]] = data[i][1];
        }
      }
    }

    if (key) {
      return ContentService.createTextOutput(JSON.stringify({value: obj[key] !== undefined ? obj[key] : null}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify(obj))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({error: err.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var key = data.key;
    var value = typeof data.value === 'string' ? data.value : JSON.stringify(data.value);
    
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Database") || ss.insertSheet("Database");
    var range = sheet.getDataRange();
    var values = range.getValues();
    
    var found = false;
    for (var i = 0; i < values.length; i++) {
      if (values[i][0] === key) {
        sheet.getRange(i + 1, 2).setValue(value);
        found = true;
        break;
      }
    }
    
    if (!found) {
      sheet.appendRow([key, value]);
    }
    
    return ContentService.createTextOutput(JSON.stringify({status: "success"}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({error: err.toString(), status: "error"}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
