import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as apigwv2 from "@aws-cdk/aws-apigatewayv2-alpha";
import * as apigatewayv2_integrations from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as cognito from "aws-cdk-lib/aws-cognito";
export class ReviewSectionStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create the DynamoDB table

    const table = new dynamodb.Table(this, "MyTable", {
      tableName: "Review-Section",
      partitionKey: { name: "sameid", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "id", type: dynamodb.AttributeType.STRING },
    });

    const httpApi = new apigwv2.HttpApi(this, `Afffan`, {
      corsPreflight: {
        allowHeaders: ["Content-Type"],
        allowMethods: [apigwv2.CorsHttpMethod.GET, apigwv2.CorsHttpMethod.POST],
        allowCredentials: false,
        allowOrigins: ["*"],
      },
    });

    const getLambda = new lambda.Function(this, "GetLambdaHandler", {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset("lambda"),
      handler: "getlambda.handler",
      environment: {
        HELLO_TABLE_NAME: table.tableName,
      },
    });

    const postLambda = new lambda.Function(this, "PostLambdaHandler", {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset("lambda"),
      handler: "postlambda.handler",
      environment: {
        HELLO_TABLE_NAME: table.tableName,
      },
    });

    const getIntegration = new apigatewayv2_integrations.HttpLambdaIntegration(
      "Get",
      getLambda
    );
    const postIntegration = new apigatewayv2_integrations.HttpLambdaIntegration(
      "post",
      postLambda
    );

    httpApi.addRoutes({
      integration: getIntegration,
      path: "/getdata",
      methods: [apigwv2.HttpMethod.GET],
    });
    httpApi.addRoutes({
      integration: postIntegration,
      path: "/postdata",
      methods: [apigwv2.HttpMethod.POST],
    });
    // permissions to lambda to dynamo table
    table.grantFullAccess(getLambda);
    table.grantFullAccess(postLambda);
    new cdk.CfnOutput(this, "ApiEndpoint", {
      value: httpApi.url!,
    });
  }
}
