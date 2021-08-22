const fetch = require('node-fetch');

const query = `
    query GetPirate($objktId: bigint!) {
        hic_et_nunc_token_by_pk(id: $objktId) {
            id
            artifact_uri
            title
            token_tags {
                tag {
                    tag
                }
            }
        }
    }
`;

async function fetchGraphQL(operationsDoc, variables, operationName) {
    const result = await fetch(
        'https://api.hicdex.com/v1/graphql',
        {
            method: 'POST',
            body: JSON.stringify({
                query: operationsDoc,
                variables: variables,
                operationName: operationName,
            }),
        },
    );

    return await result.json();
}

async function getPirate(objktId) {
    const {errors, data} = await fetchGraphQL(
        query,
        {objktId},
        'GetPirate',
    );
    if(errors) {
        console.error(errors);
        return null;
    }

    return data.hic_et_nunc_token_by_pk;
}

module.exports = getPirate;
