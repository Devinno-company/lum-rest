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
          "title": "No token error:",
          "content": "HTTPS/1.1 403 Forbidden\n{\n    \"message\": \"none token provided\"\n}",
          "type": "json"
        },
        {
          "title": "Invalid token error:",
          "content": "HTTPS/1.1 403 Forbidden\n{\n    \"message\": \"invalid token\"\n}",
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
          "title": "No token error:",
          "content": "HTTPS/1.1 403 Forbidden\n{\n    \"message\": \"none token provided\"\n}",
          "type": "json"
        },
        {
          "title": "Invalid token error:",
          "content": "HTTPS/1.1 403 Forbidden\n{\n    \"message\": \"invalid token\"\n}",
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
          "title": "No token error:",
          "content": "HTTPS/1.1 403 Forbidden\n{\n    \"message\": \"none token provided\"\n}",
          "type": "json"
        },
        {
          "title": "Invalid token error:",
          "content": "HTTPS/1.1 403 Forbidden\n{\n    \"message\": \"invalid token\"\n}",
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
          "title": "No token error:",
          "content": "HTTPS/1.1 403 Forbidden\n{\n    \"message\": \"none token provided\"\n}",
          "type": "json"
        },
        {
          "title": "Invalid token error:",
          "content": "HTTPS/1.1 403 Forbidden\n{\n    \"message\": \"invalid token\"\n}",
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
          "title": "No token error:",
          "content": "HTTPS/1.1 403 Forbidden\n{\n    \"message\": \"none token provided\"\n}",
          "type": "json"
        },
        {
          "title": "Invalid token error:",
          "content": "HTTPS/1.1 403 Forbidden\n{\n    \"message\": \"invalid token\"\n}",
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
          "title": "No token error:",
          "content": "HTTPS/1.1 403 Forbidden\n{\n    \"message\": \"none token provided\"\n}",
          "type": "json"
        },
        {
          "title": "Invalid token error:",
          "content": "HTTPS/1.1 403 Forbidden\n{\n    \"message\": \"invalid token\"\n}",
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
          "title": "No token error:",
          "content": "HTTPS/1.1 403 Forbidden\n{\n    \"message\": \"none token provided\"\n}",
          "type": "json"
        },
        {
          "title": "Invalid token error:",
          "content": "HTTPS/1.1 403 Forbidden\n{\n    \"message\": \"invalid token\"\n}",
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
          "title": "No token error:",
          "content": "HTTPS/1.1 403 Forbidden\n{\n    \"message\": \"none token provided\"\n}",
          "type": "json"
        },
        {
          "title": "Invalid token error:",
          "content": "HTTPS/1.1 403 Forbidden\n{\n    \"message\": \"invalid token\"\n}",
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
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Event identification code.</p>"
          },
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
            "type": "Number",
            "optional": false,
            "field": "geolocation[longitude]",
            "description": "<p>Event longitude.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Request body:",
        "content": " \n{\n     \"name_to\": \"Árvores e Legumes\",\n     \"date_start_to\": \"2020-10-25\",\n     \"date_end_to\": \"2020-11-05\",\n     \"description_to\": \"Venha participar do maior evento sobre árvores e legumes da América Latina.\",\n     \"hour_start_to\": \"16:00\",\n     \"hour_end_to\": \"23:00\",\n     \"type_to\": \"\",\n     \"location_to\": {\n         \"street_to\": \"Avenida Kennedy\",\n         \"neighborhood_to\": \"Guilhermina\",\n         \"complement_to\": \"Apartamento 220\",\n         \"number_to\": 999,\n         \"cep_to\": 11111222,\n         \"uf\": \"SP\",\n         \"city\": \"Praia Grande\",\n         \"geolocation\": {\n             \"latitude\": -100.0111,\n             \"longitude\": 90.3245\n         },\n     \"privacy_to\": PRI,\n     \"category_to\": REL \n}",
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
            "type": "Number",
            "optional": false,
            "field": "geolocation[longitude]",
            "description": "<p>Event longitude.</p>"
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
          "title": "No token error:",
          "content": "HTTPS/1.1 403 Forbidden\n{\n    \"message\": \"none token provided\"\n}",
          "type": "json"
        },
        {
          "title": "Invalid token error:",
          "content": "HTTPS/1.1 403 Forbidden\n{\n    \"message\": \"invalid token\"\n}",
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
  }
] });
