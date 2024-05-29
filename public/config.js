{
  "workflowApiVersion": "1.1",
  "metaData": {
    "icon": "icon.png",
    "category": "message"
  },
  "type": "REST",
  "lang": {
    "en-US": {
      "name": "sendmoConvertUTC",
      "description": "Calculates time difference between current and future time in user's timezone"
    }
  },
  "arguments": {
    "execute": {
      "inArguments": [
        {
          "timezoneOffset": "{{Event.DE.timezoneOffset}}"
        },
        {
          "triggerTime": "08:00"
        },
        {
          "daytype": "weekday"
        }
      ],
      "outArguments": [
        {
          "result": "2090"
        }
      ],
      "url": "https://email-optimization-1.onrender.com/execute",
      "verb": "POST",
      "body": "",
      "header": "",
      "format": "json",
      "useJwt": false,
      "timeout": 10000
    }
  },
  "schema": {
    "arguments": {
      "execute": {
        "inArguments": [
          {
            "futureUtcTime": {
              "dataType": "Text",
              "isNullable": false,
              "direction": "in",
              "access": "visible"
            },
            "userTimeZone": {
              "dataType": "Text",
              "isNullable": false,
              "direction": "in",
              "access": "visible"
            }
          }
        ],
        "outArguments": [
          {
            "timeDifference": {
              "dataType": "Text",
              "isNullable": false,
              "direction": "out",
              "access": "visible"
            }
          }
        ]
      }
    }
  },
  "configurationArguments": {
    "applicationExtensionKey": "cfaaed29-c9a5-470b-9580-cf5e344567a2",
    "publish": {
      "url": "https://email-optimization-1.onrender.com/publish",
      "verb": "POST",
      "header": "Content-Type: application/json",
      "body": "{}",
      "useJwt": false
    },
    "validate": {
      "url": "https://email-optimization-1.onrender.com/validate",
      "verb": "POST",
      "header": "Content-Type: application/json",
      "body": "{}",
      "useJwt": false
    },
    "stop": {
      "url": "https://email-optimization-1.onrender.com/stop",
      "verb": "POST",
      "header": "Content-Type: application/json",
      "body": "{}",
      "useJwt": false
    }
  },
  "userInterfaces": {
    "configModal": {
      "height": 200,
      "width": 300,
      "url": "https://email-optimization-1.onrender.com/index.html"
    }
  }
}