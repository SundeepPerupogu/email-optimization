
{
  "workflowApiVersion": "1.1",
  "metaData": {
   "icon": "public/icon.png",
    "iconSmall": "public/icon.png",
    "category": "message"
  },
  "type": "REST",
  "lang": {
    "en-US": {
      "name": "Custom Time Delta Activity",
      "description": "Calculates time difference between current and future time in user's timezone"
    }
  },
  "arguments": {
    "execute": {
      "inArguments": [
        {
          "futureUtcTime": "{{Event.deltaDate.futureUtcTime}}"
        },
        {
          "userTimeZone": "UTC+01:00"
        }
      ],
      "outArguments": [
        {
          "timeDifference": "209min"
        }
      ],
      "url": "https://bizcuit-sfmc-jbis.onrender.com/execute",
      "verb": "POST",
      "body": "",
      "header": "",
      "format": "json",
      "useJwt": false,
      "timeout": 10000
    }
  },
  "configurationArguments": {
    "applicationExtensionKey": "eb43d84b-32ae-44f7-8223-abdde6b9126c",
    "publish": {
      "url": "https://bizcuit-sfmc-jbis.onrender.com/publish",
      "verb": "POST",
      "header": "Content-Type: application/json",
      "body": "{}",
      "useJwt": false
    },
    "validate": {
      "url": "https://bizcuit-sfmc-jbis.onrender.com/validate",
      "verb": "POST",
      "header": "Content-Type: application/json",
      "body": "{}",
      "useJwt": false
    },
    "stop": {
      "url": "https://bizcuit-sfmc-jbis.onrender.com/stop",
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
      "url": "https://bizcuit-sfmc-jbis.onrender.com/index.html"
    }
  }
}
