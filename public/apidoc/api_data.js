define({ "api": [
  {
    "type": "post",
    "url": "login",
    "title": "1.2. Log in",
    "version": "1.4.11",
    "group": "1._System",
    "examples": [
      {
        "title": "Request body",
        "content": "{\n    \"email\": \"joao@gmail.com\", \n    \"password\": \"joaoPassword\" \n}",
        "type": "json"
      }
    ],
    "parameter": {
      "fields": {
        "Request body params": [
          {
            "group": "Request body params",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>User email.</p>"
          },
          {
            "group": "Request body params",
            "type": "String",
            "size": "8..",
            "optional": false,
            "field": "password",
            "description": "<p>User password.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>Token for authentication.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success Response:",
          "content": "HTTPS/1.1 200 OK\n{\n    \"token\": \"eyJhbGciOiJIUzI1NiIvInR5cCI6IkpXVCJ4.eyJpZCI6NRwiaWF0IjoxNjAyMTgyNDUyfQ.MR_ehSSQTe9-yVoSe1RAGQZnV6ygLCV4-vcxajBAeaq\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "type": "Object[]",
            "optional": false,
            "field": "incorrectFields",
            "description": "<p>The fields were not filled in according to our business rule</p>"
          }
        ],
        "401": [
          {
            "group": "401",
            "type": "Object",
            "optional": false,
            "field": "incorrectCredentials",
            "description": "<p>Invalid credentials</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Incorrect fields:",
          "content": "HTTPS/1.1 400 Bad Request\n[\n    {\n        \"label\": \"email\",\n        \"message\": \"This string is invalid for email type\"\n    },\n    {\n        \"label\": \"password\",\n        \"message\": \"The name must have on minimum 8 characters\"\n    }\n]",
          "type": "json"
        },
        {
          "title": "Incorrect credentials: ",
          "content": "HTTPS/1.1 401 Unauthorized\n{\n    \"message\": \"Incorrect credentials\",\n    \"status\": 409\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/userRoutes.ts",
    "groupTitle": "1._System",
    "name": "PostLogin"
  },
  {
    "type": "post",
    "url": "users",
    "title": "1.1. Register",
    "version": "1.4.11",
    "group": "1._System",
    "examples": [
      {
        "title": "Request body",
        "content": "{ \n    \"name\": \"João\", \n    \"surname\": \"Silva\", \n    \"email\": \"joao@gmail.com\", \n    \"password\": \"joaoPassword\" \n}",
        "type": "json"
      }
    ],
    "parameter": {
      "fields": {
        "Request body params": [
          {
            "group": "Request body params",
            "type": "String",
            "size": "3..100",
            "optional": false,
            "field": "name",
            "description": "<p>User name.</p>"
          },
          {
            "group": "Request body params",
            "type": "String",
            "size": "3..100",
            "optional": false,
            "field": "surname",
            "description": "<p>User last name.</p>"
          },
          {
            "group": "Request body params",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>User email.</p>"
          },
          {
            "group": "Request body params",
            "type": "String",
            "size": "8..",
            "optional": false,
            "field": "password",
            "description": "<p>User password.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "201": [
          {
            "group": "201",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>Token for authentication.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success Response:",
          "content": "HTTPS/1.1 201 CREATED\n{\n    \"token\": \"eyJhbGciOiJIUzI1NiIvInR5cCI6IkpXVCJ4.eyJpZCI6NRwiaWF0IjoxNjAyMTgyNDUyfQ.MR_ehSSQTe9-yVoSe1RAGQZnV6ygLCV4-vcxajBAeaq\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Incorrects fields:",
          "content": "HTTPS/1.1 400 Bad Request\n[\n    {\n        \"label\": \"name\",\n        \"message\": \"This field is required\"\n    },\n    {\n        \"label\": \"surname\",\n        \"message\": \"This field is string type\"\n    },\n    {\n        \"label\": \"email\",\n        \"message\": \"This string is invalid for email type\"\n    },\n    {\n        \"label\": \"password\",\n        \"message\": \"The name must have on minimum 8 characters\"\n    }\n ]",
          "type": "json"
        }
      ],
      "fields": {
        "400": [
          {
            "group": "400",
            "type": "Object[]",
            "optional": false,
            "field": "incorrectFields",
            "description": "<p>The fields were not filled in according to our business rule</p>"
          }
        ]
      }
    },
    "filename": "src/routes/userRoutes.ts",
    "groupTitle": "1._System",
    "name": "PostUsers"
  },
  {
    "type": "delete",
    "url": "profile",
    "title": "2.5. Delete user",
    "version": "1.4.11",
    "group": "2._Profile",
    "parameter": {
      "fields": {
        "Request body param": [
          {
            "group": "Request body param",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>User email</p>"
          },
          {
            "group": "Request body param",
            "type": "String",
            "size": "8..",
            "optional": false,
            "field": "passowrd",
            "description": "<p>user password</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Request body:",
        "content": "{\n    \"email\": \"joao@gmail.com\",\n    \"password\": \"joaoPassword\"\n}",
        "type": "json"
      },
      {
        "title": "Token header:",
        "content": "\"x-access-token\": \"Bearer <TOKEN>\"",
        "type": "header"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success Response:",
          "content": "HTTPS/1.1 200 OK",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "type": "Object",
            "optional": false,
            "field": "incorrectCredentials",
            "description": "<p>Credentials inserted are incorrect</p>"
          },
          {
            "group": "400",
            "type": "Object",
            "optional": false,
            "field": "noneToken",
            "description": "<p>None token inserted in header x-access-token</p>"
          },
          {
            "group": "400",
            "type": "Object[]",
            "optional": false,
            "field": "incorrectFields",
            "description": "<p>The fields were not filled in according to our business rule</p>"
          }
        ],
        "403": [
          {
            "group": "403",
            "type": "Object",
            "optional": false,
            "field": "invalidToken",
            "description": "<p>The token inserted is invalid.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "No token error",
          "content": "HTTPS/1.1 403 Forbidden\n{\n    \"status\": 403,\n    \"message\": \"none token provided\"\n}",
          "type": "json"
        },
        {
          "title": "Invalid token error",
          "content": "HTTPS/1.1 403 Forbidden\n{\n    \"status\": 403,\n    \"message\": \"invalid token\"\n}",
          "type": "json"
        },
        {
          "title": "Incorrect credentials: ",
          "content": "HTTPS/1.1 401 Unauthorized\n{\n    \"message\": \"Incorrect credentials\",\n    \"status\": 409\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/profileRoutes.ts",
    "groupTitle": "2._Profile",
    "name": "DeleteProfile",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>Token for authentication.</p>"
          }
        ]
      }
    }
  },
  {
    "type": "get",
    "url": "profile",
    "title": "2.1. Get profile",
    "version": "1.5.1",
    "group": "2._Profile",
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>User identification code.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>User name.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "surname",
            "description": "<p>User last name.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>User email.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": true,
            "field": "biography",
            "description": "<p>User biography.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": true,
            "field": "label",
            "description": "<p>User characteristic.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": true,
            "field": "website",
            "description": "<p>User website.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": true,
            "field": "image",
            "description": "<p>Profile picture link.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": true,
            "field": "profission",
            "description": "<p>User profission.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": true,
            "field": "company",
            "description": "<p>User company name.</p>"
          },
          {
            "group": "200",
            "type": "Object",
            "optional": true,
            "field": "location",
            "description": "<p>User location.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "location[city]",
            "description": "<p>User city.</p>"
          },
          {
            "group": "200",
            "type": "Object",
            "optional": false,
            "field": "location[geolocation]",
            "description": "<p>User geolocation.</p>"
          },
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "geolocation[latitude]",
            "description": "<p>Geolocation latitude.</p>"
          },
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "geolocation[longitude]",
            "description": "<p>Geolocation longitude.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success Response:",
          "content": "HTTPS/1.1 200 OK\n{\n    \"id\": 5,\n    \"name\": \"Joao\",\n    \"surname\": \"Silva\",\n    \"email\": \"joao1980@gmail.com\",\n    \"biography\": null,\n    \"label\": null,\n    \"website\": null,\n    \"image\": null,\n    \"profission\": null,\n    \"company\": null,\n    \"location\": null\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/profileRoutes.ts",
    "groupTitle": "2._Profile",
    "name": "GetProfile",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>Token for authentication.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Token header:",
        "content": "\"x-access-token\": \"Bearer <TOKEN>\"",
        "type": "header"
      }
    ],
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "type": "Object",
            "optional": false,
            "field": "noneToken",
            "description": "<p>None token inserted in header x-access-token</p>"
          }
        ],
        "403": [
          {
            "group": "403",
            "type": "Object",
            "optional": false,
            "field": "invalidToken",
            "description": "<p>The token inserted is invalid.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "No token error",
          "content": "HTTPS/1.1 403 Forbidden\n{\n    \"status\": 403,\n    \"message\": \"none token provided\"\n}",
          "type": "json"
        },
        {
          "title": "Invalid token error",
          "content": "HTTPS/1.1 403 Forbidden\n{\n    \"status\": 403,\n    \"message\": \"invalid token\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "patch",
    "url": "profile",
    "title": "2.4. Update password",
    "version": "1.4.11",
    "name": "PATCH_profile",
    "group": "2._Profile",
    "parameter": {
      "fields": {
        "Request body params": [
          {
            "group": "Request body params",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>User password</p>"
          },
          {
            "group": "Request body params",
            "type": "String",
            "size": "8..",
            "optional": false,
            "field": "newPassowrd",
            "description": "<p>New password</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Request body:",
        "content": "{\n    \"password\": \"joaoPassword\",\n    \"newPassword\": \"joao1234\"\n}",
        "type": "json"
      },
      {
        "title": "Token header:",
        "content": "\"x-access-token\": \"Bearer <TOKEN>\"",
        "type": "header"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success Response:",
          "content": "HTTPS/1.1 200 OK",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "type": "Object",
            "optional": false,
            "field": "noneToken",
            "description": "<p>None token inserted in header x-access-token</p>"
          }
        ],
        "401": [
          {
            "group": "401",
            "type": "Object",
            "optional": false,
            "field": "invalidPassword",
            "description": "<p>Password inserted is invalid</p>"
          }
        ],
        "403": [
          {
            "group": "403",
            "type": "Object",
            "optional": false,
            "field": "invalidToken",
            "description": "<p>The token inserted is invalid.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Incorrect password error:",
          "content": "HTTPS/1.1 401 Unauthorized\n{\n    \"message\": \"Invalid password\",\n    \"status\": 401\n}",
          "type": "json"
        },
        {
          "title": "No token error",
          "content": "HTTPS/1.1 403 Forbidden\n{\n    \"status\": 403,\n    \"message\": \"none token provided\"\n}",
          "type": "json"
        },
        {
          "title": "Invalid token error",
          "content": "HTTPS/1.1 403 Forbidden\n{\n    \"status\": 403,\n    \"message\": \"invalid token\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/profileRoutes.ts",
    "groupTitle": "2._Profile",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>Token for authentication.</p>"
          }
        ]
      }
    }
  },
  {
    "type": "post",
    "url": "profile",
    "title": "2.3. Upload profile picture",
    "version": "1.5.1",
    "group": "2._Profile",
    "parameter": {
      "fields": {
        "Form data params": [
          {
            "group": "Form data params",
            "type": "image",
            "optional": false,
            "field": "imageProfile",
            "description": "<p>Profile picture</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "form-data:",
        "content": "imageProfile: <image>",
        "type": "FormData"
      },
      {
        "title": "Token header:",
        "content": "\"x-access-token\": \"Bearer <TOKEN>\"",
        "type": "header"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success Response:",
          "content": "HTTPS/1.1 200 OK\n{\n    \"id\": 5,\n    \"name\": \"Joao\",\n    \"surname\": \"Silva\",\n    \"email\": \"joao1980@gmail.com\",\n    \"biography\": null,\n    \"label\": null,\n    \"website\": null,\n    \"image\": \"https://images.com/1\",\n    \"profission\": null,\n    \"company\": null\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Incorrect Field:",
          "content": "HTTPS/1.1 400 Bad Request\n{ \n    \"message\": \"This file format is not accept here, only .jpg and .png\" \n}",
          "type": "json"
        },
        {
          "title": "No token error",
          "content": "HTTPS/1.1 403 Forbidden\n{\n    \"status\": 403,\n    \"message\": \"none token provided\"\n}",
          "type": "json"
        },
        {
          "title": "Invalid token error",
          "content": "HTTPS/1.1 403 Forbidden\n{\n    \"status\": 403,\n    \"message\": \"invalid token\"\n}",
          "type": "json"
        }
      ],
      "fields": {
        "400": [
          {
            "group": "400",
            "type": "Object",
            "optional": false,
            "field": "noneToken",
            "description": "<p>None token inserted in header x-access-token</p>"
          },
          {
            "group": "400",
            "type": "Object[]",
            "optional": false,
            "field": "incorrectFields",
            "description": "<p>The fields were not filled in according to our business rule</p>"
          }
        ],
        "403": [
          {
            "group": "403",
            "type": "Object",
            "optional": false,
            "field": "invalidToken",
            "description": "<p>The token inserted is invalid.</p>"
          }
        ]
      }
    },
    "filename": "src/routes/profileRoutes.ts",
    "groupTitle": "2._Profile",
    "name": "PostProfile",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>Token for authentication.</p>"
          }
        ]
      }
    }
  },
  {
    "type": "put",
    "url": "profile",
    "title": "2.2. Update profile",
    "version": "1.4.11",
    "group": "2._Profile",
    "parameter": {
      "fields": {
        "Request body params": [
          {
            "group": "Request body params",
            "type": "String",
            "size": "3..100",
            "optional": true,
            "field": "name_to",
            "description": "<p>New user name.</p>"
          },
          {
            "group": "Request body params",
            "type": "String",
            "size": "3..100",
            "optional": true,
            "field": "surname_to",
            "description": "<p>New user last name.</p>"
          },
          {
            "group": "Request body params",
            "type": "String",
            "size": "..255",
            "optional": true,
            "field": "biography_to",
            "description": "<p>New user biography.</p>"
          },
          {
            "group": "Request body params",
            "type": "String",
            "size": "..30",
            "optional": true,
            "field": "label_to",
            "description": "<p>New user label.</p>"
          },
          {
            "group": "Request body params",
            "type": "String",
            "size": "..100",
            "optional": true,
            "field": "profission_to",
            "description": "<p>New user profission.</p>"
          },
          {
            "group": "Request body params",
            "type": "String",
            "size": "..100",
            "optional": true,
            "field": "company_to",
            "description": "<p>New user company.</p>"
          },
          {
            "group": "Request body params",
            "type": "String",
            "size": "..255",
            "optional": true,
            "field": "website_to",
            "description": "<p>New user website.</p>"
          },
          {
            "group": "Request body params",
            "type": "Object",
            "optional": true,
            "field": "location_to",
            "description": "<p>New user location.</p>"
          },
          {
            "group": "Request body params",
            "type": "String",
            "size": "2",
            "optional": false,
            "field": "location[uf]",
            "description": "<p>New user UF.</p>"
          },
          {
            "group": "Request body params",
            "type": "String",
            "size": "..100",
            "optional": false,
            "field": "location[city]",
            "description": "<p>New user city.</p>"
          },
          {
            "group": "Request body params",
            "type": "Object",
            "optional": false,
            "field": "location[geolocation]",
            "description": "<p>New user geolocation.</p>"
          },
          {
            "group": "Request body params",
            "type": "Number",
            "optional": false,
            "field": "geolocation[latitude]",
            "description": "<p>New latitude.</p>"
          },
          {
            "group": "Request body params",
            "type": "Number",
            "optional": false,
            "field": "geolocation[longitude]",
            "description": "<p>New longitude.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Request body:",
        "content": "{\n    \"name_to\": \"Pedro\",\n    \"surname_to\": \"Santiago\",\n    \"biography_to\": \"Um jovem que gosta de eventos de jogos.\",\n    \"label_to\": \"gamer\",\n    \"profission_to\": \"Estudante\",\n    \"website_to\": \"https://www.pedrogames.com\",\n    \"location_to\": {\n        \"uf\": \"SP\",\n        \"city\": \"Praia Grande\",\n        \"geolocation\": {\n            \"latitude\": -24.0089,\n            \"longitude\": -46.4125\n        }\n    }\n}",
        "type": "json"
      },
      {
        "title": "Token header:",
        "content": "\"x-access-token\": \"Bearer <TOKEN>\"",
        "type": "header"
      }
    ],
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>User identification code.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>User name.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "surname",
            "description": "<p>User last name.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>User email.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": true,
            "field": "biography",
            "description": "<p>User biography.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": true,
            "field": "label",
            "description": "<p>User characteristic.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": true,
            "field": "website",
            "description": "<p>User website.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": true,
            "field": "image",
            "description": "<p>Profile picture link.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": true,
            "field": "company",
            "description": "<p>User company name.</p>"
          },
          {
            "group": "200",
            "type": "Object",
            "optional": true,
            "field": "location",
            "description": "<p>User location.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "location[city]",
            "description": "<p>User city.</p>"
          },
          {
            "group": "200",
            "type": "Object",
            "optional": false,
            "field": "location[geolocation]",
            "description": "<p>User geolocation.</p>"
          },
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "geolocation[latitude]",
            "description": "<p>Geolocation latitude.</p>"
          },
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "geolocation[longitude]",
            "description": "<p>Geolocation longitude.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success response:",
          "content": "HTTPS/1.1 200 OK\n{\n   \"id\": 5,\n   \"name\": \"Pedro\",\n   \"surname\": \"Santiago\",\n   \"email\": \"joao1980@gmail.com\",\n   \"biography\": \"Um jovem que gosta de eventos de jogos.\",\n   \"label\": \"gamer\",\n   \"website\": \"https://www.pedrogames.com\",\n   \"image\": null,\n   \"company\": null,\n   \"location\": {\n       \"city\": \"Praia Grande\",\n       \"uf\": \"SP\",\n       \"geolocation\": {\n           \"latitude\": \"-24.00890\",\n           \"longitude\": \"-46.41250\"\n       }\n   }\n}",
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
            "field": "noField",
            "description": "<p>No field need be updated.</p>"
          },
          {
            "group": "400",
            "type": "Object",
            "optional": false,
            "field": "noneToken",
            "description": "<p>None token inserted in header x-access-token</p>"
          },
          {
            "group": "400",
            "type": "Object[]",
            "optional": false,
            "field": "incorrectFields",
            "description": "<p>The fields were not filled in according to our business rule</p>"
          }
        ],
        "403": [
          {
            "group": "403",
            "type": "Object",
            "optional": false,
            "field": "invalidToken",
            "description": "<p>The token inserted is invalid.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "noField:",
          "content": "HTTPS/1.1 400 Bad Request\n    { \n        status: 400, \n        message: 'No field to update' \n    }",
          "type": "json"
        },
        {
          "title": "No token error",
          "content": "HTTPS/1.1 403 Forbidden\n{\n    \"status\": 403,\n    \"message\": \"none token provided\"\n}",
          "type": "json"
        },
        {
          "title": "Invalid token error",
          "content": "HTTPS/1.1 403 Forbidden\n{\n    \"status\": 403,\n    \"message\": \"invalid token\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/profileRoutes.ts",
    "groupTitle": "2._Profile",
    "name": "PutProfile",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>Token for authentication.</p>"
          }
        ]
      }
    }
  },
  {
    "type": "get",
    "url": "users",
    "title": "2.1. Get user by email",
    "version": "1.5.1",
    "group": "2._Users",
    "parameter": {
      "fields": {
        "Request body params": [
          {
            "group": "Request body params",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>User email.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Request body:",
        "content": "{\n    \"email\": \"joao1980@gmail.com\"\n}",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>User identification code.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>User name.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "surname",
            "description": "<p>User last name.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>User email.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": true,
            "field": "biography",
            "description": "<p>User biography.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": true,
            "field": "label",
            "description": "<p>User characteristic.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": true,
            "field": "website",
            "description": "<p>User website.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": true,
            "field": "image",
            "description": "<p>Profile picture link.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": true,
            "field": "profission",
            "description": "<p>User profission.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": true,
            "field": "company",
            "description": "<p>User company name.</p>"
          },
          {
            "group": "200",
            "type": "Object",
            "optional": true,
            "field": "location",
            "description": "<p>User location.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "location[city]",
            "description": "<p>User city.</p>"
          },
          {
            "group": "200",
            "type": "Object",
            "optional": false,
            "field": "location[geolocation]",
            "description": "<p>User geolocation.</p>"
          },
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "geolocation[latitude]",
            "description": "<p>Geolocation latitude.</p>"
          },
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "geolocation[longitude]",
            "description": "<p>Geolocation longitude.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success Response:",
          "content": "HTTPS/1.1 200 OK\n{\n    \"id\": 5,\n    \"name\": \"Joao\",\n    \"surname\": \"Silva\",\n    \"email\": \"joao1980@gmail.com\",\n    \"biography\": null,\n    \"label\": null,\n    \"website\": null,\n    \"image\": null,\n    \"profission\": null,\n    \"company\": null,\n    \"location\": null\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "404": [
          {
            "group": "404",
            "optional": false,
            "field": "userNotFound",
            "description": "<p>No registered user with this email</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "HTTPS/1.1 404 Not Found",
          "content": "HTTPS/1.1 404 Not Found\n    {\n        \"status\": 404,\n        \"message\": \"This user don't exists\"\n    }",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/userRoutes.ts",
    "groupTitle": "2._Users",
    "name": "GetUsers"
  },
  {
    "type": "delete",
    "url": "events/:id",
    "title": "3.4. Delete event",
    "version": "1.6.3",
    "group": "3._Events",
    "parameter": {
      "fields": {
        "Path Params": [
          {
            "group": "Path Params",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Event identification code.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success Response:",
          "content": "HTTPS/1.1 200 OK",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/eventRoutes.ts",
    "groupTitle": "3._Events",
    "name": "DeleteEventsId",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>Token for authentication.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Token header:",
        "content": "\"x-access-token\": \"Bearer <TOKEN>\"",
        "type": "header"
      }
    ],
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "type": "Object",
            "optional": false,
            "field": "noneToken",
            "description": "<p>None token inserted in header x-access-token</p>"
          }
        ],
        "403": [
          {
            "group": "403",
            "type": "Object",
            "optional": false,
            "field": "invalidToken",
            "description": "<p>The token inserted is invalid.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "No token error",
          "content": "HTTPS/1.1 403 Forbidden\n{\n    \"status\": 403,\n    \"message\": \"none token provided\"\n}",
          "type": "json"
        },
        {
          "title": "Invalid token error",
          "content": "HTTPS/1.1 403 Forbidden\n{\n    \"status\": 403,\n    \"message\": \"invalid token\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "events",
    "title": "3.1. Create event",
    "version": "1.5.2",
    "group": "3._Events",
    "parameter": {
      "fields": {
        "Request body params": [
          {
            "group": "Request body params",
            "type": "String",
            "size": "3..100",
            "optional": false,
            "field": "name",
            "description": "<p>Event name.</p>"
          },
          {
            "group": "Request body params",
            "type": "Date",
            "optional": false,
            "field": "start_date",
            "description": "<p>Start date of the event. (Format: yyyy-mm-dd).</p>"
          },
          {
            "group": "Request body params",
            "type": "Date",
            "optional": false,
            "field": "end_date",
            "description": "<p>End date of the event. (Format: yyyy-mm-dd).</p>"
          },
          {
            "group": "Request body params",
            "type": "String",
            "size": "..255",
            "optional": true,
            "field": "description",
            "description": "<p>Event description.</p>"
          },
          {
            "group": "Request body params",
            "type": "Time",
            "optional": true,
            "field": "start_time",
            "description": "<p>Start time of the event. (Format: hh:mm).</p>"
          },
          {
            "group": "Request body params",
            "type": "Time",
            "optional": true,
            "field": "end_time",
            "description": "<p>End time of the event. (Format: hh:mm).</p>"
          },
          {
            "group": "Request body params",
            "type": "String",
            "size": "0..100",
            "optional": true,
            "field": "type",
            "description": "<p>Event type.</p>"
          },
          {
            "group": "Request body params",
            "type": "Object",
            "optional": false,
            "field": "location",
            "description": "<p>Event location.</p>"
          },
          {
            "group": "Request body params",
            "type": "String",
            "size": "3",
            "optional": false,
            "field": "privacy",
            "description": "<p>Event privacy.</p>"
          },
          {
            "group": "Request body params",
            "type": "String",
            "size": "3",
            "optional": false,
            "field": "category",
            "description": "<p>Event category.</p>"
          },
          {
            "group": "Request body params",
            "type": "String",
            "size": "3..120",
            "optional": false,
            "field": "location[street]",
            "description": "<p>Event street.</p>"
          },
          {
            "group": "Request body params",
            "type": "String",
            "size": "3..100",
            "optional": false,
            "field": "location[neighborhood]",
            "description": "<p>Event neighborhood.</p>"
          },
          {
            "group": "Request body params",
            "type": "Number",
            "optional": false,
            "field": "location[number]",
            "description": "<p>Event establishment number</p>"
          },
          {
            "group": "Request body params",
            "type": "String",
            "size": "8",
            "optional": false,
            "field": "location[cep]",
            "description": "<p>Event zip code. (Only numbers).</p>"
          },
          {
            "group": "Request body params",
            "type": "String",
            "size": "0..100",
            "optional": true,
            "field": "location[complement]",
            "description": "<p>Additional event location information.</p>"
          },
          {
            "group": "Request body params",
            "type": "String",
            "size": "3..100",
            "optional": false,
            "field": "location[city]",
            "description": "<p>Location Event city.</p>"
          },
          {
            "group": "Request body params",
            "type": "String",
            "size": "2",
            "optional": false,
            "field": "location[uf]",
            "description": "<p>Event federative unit. (uppercase).</p>"
          },
          {
            "group": "Request body params",
            "type": "Object",
            "optional": false,
            "field": "location[geolocation]",
            "description": "<p>Event geolocation.</p>"
          },
          {
            "group": "Request body params",
            "type": "Number",
            "optional": false,
            "field": "geolocation[latitude]",
            "description": "<p>Event latitude.</p>"
          },
          {
            "group": "Request body params",
            "type": "Object",
            "optional": false,
            "field": "geolocation[longitude]",
            "description": "<p>Event longitude.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Request body",
        "content": "{\n    \"name\": \"Flores e frutas\",\n    \"start_date\": \"2020-10-22\",\n    \"end_date\": \"2020-10-25\",\n    \"description\": \"Venha participar do maior evento sobre flores e frutas da América Latina.\",\n    \"start_time\": \"15:00\",\n    \"end_time\": \"20:00\",\n    \"privacy\": \"PUB\",\n    \"category\": \"NAT\",\n    \"location\": {\n        \"street\": \"Rua rubi\",\n        \"neighborhood\": \"Cidade da criança\",\n        \"number\": 202,\n        \"cep\": \"11710210\",\n        \"complement\": \"Espaço B\",\n        \"geolocation\": {\n             \"latitude\": 1.534,\n             \"longitude\": 3.123\n        },\n        \"city\": \"Praia Grande\",\n        \"uf\": \"SP\"\n    }\n}",
        "type": "json"
      },
      {
        "title": "Token header:",
        "content": "\"x-access-token\": \"Bearer <TOKEN>\"",
        "type": "header"
      }
    ],
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Event identification code.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "size": "3..100",
            "optional": false,
            "field": "name",
            "description": "<p>Event name.</p>"
          },
          {
            "group": "200",
            "type": "Date",
            "optional": false,
            "field": "start_date",
            "description": "<p>Start date of the event. (Format: yyyy-mm-dd).</p>"
          },
          {
            "group": "200",
            "type": "Date",
            "optional": false,
            "field": "end_date",
            "description": "<p>End date of the event. (Format: yyyy-mm-dd).</p>"
          },
          {
            "group": "200",
            "type": "String",
            "size": "..255",
            "optional": true,
            "field": "description",
            "description": "<p>Event description.</p>"
          },
          {
            "group": "200",
            "type": "Time",
            "optional": true,
            "field": "start_time",
            "description": "<p>Start time of the event. (Format: hh:mm).</p>"
          },
          {
            "group": "200",
            "type": "Time",
            "optional": true,
            "field": "end_time",
            "description": "<p>End time of the event. (Format: hh:mm).</p>"
          },
          {
            "group": "200",
            "type": "String",
            "size": "0..100",
            "optional": true,
            "field": "type",
            "description": "<p>Event type.</p>"
          },
          {
            "group": "200",
            "type": "Object",
            "optional": false,
            "field": "location",
            "description": "<p>Event location.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "size": "3",
            "optional": false,
            "field": "privacy",
            "description": "<p>Event privacy.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "size": "3",
            "optional": false,
            "field": "category",
            "description": "<p>Event category.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "size": "3..120",
            "optional": false,
            "field": "location[street]",
            "description": "<p>Event street.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "size": "3..100",
            "optional": false,
            "field": "location[neighborhood]",
            "description": "<p>Event neighborhood.</p>"
          },
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "location[number]",
            "description": "<p>Event establishment number</p>"
          },
          {
            "group": "200",
            "type": "String",
            "size": "8",
            "optional": false,
            "field": "location[cep]",
            "description": "<p>Event zip code. (Only numbers).</p>"
          },
          {
            "group": "200",
            "type": "String",
            "size": "0..100",
            "optional": true,
            "field": "location[complement]",
            "description": "<p>Additional event location information.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "size": "3..100",
            "optional": false,
            "field": "location[city]",
            "description": "<p>Location Event city.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "size": "2",
            "optional": false,
            "field": "location[uf]",
            "description": "<p>Event federative unit. (uppercase).</p>"
          },
          {
            "group": "200",
            "type": "Object",
            "optional": false,
            "field": "location[geolocation]",
            "description": "<p>Event geolocation.</p>"
          },
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "geolocation[latitude]",
            "description": "<p>Event latitude.</p>"
          },
          {
            "group": "200",
            "type": "Object",
            "optional": false,
            "field": "geolocation[longitude]",
            "description": "<p>Event longitude.</p>"
          },
          {
            "group": "200",
            "type": "Object[user]",
            "optional": false,
            "field": "team",
            "description": "<p>Users responsible for organizing the event.</p>"
          },
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "team[id]",
            "description": "<p>User identification code.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "team[name]",
            "description": "<p>User name.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "team[surname]",
            "description": "<p>User surname.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "team[image]",
            "description": "<p>User image</p>"
          },
          {
            "group": "200",
            "type": "Object",
            "optional": false,
            "field": "team[role]",
            "description": "<p>User name.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "role[name]",
            "description": "<p>Role name.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "role[description]",
            "description": "<p>Role description.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success Response:",
          "content": "HTTPS/1.1 201 Created\n{\n     \"name\": \"Flores e frutas\",\n     \"start_date\": \"2020-10-22\",\n     \"end_date\": \"2020-10-25\",\n     \"description\": \"Venha participar do maior evento sobre flores e frutas da América Latina.\",\n     \"start_time\": \"15:00\",\n     \"end_time\": \"20:00\",\n     \"privacy\": \"PUB\",\n     \"category\": \"NAT\"\n     \"location\": {\n         \"street\": \"Rua rubi\",\n         \"neighborhood\": \"Cidade da criança\",\n         \"number\": 202,\n         \"cep\": \"11710210\",\n         \"complement\": \"Espaço B\",\n         \"geolocation\": {\n              \"latitude\": 1.534,\n              \"longitude\": 3.123,\n         },\n         \"city\": \"Praia Grande\",\n         \"uf\": \"SP\"\n     },\n     \"team\": [\n        {\n            \"id\": 1,\n            \"name\": \"João\",\n            \"surname\": \"Silva\",\n            \"image\": null,\n            \"role\": {\n                \"name\": \"Criador\",\n                \"description\": \"Responsável pela criação e toda organização do evento.\"\n         },\n         {\n            \"id\": 2,\n            \"name\": \"Marcos\",\n            \"surname\": \"Oliveira\",\n            \"image\": \"https://www.images.com/2\",\n            \"role\": {\n                \"name\": \"Coordenador\",\n                \"description\": \"Responsável por auxiliar o criador a organizar o evento.\"\n         },\n         {\n            \"id\": 3,\n            \"name\": \"Fernanda\",\n            \"surname\": \"Oliveira\",\n            \"image\": \"https://www.images.com/4\",\n            \"role\": {\n                \"name\": \"Membro da equipe\",\n                \"description\": \"Responsável por realizar as tarefas atribuídas a ele.\"\n         }\n      ]\n }",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/eventRoutes.ts",
    "groupTitle": "3._Events",
    "name": "PostEvents",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>Token for authentication.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "type": "Object",
            "optional": false,
            "field": "noneToken",
            "description": "<p>None token inserted in header x-access-token</p>"
          },
          {
            "group": "400",
            "type": "Object[]",
            "optional": false,
            "field": "incorrectFields",
            "description": "<p>The fields were not filled in according to our business rule</p>"
          }
        ],
        "403": [
          {
            "group": "403",
            "type": "Object",
            "optional": false,
            "field": "invalidToken",
            "description": "<p>The token inserted is invalid.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "No token error",
          "content": "HTTPS/1.1 403 Forbidden\n{\n    \"status\": 403,\n    \"message\": \"none token provided\"\n}",
          "type": "json"
        },
        {
          "title": "Invalid token error",
          "content": "HTTPS/1.1 403 Forbidden\n{\n    \"status\": 403,\n    \"message\": \"invalid token\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "events/:id",
    "title": "3.2. Get event by id",
    "version": "1.5.2",
    "group": "3._Events",
    "parameter": {
      "fields": {
        "Path Params": [
          {
            "group": "Path Params",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Event identification code.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Event identification code.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "size": "3..100",
            "optional": false,
            "field": "name",
            "description": "<p>Event name.</p>"
          },
          {
            "group": "200",
            "type": "Date",
            "optional": false,
            "field": "start_date",
            "description": "<p>Start date of the event. (Format: yyyy-mm-dd).</p>"
          },
          {
            "group": "200",
            "type": "Date",
            "optional": false,
            "field": "end_date",
            "description": "<p>End date of the event. (Format: yyyy-mm-dd).</p>"
          },
          {
            "group": "200",
            "type": "String",
            "size": "..255",
            "optional": true,
            "field": "description",
            "description": "<p>Event description.</p>"
          },
          {
            "group": "200",
            "type": "Time",
            "optional": true,
            "field": "start_time",
            "description": "<p>Start time of the event. (Format: hh:mm).</p>"
          },
          {
            "group": "200",
            "type": "Time",
            "optional": true,
            "field": "end_time",
            "description": "<p>End time of the event. (Format: hh:mm).</p>"
          },
          {
            "group": "200",
            "type": "String",
            "size": "0..100",
            "optional": true,
            "field": "type",
            "description": "<p>Event type.</p>"
          },
          {
            "group": "200",
            "type": "Object",
            "optional": false,
            "field": "location",
            "description": "<p>Event location.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "size": "3",
            "optional": false,
            "field": "privacy",
            "description": "<p>Event privacy.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "size": "3",
            "optional": false,
            "field": "category",
            "description": "<p>Event category.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "size": "3..120",
            "optional": false,
            "field": "location[street]",
            "description": "<p>Event street.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "size": "3..100",
            "optional": false,
            "field": "location[neighborhood]",
            "description": "<p>Event neighborhood.</p>"
          },
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "location[number]",
            "description": "<p>Event establishment number</p>"
          },
          {
            "group": "200",
            "type": "String",
            "size": "8",
            "optional": false,
            "field": "location[cep]",
            "description": "<p>Event zip code. (Only numbers).</p>"
          },
          {
            "group": "200",
            "type": "String",
            "size": "0..100",
            "optional": true,
            "field": "location[complement]",
            "description": "<p>Additional event location information.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "size": "3..100",
            "optional": false,
            "field": "location[city]",
            "description": "<p>Location Event city.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "size": "2",
            "optional": false,
            "field": "location[uf]",
            "description": "<p>Event federative unit. (uppercase).</p>"
          },
          {
            "group": "200",
            "type": "Object",
            "optional": false,
            "field": "location[geolocation]",
            "description": "<p>Event geolocation.</p>"
          },
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "geolocation[latitude]",
            "description": "<p>Event latitude.</p>"
          },
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "geolocation[longitude]",
            "description": "<p>Event longitude.</p>"
          },
          {
            "group": "200",
            "type": "Object[user]",
            "optional": false,
            "field": "team",
            "description": "<p>Users responsible for organizing the event.</p>"
          },
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "team[id]",
            "description": "<p>User identification code.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "team[name]",
            "description": "<p>User name.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "team[surname]",
            "description": "<p>User surname.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "team[image]",
            "description": "<p>User image</p>"
          },
          {
            "group": "200",
            "type": "Object",
            "optional": false,
            "field": "team[role]",
            "description": "<p>User name.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "role[name]",
            "description": "<p>Role name.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "role[description]",
            "description": "<p>Role description.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success Response:",
          "content": "HTTPS/1.1 201 Created\n{\n     \"name\": \"Flores e frutas\",\n     \"start_date\": \"2020-10-22\",\n     \"end_date\": \"2020-10-25\",\n     \"description\": \"Venha participar do maior evento sobre flores e frutas da América Latina.\",\n     \"start_time\": \"15:00\",\n     \"end_time\": \"20:00\",\n     \"privacy\": \"PUB\",\n     \"category\": \"NAT\"\n     \"location\": {\n         \"street\": \"Rua rubi\",\n         \"neighborhood\": \"Cidade da criança\",\n         \"number\": 202,\n         \"cep\": \"11710210\",\n         \"complement\": \"Espaço B\",\n         \"geolocation\": {\n              \"latitude\": 1.534,\n              \"longitude\": 3.123,\n         },\n         \"city\": \"Praia Grande\",\n         \"uf\": \"SP\"\n     },\n     \"team\": [\n        {\n            \"id\": 1,\n            \"name\": \"João\",\n            \"surname\": \"Silva\",\n            \"image\": null,\n            \"role\": {\n                \"name\": \"Criador\",\n                \"description\": \"Responsável pela criação e toda organização do evento.\"\n         },\n         {\n            \"id\": 2,\n            \"name\": \"Marcos\",\n            \"surname\": \"Oliveira\",\n            \"image\": \"https://www.images.com/2\",\n            \"role\": {\n                \"name\": \"Coordenador\",\n                \"description\": \"Responsável por auxiliar o criador a organizar o evento.\"\n         },\n         {\n            \"id\": 3,\n            \"name\": \"Fernanda\",\n            \"surname\": \"Oliveira\",\n            \"image\": \"https://www.images.com/4\",\n            \"role\": {\n                \"name\": \"Membro da equipe\",\n                \"description\": \"Responsável por realizar as tarefas atribuídas a ele.\"\n         }\n      ]\n }",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/eventRoutes.ts",
    "groupTitle": "3._Events",
    "name": "PostEventsId",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>Token for authentication.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Token header:",
        "content": "\"x-access-token\": \"Bearer <TOKEN>\"",
        "type": "header"
      }
    ],
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "type": "Object",
            "optional": false,
            "field": "noneToken",
            "description": "<p>None token inserted in header x-access-token</p>"
          },
          {
            "group": "400",
            "type": "Object[]",
            "optional": false,
            "field": "incorrectFields",
            "description": "<p>The fields were not filled in according to our business rule</p>"
          }
        ],
        "403": [
          {
            "group": "403",
            "type": "Object",
            "optional": false,
            "field": "invalidToken",
            "description": "<p>The token inserted is invalid.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "No token error",
          "content": "HTTPS/1.1 403 Forbidden\n{\n    \"status\": 403,\n    \"message\": \"none token provided\"\n}",
          "type": "json"
        },
        {
          "title": "Invalid token error",
          "content": "HTTPS/1.1 403 Forbidden\n{\n    \"status\": 403,\n    \"message\": \"invalid token\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "put",
    "url": "events/:id",
    "title": "3.3. Update event",
    "version": "1.7.0",
    "group": "3._Events",
    "parameter": {
      "fields": {
        "Request body params": [
          {
            "group": "Request body params",
            "type": "String",
            "size": "3..100",
            "optional": true,
            "field": "name_to",
            "description": "<p>New event name.</p>"
          },
          {
            "group": "Request body params",
            "type": "Date",
            "optional": true,
            "field": "start_date_to",
            "description": "<p>New start date of the event. (Format: yyyy-mm-dd).</p>"
          },
          {
            "group": "Request body params",
            "type": "Date",
            "optional": true,
            "field": "end_date_to",
            "description": "<p>New end date of the event. (Format: yyyy-mm-dd).</p>"
          },
          {
            "group": "Request body params",
            "type": "String",
            "size": "..255",
            "optional": true,
            "field": "description_to",
            "description": "<p>New event description.</p>"
          },
          {
            "group": "Request body params",
            "type": "Time",
            "optional": true,
            "field": "start_time_to",
            "description": "<p>New start time of the event. (Format: hh:mm).</p>"
          },
          {
            "group": "Request body params",
            "type": "Time",
            "optional": true,
            "field": "end_time_to",
            "description": "<p>New end time of the event. (Format: hh:mm).</p>"
          },
          {
            "group": "Request body params",
            "type": "String",
            "size": "0..100",
            "optional": true,
            "field": "type_to",
            "description": "<p>New event type.</p>"
          },
          {
            "group": "Request body params",
            "type": "Object",
            "optional": true,
            "field": "location_to",
            "description": "<p>New event location.</p>"
          },
          {
            "group": "Request body params",
            "type": "String",
            "size": "3..120",
            "optional": false,
            "field": "location[street_to]",
            "description": "<p>New event street.</p>"
          },
          {
            "group": "Request body params",
            "type": "String",
            "size": "3..100",
            "optional": false,
            "field": "location[neighborhood_to]",
            "description": "<p>New event neighborhood.</p>"
          },
          {
            "group": "Request body params",
            "type": "Number",
            "optional": false,
            "field": "location[number_to]",
            "description": "<p>New event establishment number</p>"
          },
          {
            "group": "Request body params",
            "type": "String",
            "size": "8",
            "optional": false,
            "field": "location[cep_to]",
            "description": "<p>New event zip code. (Only numbers).</p>"
          },
          {
            "group": "Request body params",
            "type": "String",
            "size": "0..100",
            "optional": true,
            "field": "location[complement_to]",
            "description": "<p>New additional event location information.</p>"
          },
          {
            "group": "Request body params",
            "type": "String",
            "size": "3..100",
            "optional": false,
            "field": "location[city]",
            "description": "<p>New location Event city.</p>"
          },
          {
            "group": "Request body params",
            "type": "String",
            "size": "2",
            "optional": false,
            "field": "location[uf]",
            "description": "<p>New event federative unit. (uppercase).</p>"
          },
          {
            "group": "Request body params",
            "type": "Object",
            "optional": false,
            "field": "location[geolocation]",
            "description": "<p>New event geolocation.</p>"
          },
          {
            "group": "Request body params",
            "type": "Number",
            "optional": false,
            "field": "geolocation[latitude]",
            "description": "<p>New event latitude.</p>"
          },
          {
            "group": "Request body params",
            "type": "Number",
            "optional": false,
            "field": "geolocation[longitude]",
            "description": "<p>New event longitude.</p>"
          },
          {
            "group": "Request body params",
            "type": "String",
            "size": "3",
            "optional": true,
            "field": "privacy_to",
            "description": "<p>New event privacy.</p>"
          },
          {
            "group": "Request body params",
            "type": "String",
            "size": "3",
            "optional": true,
            "field": "category_to",
            "description": "<p>New event category.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Request body:",
        "content": " \n{\n     \"name_to\": \"Árvores e Legumes\",\n     \"start_date_to\": \"2020-10-25\",\n     \"end_date_to\": \"2020-11-05\",\n     \"description_to\": \"Venha participar do maior evento sobre árvores e legumes da América Latina.\",\n     \"start_time_to\": \"16:00\",\n     \"end_time_to\": \"23:00\",\n     \"type_to\": \"\",\n     \"location_to\": {\n         \"street_to\": \"Avenida Kennedy\",\n         \"neighborhood_to\": \"Guilhermina\",\n         \"complement_to\": \"Apartamento 220\",\n         \"number_to\": 999,\n         \"cep_to\": 11111222,\n         \"uf\": \"SP\",\n         \"city\": \"Praia Grande\",\n         \"geolocation\": {\n             \"latitude\": -100.0111,\n             \"longitude\": 90.3245\n         },\n     \"privacy_to\": \"PRI\",\n     \"category_to\": \"REL\" \n}",
        "type": "json"
      },
      {
        "title": "Token header:",
        "content": "\"x-access-token\": \"Bearer <TOKEN>\"",
        "type": "header"
      }
    ],
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Event identification code.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "size": "3..100",
            "optional": false,
            "field": "name",
            "description": "<p>Event name.</p>"
          },
          {
            "group": "200",
            "type": "Date",
            "optional": false,
            "field": "start_date",
            "description": "<p>Start date of the event. (Format: yyyy-mm-dd).</p>"
          },
          {
            "group": "200",
            "type": "Date",
            "optional": false,
            "field": "end_date",
            "description": "<p>End date of the event. (Format: yyyy-mm-dd).</p>"
          },
          {
            "group": "200",
            "type": "String",
            "size": "..255",
            "optional": true,
            "field": "description",
            "description": "<p>Event description.</p>"
          },
          {
            "group": "200",
            "type": "Time",
            "optional": true,
            "field": "start_time",
            "description": "<p>Start time of the event. (Format: hh:mm).</p>"
          },
          {
            "group": "200",
            "type": "Time",
            "optional": true,
            "field": "end_time",
            "description": "<p>End time of the event. (Format: hh:mm).</p>"
          },
          {
            "group": "200",
            "type": "String",
            "size": "0..100",
            "optional": true,
            "field": "type",
            "description": "<p>Event type.</p>"
          },
          {
            "group": "200",
            "type": "Object",
            "optional": false,
            "field": "location",
            "description": "<p>Event location.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "size": "3..120",
            "optional": false,
            "field": "location[street]",
            "description": "<p>Event street.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "size": "3..100",
            "optional": false,
            "field": "location[neighborhood]",
            "description": "<p>Event neighborhood.</p>"
          },
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "location[number]",
            "description": "<p>Event establishment number</p>"
          },
          {
            "group": "200",
            "type": "String",
            "size": "8",
            "optional": false,
            "field": "location[cep]",
            "description": "<p>Event zip code. (Only numbers).</p>"
          },
          {
            "group": "200",
            "type": "String",
            "size": "0..100",
            "optional": true,
            "field": "location[complement]",
            "description": "<p>Additional event location information.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "size": "3..100",
            "optional": false,
            "field": "location[city]",
            "description": "<p>Location Event city.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "size": "2",
            "optional": false,
            "field": "location[uf]",
            "description": "<p>Event federative unit. (uppercase).</p>"
          },
          {
            "group": "200",
            "type": "Object",
            "optional": false,
            "field": "location[geolocation]",
            "description": "<p>Event geolocation.</p>"
          },
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "geolocation[latitude]",
            "description": "<p>Event latitude.</p>"
          },
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "geolocation[longitude]",
            "description": "<p>Event longitude.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "size": "3",
            "optional": false,
            "field": "privacy",
            "description": "<p>Event privacy. Possible values: &quot;PUB&quot; (public) and &quot;PRI&quot; (private).</p>"
          },
          {
            "group": "200",
            "type": "String",
            "size": "3",
            "optional": false,
            "field": "category",
            "description": "<p>Event category.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success response:",
          "content": "  HTTPS/1.1 200 OK\n  {\n      \"name\": \"Árvores e Legumes\",\n      \"start_date\": \"2020-10-25\",\n      \"end_date\": \"2020-11-05\",\n      \"description\": \"Venha participar do maior evento sobre árvores e vegumes da América Latina.\",\n      \"start_time\": \"16:00\",\n      \"end_time\": \"23:00\",\n      \"privacy\": \"PRI\",\n      \"category\": \"REL\",\n      \"location\": {\n          \"street\": \"Avenida Kennedy\",\n          \"neighborhood\": \"Guilhermina\",\n          \"number\": 999,\n          \"cep\": \"11111222\",\n          \"complement\": \"Apartamento 220\",\n          \"geolocation\": {\n               \"latitude\": -100.0111,\n               \"longitude\": 90.3245\n          },\n          \"city\": \"Praia Grande\",\n          \"uf\": \"SP\"\n      }\n}",
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
            "field": "noField",
            "description": "<p>No field need be updated.</p>"
          },
          {
            "group": "400",
            "type": "Object",
            "optional": false,
            "field": "noneToken",
            "description": "<p>None token inserted in header x-access-token</p>"
          },
          {
            "group": "400",
            "type": "Object[]",
            "optional": false,
            "field": "incorrectFields",
            "description": "<p>The fields were not filled in according to our business rule</p>"
          }
        ],
        "403": [
          {
            "group": "403",
            "type": "Object",
            "optional": false,
            "field": "invalidToken",
            "description": "<p>The token inserted is invalid.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "noField:",
          "content": "HTTPS/1.1 400 Bad Request\n    { \n        status: 400, \n        message: 'No field to update' \n    }",
          "type": "json"
        },
        {
          "title": "No token error",
          "content": "HTTPS/1.1 403 Forbidden\n{\n    \"status\": 403,\n    \"message\": \"none token provided\"\n}",
          "type": "json"
        },
        {
          "title": "Invalid token error",
          "content": "HTTPS/1.1 403 Forbidden\n{\n    \"status\": 403,\n    \"message\": \"invalid token\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/eventRoutes.ts",
    "groupTitle": "3._Events",
    "name": "PutEventsId",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>Token for authentication.</p>"
          }
        ]
      }
    }
  },
  {
    "type": "delete",
    "url": "invites/:idInvite",
    "title": "4.5. Delete a invite",
    "version": "1.9.4",
    "group": "4._Invites",
    "parameter": {
      "fields": {
        "Path Params": [
          {
            "group": "Path Params",
            "type": "Number",
            "optional": false,
            "field": "idInvite",
            "description": "<p>Invite identification code.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success Response:",
          "content": "HTTPS/1.1 200 OK",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "type": "Object",
            "optional": false,
            "field": "unanswered",
            "description": "<p>You can't delete a pending invitation</p>"
          },
          {
            "group": "400",
            "type": "Object",
            "optional": false,
            "field": "noneToken",
            "description": "<p>None token inserted in header x-access-token</p>"
          },
          {
            "group": "400",
            "type": "Object",
            "optional": false,
            "field": "invalidId",
            "description": "<p>the id provided this in an incorrect format.</p>"
          }
        ],
        "401": [
          {
            "group": "401",
            "type": "Object",
            "optional": false,
            "field": "noAllowed",
            "description": "<p>You don't have permission to do so.</p>"
          }
        ],
        "403": [
          {
            "group": "403",
            "type": "Object",
            "optional": false,
            "field": "invalidToken",
            "description": "<p>The token inserted is invalid.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "unanswered",
          "content": "HTTPS/1.1 400 Bad request\n    { \n        \"status\": 400, \n        \"message\": \"You can't delete a pending invitation\" \n    }",
          "type": "json"
        },
        {
          "title": "noAllowed",
          "content": "HTTPS/1.1 401 Unauthorized\n    {\n        \"status\": 401,\n        \"message\": \"You are not allowed do so\"\n    }",
          "type": "json"
        },
        {
          "title": "No token error",
          "content": "HTTPS/1.1 403 Forbidden\n{\n    \"status\": 403,\n    \"message\": \"none token provided\"\n}",
          "type": "json"
        },
        {
          "title": "invalidId ",
          "content": "HTTPS/1.1 400 Bad request\n    {\n        \"status\": 400,\n        \"message\": \"Invalid id\"\n    }",
          "type": "json"
        },
        {
          "title": "Invalid token error",
          "content": "HTTPS/1.1 403 Forbidden\n{\n    \"status\": 403,\n    \"message\": \"invalid token\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/inviteRoutes.ts",
    "groupTitle": "4._Invites",
    "name": "DeleteInvitesIdinvite",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>Token for authentication.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Token header:",
        "content": "\"x-access-token\": \"Bearer <TOKEN>\"",
        "type": "header"
      }
    ]
  },
  {
    "type": "get",
    "url": "invites",
    "title": "4.2. Get all your invites",
    "version": "1.9.4",
    "group": "4._Invites",
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Invite identification code.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "size": "..100",
            "optional": false,
            "field": "title",
            "description": "<p>Invite title.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "size": "..255",
            "optional": false,
            "field": "content",
            "description": "<p>Invite content.</p>"
          },
          {
            "group": "200",
            "type": "Object",
            "optional": false,
            "field": "role",
            "description": "<p>User role if you accept the invitation.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "size": "..100",
            "optional": false,
            "field": "role[name]",
            "description": "<p>Role name.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "size": "..255",
            "optional": false,
            "field": "role[description]",
            "description": "<p>Role description.</p>"
          },
          {
            "group": "200",
            "type": "Object",
            "optional": false,
            "field": "status",
            "description": "<p>Invite status.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "size": "..100",
            "optional": false,
            "field": "status[name]",
            "description": "<p>Status name.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "size": "..255",
            "optional": false,
            "field": "status[description]",
            "description": "<p>Status description.</p>"
          },
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "event_id",
            "description": "<p>Event Identification code of the event that the user is being invited to.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success Response:",
          "content": "HTTPS/1.1 201 OK\n    [\n        {\n            \"id\": 1,\n            \"title\": \"Você foi convidado para participar da equipe de organização de um evento\",    \n            \"content\": \"O evento Joao Evento está te convidado para você atuar como membro da equipe do evento.\",\n            \"role\": {\n                \"name\": \"Membro da equipe\",\n                \"description\": \"Responsável por realizar as tarefas atribuídas a ele.\"\n            },\n            \"status\": {\n                \"name\": \"Pendente\",\n                \"description\": \"Convite aguarda resposta.\"\n            },\n            \"event_id\": 1\n          }\n    ]",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/inviteRoutes.ts",
    "groupTitle": "4._Invites",
    "name": "GetInvites",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>Token for authentication.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Token header:",
        "content": "\"x-access-token\": \"Bearer <TOKEN>\"",
        "type": "header"
      }
    ],
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "type": "Object",
            "optional": false,
            "field": "noneToken",
            "description": "<p>None token inserted in header x-access-token</p>"
          },
          {
            "group": "400",
            "type": "Object[]",
            "optional": false,
            "field": "incorrectFields",
            "description": "<p>The fields were not filled in according to our business rule</p>"
          }
        ],
        "403": [
          {
            "group": "403",
            "type": "Object",
            "optional": false,
            "field": "invalidToken",
            "description": "<p>The token inserted is invalid.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "No token error",
          "content": "HTTPS/1.1 403 Forbidden\n{\n    \"status\": 403,\n    \"message\": \"none token provided\"\n}",
          "type": "json"
        },
        {
          "title": "Invalid token error",
          "content": "HTTPS/1.1 403 Forbidden\n{\n    \"status\": 403,\n    \"message\": \"invalid token\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "invites/:idInvite",
    "title": "4.3. Get a invite",
    "version": "1.9.4",
    "group": "4._Invites",
    "parameter": {
      "fields": {
        "Path Params": [
          {
            "group": "Path Params",
            "type": "Number",
            "optional": false,
            "field": "idInvite",
            "description": "<p>Invite identification code.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Invite identification code.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "size": "..100",
            "optional": false,
            "field": "title",
            "description": "<p>Invite title.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "size": "..255",
            "optional": false,
            "field": "content",
            "description": "<p>Invite content.</p>"
          },
          {
            "group": "200",
            "type": "Object",
            "optional": false,
            "field": "role",
            "description": "<p>User role if you accept the invitation.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "size": "..100",
            "optional": false,
            "field": "role[name]",
            "description": "<p>Role name.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "size": "..255",
            "optional": false,
            "field": "role[description]",
            "description": "<p>Role description.</p>"
          },
          {
            "group": "200",
            "type": "Object",
            "optional": false,
            "field": "status",
            "description": "<p>Invite status.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "size": "..100",
            "optional": false,
            "field": "status[name]",
            "description": "<p>Status name.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "size": "..255",
            "optional": false,
            "field": "status[description]",
            "description": "<p>Status description.</p>"
          },
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "event_id",
            "description": "<p>Event Identification code of the event that the user is being invited to.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success Response:",
          "content": "HTTPS/1.1 200 OK\n    {\n        \"id\": 1,\n        \"title\": \"Você foi convidado para participar da equipe de organização de um evento\",    \n        \"content\": \"O evento Joao Evento está te convidado para você atuar como membro da equipe do evento.\",\n        \"role\": {\n            \"name\": \"Membro da equipe\",\n            \"description\": \"Responsável por realizar as tarefas atribuídas a ele.\"\n        },\n        \"status\": {\n            \"name\": \"Pendente\",\n            \"description\": \"Convite aguarda resposta.\"\n        },\n        \"event_id\": 1\n    }",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "type": "Object",
            "optional": false,
            "field": "noneToken",
            "description": "<p>None token inserted in header x-access-token</p>"
          },
          {
            "group": "400",
            "type": "Object[]",
            "optional": false,
            "field": "incorrectFields",
            "description": "<p>The fields were not filled in according to our business rule</p>"
          }
        ],
        "401": [
          {
            "group": "401",
            "type": "Object",
            "optional": false,
            "field": "noAllowed",
            "description": "<p>You don't have permission to do so.</p>"
          }
        ],
        "403": [
          {
            "group": "403",
            "type": "Object",
            "optional": false,
            "field": "invalidToken",
            "description": "<p>The token inserted is invalid.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "noAllowed",
          "content": "HTTPS/1.1 401 Unauthorized\n    {\n        \"status\": 401,\n        \"message\": \"You are not allowed do so\"\n    }",
          "type": "json"
        },
        {
          "title": "No token error",
          "content": "HTTPS/1.1 403 Forbidden\n{\n    \"status\": 403,\n    \"message\": \"none token provided\"\n}",
          "type": "json"
        },
        {
          "title": "Invalid token error",
          "content": "HTTPS/1.1 403 Forbidden\n{\n    \"status\": 403,\n    \"message\": \"invalid token\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/inviteRoutes.ts",
    "groupTitle": "4._Invites",
    "name": "GetInvitesIdinvite",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>Token for authentication.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Token header:",
        "content": "\"x-access-token\": \"Bearer <TOKEN>\"",
        "type": "header"
      }
    ]
  },
  {
    "type": "patch",
    "url": "invites/:idInvite",
    "title": "4.4. Reply invitation",
    "version": "1.9.4",
    "group": "4._Invites",
    "parameter": {
      "fields": {
        "Path Params": [
          {
            "group": "Path Params",
            "type": "Number",
            "optional": false,
            "field": "idInvite",
            "description": "<p>Invite identification code.</p>"
          }
        ],
        "Request Body Params": [
          {
            "group": "Request Body Params",
            "type": "String",
            "optional": false,
            "field": "choice",
            "description": "<p>Invite Response. Possible values: ACE (accept) and REC (Reject).</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Request body",
        "content": "{\n    \"choice\": \"ACE\"\n}",
        "type": "json"
      },
      {
        "title": "Token header:",
        "content": "\"x-access-token\": \"Bearer <TOKEN>\"",
        "type": "header"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success Response:",
          "content": "HTTPS/1.1 200 OK",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "type": "Object",
            "optional": false,
            "field": "noneToken",
            "description": "<p>None token inserted in header x-access-token</p>"
          },
          {
            "group": "400",
            "type": "Object",
            "optional": false,
            "field": "invalidId",
            "description": "<p>the id provided this in an incorrect format.</p>"
          }
        ],
        "401": [
          {
            "group": "401",
            "type": "Object",
            "optional": false,
            "field": "noAllowed",
            "description": "<p>You don't have permission to do so.</p>"
          }
        ],
        "403": [
          {
            "group": "403",
            "type": "Object",
            "optional": false,
            "field": "invalidToken",
            "description": "<p>The token inserted is invalid.</p>"
          }
        ],
        "409": [
          {
            "group": "409",
            "type": "Object",
            "optional": false,
            "field": "alreadyAnswered",
            "description": "<p>This invite already answered</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "noAllowed",
          "content": "HTTPS/1.1 401 Unauthorized\n    {\n        \"status\": 401,\n        \"message\": \"You are not allowed do so\"\n    }",
          "type": "json"
        },
        {
          "title": "alreadyAnswered",
          "content": "HTTPS/1.1 409 alreadyAnswered\n    {\n        \"status\": 409,\n        \"message\": \"This invitation has already been answered\"\n    }",
          "type": "json"
        },
        {
          "title": "No token error",
          "content": "HTTPS/1.1 403 Forbidden\n{\n    \"status\": 403,\n    \"message\": \"none token provided\"\n}",
          "type": "json"
        },
        {
          "title": "invalidId ",
          "content": "HTTPS/1.1 400 Bad request\n    {\n        \"status\": 400,\n        \"message\": \"Invalid id\"\n    }",
          "type": "json"
        },
        {
          "title": "Invalid token error",
          "content": "HTTPS/1.1 403 Forbidden\n{\n    \"status\": 403,\n    \"message\": \"invalid token\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/inviteRoutes.ts",
    "groupTitle": "4._Invites",
    "name": "PatchInvitesIdinvite",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>Token for authentication.</p>"
          }
        ]
      }
    }
  },
  {
    "type": "post",
    "url": "events/:idEvent/invite",
    "title": "4.1. Invite a user to the event",
    "version": "1.9.4",
    "group": "4._Invites",
    "parameter": {
      "fields": {
        "Path Params": [
          {
            "group": "Path Params",
            "type": "Number",
            "optional": false,
            "field": "idEvent",
            "description": "<p>Event identification code.</p>"
          }
        ],
        "Request Body Params": [
          {
            "group": "Request Body Params",
            "type": "String",
            "optional": false,
            "field": "guest_email",
            "description": "<p>Guest email.</p>"
          },
          {
            "group": "Request Body Params",
            "type": "String",
            "size": "3",
            "optional": false,
            "field": "role",
            "description": "<p>User role in project. Possible values: COO (coordinator) and EQP (team member).</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "(Request body:)",
        "content": "{\n    \"guest_email\": \"joao1980@gmail.com\",\n    \"role\": \"COO\"\n}",
        "type": "json"
      },
      {
        "title": "Token header:",
        "content": "\"x-access-token\": \"Bearer <TOKEN>\"",
        "type": "header"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success Response:",
          "content": "HTTPS/1.1 201 Created",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "type": "Object",
            "optional": false,
            "field": "noneToken",
            "description": "<p>None token inserted in header x-access-token</p>"
          },
          {
            "group": "400",
            "type": "Object[]",
            "optional": false,
            "field": "incorrectFields",
            "description": "<p>The fields were not filled in according to our business rule</p>"
          }
        ],
        "401": [
          {
            "group": "401",
            "optional": false,
            "field": "noAllowed",
            "description": "<p>You don't have permission to do so.</p>"
          }
        ],
        "403": [
          {
            "group": "403",
            "type": "Object",
            "optional": false,
            "field": "invalidToken",
            "description": "<p>The token inserted is invalid.</p>"
          }
        ],
        "404": [
          {
            "group": "404",
            "optional": false,
            "field": "userNotFound",
            "description": "<p>This user does not exists.</p>"
          }
        ],
        "409": [
          {
            "group": "409",
            "optional": false,
            "field": "alreadyInvited",
            "description": "<p>This user has already been invited to this project.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "noAllowed",
          "content": "HTTPS/1.1 401 Unauthorized\n    {\n        \"status\": 401,\n        \"message\": \"You are not allowed do so\"\n    }",
          "type": "json"
        },
        {
          "title": "userNotFound",
          "content": "HTTPS/1.1 404 Not found\n    {\n        \"status\": 404,\n        \"message\": \"This user does not exist\"\n    }",
          "type": "json"
        },
        {
          "title": "alreadyInvited",
          "content": "HTTPS/1.1 409 Conflict\n    {\n        \"status\": 409,\n        \"message\": \"This user has already been invited to this project.\"\n    }",
          "type": "json"
        },
        {
          "title": "No token error",
          "content": "HTTPS/1.1 403 Forbidden\n{\n    \"status\": 403,\n    \"message\": \"none token provided\"\n}",
          "type": "json"
        },
        {
          "title": "Invalid token error",
          "content": "HTTPS/1.1 403 Forbidden\n{\n    \"status\": 403,\n    \"message\": \"invalid token\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/inviteRoutes.ts",
    "groupTitle": "4._Invites",
    "name": "PostEventsIdeventInvite",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>Token for authentication.</p>"
          }
        ]
      }
    }
  },
  {
    "type": "delete",
    "url": "notifications/:idNotification",
    "title": "5.4. Delete a notification",
    "version": "1.10.2",
    "group": "5._Notifications",
    "parameter": {
      "fields": {
        "Path Params": [
          {
            "group": "Path Params",
            "type": "Number",
            "optional": false,
            "field": "idNotification",
            "description": "<p>Notification identification code.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success Response:",
          "content": "HTTPS/1.1 200 OK",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "type": "Object",
            "optional": false,
            "field": "noneToken",
            "description": "<p>None token inserted in header x-access-token</p>"
          },
          {
            "group": "400",
            "type": "Object",
            "optional": false,
            "field": "invalidId",
            "description": "<p>the id provided this in an incorrect format.</p>"
          }
        ],
        "401": [
          {
            "group": "401",
            "type": "Object",
            "optional": false,
            "field": "noAllowed",
            "description": "<p>You don't have permission to do so.</p>"
          }
        ],
        "403": [
          {
            "group": "403",
            "type": "Object",
            "optional": false,
            "field": "invalidToken",
            "description": "<p>The token inserted is invalid.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "noAllowed",
          "content": "HTTPS/1.1 401 Unauthorized\n    {\n        \"status\": 401,\n        \"message\": \"You are not allowed do so\"\n    }",
          "type": "json"
        },
        {
          "title": "No token error",
          "content": "HTTPS/1.1 403 Forbidden\n{\n    \"status\": 403,\n    \"message\": \"none token provided\"\n}",
          "type": "json"
        },
        {
          "title": "invalidId ",
          "content": "HTTPS/1.1 400 Bad request\n    {\n        \"status\": 400,\n        \"message\": \"Invalid id\"\n    }",
          "type": "json"
        },
        {
          "title": "Invalid token error",
          "content": "HTTPS/1.1 403 Forbidden\n{\n    \"status\": 403,\n    \"message\": \"invalid token\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/notificationRoutes.ts",
    "groupTitle": "5._Notifications",
    "name": "DeleteNotificationsIdnotification",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>Token for authentication.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Token header:",
        "content": "\"x-access-token\": \"Bearer <TOKEN>\"",
        "type": "header"
      }
    ]
  },
  {
    "type": "get",
    "url": "notifications",
    "title": "5.1. Get all notifications from the user",
    "version": "1.9.0",
    "group": "5._Notifications",
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Notification identification code.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "size": "3..100",
            "optional": false,
            "field": "title",
            "description": "<p>Notification name.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "size": "..255",
            "optional": false,
            "field": "content",
            "description": "<p>Notification content.</p>"
          },
          {
            "group": "200",
            "type": "Boolean",
            "optional": false,
            "field": "isRead",
            "description": "<p>Is the notification read or unread.</p>"
          },
          {
            "group": "200",
            "type": "Object",
            "optional": false,
            "field": "link",
            "description": "<p>Notification link.</p>"
          },
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "link[idItem]",
            "description": "<p>Identification number of the item(cd_material, cd_invite, etc.).</p>"
          },
          {
            "group": "200",
            "type": "String",
            "size": "3",
            "optional": false,
            "field": "link[type]",
            "description": "<p>Type of the notification.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success Response:",
          "content": "HTTPS/1.1 200 OK\n{\n    id: 3,\n    title: \"Novo material!\",\n    content: \"Material: x10 Violetas, adicionado ao evento Flores e Frutas\",\n    isRead: \"false\",\n    link: {\n        idItem: 42,\n        type: \"MTA\"\n    }\n }\n {\n    id: 5,\n    title: \"Novo convite!\",\n    content: \"Você recebeu um novo convite para participar da organização de um evento.\",\n    isRead: \"true\",\n    link: {\n        idItem: 12,\n        type: \"CVC\"\n    }\n }",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "type": "Object",
            "optional": false,
            "field": "noneToken",
            "description": "<p>None token inserted in header x-access-token</p>"
          },
          {
            "group": "400",
            "type": "Object[]",
            "optional": false,
            "field": "incorrectFields",
            "description": "<p>The fields were not filled in according to our business rule</p>"
          }
        ],
        "401": [
          {
            "group": "401",
            "type": "Object",
            "optional": false,
            "field": "noAllowed",
            "description": "<p>You don't have permission to do so.</p>"
          }
        ],
        "403": [
          {
            "group": "403",
            "type": "Object",
            "optional": false,
            "field": "invalidToken",
            "description": "<p>The token inserted is invalid.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "noAllowed",
          "content": "HTTPS/1.1 401 Unauthorized\n   {\n       \"status\": 401,\n       \"message\": \"You are not allowed do so\"\n   }",
          "type": "json"
        },
        {
          "title": "No token error",
          "content": "HTTPS/1.1 403 Forbidden\n{\n    \"status\": 403,\n    \"message\": \"none token provided\"\n}",
          "type": "json"
        },
        {
          "title": "Invalid token error",
          "content": "HTTPS/1.1 403 Forbidden\n{\n    \"status\": 403,\n    \"message\": \"invalid token\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/notificationRoutes.ts",
    "groupTitle": "5._Notifications",
    "name": "GetNotifications",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>Token for authentication.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Token header:",
        "content": "\"x-access-token\": \"Bearer <TOKEN>\"",
        "type": "header"
      }
    ]
  },
  {
    "type": "get",
    "url": "notifications/:idNotification",
    "title": "5.2. Get notification by id",
    "version": "1.10.2",
    "group": "5._Notifications",
    "parameter": {
      "fields": {
        "Path Params": [
          {
            "group": "Path Params",
            "type": "Number",
            "optional": false,
            "field": "idNotification",
            "description": "<p>Notification identification code.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Notification identification code.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "size": "3..100",
            "optional": false,
            "field": "title",
            "description": "<p>Notification name.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "size": "..255",
            "optional": false,
            "field": "content",
            "description": "<p>Notification content.</p>"
          },
          {
            "group": "200",
            "type": "Boolean",
            "optional": false,
            "field": "isRead",
            "description": "<p>Is the notification read or unread.</p>"
          },
          {
            "group": "200",
            "type": "Object",
            "optional": false,
            "field": "link",
            "description": "<p>Notification link.</p>"
          },
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "link[idItem]",
            "description": "<p>Identification number of the item(cd_material, cd_invite, etc.).</p>"
          },
          {
            "group": "200",
            "type": "String",
            "size": "3",
            "optional": false,
            "field": "link[type]",
            "description": "<p>Type of the notification.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success Response:",
          "content": "HTTPS/1.1 200 OK\n {\n    id: 5,\n    title: \"Novo convite!\",\n    content: \"Você recebeu um novo convite para participar da organização de um evento.\",\n    isRead: \"true\",\n    link: {\n        idItem: 12,\n        type: \"CVC\"\n    }\n }",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "type": "Object",
            "optional": false,
            "field": "noneToken",
            "description": "<p>None token inserted in header x-access-token</p>"
          },
          {
            "group": "400",
            "type": "Object[]",
            "optional": false,
            "field": "incorrectFields",
            "description": "<p>The fields were not filled in according to our business rule</p>"
          }
        ],
        "401": [
          {
            "group": "401",
            "type": "Object",
            "optional": false,
            "field": "noAllowed",
            "description": "<p>You don't have permission to do so.</p>"
          }
        ],
        "403": [
          {
            "group": "403",
            "type": "Object",
            "optional": false,
            "field": "invalidToken",
            "description": "<p>The token inserted is invalid.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "noAllowed",
          "content": "HTTPS/1.1 401 Unauthorized\n   {\n       \"status\": 401,\n       \"message\": \"You are not allowed do so\"\n   }",
          "type": "json"
        },
        {
          "title": "No token error",
          "content": "HTTPS/1.1 403 Forbidden\n{\n    \"status\": 403,\n    \"message\": \"none token provided\"\n}",
          "type": "json"
        },
        {
          "title": "Invalid token error",
          "content": "HTTPS/1.1 403 Forbidden\n{\n    \"status\": 403,\n    \"message\": \"invalid token\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/notificationRoutes.ts",
    "groupTitle": "5._Notifications",
    "name": "GetNotificationsIdnotification",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>Token for authentication.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Token header:",
        "content": "\"x-access-token\": \"Bearer <TOKEN>\"",
        "type": "header"
      }
    ]
  },
  {
    "type": "patch",
    "url": "notifications/:idNotification",
    "title": "5.3. Change isRead.",
    "version": "1.10.2",
    "group": "5._Notifications",
    "parameter": {
      "fields": {
        "Path Params": [
          {
            "group": "Path Params",
            "type": "Number",
            "optional": false,
            "field": "idNotification",
            "description": "<p>Notification identification code.</p>"
          }
        ],
        "Request Body Params": [
          {
            "group": "Request Body Params",
            "type": "String",
            "optional": false,
            "field": "choice",
            "description": "<p>Notification Response. Possible values: &quot;unread&quot; and &quot;read&quot;.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Request body",
        "content": "{\n    \"choice\": \"unread\"\n}",
        "type": "json"
      },
      {
        "title": "Token header:",
        "content": "\"x-access-token\": \"Bearer <TOKEN>\"",
        "type": "header"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success Response:",
          "content": "HTTPS/1.1 200 OK",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "type": "Object",
            "optional": false,
            "field": "noneToken",
            "description": "<p>None token inserted in header x-access-token</p>"
          },
          {
            "group": "400",
            "type": "Object",
            "optional": false,
            "field": "invalidId",
            "description": "<p>the id provided this in an incorrect format.</p>"
          }
        ],
        "401": [
          {
            "group": "401",
            "type": "Object",
            "optional": false,
            "field": "noAllowed",
            "description": "<p>You don't have permission to do so.</p>"
          }
        ],
        "403": [
          {
            "group": "403",
            "type": "Object",
            "optional": false,
            "field": "invalidToken",
            "description": "<p>The token inserted is invalid.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "noAllowed",
          "content": "HTTPS/1.1 401 Unauthorized\n    {\n        \"status\": 401,\n        \"message\": \"You are not allowed do so\"\n    }",
          "type": "json"
        },
        {
          "title": "No token error",
          "content": "HTTPS/1.1 403 Forbidden\n{\n    \"status\": 403,\n    \"message\": \"none token provided\"\n}",
          "type": "json"
        },
        {
          "title": "invalidId ",
          "content": "HTTPS/1.1 400 Bad request\n    {\n        \"status\": 400,\n        \"message\": \"Invalid id\"\n    }",
          "type": "json"
        },
        {
          "title": "Invalid token error",
          "content": "HTTPS/1.1 403 Forbidden\n{\n    \"status\": 403,\n    \"message\": \"invalid token\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/notificationRoutes.ts",
    "groupTitle": "5._Notifications",
    "name": "PatchNotificationsIdnotification",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>Token for authentication.</p>"
          }
        ]
      }
    }
  },
  {
    "type": "delete",
    "url": "events/:idEvent/material/:idMaterial",
    "title": "6.5. Delete a Material",
    "version": "1.12.5",
    "group": "6._Materials",
    "parameter": {
      "fields": {
        "Path Params": [
          {
            "group": "Path Params",
            "type": "Number",
            "optional": false,
            "field": "idEvent",
            "description": "<p>Event identification code.</p>"
          },
          {
            "group": "Path Params",
            "type": "Number",
            "optional": false,
            "field": "idMaterial",
            "description": "<p>Material identification code.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success Response:",
          "content": "HTTPS/1.1 200 OK",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "type": "Object",
            "optional": false,
            "field": "noneToken",
            "description": "<p>None token inserted in header x-access-token</p>"
          },
          {
            "group": "400",
            "type": "Object",
            "optional": false,
            "field": "invalidId",
            "description": "<p>the id provided this in an incorrect format.</p>"
          }
        ],
        "401": [
          {
            "group": "401",
            "type": "Object",
            "optional": false,
            "field": "noAllowed",
            "description": "<p>You don't have permission to do so.</p>"
          }
        ],
        "403": [
          {
            "group": "403",
            "type": "Object",
            "optional": false,
            "field": "invalidToken",
            "description": "<p>The token inserted is invalid.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "noAllowed",
          "content": "HTTPS/1.1 401 Unauthorized\n    {\n        \"status\": 401,\n        \"message\": \"You are not allowed do so\"\n    }",
          "type": "json"
        },
        {
          "title": "No token error",
          "content": "HTTPS/1.1 403 Forbidden\n{\n    \"status\": 403,\n    \"message\": \"none token provided\"\n}",
          "type": "json"
        },
        {
          "title": "invalidId ",
          "content": "HTTPS/1.1 400 Bad request\n    {\n        \"status\": 400,\n        \"message\": \"Invalid id\"\n    }",
          "type": "json"
        },
        {
          "title": "Invalid token error",
          "content": "HTTPS/1.1 403 Forbidden\n{\n    \"status\": 403,\n    \"message\": \"invalid token\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/materialRoutes.ts",
    "groupTitle": "6._Materials",
    "name": "DeleteEventsIdeventMaterialIdmaterial",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>Token for authentication.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Token header:",
        "content": "\"x-access-token\": \"Bearer <TOKEN>\"",
        "type": "header"
      }
    ]
  },
  {
    "type": "get",
    "url": "events/:idEvent/material",
    "title": "6.3. Get all materials from event",
    "version": "1.12.5",
    "group": "6._Materials",
    "parameter": {
      "fields": {
        "Path Params": [
          {
            "group": "Path Params",
            "type": "Number",
            "optional": false,
            "field": "idEvent",
            "description": "<p>Event identification code.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Material identification code.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Material name.</p>"
          },
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "quantity",
            "description": "<p>Material quantity.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "observation",
            "description": "<p>Material observation name.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>Material status.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success Response:",
          "content": "HTTPS/1.1 200 OK\n{\n    \"id\": \"2\",\n    \"name\": \"Mesas de Bar\",\n    \"quantity\": \"5\",\n    \"observation\": \"Mesas de bar de plastico tamanho médio\",\n    \"status\": \"PEN\"\n }\n {\n    \"id\": \"4\",\n    \"name\": \"Cadeiras Amarelas\",\n    \"quantity\": \"6\",\n    \"observation\": \"Cadeiras de madeira com estofado, de cor amarela\",\n    \"status\": \"PEN\"\n }",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "type": "Object",
            "optional": false,
            "field": "noneToken",
            "description": "<p>None token inserted in header x-access-token</p>"
          },
          {
            "group": "400",
            "type": "Object[]",
            "optional": false,
            "field": "incorrectFields",
            "description": "<p>The fields were not filled in according to our business rule</p>"
          }
        ],
        "401": [
          {
            "group": "401",
            "type": "Object",
            "optional": false,
            "field": "noAllowed",
            "description": "<p>You don't have permission to do so.</p>"
          }
        ],
        "403": [
          {
            "group": "403",
            "type": "Object",
            "optional": false,
            "field": "invalidToken",
            "description": "<p>The token inserted is invalid.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "noAllowed",
          "content": "HTTPS/1.1 401 Unauthorized\n   {\n       \"status\": 401,\n       \"message\": \"You are not allowed do so\"\n   }",
          "type": "json"
        },
        {
          "title": "No token error",
          "content": "HTTPS/1.1 403 Forbidden\n{\n    \"status\": 403,\n    \"message\": \"none token provided\"\n}",
          "type": "json"
        },
        {
          "title": "Invalid token error",
          "content": "HTTPS/1.1 403 Forbidden\n{\n    \"status\": 403,\n    \"message\": \"invalid token\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/materialRoutes.ts",
    "groupTitle": "6._Materials",
    "name": "GetEventsIdeventMaterial",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>Token for authentication.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Token header:",
        "content": "\"x-access-token\": \"Bearer <TOKEN>\"",
        "type": "header"
      }
    ]
  },
  {
    "type": "post",
    "url": "events/:idEvent/material",
    "title": "6.1. Create material",
    "version": "1.12.5",
    "group": "6._Materials",
    "parameter": {
      "fields": {
        "Path Params": [
          {
            "group": "Path Params",
            "type": "Number",
            "optional": false,
            "field": "idEvent",
            "description": "<p>Event identification code.</p>"
          }
        ],
        "Request body params": [
          {
            "group": "Request body params",
            "type": "String",
            "size": "3..100",
            "optional": true,
            "field": "nm_material",
            "description": "<p>Material name.</p>"
          },
          {
            "group": "Request body params",
            "type": "Number",
            "optional": true,
            "field": "qt_material",
            "description": "<p>Material quantity.</p>"
          },
          {
            "group": "Request body params",
            "type": "String",
            "size": "..255",
            "optional": true,
            "field": "ds_observation",
            "description": "<p>Material observation.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Request body:",
        "content": "{\n    \"nm_material\": \"Cadeiras Amarelas\",\n    \"qt_material\": \"6\",\n    \"ds_observation\": \"Cadeiras de madeira com estofado, de cor amarela\"\n}",
        "type": "json"
      },
      {
        "title": "Token header:",
        "content": "\"x-access-token\": \"Bearer <TOKEN>\"",
        "type": "header"
      }
    ],
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Material identification code.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Material name.</p>"
          },
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "quantity",
            "description": "<p>Material quantity.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "observation",
            "description": "<p>Material observation name.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>Material status.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success response:",
          "content": "HTTPS/1.1 201 Created\n{\n   \"id\": \"4\",\n   \"name\": \"Cadeiras Amarelas\",\n   \"quantity\": \"6\",\n   \"observation\": \"Cadeiras de madeira com estofado, de cor amarela\",\n   \"status\": \"PEN\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/materialRoutes.ts",
    "groupTitle": "6._Materials",
    "name": "PostEventsIdeventMaterial",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>Token for authentication.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "type": "Object",
            "optional": false,
            "field": "noneToken",
            "description": "<p>None token inserted in header x-access-token</p>"
          },
          {
            "group": "400",
            "type": "Object[]",
            "optional": false,
            "field": "incorrectFields",
            "description": "<p>The fields were not filled in according to our business rule</p>"
          }
        ],
        "403": [
          {
            "group": "403",
            "type": "Object",
            "optional": false,
            "field": "invalidToken",
            "description": "<p>The token inserted is invalid.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "No token error",
          "content": "HTTPS/1.1 403 Forbidden\n{\n    \"status\": 403,\n    \"message\": \"none token provided\"\n}",
          "type": "json"
        },
        {
          "title": "Invalid token error",
          "content": "HTTPS/1.1 403 Forbidden\n{\n    \"status\": 403,\n    \"message\": \"invalid token\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "put",
    "url": "events/:idEvent/material/:idMaterial",
    "title": "6.4. Update material",
    "version": "1.12.5",
    "group": "6._Materials",
    "parameter": {
      "fields": {
        "Path Params": [
          {
            "group": "Path Params",
            "type": "Number",
            "optional": false,
            "field": "idEvent",
            "description": "<p>Event identification code.</p>"
          },
          {
            "group": "Path Params",
            "type": "Number",
            "optional": false,
            "field": "idMaterial",
            "description": "<p>Material identification code.</p>"
          }
        ],
        "Request body params": [
          {
            "group": "Request body params",
            "type": "String",
            "size": "3..100",
            "optional": true,
            "field": "name_to",
            "description": "<p>New material name.</p>"
          },
          {
            "group": "Request body params",
            "type": "Number",
            "optional": true,
            "field": "quantity_to",
            "description": "<p>New material quantity.</p>"
          },
          {
            "group": "Request body params",
            "type": "String",
            "size": "..255",
            "optional": true,
            "field": "description_to",
            "description": "<p>New material observation.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Request body:",
        "content": "{\n    \"name_to\": \"Cadeiras Verdes\",\n    \"quantity_to\": \"10\",\n    \"description_to\": \"Cadeiras de plastico sem estofado de cor verde\"\n}",
        "type": "json"
      },
      {
        "title": "Token header:",
        "content": "\"x-access-token\": \"Bearer <TOKEN>\"",
        "type": "header"
      }
    ],
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Material identification code.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Material name.</p>"
          },
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "quantity",
            "description": "<p>Material quantity.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "observation",
            "description": "<p>Material observation name.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>Material status.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success response:",
          "content": "HTTPS/1.1 200 OK\n{\n   \"id\": \"4\",\n   \"name\": \"Cadeiras Verdes\",\n   \"quantity\": \"10\",\n   \"observation\": \"Cadeiras de plastico sem estofado, de cor verde\",\n   \"status\": \"PEN\"\n}",
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
            "field": "noField",
            "description": "<p>No field need be updated.</p>"
          },
          {
            "group": "400",
            "type": "Object",
            "optional": false,
            "field": "noneToken",
            "description": "<p>None token inserted in header x-access-token</p>"
          },
          {
            "group": "400",
            "type": "Object[]",
            "optional": false,
            "field": "incorrectFields",
            "description": "<p>The fields were not filled in according to our business rule</p>"
          }
        ],
        "403": [
          {
            "group": "403",
            "type": "Object",
            "optional": false,
            "field": "invalidToken",
            "description": "<p>The token inserted is invalid.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "noField:",
          "content": "HTTPS/1.1 400 Bad Request\n    { \n        status: 400, \n        message: 'No field to update' \n    }",
          "type": "json"
        },
        {
          "title": "No token error",
          "content": "HTTPS/1.1 403 Forbidden\n{\n    \"status\": 403,\n    \"message\": \"none token provided\"\n}",
          "type": "json"
        },
        {
          "title": "Invalid token error",
          "content": "HTTPS/1.1 403 Forbidden\n{\n    \"status\": 403,\n    \"message\": \"invalid token\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/materialRoutes.ts",
    "groupTitle": "6._Materials",
    "name": "PutEventsIdeventMaterialIdmaterial",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>Token for authentication.</p>"
          }
        ]
      }
    }
  },
  {
    "type": "get",
    "url": "events/:idEvent/material/:idMaterial",
    "title": "6.2. Get material by id",
    "version": "1.12.5",
    "group": "6._Notifications",
    "parameter": {
      "fields": {
        "Path Params": [
          {
            "group": "Path Params",
            "type": "Number",
            "optional": false,
            "field": "idEvent",
            "description": "<p>Event identification code.</p>"
          },
          {
            "group": "Path Params",
            "type": "Number",
            "optional": false,
            "field": "idMaterial",
            "description": "<p>Material identification code.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Material identification code.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Material name.</p>"
          },
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "quantity",
            "description": "<p>Material quantity.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "observation",
            "description": "<p>Material observation name.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>Material status.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success Response:",
          "content": "HTTPS/1.1 200 OK\n {\n    \"id\": \"4\",\n    \"name\": \"Cadeiras Amarelas\",\n    \"quantity\": \"6\",\n    \"observation\": \"Cadeiras de madeira com estofado, de cor amarela\",\n    \"status\": \"PEN\"\n }",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "type": "Object",
            "optional": false,
            "field": "noneToken",
            "description": "<p>None token inserted in header x-access-token</p>"
          },
          {
            "group": "400",
            "type": "Object[]",
            "optional": false,
            "field": "incorrectFields",
            "description": "<p>The fields were not filled in according to our business rule</p>"
          }
        ],
        "401": [
          {
            "group": "401",
            "type": "Object",
            "optional": false,
            "field": "noAllowed",
            "description": "<p>You don't have permission to do so.</p>"
          }
        ],
        "403": [
          {
            "group": "403",
            "type": "Object",
            "optional": false,
            "field": "invalidToken",
            "description": "<p>The token inserted is invalid.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "noAllowed",
          "content": "HTTPS/1.1 401 Unauthorized\n   {\n       \"status\": 401,\n       \"message\": \"You are not allowed do so\"\n   }",
          "type": "json"
        },
        {
          "title": "No token error",
          "content": "HTTPS/1.1 403 Forbidden\n{\n    \"status\": 403,\n    \"message\": \"none token provided\"\n}",
          "type": "json"
        },
        {
          "title": "Invalid token error",
          "content": "HTTPS/1.1 403 Forbidden\n{\n    \"status\": 403,\n    \"message\": \"invalid token\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/materialRoutes.ts",
    "groupTitle": "6._Notifications",
    "name": "GetEventsIdeventMaterialIdmaterial",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>Token for authentication.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Token header:",
        "content": "\"x-access-token\": \"Bearer <TOKEN>\"",
        "type": "header"
      }
    ]
  },
  {
    "type": "delete",
    "url": "events/:idEvent/team/:idMember",
    "title": "7.4. Delete team member",
    "version": "1.10.0",
    "group": "7._Team",
    "parameter": {
      "fields": {
        "Path Params": [
          {
            "group": "Path Params",
            "type": "Number",
            "optional": false,
            "field": "idEvent",
            "description": "<p>Event identification code.</p>"
          },
          {
            "group": "Path Params",
            "type": "Number",
            "optional": false,
            "field": "idMember",
            "description": "<p>Team member identification code.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success Response:",
          "content": "HTTPS/1.1 200 Ok",
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
            "field": "selfDelete",
            "description": "<p>You cannot remove yourself from the team of an event. For this action use the endpoint /events/:idEvent/quit.</p>"
          },
          {
            "group": "400",
            "type": "Object",
            "optional": false,
            "field": "noneToken",
            "description": "<p>None token inserted in header x-access-token</p>"
          },
          {
            "group": "400",
            "type": "Object[]",
            "optional": false,
            "field": "incorrectFields",
            "description": "<p>The fields were not filled in according to our business rule</p>"
          }
        ],
        "401": [
          {
            "group": "401",
            "type": "Object",
            "optional": false,
            "field": "notAllowed",
            "description": "<p>You are not allowed to do so</p>"
          }
        ],
        "403": [
          {
            "group": "403",
            "type": "Object",
            "optional": false,
            "field": "invalidToken",
            "description": "<p>The token inserted is invalid.</p>"
          }
        ],
        "404": [
          {
            "group": "404",
            "optional": false,
            "field": "eventNotFound",
            "description": "<p>This event doesn't exists</p>"
          },
          {
            "group": "404",
            "optional": false,
            "field": "teamMemberNotFound",
            "description": "<p>This user is not on the organization team for this event.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "selfDelete",
          "content": "HTTPS/1.1 400 Bad request\n{ \n    \"status\": 400, \n    \"message\": \"You cannot remove yourself from the team of an event. For this action use the endpoint /events/:idEvent/quit\" \n}",
          "type": "json"
        },
        {
          "title": "eventNotFound",
          "content": "HTTPS/1.1 404 Not found\n{ \n    \"status\": 404, \n    \"message\": \"This event doesn't exists\" \n}",
          "type": "json"
        },
        {
          "title": "teamMemberNotFound",
          "content": "HTTPS/1.1 404 Not found\n{ \n    \"status\": 404, \n    \"message\": 'This user is not on the organization team for this event' \n}",
          "type": "json"
        },
        {
          "title": "No token error",
          "content": "HTTPS/1.1 403 Forbidden\n{\n    \"status\": 403,\n    \"message\": \"none token provided\"\n}",
          "type": "json"
        },
        {
          "title": "Invalid token error",
          "content": "HTTPS/1.1 403 Forbidden\n{\n    \"status\": 403,\n    \"message\": \"invalid token\"\n}",
          "type": "json"
        },
        {
          "title": "notAllowed",
          "content": "HTTPS/1.1 401 Unauthorized\n{ \n    \"status\": 401, \n    \"message\": \"You are not allowed to do so\" \n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/teamRoutes.ts",
    "groupTitle": "7._Team",
    "name": "DeleteEventsIdeventTeamIdmember",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>Token for authentication.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Token header:",
        "content": "\"x-access-token\": \"Bearer <TOKEN>\"",
        "type": "header"
      }
    ]
  },
  {
    "type": "get",
    "url": "events/:idEvent/team",
    "title": "7.1. Get team",
    "version": "1.10.0",
    "group": "7._Team",
    "parameter": {
      "fields": {
        "Path Params": [
          {
            "group": "Path Params",
            "type": "Number",
            "optional": false,
            "field": "idEvent",
            "description": "<p>Event idetification code.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "team[id]",
            "description": "<p>User identification code.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "team[name]",
            "description": "<p>User name.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "team[surname]",
            "description": "<p>User surname.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "team[image]",
            "description": "<p>User image</p>"
          },
          {
            "group": "200",
            "type": "Object",
            "optional": false,
            "field": "team[role]",
            "description": "<p>User name.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "role[name]",
            "description": "<p>Role name.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "role[description]",
            "description": "<p>Role description.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success Response:",
          "content": "HTTPS/1.1 200 Ok\n[\n    {\n        \"id\": 1,\n        \"name\": \"João\",\n        \"surname\": \"Silva\",\n        \"image\": null,\n        \"role\": {\n            \"name\": \"Criador\",\n            \"description\": \"Responsável pela criação e toda organização do evento.\"\n     },\n     {\n        \"id\": 2,\n        \"name\": \"Marcos\",\n        \"surname\": \"Oliveira\",\n        \"image\": \"https://www.images.com/2\",\n        \"role\": {\n            \"name\": \"Coordenador\",\n            \"description\": \"Responsável por auxiliar o criador a organizar o evento.\"\n     },\n     {\n        \"id\": 3,\n        \"name\": \"Fernanda\",\n        \"surname\": \"Oliveira\",\n        \"image\": \"https://www.images.com/4\",\n        \"role\": {\n            \"name\": \"Membro da equipe\",\n            \"description\": \"Responsável por realizar as tarefas atribuídas a ele.\"\n     }\n]",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "type": "Object",
            "optional": false,
            "field": "noneToken",
            "description": "<p>None token inserted in header x-access-token</p>"
          },
          {
            "group": "400",
            "type": "Object[]",
            "optional": false,
            "field": "incorrectFields",
            "description": "<p>The fields were not filled in according to our business rule</p>"
          }
        ],
        "401": [
          {
            "group": "401",
            "type": "Object",
            "optional": false,
            "field": "notAllowed",
            "description": "<p>You are not allowed to do so</p>"
          }
        ],
        "403": [
          {
            "group": "403",
            "type": "Object",
            "optional": false,
            "field": "invalidToken",
            "description": "<p>The token inserted is invalid.</p>"
          }
        ],
        "404": [
          {
            "group": "404",
            "optional": false,
            "field": "eventNotFound",
            "description": "<p>This event doesn't exists.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "eventNotFound",
          "content": "HTTPS/1.1 404 Not found\n{ \n    \"status\": 404, \n    \"message\": \"This event doesn't exists\" \n}",
          "type": "json"
        },
        {
          "title": "No token error",
          "content": "HTTPS/1.1 403 Forbidden\n{\n    \"status\": 403,\n    \"message\": \"none token provided\"\n}",
          "type": "json"
        },
        {
          "title": "Invalid token error",
          "content": "HTTPS/1.1 403 Forbidden\n{\n    \"status\": 403,\n    \"message\": \"invalid token\"\n}",
          "type": "json"
        },
        {
          "title": "notAllowed",
          "content": "HTTPS/1.1 401 Unauthorized\n{ \n    \"status\": 401, \n    \"message\": \"You are not allowed to do so\" \n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/teamRoutes.ts",
    "groupTitle": "7._Team",
    "name": "GetEventsIdeventTeam",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>Token for authentication.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Token header:",
        "content": "\"x-access-token\": \"Bearer <TOKEN>\"",
        "type": "header"
      }
    ]
  },
  {
    "type": "get",
    "url": "events/:idEvent/team/:idMember",
    "title": "7.2. Get team member",
    "version": "1.10.0",
    "group": "7._Team",
    "parameter": {
      "fields": {
        "Path Params": [
          {
            "group": "Path Params",
            "type": "Number",
            "optional": false,
            "field": "idEvent",
            "description": "<p>Event identification code.</p>"
          },
          {
            "group": "Path Params",
            "type": "Number",
            "optional": false,
            "field": "idMember",
            "description": "<p>Team member identification code.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "team[id]",
            "description": "<p>User identification code.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "team[name]",
            "description": "<p>User name.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "team[surname]",
            "description": "<p>User surname.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "team[image]",
            "description": "<p>User image</p>"
          },
          {
            "group": "200",
            "type": "Object",
            "optional": false,
            "field": "team[role]",
            "description": "<p>User name.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "role[name]",
            "description": "<p>Role name.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "role[description]",
            "description": "<p>Role description.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success Response",
          "content": "HTTPS/1.1 200 Ok\n{\n    \"id\": 1,\n    \"name\": \"João\",\n    \"surname\": \"Silva\",\n    \"image\": null,\n    \"role\": {\n        \"name\": \"Criador\",\n        \"description\": \"Responsável pela criação e toda organização do evento.\"\n    }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "type": "Object",
            "optional": false,
            "field": "noneToken",
            "description": "<p>None token inserted in header x-access-token</p>"
          },
          {
            "group": "400",
            "type": "Object[]",
            "optional": false,
            "field": "incorrectFields",
            "description": "<p>The fields were not filled in according to our business rule</p>"
          }
        ],
        "401": [
          {
            "group": "401",
            "type": "Object",
            "optional": false,
            "field": "notAllowed",
            "description": "<p>You are not allowed to do so</p>"
          }
        ],
        "403": [
          {
            "group": "403",
            "type": "Object",
            "optional": false,
            "field": "invalidToken",
            "description": "<p>The token inserted is invalid.</p>"
          }
        ],
        "404": [
          {
            "group": "404",
            "optional": false,
            "field": "eventNotFound",
            "description": "<p>This event doesn't exists</p>"
          },
          {
            "group": "404",
            "optional": false,
            "field": "teamMemberNotFound",
            "description": "<p>This user is not on the organization team for this event.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "eventNotFound",
          "content": "HTTPS/1.1 404 Not found\n{ \n    \"status\": 404, \n    \"message\": \"This event doesn't exists\" \n}",
          "type": "json"
        },
        {
          "title": "teamMemberNotFound",
          "content": "HTTPS/1.1 404 Not found\n{ \n    \"status\": 404, \n    \"message\": 'This user is not on the organization team for this event' \n}",
          "type": "json"
        },
        {
          "title": "No token error",
          "content": "HTTPS/1.1 403 Forbidden\n{\n    \"status\": 403,\n    \"message\": \"none token provided\"\n}",
          "type": "json"
        },
        {
          "title": "Invalid token error",
          "content": "HTTPS/1.1 403 Forbidden\n{\n    \"status\": 403,\n    \"message\": \"invalid token\"\n}",
          "type": "json"
        },
        {
          "title": "notAllowed",
          "content": "HTTPS/1.1 401 Unauthorized\n{ \n    \"status\": 401, \n    \"message\": \"You are not allowed to do so\" \n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/teamRoutes.ts",
    "groupTitle": "7._Team",
    "name": "GetEventsIdeventTeamIdmember",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>Token for authentication.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Token header:",
        "content": "\"x-access-token\": \"Bearer <TOKEN>\"",
        "type": "header"
      }
    ]
  },
  {
    "type": "patch",
    "url": "events/:idEvent/team/:idMember",
    "title": "7.3. Update team member role",
    "version": "1.10.0",
    "group": "7._Team",
    "parameter": {
      "fields": {
        "Path Params": [
          {
            "group": "Path Params",
            "type": "Number",
            "optional": false,
            "field": "idEvent",
            "description": "<p>Event identification code.</p>"
          },
          {
            "group": "Path Params",
            "type": "Number",
            "optional": false,
            "field": "idMember",
            "description": "<p>Team member identification code.</p>"
          }
        ],
        "Request Body Params": [
          {
            "group": "Request Body Params",
            "type": "String",
            "optional": false,
            "field": "role_to",
            "description": "<p>New user role in event. Possible values: &quot;COO&quot;(coordinator) and &quot;EQP&quot;(&quot;Team member&quot;).</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Request Body",
        "content": "{\n    \"role_to\": \"EQP\"\n}",
        "type": "json"
      },
      {
        "title": "Token header:",
        "content": "\"x-access-token\": \"Bearer <TOKEN>\"",
        "type": "header"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success Response:",
          "content": "HTTPS/1.1 200 Ok\n{\n    \"id\": 3,\n    \"name\": \"Fernanda\",\n    \"surname\": \"Oliveira\",\n    \"image\": \"https://www.images.com/4\",\n    \"role\": {\n        \"name\": \"Membro da equipe\",\n        \"description\": \"Responsável por realizar as tarefas atribuídas a ele.\"\n}",
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
            "field": "selfDelete",
            "description": "<p>You cannot remove yourself from the team of an event. For this action use the endpoint /events/:idEvent/quit.</p>"
          },
          {
            "group": "400",
            "type": "Object",
            "optional": false,
            "field": "noneToken",
            "description": "<p>None token inserted in header x-access-token</p>"
          },
          {
            "group": "400",
            "type": "Object[]",
            "optional": false,
            "field": "incorrectFields",
            "description": "<p>The fields were not filled in according to our business rule</p>"
          }
        ],
        "401": [
          {
            "group": "401",
            "type": "Object",
            "optional": false,
            "field": "notAllowed",
            "description": "<p>You are not allowed to do so</p>"
          }
        ],
        "403": [
          {
            "group": "403",
            "type": "Object",
            "optional": false,
            "field": "invalidToken",
            "description": "<p>The token inserted is invalid.</p>"
          }
        ],
        "404": [
          {
            "group": "404",
            "optional": false,
            "field": "eventNotFound",
            "description": "<p>This event doesn't exists</p>"
          },
          {
            "group": "404",
            "optional": false,
            "field": "teamMemberNotFound",
            "description": "<p>This user is not on the organization team for this event.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "selfDelete",
          "content": "HTTPS/1.1 400 Bad request\n{ \n    \"status\": 400, \n    \"message\": \"You cannot remove yourself from the team of an event. For this action use the endpoint /events/:idEvent/quit\" \n}",
          "type": "json"
        },
        {
          "title": "eventNotFound",
          "content": "HTTPS/1.1 404 Not found\n{ \n    \"status\": 404, \n    \"message\": \"This event doesn't exists\" \n}",
          "type": "json"
        },
        {
          "title": "teamMemberNotFound",
          "content": "HTTPS/1.1 404 Not found\n{ \n    \"status\": 404, \n    \"message\": 'This user is not on the organization team for this event' \n}",
          "type": "json"
        },
        {
          "title": "No token error",
          "content": "HTTPS/1.1 403 Forbidden\n{\n    \"status\": 403,\n    \"message\": \"none token provided\"\n}",
          "type": "json"
        },
        {
          "title": "Invalid token error",
          "content": "HTTPS/1.1 403 Forbidden\n{\n    \"status\": 403,\n    \"message\": \"invalid token\"\n}",
          "type": "json"
        },
        {
          "title": "notAllowed",
          "content": "HTTPS/1.1 401 Unauthorized\n{ \n    \"status\": 401, \n    \"message\": \"You are not allowed to do so\" \n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/teamRoutes.ts",
    "groupTitle": "7._Team",
    "name": "PatchEventsIdeventTeamIdmember",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>Token for authentication.</p>"
          }
        ]
      }
    }
  }
] });
