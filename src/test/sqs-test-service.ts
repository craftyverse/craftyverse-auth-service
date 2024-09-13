import { SQSClient, CreateQueueCommand } from "@aws-sdk/client-sqs";
import dotenv from "dotenv";

dotenv.config({ path: ".env.test" });

export class SQSTestService {
  private sqsClient: SQSClient;

  constructor() {
    this.sqsClient = new SQSClient({
      region: process.env.AWS_REGION,
      endpoint: process.env.AWS_ENDPOINT,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "test",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "test",
      },
    });
  }

  async createQueue(queueName: string): Promise<string> {
    console.log(process.env.AWS_ENDPOINT);
    const params = {
      QueueName: queueName,
    };
    const command = new CreateQueueCommand(params);
    const response = await this.sqsClient.send(command);

    console.log(response.QueueUrl);
    return response.QueueUrl!;
  }
}
