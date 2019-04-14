const path = require('path');
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const jwt = require('jsonwebtoken');

const jwtSecretKey = 'superSecretKeyW5MAIc6gBKvD7Pn9fLFWDnCulpSYeElw22mAkzwktwZ8gdzpAXx2xskSSLlAa6';

// protoLoader options here:  https://www.npmjs.com/package/@grpc/proto-loader
const packageDefinition = protoLoader.loadSync(
  path.join(__dirname, 'json.proto'),
  {keepCase: true,
   longs: String,
   enums: String,
   defaults: true,
   oneofs: true
  });
const jsonProto = grpc.loadPackageDefinition(packageDefinition).json;

const server = new grpc.Server();

function handleTestSomething(call, callback) {
  console.log('testSomething called');
  let requestPayload;
  try {
    requestPayload = jwt.verify(call.request.payload, jwtSecretKey);
  } catch (error) {
    console.log('jwt verify error: ', error);
    return;
  }
  const replyData = {
    time: new Date(),
    fromServer: 'testSomething made it to server',
    call: requestPayload,
  };
  const jwtToken = jwt.sign(replyData, jwtSecretKey);
  callback(null, { payload: jwtToken });
}

server.addService(jsonProto.JsonService.service, {
  testSomething: handleTestSomething,
  // handlers for all proto services go here
})

server.bind('127.0.0.1:50051', grpc.ServerCredentials.createInsecure())
console.log('Server running at http://127.0.0.1:50051')
server.start()
