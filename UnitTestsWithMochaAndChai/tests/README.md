<!-- execute tests, display then in JSON REPORTER, SAVE result in json file -->
node ../node_modules/mocha/bin/_mocha tests -R json > result.json

node ../node_modules/mocha/bin/_mocha tests -R doc > result.html