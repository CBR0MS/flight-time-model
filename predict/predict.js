
// get the url parameters 
function getUrlVars() {
    let vars = {};
    let parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
        vars[key] = value;
    });
    return vars;
}

(async () => {
    // load the json files with lookup tables and encodings for airlines and airports
    let airlines = {}
    let airlineNames = {}
    let locationNames = {}

    $.getJSON("../data/meta/airline_abbreviations.json", function(json) {
        airlines = json
    });

    $.getJSON("../data/meta/airline_names.json", function(json) {
        airlineNames = json
    });

    $.getJSON("../data/meta/location_names.json", function(json) {
        locationNames = json
    });

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
    console.log(pathDep)
   // load the arrival and departure models 
    const arrivalModel = await tf.loadModel(pathArr);
    const departModel = await tf.loadModel(pathDep);

    const originEncoded = locationNames['PIT']
    const destEncoded = locationNames['ORD']
    const keys = Object.keys(airlineNames)

    let airlineKey = ''

    for (const key of keys) {
        if (airlineNames[key] == 'Delta Air Lines Inc.') {
            airlineKey = key
            break
        }
    }
    const inputList = [dayOfMonth, dayOfWeek, airlines[airlineKey], originEncoded, destEncoded]
    makePrediction(inputList, departModel, arrivalModel)
})();

function makePrediction(inputList, departModel, arrivalModel) {
    // need to feed model with:
    // DayofMonth, DayOfWeek, Reporting_Airline (encoded), Origin (encoded), Dest (encoded)
    const input = tf.tensor([inputList])

    const predictionDep = Array.from(departModel.predict(input).dataSync());
    const predictionArr = Array.from(arrivalModel.predict(input).dataSync());

    const departTime = Math.round(predictionDep[0] / 1000)
    const arriveTime = Math.round(predictionArr[0] / 1000)

    console.log(departTime)
    console.log(arriveTime)

}
