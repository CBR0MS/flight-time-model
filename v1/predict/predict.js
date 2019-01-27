var pie;

// get the url parameters 
function getUrlVars() {
    let vars = {};
    let parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
        vars[key] = value;
    });
    return vars;
}

function timeConvert(n) {
    var num = n;
    var hours = (num / 60);
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);
    rminutes = rminutes.toString().padStart(2, '0')
    return  rhours.toString() + ":" + rminutes;
}


(async () => {
    // load the json files with lookup tables and encodings for airlines and airports
    let lookup = {}
    let airlineNames = {}
    let locationNames = {}

    $.getJSON("../data/meta/airline_abbreviations.json", function(json) {
        airlinesNames = json
    });

    $.getJSON("../data/meta/location_names.json", function(json) {
        locationNames = json
    });

    $.getJSON("../data/meta/lookup_all.json", function(json) {
        lookup = json;

        (async () => {
        // get the url parameters with user's selections
        const params = getUrlVars()
        const usrOrigin = params['origin']
        const usrDest = params['dest']

        // date is passed in ISO 8601 Extended Format
        const usrDate = new Date(params['date'])
        const usrAirline = params['airline']

        const month = usrDate.getMonth() + 1
        const dayOfMonth = usrDate.getUTCDate()
        const dayOfWeek = usrDate.getUTCDay() + 1

        let pathArr = '../data/models/' + month.toString() + '_arr/model.json'
        let pathDep = '../data/models/' + month.toString() + '_dep/model.json'

        // load the arrival and departure models 
        const arrivalModel = await tf.loadModel(pathArr);
        const departModel = await tf.loadModel(pathDep);

        const originEncoded = locationNames[usrOrigin]
        const destEncoded = locationNames[usrDest]
        const airlineEncoded = airlinesNames[usrAirline];

        const inputList = [dayOfMonth, dayOfWeek, airlineEncoded, originEncoded, destEncoded]
        let depart, arrive = makePrediction(inputList, departModel, arrivalModel)
        depart = depart || 0
        arrive = arrive || 0

        // set page infor 
        let loc = (lookup['airport_codes_to_airports'][usrOrigin])
        loc = loc.substring(0, loc.indexOf(':'));
        let title = loc + " (" + usrOrigin + ") → " 
        loc = (lookup['airport_codes_to_airports'][usrDest])
        loc = loc.substring(0, loc.indexOf(':'));
        title += loc + " (" + usrDest + ")" 
        $("#title").text(title)
        title = lookup['airline_codes_to_airlines'][usrAirline]
        $("#airline-title").text(title)
        let formattedDate = usrDate.toLocaleString("en-us", {
            month: "long",
            day: "numeric",
            year: "numeric",
        });
        $("#date-title").text(formattedDate)

        // calcluate the unadjusted times 
        const timeAtOrigin = lookup['airport_codes_to_taxi_time'][usrDate.getMonth()][usrOrigin]['avg_out']
        let key = usrOrigin + '_' + usrDest
        const timeInAir = lookup['airport_codes_to_air_time'][usrDate.getMonth()][key]
        const timeAtDest = lookup['airport_codes_to_taxi_time'][usrDate.getMonth()][usrDest]['avg_in']
        let totalUnAdjusted = Math.round(timeAtOrigin + timeInAir + timeAtDest);

        // calulate ajusted times 
        let total = Math.round((timeAtOrigin + depart) + (timeInAir + arrive) + timeAtDest);
        let origin = Math.ceil(timeAtOrigin / total * 100)
        let dest = Math.ceil(timeAtDest / total * 100)
        let air = Math.ceil(timeInAir / total * 100)

        chartContent['data']['content'][0]['value'] = origin;
        chartContent['data']['content'][0]['label'] = "At " + usrOrigin + " (" + timeConvert(timeAtOrigin + depart) + ")" ;
        chartContent['data']['content'][1]['value'] = dest;
        chartContent['data']['content'][1]['label'] = "At " + usrDest + " (" + timeConvert(timeAtDest) + ")" ;
        chartContent['data']['content'][2]['value'] = air;
        chartContent['data']['content'][2]['label'] = "In Air (" + timeConvert(timeInAir + arrive) + ")" ;
        chartContent['header']['title']['text'] =  timeConvert(total) ;

        $(document).ready(function(){
            chartContent['size']['canvasWidth'] = $(document).width() / 2;
            if ($(document).width() < 600){
                chartContent['size']['canvasWidth'] =  $(document).width() - ($(document).width() / 3);
            }
            pie = new d3pie("pieChart", chartContent);
        })
        

        function sign (time) {
            if (Math.sign == 1) {
                return "+ "
            } 
            return "- "
        }
        // add times to page
        $("#route").text(timeConvert(totalUnAdjusted))
        $("#depart").text(sign(depart) + timeConvert(Math.abs(depart)))
        $("#arrive").text(sign(arrive) + timeConvert(Math.abs(arrive)))
        $("#duration").text(timeConvert(total))
    })();
});

})();

function makePrediction(inputList, departModel, arrivalModel) {
    // need to feed model with:
    // DayofMonth, DayOfWeek, Reporting_Airline (encoded), Origin (encoded), Dest (encoded)
    const input = tf.tensor([inputList])

    const predictionDep = Array.from(departModel.predict(input).dataSync());
    const predictionArr = Array.from(arrivalModel.predict(input).dataSync());

    const departTime = Math.round(predictionDep[0] / 1000)
    const arriveTime = Math.round(predictionArr[0] / 1000)

    return (departTime, arriveTime)
}

let chartContent = {
    "header": {
        "title": {
            "text": "",
            "fontSize": 45,
            "font": "nimbus-sans",
            "fontStyle" : "italic",
            "color": "#fff"
        },
        "location": "pie-center",
        "titleSubtitlePadding": 10
    },
    "size": {
        "canvasWidth": 500,
        "pieInnerRadius": "77%",
        "pieOuterRadius": "71%"
    },
    "data": {
        "sortOrder": "label-desc",
        "content": [
        {
            "label": "",
            "value": 10,
            "color": "#F49E4C"
        },
        {
            "label": "",
            "value": 20,
            "color": "#FFD89B"
        },
        {
            "label": "",
            "value": 60,
            "color": "#154463"
        },
        ]
    },
    "labels": {
        "outer": {
            "pieDistance": 20
        },
        "inner": {
            "format": "none"
        },
        "mainLabel": {
            "color": "#fff",
            "fontSize": 15,
            "font": "nimbus-sans",
        },
        "value": {
            "color": "#fff",
            "fontSize": 15,
            "font": "nimbus-sans",
        },
        "lines": {
            "enabled": true,
            "style": "straight"
        },
        "truncation": {
            "enabled": true
        }
    },
    "effects": {
        "pullOutSegmentOnClick": {
            "effect": "linear",
            "speed": 400,
            "size": 8
        },
        "highlightSegmentOnMouseover": false
    },
    "misc": {
        "colors": {
            "segmentStroke": "#00000000"
        }
    }  
};