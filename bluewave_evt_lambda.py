import os
import json
import boto3

def lambda_handler(event, context):
    # Print the received event for debugging
    print("Received event:", json.dumps(event))
    
    # Check if the event contains S3 records
    if 'Records' in event and len(event['Records']) > 0:
        # Retrieve the S3 bucket name and object key from the event
        s3_record = event['Records'][0]
        bucket_name = s3_record['s3']['bucket']['name']
        object_key = s3_record['s3']['object']['key']
        
        # Create Amazon Q Client
        q_client = boto3.client('qbusiness')
        
        # Create an SNS client
        sns_client = boto3.client('sns')
        
        # Retrieve SNS topic ARN from environment variable
        sns_topic_arn = os.environ['SNS_TOPIC_ARN']
        
        q_sync_response = q_client.start_data_source_sync_job(
            dataSourceId = os.environ['DATASOURCE_ID'],
            applicationId = os.environ['APPLICATION_ID'],
            indexId = os.environ['INDEX_ID']
        )
                
        # Compose the message to be sent
        message = f"New object created in S3 bucket '{bucket_name}': '{object_key}' and Sync started '{q_sync_response}' "
        
        # Publish the message to the SNS topic
        response = sns_client.publish(
            TopicArn = sns_topic_arn,
            Message = message
        )
        
        # Print response for logging (optional)
        print(response)
        print(q_sync_response)
        
        return {
            'statusCode': 200,
            'body': json.dumps('SNS message Sent and Also Amazon Q Sync Job Started successfully')
        }
    else:
        return {
            'statusCode': 400,
            'body': json.dumps('No S3 records found in event')
        }
