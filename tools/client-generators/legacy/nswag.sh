#!/usr/bin/env bash

input=http://localhost:5000/openapi/v1.json
output=../frontend/src/api/generated.ts
template=Fetch
operationGenerationMode=MultipleClientsFromFirstTagAndOperationName
dateTimeType=string
typeStyle=Class

cd "$(dirname "$0")"

clear &&
rm $output
nswag openapi2tsclient \
    /input:"$input" \
    /output:"$output" \
    /template:"$template" \
    /operationGenerationMode:"$operationGenerationMode" \
    /DateTimeType:"$dateTimeType" \
    /MarkOptionalProperties:false \
    /NullValue:Null \
    /TypeStyle:"$typeStyle" \
    /GenerateOptionalParameters:false

# Prefix RequestDto / ResponseDto types with "I".

if ["$typeStyle" eq "Interface"]; then
    sed -i -E \
        's/([A-Za-z0-9_]+)(RequestDto|ResponseDto)/I\1\2/g' \
        "$output"
fi &&

pnpm exec prettier $output --config ../.prettierrc --write
