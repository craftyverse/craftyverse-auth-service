import { SNSClient, CreateTopicCommand } from "@aws-sdk/client-sns";
import dotenv from "dotenv";

dotenv.config({ path: ".env.test" });

// create class
export class SNSTestService {
  private snsClient: SNSClient;

  constructor() {
    this.snsClient = new SNSClient({
      region: process.env.AWS_REGION,
      endpoint: process.env.AWS_ENDPOINT,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "test",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "test",
      },
    });
  }

  // create topic
  async createTopic(topicName: string): Promise<string> {
    console.log(process.env.AWS_ENDPOINT);
    const params = {
      Name: topicName,
    };
    const command = new CreateTopicCommand(params);
    const response = await this.snsClient.send(command);

    console.log(response.TopicArn);
    return response.TopicArn!;
  }
}
