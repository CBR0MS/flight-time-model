
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

    let month = usrDate.getMonth() + 1
    let pathArr = '../data/models/' + month.toString() + '_arr/model.json'
    let pathDep = '../data/models/' + month.toString() + '_dep/model.json'
    console.log(pathDep)
   // load the arrival and departure models 
    const arrivalModel = await tf.loadModel(pathArr);
    const departModel = await tf.loadModel(pathDep);

   //const prediction = model.predict([1, ]);
    //console.log(arrivalModel.p)
    
})();
