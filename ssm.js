const AWS = require("aws-sdk");
AWS.config.update({ region: "us-east-1" });
const ssm = new AWS.SSM();

const getSecretParam = async secretParamName => {
  const params = {
    Name: secretParamName,
    WithDecryption: true
  };

  const result = await ssm.getParameter(params).promise();
  return result.Parameter.Value;
};

module.exports = getSecretParam;
