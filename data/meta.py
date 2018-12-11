import glob 
import pandas as pd
import json
from functools import reduce
from collections import defaultdict
# this_data = pd.read_csv('flight-data/carriers.csv', skipinitialspace=True, low_memory=False)
# airline_codes_to_airlines = this_data.set_index('Code')['Description'].to_dict()
# airlines_to_airline_codes = this_data.set_index('Description')['Code'].to_dict()

this_data = pd.read_csv('flight-data/carriers_percent.csv', skipinitialspace=True, low_memory=False)
airline_codes_to_airlines = this_data.set_index('OP_UNIQUE_CARRIER')['Description'].to_dict()
airlines_to_airline_codes = this_data.set_index('Description')['OP_UNIQUE_CARRIER'].to_dict()
airline_codes_to_punctuality = this_data.set_index('OP_UNIQUE_CARRIER')['N/A(PCT_ONTIME_ARR)'].to_dict()
#airline_codes_to_punctuality = dict()

# for key in airline_codes_to_airlines.keys():
#     if key in punc:
#         airline_codes_to_punctuality[key] = punc[key]
#     else:
#         airline_codes_to_punctuality[key] = None


this_data = pd.read_csv('flight-data/airports.csv', skipinitialspace=True, low_memory=False)
airport_codes_to_airports = this_data.set_index('ORIGIN')['Description'].to_dict()
airports_to_airport_codes = this_data.set_index('Description')['ORIGIN'].to_dict()
airport_codes_to_punctuality = this_data.set_index('ORIGIN')['N/A(PCT_ONTIME_DEP)'].to_dict()

data = {}
data['airline_codes_to_airlines'] = airline_codes_to_airlines
data['airlines_to_airline_codes'] = airlines_to_airline_codes
data['airline_codes_to_punctuality'] = airline_codes_to_punctuality
data['airport_codes_to_airports'] = airport_codes_to_airports
data['airports_to_airport_codes'] = airports_to_airport_codes
data['airport_codes_to_punctuality'] = airport_codes_to_punctuality
data['airport_codes_to_air_time'] = []
data['airport_codes_to_route_time'] = []
data['airport_codes_to_taxi_time'] = []

for i in range (1, 13):
    print(i)
    path = 'flight-data/*/*_2017_' + str(i) + '.csv'
    month_data = glob.glob(path)
    loaded_data = []
    for path in month_data:
        this_data = pd.read_csv(path, skipinitialspace=True, low_memory=False)
        loaded_data.append(this_data)

    df = pd.concat(loaded_data)
    df = df[[ 'Origin','Dest', 'TaxiOut', 'TaxiIn', 'AirTime', 'CRSElapsedTime']]
    df.dropna(inplace=True)
    print(df.head())

    route_time_dict = defaultdict(list)
    ideal_time_dict = defaultdict(list)
    out_time = defaultdict(list)
    in_time = defaultdict(list)
    print('Getting times')
    for index, row in df.iterrows():
        og = row['Origin']
        dest = row['Dest']
        out_time[og].append(row['TaxiOut'])
        in_time[dest].append(row['TaxiIn'])
        time = row['AirTime']
        projected = row['CRSElapsedTime']
        key = og + '_' + dest
        route_time_dict[key].append(time)
        ideal_time_dict[key].append(projected)


    print("Averaging route times")
    route_time = {}
    for route in route_time_dict.keys():
        times = route_time_dict[route]
        route_time[route] = reduce(lambda x, y: x + y, times) / len(times)

    total_time = {}
    for route in ideal_time_dict.keys():
        times = ideal_time_dict[route]
        total_time[route] = reduce(lambda x, y: x + y, times) / len(times)

    print("Averaging taxi times")
    taxi_time = {}
    for og in out_time.keys():
        out = out_time[og]
        reduced_out = reduce(lambda x, y: x + y, out) / len(out)
        inti = in_time[og]
        if (len(inti) > 0):
            reduced_in = reduce(lambda x, y: x + y, inti) / len(inti)
            taxi_time[og] = {"avg_out": reduced_out, "avg_in": reduced_in}
        else:
            taxi_time[og] = {"avg_out": reduced_out, "avg_in": None}

    data['airport_codes_to_air_time'].append(route_time)
    data['airport_codes_to_route_time'].append(total_time)
    data['airport_codes_to_taxi_time'].append(taxi_time)

with open('meta/lookup_all.json', 'w') as fp:
        json.dump(data, fp)