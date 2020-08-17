from flask import Flask
from flask_restful import Api, Resource, reqparse
from config import config as con
import sqlite3
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
api = Api(app)

config = con.Config()
pass_key = config.PASSWORD

companies = {"ASHOKLEY_NS", "CIPLA_NS", "EICHERMOT_NS", "RELIANCE_NS", "TATASTEEL_NS"}

recieved_args = reqparse.RequestParser()
recieved_args.add_argument("pass-key", type=str, help="No password Received", required=True)
recieved_args.add_argument("file", type=str, help="No File-type Received", required=True)

def get_latest_day_data(cur, filename):
    latest_date = cur.execute(f"SELECT MAX(Date) FROM {filename}").fetchone()[0]  # get the latest date in db
    # print(latest_date)
    cur.execute(f"SELECT * FROM {filename} WHERE Date='{latest_date}'") #get that latest date's filed values
    # print(cur.fetchone())
    return list(cur.fetchone()) #[ date, open, .....volume]

def get_graph_data(cur, filename):
    cur.execute(f"SELECT Date, Close FROM {filename}")
    cur.execute(f"SELECT Date, Close FROM {filename}")
    datas = cur.fetchall()
    datas = [list(data) for data in datas]  #conv tuples into list inside for valid json
    return datas  #[ [date1,close1], [date2,close2], ..]

def get_additional_data(cur, filename):
    cur.execute(f"""
            SELECT DISTINCT Date, Close FROM {filename}
            WHERE Date < (SELECT MAX(Date) FROM {filename})
            ORDER BY Date DESC
            LIMIT 1
            """)  #since we restrict limit to '1', we get the nearest low date (& its close) of the max-date(last-registerede-date)
    prev_date, prev_close = cur.fetchone()
    # print(prev_close)

    Close_values_in_a_year_back = cur.execute(f"""
            SELECT DISTINCT Close FROM {filename}
            WHERE Date < (SELECT MAX(Date) FROM {filename})
            ORDER BY Date DESC
            LIMIT 364
            """).fetchall()
    # print(Close_values_in_a_year_back)
    close_high_in_a_year = max(Close_values_in_a_year_back)[0]
    close_low_in_a_year = min(Close_values_in_a_year_back)[0]

    return {"prev_close" : prev_close, "close_high_in_a_year" : close_high_in_a_year, "close_low_in_a_year" : close_low_in_a_year} #[ 2020-08-12, 52-span-high, 52-span-low]

def fetch_data(filename):
    conn = sqlite3.connect("Data/master.db")
    cur = conn.cursor()

    present_day_data = get_latest_day_data(cur, filename) #that days field data

    if filename in companies:
        graph_data = get_graph_data(cur, filename)  #only if its a company we get graph data
    else:
        graph_data = None  #called for bse/nse

    if filename not in companies: #get prev-close, 52-week-(high/low)
        add_info = get_additional_data(cur, filename)
    else:
        add_info = None  #called for comapny

    return {"present_day_data" : present_day_data, "graph_data" : graph_data, "add_info" : add_info}

class MainReceiver(Resource):

    @cross_origin()
    def put(self):
        # print("recievd call put")
        args = recieved_args.parse_args()
        pass_key_recieved = args['pass-key']
        file = args['file']
        if pass_key_recieved == pass_key:
            return fetch_data(file), 201
        else:
            print("UNAUTHERIZED ATTEMPT!")

api.add_resource(MainReceiver, "/Main-Receiver")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
    # app.run(host="0.0.0.0", port=5000)
