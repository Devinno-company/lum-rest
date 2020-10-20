define({ "api": [
  {
    "type": "post",
    "url": "login",
    "title": "Log in",
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
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>User email.</p>"
          },
          {
            "group": "Parameter",
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
      "examples": [
        {
          "title": "Incorrect fields:",
          "content": "HTTPS/1.1 400 Bad Request\n[\n    {\n        \"label\": \"email\",\n        \"message\": \"This string is invalid for email type\"\n    },\n    {\n        \"label\": \"password\",\n        \"message\": \"The name must have on minimum 8 characters\"\n    }\n]",
          "type": "json"
        },
        {
          "title": "Incorrect credentials: ",
          "content": "HTTPS/1.1 403 Unauthorized\n{\n    \"message\": \"Incorrect credentials\",\n    \"status\": 409\n}",
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
    "title": "Register",
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
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "size": "3..100",
            "optional": false,
            "field": "name",
            "description": "<p>User name.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "3..100",
            "optional": false,
            "field": "surname",
            "description": "<p>User last name.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>User email.</p>"
          },
          {
            "group": "Parameter",
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
          "title": "Fields incorrects:",
          "content": "HTTPS/1.1 400 Bad Request\n[\n    {\n        \"label\": \"name\",\n        \"message\": \"This field is required\"\n    },\n    {\n        \"label\": \"surname\",\n        \"message\": \"This field is string type\"\n    },\n    {\n        \"label\": \"email\",\n        \"message\": \"This string is invalid for email type\"\n    },\n    {\n        \"label\": \"password\",\n        \"message\": \"The name must have on minimum 8 characters\"\n    }\n ]",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/userRoutes.ts",
    "groupTitle": "1._System",
    "name": "PostUsers"
  },
  {
    "type": "delete",
    "url": "profile",
    "title": "Delete user",
    "version": "1.4.11",
    "group": "2._Profile",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>User email</p>"
          },
          {
            "group": "Parameter",
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
    },
    "error": {
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
          "content": "HTTPS/1.1 403 Unauthorized\n{\n    \"message\": \"Incorrect credentials\",\n    \"status\": 409\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "profile",
    "title": "Get profile",
    "version": "1.4.11",
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
            "field": "biography",
            "description": "<p>User biography.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "label",
            "description": "<p>User characteristic.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "website",
            "description": "<p>User website.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "image",
            "description": "<p>Profile picture link.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "profission",
            "description": "<p>User profission.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "company",
            "description": "<p>User company name.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success Response:",
          "content": "HTTPS/1.1 200 OK\n{\n    \"id\": 5,\n    \"name\": \"Joao\",\n    \"surname\": \"Silva\",\n    \"biography\": null,\n    \"label\": null,\n    \"website\": null,\n    \"image\": null,\n    \"profission\": null,rnote\n    \"company\": null\n}",
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
    "title": "Update password",
    "version": "1.4.11",
    "name": "PATCH_profile",
    "group": "2._Profile",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>User password</p>"
          },
          {
            "group": "Parameter",
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
    "title": "Upload profile picture",
    "version": "1.4.11",
    "group": "2._Profile",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
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
          "content": "HTTPS/1.1 200 OK",
          "type": "json"
        }
      ]
    },
    "error": {
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
    "title": "Update profile",
    "version": "1.4.11",
    "group": "2._Profile",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "size": "3..100",
            "optional": true,
            "field": "name_to",
            "description": "<p>New user name.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "3..100",
            "optional": true,
            "field": "surname_to",
            "description": "<p>New user last name.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "..255",
            "optional": true,
            "field": "biography_to",
            "description": "<p>New user biography.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "..30",
            "optional": true,
            "field": "label_to",
            "description": "<p>New user label.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "..100",
            "optional": true,
            "field": "profission_to",
            "description": "<p>New user profission.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "..100",
            "optional": true,
            "field": "company_to",
            "description": "<p>New user company.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "..255",
            "optional": true,
            "field": "website_to",
            "description": "<p>New user website.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": true,
            "field": "location_to",
            "description": "<p>New user location.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "..100",
            "optional": false,
            "field": "location_to[city]",
            "description": "<p>New user city.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "location_to[geolocation]",
            "description": "<p>New user geolocation.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "geolocation[latitude]",
            "description": "<p>New latitude.</p>"
          },
          {
            "group": "Parameter",
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
        "content": "{\n    \"name_to\": \"Pedro\",\n    \"surname_to\": \"Santiago\",\n    \"biography_to\": \"Um jovem que gosta de eventos de jogos.\",\n    \"label_to\": \"gamer\",\n    \"profission_to\": \"Estudante\",\n    \"website_to\": \"https://www.pedrogames.com\",\n    \"location_to\": {\n        \"city\": \"Praia Grande\",\n        \"geolocation\": {\n            \"latitude\": -24.0089,\n            \"longitude\": -46.4125\n        }\n    }\n}",
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
            "field": "biography",
            "description": "<p>User biography.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "label",
            "description": "<p>User characteristic.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "website",
            "description": "<p>User website.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "image",
            "description": "<p>Profile picture link.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "company",
            "description": "<p>User company name.</p>"
          },
          {
            "group": "200",
            "type": "Object",
            "optional": false,
            "field": "location",
            "description": "<p>User location.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "location_to[city]",
            "description": "<p>User city.</p>"
          },
          {
            "group": "200",
            "type": "Object",
            "optional": false,
            "field": "location_to[geolocation]",
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
          "content": "HTTPS/1.1 200 OK\n{\n   \"id\": 5,\n   \"name\": \"Pedro\",\n   \"surname\": \"Santiago\",\n   \"biography\": \"Um jovem que gosta de eventos de jogos.\",\n   \"label\": \"gamer\",\n   \"website\": \"https://www.pedrogames.com\",\n   \"image\": null,\n   \"company\": null,\n   \"location\": {\n       \"city\": \"Praia Grande\",\n       \"uf\": \"SP\",\n       \"geolocation\": {\n           \"latitude\": \"-24.00890\",\n           \"longitude\": \"-46.41250\"\n       }\n   }\n}",
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
    },
    "error": {
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
  }
] });
