function validateEmail(email) {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
}




function generateIdentifier(name, aadhaar) {
  // Ensure name is at least 4 characters long
 
  // Get the first 4 characters of the name
  const namePart = name.substring(0, 4);

  // Get the last 4 digits of the aadhaar number
  const aadhaarPart = aadhaar.slice(-4);

  // Concatenate the parts and return
  return namePart + aadhaarPart;
}





module.exports = { validateEmail ,generateIdentifier };
