define({ "api": [
  {
    "type": "PUT",
    "url": "/api/v1/chain/batch/read",
    "title": "Get Batch Data",
    "group": "Batch",
    "name": "GetBatch",
    "version": "1.0.0",
    "description": "<p>Get the data for the tokens given in the request body. Any JSON values that are not reference tokens will be returned as is. No more than 1024 values are accepted in a request. If any token is associated with data greater than 3kb, the value will be null in the response. If the total size of the request, after ignoring single values that overflow, is greater than 500kb, the request will be rejected with a 509 status code.</p>",
    "header": {
      "fields": {
        "Request": [
          {
            "group": "Request",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>chainAPI's authorization protocol relies on a properly formatted authorization header. The accepted format is: <code>&quot;ALTR &quot; + api_key + &quot;:&quot; + signature</code>. <code>signature</code> is a base64-encoded, SHA-256 hash that uses the API key's secret as the key for the hash function. The payload being hashed must follow the format: <code>HTTP-METHOD + &quot;\\n&quot; + RESOURCE + &quot;\\n&quot; + DATE + &quot;\\n&quot;</code>. <code>DATE</code> must match X-ALTR-DATE, and RESOURCE must match the referenceToken in the query string. An example payload for a PUT request is: <code>&quot;PUT\\n\\n01-01-1970 00:00:00\\n&quot;</code></p>"
          },
          {
            "group": "Request",
            "type": "Date",
            "optional": false,
            "field": "X-ALTR-DATE",
            "description": "<p>The datetime used in the Date signature. If this is more than 15 minutes past the server's internal clock, the request will be rejected.</p>"
          },
          {
            "group": "Request",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>must be application/json</p>"
          }
        ],
        "Response": [
          {
            "group": "Response",
            "type": "String",
            "optional": false,
            "field": "X-OVERFLOW-DATA",
            "description": "<p>If any token is over 3kb, or the entire batch is over 500kb this flag will be set and the tokens that overflowed will be returned as null.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example-Requst-Headers:",
          "content": "date = new Date();\npayload = 'PUT\\n\\n' + date + '\\n';\nAPI_KEY = <your API key>;\nSECRET = <your API secret>;\n{\n    \"X-ALTR-DATE\": date,\n    \"Authorization\": \"ALTR \" + API_KEY + \":\" + base64(hmac-sha256(payload, SECRET)),\n    \"Content-Type\": \"application/json\"\n}",
          "type": "json"
        },
        {
          "title": "Example-Response-Headers:",
          "content": "{\n    \"X-OVERFLOW-DATA\": true\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"id\": \"1\"\n    \"key1\": \"token1\",\n    \"key2\": \"token2\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "json",
            "optional": false,
            "field": "body",
            "description": "<p>On success, all tokens given in the request will be replaced with the data associated. All non-tokens are given back. If the data for any token is greater than 3kb, the X-Overflow-Data header will be set to true and the value associated with the key will be null.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"id\": \"1\",\n  \"key1\": <data for token1>,\n  \"key2\": <data for token2>\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "optional": false,
            "field": "bad_request",
            "description": "<p>Invalid JSON detected</p>"
          }
        ],
        "401": [
          {
            "group": "401",
            "optional": false,
            "field": "unauthorized",
            "description": "<p>The API key could not be authenticated.</p>"
          }
        ],
        "403": [
          {
            "group": "403",
            "optional": false,
            "field": "forbidden",
            "description": "<p>API key does not have read permissions.</p>"
          }
        ],
        "404": [
          {
            "group": "404",
            "optional": false,
            "field": "resource_not_found",
            "description": "<p>The requested resource could not be found.</p>"
          }
        ],
        "503": [
          {
            "group": "503",
            "optional": false,
            "field": "internal_error",
            "description": "<p>The webserver encountered an unexpected error.</p>"
          }
        ],
        "509": [
          {
            "group": "509",
            "optional": false,
            "field": "Bandwith",
            "description": "<p>Limit Exceeded Request exceeded 500kb limit. X-Overflow-Data header will be set to true</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example-503-Response:",
          "content": "HTTP/1.1 503 Internal Server Error\n{\n  \"success\": false,\n  \"response\": {\n      \"error_type\": \"internal_error\",\n      \"error_message\": \"Unable to process request at this time.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "Example-401-Response:",
          "content": "  HTTP/1.1 401 Authentication Required\n  {\n    \"success\": false,\n    \"response\": {\n        \"error_type\": \"unauthorized\",\n        \"error_message\":  \"API key must be included in header.\"\n    }\n}",
          "type": "json"
        },
        {
          "title": "Example-403-Response:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"success\": false,\n  \"response\": {\n      \"error_type\": \"forbidden\",\n      \"error_message\":  \"API key does not have read permissions.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "Example-404-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"success\": false,\n  \"response\": {\n      \"error_type\": \"resource_not_found\",\n      \"error_message\":  \"The following tokens could not be found: \"\n  }\n}",
          "type": "json"
        },
        {
          "title": "Example-404-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"success\": false,\n  \"response\": {\n      \"error_type\": \"resource_not_found\",\n      \"error_message\":  \"The following tokens are not yet available: \"\n  }\n}",
          "type": "json"
        },
        {
          "title": "Example-400-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"success\": false,\n  \"response\": {\n      \"error_type\": \"bad_request\",\n      \"error_message\": \"Invalid JSON detected. Failed unique key check\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./apiDocumentation/BatchDocumenation.js",
    "groupTitle": "Batch"
  },
  {
    "type": "POST",
    "url": "/api/v1/chain/batch/write",
    "title": "Add Batched JSON Data",
    "group": "Batch",
    "name": "PostBatch",
    "version": "1.0.0",
    "description": "<p>Write JSON values to the blockchain. The body is treated as an object of key-value pairs, with the values getting written to the blockchain and replaced with tokens in the response. There is a per-request limit of 1024 key-value pairs, with no value allowed to be greater than 3kb in size. If the size of the batch is greater than 500kb, the request will be rejected. The PostBatch operation offers read-after-write consistency and each token is available when the response is sent.</p>",
    "header": {
      "fields": {
        "Request": [
          {
            "group": "Request",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          },
          {
            "group": "Request",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>chainAPI's authorization protocol relies on a properly formatted authorization header. The accepted format is: <code>&quot;ALTR &quot; + api_key + &quot;:&quot; + signature</code>. <code>signature</code> is a base64-encoded, SHA-256 hash that uses the API key's secret as the key for the hash function. The payload being hashed must follow the format: <code>HTTP-METHOD + &quot;\\n&quot; + RESOURCE + &quot;\\n&quot; + DATE + &quot;\\n&quot;</code>. <code>DATE</code> must match X-ALTR-DATE, and RESOURCE must be empty for a POST request. An example payload for a POST request is: <code>&quot;POST\\n\\n01-01-1970 00:00:00\\n&quot;</code></p>"
          },
          {
            "group": "Request",
            "type": "Date",
            "optional": false,
            "field": "X-ALTR-DATE",
            "description": "<p>The datetime used in the authorization signature. If this is more than 15 minutes past the server's internal clock, the request will be rejected.</p>"
          },
          {
            "group": "Request",
            "type": "Number",
            "optional": false,
            "field": "Content-Length",
            "description": "<p>Size of the request. The request will be rejected with a 509 status code if the request if over 500kb.</p>"
          }
        ],
        "Response": [
          {
            "group": "Response",
            "type": "Number",
            "optional": false,
            "field": "X-Bytes-Consumed",
            "description": "<p>The number of bytes written to the blockchain and counted against the Key's organization. The number may differ from the Content-Length header becuase the string representation of the data is written to the blockchain.</p>"
          },
          {
            "group": "Response",
            "type": "Boolean",
            "optional": false,
            "field": "X-Overflow-Data",
            "description": "<p>This flag will be set if any single value is greater than 3kb, or the entire batch is greater than 500kb.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example-Request-Headers:",
          "content": "date = new Date();\npayload = 'POST\\n\\n' + date + '\\n';\nAPI_KEY = <your API key>;\nSECRET = <your API secret>;\n{\n    \"X-ALTR-DATE\": date,\n    \"Authorization\": \"ALTR \" + API_KEY + \":\" + base64(hmac-sha256(payload, SECRET)),\n    \"Content-Type\": \"application/json\",\n    \"Content-Length\": 12345\n}",
          "type": "json"
        },
        {
          "title": "Example-Response-Headers:",
          "content": "{\n    \"X-BYTES-CONSUMED\": 12345,\n    \"X-OVERFLOW-DATA\": true\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>On success, the JSON values given in the body will be replaced with the tokens. If any single value is greater than 3kb, X-Overflow-Data will be set to true and the value will be set to null in the response</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"key-1\": \"token1\",\n    \"key-2\": \"token2\",\n    \"overflow-key\": null\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "optional": false,
            "field": "bad_request",
            "description": "<p>Organization data cap exceeded</p>"
          }
        ],
        "401": [
          {
            "group": "401",
            "optional": false,
            "field": "unauthorized",
            "description": "<p>The API key could not be authenticated.</p>"
          }
        ],
        "403": [
          {
            "group": "403",
            "optional": false,
            "field": "forbidden",
            "description": "<p>API key does not have write permissions.</p>"
          }
        ],
        "503": [
          {
            "group": "503",
            "optional": false,
            "field": "internal_error",
            "description": "<p>The webserver encountered an unexpected error.</p>"
          }
        ],
        "509": [
          {
            "group": "509",
            "optional": false,
            "field": "Bandwith",
            "description": "<p>Limit Exceeded Request exceeded 500kb limit. X-Overflow-Data header will be set to true</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example-503-Response:",
          "content": "HTTP/1.1 503 Internal Server Error\n{\n  \"success\": false,\n  \"response\": {\n      \"error_type\": \"internal_error\",\n      \"error_message\": \"Unable to process request at this time.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "Example-400-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"success\": false,\n  \"response\": {\n      \"error_type\": \"bad_request\",\n      \"error_message\": \"Organization data cap exceeded\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "Example-400-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"success\": false,\n  \"response\": {\n      \"error_type\": \"bad_request\",\n      \"error_message\": \"Invalid JSON detected. Failed unique key check\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "Example-401-Response:",
          "content": "HTTP/1.1 401 Authentication Required\n{\n  \"success\": false,\n  \"response\": {\n      \"error_type\": \"unauthorized\",\n      \"error_message\":  \"API key must be included in header.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "Example-403-Response:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"success\": false,\n  \"response\": {\n      \"error_type\": \"forbidden\",\n      \"error_message\":  \"API key does not have write permission.\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./apiDocumentation/BatchDocumenation.js",
    "groupTitle": "Batch"
  },
  {
    "type": "GET",
    "url": "/api/v1/chain/:referenceToken",
    "title": "Get Data",
    "group": "Chain",
    "name": "GetData",
    "version": "1.0.0",
    "description": "<p>Get the data for the associated reference token</p>",
    "header": {
      "fields": {
        "Request": [
          {
            "group": "Request",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>chainAPI's authorization protocol relies on a properly formatted authorization header. The accepted format is: <code>&quot;ALTR &quot; + api_key + &quot;:&quot; + signature</code>. <code>signature</code> is a base64-encoded, SHA-256 hash that uses the API key's secret as the key for the hash function. The payload being hashed must follow the format: <code>HTTP-METHOD + &quot;\\n&quot; + RESOURCE + &quot;\\n&quot; + DATE + &quot;\\n&quot;</code>. <code>DATE</code> must match X-ALTR-DATE, and RESOURCE must match the referenceToken in the query string. An example payload for a GET request is: <code>&quot;GET\\n&quot; + referenceToken + &quot;\\n01-01-1970 00:00:00\\n&quot;</code></p>"
          },
          {
            "group": "Request",
            "type": "Date",
            "optional": false,
            "field": "X-ALTR-DATE",
            "description": "<p>The datetime used in the authorization signature. If this is more than 15 minutes past the server's internal clock, the request will be rejected.</p>"
          }
        ],
        "Response": [
          {
            "group": "Response",
            "type": "String",
            "optional": false,
            "field": "X-Expected-Hash",
            "description": "<p>A base64 encoded MD5 hash of the data that is expected to be returned.</p>"
          },
          {
            "group": "Response",
            "type": "String",
            "optional": false,
            "field": "X-ALTR-Metadata",
            "description": "<p>If available and given with the file during upload, the metadata associated with the token.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example-Request-Headers:",
          "content": "date = new Date();\npayload = 'GET\\n' + referenceToken + '\\n' + date + '\\n';\nAPI_KEY = <your API key>;\nSECRET = <your API secret>;\n{\n    \"X-ALTR-DATE\": date,\n    \"Authorization\": \"ALTR \" + API_KEY + \":\" + base64(hmac-sha256(payload, SECRET))\n}",
          "type": "json"
        },
        {
          "title": "Example-Response-Headers:",
          "content": "{\n    \"X-EXPECTED-HASH\": \"QHD8L8CIh2n7XAl0ZeCa5A==\",\n    \"X-ALTR-METADATA\": \"filename.txt\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "referenceToken",
            "description": "<p>The token to be fetched.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Bytes",
            "optional": false,
            "field": "body",
            "description": "<p>On success, the associated data will be returned as an octet-stream in the response's body.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "401": [
          {
            "group": "401",
            "optional": false,
            "field": "unauthorized",
            "description": "<p>The API key could not be authenticated.</p>"
          }
        ],
        "403": [
          {
            "group": "403",
            "optional": false,
            "field": "forbidden",
            "description": "<p>API key does not have read permissions.</p>"
          }
        ],
        "404": [
          {
            "group": "404",
            "optional": false,
            "field": "resource_not_found",
            "description": "<p>The requested resource could not be found.</p>"
          }
        ],
        "503": [
          {
            "group": "503",
            "optional": false,
            "field": "internal_error",
            "description": "<p>The webserver encountered an unexpected error.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example-503-Response:",
          "content": "HTTP/1.1 503 Internal Server Error\n{\n  \"success\": false,\n  \"response\": {\n      \"error_type\": \"internal_error\",\n      \"error_message\": \"Unable to process request at this time.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "Example-401-Response:",
          "content": "HTTP/1.1 401 Authentication Required\n{\n  \"success\": false,\n  \"response\": {\n      \"error_type\": \"unauthorized\",\n      \"error_message\":  \"API key must be included in header.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "Example-403-Response:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"success\": false,\n  \"response\": {\n      \"error_type\": \"forbidden\",\n      \"error_message\":  \"API key does not have read permissions.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "Example-404-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"success\": false,\n  \"response\": {\n      \"error_type\": \"resource_not_found\",\n      \"error_message\":  \"Token could not be found.\"\n  }  \n}",
          "type": "json"
        }
      ]
    },
    "filename": "./apiDocumentation/SingleDocumentation.js",
    "groupTitle": "Chain"
  },
  {
    "type": "GET",
    "url": "/api/v1/chain/:referenceToken/metadata",
    "title": "Get Metadata",
    "group": "Chain",
    "name": "GetMetadata",
    "version": "1.0.0",
    "description": "<p>Get the metadata for the associated reference token. If metadata is associated with the token, it will be returned as originally sent.</p>",
    "header": {
      "fields": {
        "Request": [
          {
            "group": "Request",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>chainAPI's authorization protocol relies on a properly formatted authorization header. The accepted format is: <code>&quot;ALTR &quot; + api_key + &quot;:&quot; + signature</code>. <code>signature</code> is a base64-encoded, SHA-256 hash that uses the API key's secret as the key for the hash function. The payload being hashed must follow the format: <code>HTTP-METHOD + &quot;\\n&quot; + RESOURCE + &quot;\\n&quot; + DATE + &quot;\\n&quot;</code>. <code>DATE</code> must match X-ALTR-DATE, and RESOURCE must match the referenceToken in the query string. An example payload for a GET request is: <code>&quot;GET\\n&quot; + referenceToken + &quot;\\n01-01-1970 00:00:00\\n&quot;</code></p>"
          },
          {
            "group": "Request",
            "type": "Date",
            "optional": false,
            "field": "X-ALTR-DATE",
            "description": "<p>The datetime used in the authorization signature. If this is more than 15 minutes past the server's internal clock, the request will be rejected.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example-Request-Headers:",
          "content": "date = new Date();\npayload = 'GET\\n' + referenceToken + '\\n' + date + '\\n';\nAPI_KEY = <your API key>;\nSECRET = <your API secret>;\n{\n    \"X-ALTR-DATE\": date,\n    \"Authorization\": \"ALTR \" + API_KEY + \":\" + base64(hmac-sha256(payload, SECRET))\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "referenceToken",
            "description": "<p>The token that is associated with the metadata.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Boolean indicating if the request was successful.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "metadata",
            "description": "<p>If available, the metadata associated with the token.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n    \"success\": true,\n    \"metadata\": \"filename.txt\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "401": [
          {
            "group": "401",
            "optional": false,
            "field": "unauthorized",
            "description": "<p>The API key could not be authenticated.</p>"
          }
        ],
        "403": [
          {
            "group": "403",
            "optional": false,
            "field": "forbidden",
            "description": "<p>API key does not have read permissions.</p>"
          }
        ],
        "404": [
          {
            "group": "404",
            "optional": false,
            "field": "resource_not_found",
            "description": "<p>The requested resource could not be found.</p>"
          }
        ],
        "503": [
          {
            "group": "503",
            "optional": false,
            "field": "internal_error",
            "description": "<p>The webserver encountered an unexpected error.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example-503-Response:",
          "content": "HTTP/1.1 503 Internal Server Error\n{\n  \"error_type\": \"internal_error\",\n  \"error_message\": \"Unable to process request at this time.\"\n}",
          "type": "json"
        },
        {
          "title": "Example-401-Response:",
          "content": "HTTP/1.1 401 Authentication Required\n{\n  \"error_type\": \"unauthorized\",\n  \"error_message\":  \"API key must be included in header.\"\n}",
          "type": "json"
        },
        {
          "title": "Example-403-Response:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"error_type\": \"forbidden\",\n  \"error_message\":  \"API key does not have read permissions.\"\n}",
          "type": "json"
        },
        {
          "title": "Example-404-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"error_type\": \"resource_not_found\",\n  \"error_message\":  \"Token could not be found.\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./apiDocumentation/SingleDocumentation.js",
    "groupTitle": "Chain"
  },
  {
    "type": "DELETE",
    "url": "/api/v1/chain/:referenceToken",
    "title": "Invalidate Token",
    "group": "Chain",
    "name": "InvalidateToken",
    "version": "1.0.0",
    "description": "<p>Invalidates the referenceToken and prevents this data from being accessed.</p>",
    "header": {
      "fields": {
        "Request": [
          {
            "group": "Request",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>chainAPI's authorization protocol relies on a properly formatted authorization header. The accepted format is: <code>&quot;ALTR &quot; + api_key + &quot;:&quot; + signature</code>. <code>signature</code> is a base64-encoded, SHA-256 hash that uses the API key's secret as the key for the hash function. The payload being hashed must follow the format: <code>HTTP-METHOD + &quot;\\n&quot; + RESOURCE + &quot;\\n&quot; + DATE + &quot;\\n&quot;</code>. <code>DATE</code> must match X-ALTR-DATE, and RESOURCE must match the referenceToken in the query string. An example payload for a DELETE request is: <code>&quot;DELETE\\n&quot; + referenceToken + &quot;\\n01-01-1970 00:00:00\\n&quot;</code></p>"
          },
          {
            "group": "Request",
            "type": "Date",
            "optional": false,
            "field": "X-ALTR-DATE",
            "description": "<p>The datetime used in the authorization signature. If this is more than 15 minutes past the server's internal clock, the request will be rejected.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example-Request-Headers:",
          "content": "date = new Date();\npayload = 'DELETE\\n' + referenceToken + '\\n' + date + '\\n';\nAPI_KEY = <your API key>;\nSECRET = <your API secret>;\n{\n    \"X-ALTR-DATE\": date,\n    \"Authorization\": \"ALTR \" + API_KEY + \":\" + base64(hmac-sha256(payload, SECRET))\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 204 No Content",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "401": [
          {
            "group": "401",
            "optional": false,
            "field": "unauthorized",
            "description": "<p>The API key could not be authenticated.</p>"
          }
        ],
        "403": [
          {
            "group": "403",
            "optional": false,
            "field": "forbidden",
            "description": "<p>API key does not have write permissions.</p>"
          }
        ],
        "404": [
          {
            "group": "404",
            "optional": false,
            "field": "resource_not_found",
            "description": "<p>The requested resource could not be found.</p>"
          }
        ],
        "503": [
          {
            "group": "503",
            "optional": false,
            "field": "internal_error",
            "description": "<p>The webserver encountered an unexpected error.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example-503-Response:",
          "content": "HTTP/1.1 503 Internal Server Error\n{\n  \"success\": false,\n  \"response\": {\n      \"error_type\": \"internal_error\",\n      \"error_message\": \"Unable to process request at this time.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "Example-401-Response:",
          "content": "HTTP/1.1 401 Authentication Required\n{\n  \"success\": false,\n  \"response\": {\n      \"error_type\": \"unauthorized\",\n      \"error_message\":  \"API key must be included in header.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "Example-403-Response:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"success\": false,\n  \"response\": {\n      \"error_type\": \"forbidden\",\n      \"error_message\":  \"API key does not have write permission.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "Example-404-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"success\": false,\n  \"response\": {\n      \"error_type\": \"resource_not_found\",\n      \"error_message\": \"Token could not be found\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./apiDocumentation/SingleDocumentation.js",
    "groupTitle": "Chain"
  },
  {
    "type": "POST",
    "url": "/api/v1/chain/",
    "title": "Add Data",
    "group": "Chain",
    "name": "PutData",
    "version": "1.0.0",
    "description": "<p>Write the data attached to the request to the blockchain</p>",
    "header": {
      "fields": {
        "Request": [
          {
            "group": "Request",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/octet-stream</p>"
          },
          {
            "group": "Request",
            "type": "String",
            "optional": false,
            "field": "X-ALTR-METADATA",
            "description": "<p>Optional metadata to be associated with the request.</p>"
          },
          {
            "group": "Request",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>chainAPI's authorization protocol relies on a properly formatted authorization header. The accepted format is: <code>&quot;ALTR &quot; + api_key + &quot;:&quot; + signature</code>. <code>signature</code> is a base64-encoded, SHA-256 hash that uses the API key's secret as the key for the hash function. The payload being hashed must follow the format: <code>HTTP-METHOD + &quot;\\n&quot; + RESOURCE + &quot;\\n&quot; + DATE + &quot;\\n&quot;</code>. <code>DATE</code> must match X-ALTR-DATE, and RESOURCE must be empty for a POST request. An example payload for a POST request is: <code>&quot;POST\\n\\n01-01-1970 00:00:00\\n&quot;</code></p>"
          },
          {
            "group": "Request",
            "type": "Date",
            "optional": false,
            "field": "X-ALTR-DATE",
            "description": "<p>The datetime used in the authorization signature. If this is more than 15 minutes past the server's internal clock, the request will be rejected.</p>"
          },
          {
            "group": "Request",
            "type": "Number",
            "optional": false,
            "field": "Content-Length",
            "description": "<p>If known, the length of the data being sent to the server. If given alongside X-Content-Length-Hint, Content-Length will be used in evaluating the request.</p>"
          }
        ],
        "Reqeust": [
          {
            "group": "Reqeust",
            "type": "Number",
            "optional": false,
            "field": "X-Content-Length-Hint",
            "description": "<p>If the size of the request is unkown, X-Content-Length-Hint may be provided. If the hint is less than 3kb, and the request ends up being larger than that, at most 3kb will be written to the blockchain.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example-Request-Headers:",
          "content": "date = new Date();\npayload = 'POST\\n\\n' + date + '\\n';\nAPI_KEY = <your API key>;\nSECRET = <your API secret>;\n{\n    \"X-ALTR-DATE\": date,\n    \"Authorization\": \"ALTR \" + API_KEY + \":\" + base64(hmac-sha256(payload, SECRET)),\n    \"X-ALTR-METADATA\": \"<metadata>\",\n    \"X-Content-Length-Hint\": 500\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "referenceToken",
            "description": "<p>Token used to access the data that is being written to the blockchain.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"success\": true\n    \"response\": {\n        \"data\": {\n            \"referenceToken\": <token>\n        }\n    }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "optional": false,
            "field": "bad_request",
            "description": "<p>Organization data cap exceeded</p>"
          }
        ],
        "401": [
          {
            "group": "401",
            "optional": false,
            "field": "unauthorized",
            "description": "<p>The API key could not be authenticated.</p>"
          }
        ],
        "403": [
          {
            "group": "403",
            "optional": false,
            "field": "forbidden",
            "description": "<p>API key does not have write permissions.</p>"
          }
        ],
        "503": [
          {
            "group": "503",
            "optional": false,
            "field": "internal_error",
            "description": "<p>The webserver encountered an unexpected error.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example-503-Response:",
          "content": "HTTP/1.1 503 Internal Server Error\n{\n  \"success\": false,\n  \"response\": {\n      \"error_type\": \"internal_error\",\n      \"error_message\": \"Unable to process request at this time.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "Example-400-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"success\": false,\n  \"response\": {\n      \"error_type\": \"bad_request\",\n      \"error_message\": \"Organization data cap exceeded\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "Example-401-Response:",
          "content": "HTTP/1.1 401 Authentication Required\n{\n  \"success\": false,\n  \"response\": {\n      \"error_type\": \"unauthorized\",\n      \"error_message\":  \"API key must be included in header.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "Example-403-Response:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"success\": false,\n  \"response\": {\n      \"error_type\": \"forbidden\",\n      \"error_message\":  \"API key does not have write permission.\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./apiDocumentation/SingleDocumentation.js",
    "groupTitle": "Chain"
  },
  {
    "type": "GET",
    "url": "/api/v1/status/:referenceToken",
    "title": "Token Status",
    "group": "Chain",
    "name": "TokenStatus",
    "version": "1.0.0",
    "description": "<p>Gets the status of the reference token.</p>",
    "header": {
      "fields": {
        "Request": [
          {
            "group": "Request",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>chainAPI's authorization protocol relies on a properly formatted authorization header. The accepted format is: <code>&quot;ALTR &quot; + api_key + &quot;:&quot; + signature</code>. <code>signature</code> is a base64-encoded, SHA-256 hash that uses the API key's secret as the key for the hash function. The payload being hashed must follow the format: <code>HTTP-METHOD + &quot;\\n&quot; + RESOURCE + &quot;\\n&quot; + DATE + &quot;\\n&quot;</code>. <code>DATE</code> must match X-ALTR-DATE, and RESOURCE must match the referenceToken in the query string. An example payload for a GET request is: <code>&quot;GET\\n&quot; + referenceToken + &quot;\\n01-01-1970 00:00:00\\n&quot;</code></p>"
          },
          {
            "group": "Request",
            "type": "Date",
            "optional": false,
            "field": "X-ALTR-DATE",
            "description": "<p>The datetime used in the authorization signature. If this is more than 15 minutes past the server's internal clock, the request will be rejected.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example-Request-Headers:",
          "content": "date = new Date();\npayload = 'GET\\n' + referenceToken + '\\n' + date + '\\n';\nAPI_KEY = <your API key>;\nSECRET = <your API secret>;\n{\n    \"X-ALTR-DATE\": date,\n    \"Authorization\": \"ALTR \" + API_KEY + \":\" + base64(hmac-sha256(payload, SECRET))\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "token_active",
            "description": "<p>The token's status. If false, the token cannot be fetched.</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "data_protected",
            "description": "<p>Whether or not the data has been fully written to the blockchain.</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "data_available",
            "description": "<p>Whether or not the data is available to be fetched. Data of size greater than 500 bytes becomes available upon the encryption key being protected. Data of size less than 500 bytes becomes available once it is written to the blockchain.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example-Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"success\": true,\n  \"response\": {\n     \"data\": {\n        \"token_active\": true,\n        \"data_protected\": false,\n        \"data_available\": true\n     }\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "401": [
          {
            "group": "401",
            "optional": false,
            "field": "unauthorized",
            "description": "<p>The API key could not be authenticated.</p>"
          }
        ],
        "404": [
          {
            "group": "404",
            "optional": false,
            "field": "resource_not_found",
            "description": "<p>The requested resource could not be found.</p>"
          }
        ],
        "503": [
          {
            "group": "503",
            "optional": false,
            "field": "internal_error",
            "description": "<p>The webserver encountered an unexpected error.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example-503-Response:",
          "content": "HTTP/1.1 503 Internal Server Error\n{\n  \"success\": false,\n  \"response\": {\n      \"error_type\": \"internal_error\",\n      \"error_message\": \"Unable to process request at this time.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "Example-401-Response:",
          "content": "HTTP/1.1 401 Authentication Required\n{\n  \"success\": false,\n  \"response\": {\n      \"error_type\": \"unauthorized\",\n      \"error_message\":  \"API key must be included in header.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "Example-404-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"success\": false,\n  \"response\": {\n      \"error_type\": \"resource_not_found\",\n      \"error_message\":  \"Token could not be found.\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./apiDocumentation/StatusDocumentation.js",
    "groupTitle": "Chain"
  }
] });
