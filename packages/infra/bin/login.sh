#!/bin/bash

ACCOUNT=$1
OUTPUT_PROFILE=$2
DESIRED_ROLE=$3

echo $ACCOUNT
echo $OUTPUT_PROFILE

ROLE_ARN=arn:aws:iam::$ACCOUNT:role/TRDeveloper

if [[ "$3" = "admin" ]]; then
    ROLE_ARN=arn:aws:iam::$ACCOUNT:role/TRAdmin
fi

echo "Assuming role $ROLE_ARN"
sts=$(aws sts assume-role --profile tr --role-arn "$ROLE_ARN" --role-session-name "$OUTPUT_PROFILE" --query 'Credentials.[AccessKeyId,SecretAccessKey,SessionToken]' --output text)

echo "Converting sts to array"
sts=($sts)

echo "AWS_ACCESS_KEY_ID is ${sts[0]}"
aws configure set aws_access_key_id ${sts[0]} --profile $OUTPUT_PROFILE
aws configure set aws_secret_access_key ${sts[1]} --profile $OUTPUT_PROFILE
aws configure set aws_session_token ${sts[2]} --profile $OUTPUT_PROFILE

echo "credentials stored in the profile named '$OUTPUT_PROFILE'"
