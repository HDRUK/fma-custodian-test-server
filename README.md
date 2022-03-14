## Custodian test server

Example server matching the API specifications defined in https://editor.swagger.io/?url=https://raw.githubusercontent.com/HDRUK/schemata/fed-mdc-api/openapi/catalogue.yaml

### Build and run

#### .env file

```
PORT="<port>"

MONGO_USER="<username>" # Username with RW access to the relevant database
MONGO_PASSWORD="<password>"
MONGO_CLUSTER="<cluster>" # Relevant cluster
MONGO_DATABASE="<database>" # Name of relevant database on cluster

JWT_SECRET="<JWT Secret Key>"

LOGGING_PROJECT_ID="<GCP project ID>"
LOGGING_LOG_NAME="<GCP logs name>"
```

#### Run application

```
1. npm install
2. npm test (if req.)
3. npm start

Application should now run on port defined in .env file.
```

---

### Endpoints

#### Datasets - no auth

```
GET /api/v1/noauth/datasets?
q=<string> # text string to query certain indexed fields
&offset=<number> # set the index to ignore preceding datasets results
&limit=<number> # limit the number of datasets

Requires no authorisation/authentication. Returns a list of datasets according to the schema in the above Swagger docs.

# Responses

200 - ok
400 - invalid parameters
500 - server error
```

Example 200 response:

```
GET /api/v1/noauth/datasets?q=covid&offset=0&limit=10

{
    "query": {
        "q": "covid",
        "total": "100",
        "limit": "10",
        "offset": "0"
    },
    "items": [
        {
            "@schema": "https://raw.githubusercontent.com/HDRUK/schemata/master/schema/dataset/latest/dataset.schema.json",
            "type": "dataset",
            "identifer": "example-identifier",
            "name": "example-name",
            "description": "example-description",
            "version": "1.0.0",
            "issued": "2021-09-27T15:10:28Z",
            "modified": "2021-09-27T15:10:28Z",
            "source": "example-source"
        }
        ...
    ]
}
```

#### Dataset - no auth

```
GET /api/v1/noauth/datasets/[identifier]

Requires no authorisation/authentication. Returns a single dataset conforming to the HDR UK v2 specification.

# Responses

200 - ok
500 - server error
```

Example 200 response:

```
See above Swagger documentation.
```

#### Datasets - auth

```
GET /api/v1/datasets?
q=<string> # text string to query certain indexed fields
&offset=<number> # set the index to ignore preceding datasets results
&limit=<number> # limit the number of datasets

Returns a list of datasets according to the schema in the above Swagger docs.

AUTH - API key or bearer token in header:

CASE: API Key
    "Authorization": "Basic <client_id><API key>"
CASE: Bearer token (OAuth 2.0)
    "Authorization": "Bearer <client_id><client_secret>" # see /token specification

# Responses

200 - ok
400 - invalid parameters
401 - unauthorised
500 - server error

```

Example 200 response:

```
As above.
```

#### Dataset - auth

```
GET /api/v1/noauth/datasets/[identifier]

Returns a single dataset conforming to the HDR UK v2 specification.

AUTH - API key or bearer token in header:

CASE: API Key
    "Authorization": "Basic <client_id><API key>"
CASE: Bearer token (OAuth 2.0)
    "Authorization": "Bearer <client_id><client_secret>" # see /token specification

# Responses

200 - ok
401 - unauthorised
500 - server error
```

Example 200 response:

```
As above.
```

#### Access token

```
POST /api/v1/oauth/token

Authorise via the OAuth 2.0 client_credentials grant flow to generate an access token, or optionally use a verifiable refresh token to obtain further access tokens.

Example JSON body:

// For initial authorisation
{
    "grant_type": "client_credentials", # only client credentials flow is supported
    "client_id": "<client_id>",
    "client_secret": "<client_secret>"
}

OR

// For subsequent refreshes of access_token using a refresh token
{
    "refresh_token": "<refresh_token>"
}

# Responses

200 - ok
400 - invalid parameters
401 - unauthorised
```

Example 200 response:

```
// If initial authorisation using client ID and client secret
{
    "token_type": "Bearer",
    "access_token": "xxxxxxxxxxxxxxxxxxx...",
    "refresh_token": "yyyyyyyyyyyyyyyyyyyy...",
    "expires_in": "900"
}

// If using refresh token
{
    "token_type": "Bearer",
    "access_token": "xxxxxxxxxxxxxxxxxxx...",
    "expires_in": "900"
}
```

### Other responses

#### Not found

404 - not found
