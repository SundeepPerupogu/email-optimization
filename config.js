{
  "workflowApiVersion": "1.1",
  "metaData": {
    "icon": "icon.png",
    "category": "message"
  },
  "type": "REST",
  "lang": {
    "en-US": {
      "name": "Mail Optimization",
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
      "url": "https://email-optimization.onrender.com/execute",
      "verb": "POST",
      "body": "",
      "header": "",
      "format": "json",
      "useJwt": false,
      "timeout": 10000
    }
  },
  "configurationArguments": {
    "applicationExtensionKey": "cfaaed29-c9a5-470b-9580-cf5e344567a2",
    "publish": {
      "url": "https://email-optimization.onrender.com/publish",
      "verb": "POST",
      "header": "Content-Type: application/json",
      "body": "{}",
      "useJwt": false
    },
    "validate": {
      "url": "https://email-optimization.onrender.com/validate",
      "verb": "POST",
      "header": "Content-Type: application/json",
      "body": "{}",
      "useJwt": false
    },
    "stop": {
      "url": "https://email-optimization.onrender.com/stop",
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
      "url": "https://email-optimization.onrender.com/index.html"
    }
  }
}
