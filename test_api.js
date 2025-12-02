const https = require('https');
const apiKey = "AIzaSyBx4a1f9T5avytMW9x1aFR0Rzsrcndhcxc";
const options = {
  hostname: 'generativelanguage.googleapis.com',
  path: '/v1beta/models?key=' + apiKey,
  method: 'GET',
  headers: { 'Content-Type': 'application/json' }
};
const req = https.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(body);
      if (json.models && json.models.length > 0) {
        console.log("First Model:", json.models[0].name);
        const genModel = json.models.find(m => m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent"));
        if (genModel) console.log("Gen Model:", genModel.name);
      } else {
        console.log("No models found");
      }
    } catch (e) { console.log("Error parsing"); }
  });
});
req.end();
