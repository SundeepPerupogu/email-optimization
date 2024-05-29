{
    "workflowApiVersion": "1.1",
    "metaData": {
        "icon": "public/download.png",
        "category": "message"
    },
    "type": "REST",
    "lang": {
        "en-US": {
            "name": "Send Time Calculator",
            "description": "Calculates the next available send time based on the user's time zone."
        }
    },
    "arguments": {
        "execute": {
            "inArguments": [
                {
                    "time_zone": {
                        "dataType": "Text",
                        "isRequired": true,
                        "direction": "in"
                    },
                    "start_window": {
                        "dataType": "Text",
                        "isRequired": true,
                        "direction": "in"
                    },
                    "end_window": {
                        "dataType": "Text",
                        "isRequired": true,
                        "direction": "in"
                    }
                }
            ],
            "outArguments": [
                {
                    "next_send": {
                        "dataType": "Text",
                        "direction": "out"
                    }
                }
            ],
            "url": "https://sendtimecalculator.onrender.com/execute"
        },
        "configuration": {
            "arguments": {
                "start_window": {
                    "dataType": "Text",
                    "isRequired": true
                },
                "end_window": {
                    "dataType": "Text",
                    "isRequired": true
                }
            }
        }
    },
    "userInterfaces": {
        "configModal": {
            "height": 200,
            "width": 400,
            "url": "https://sendtimecalculator.onrender.com/config"
        }
    }
}
