import sqlite3
import csv


conn = sqlite3.connect('master.db')
cur = conn.cursor()

# filename = input("Enter your .csv filename : ") #--get each csv to convert
# filename = "ASHOKLEY_NS"

filenames= ["ASHOKLEY_NS", "BSE_Sensex", "CIPLA_NS", "EICHERMOT_NS", "NSE_Nifty", "RELIANCE_NS", "TATASTEEL_NS"]
for filename in filenames:

    # if filename == "NSE_Nifty": #for my check purpose

        cur.execute(f'DROP TABLE IF EXISTS {filename}') #re-writng the table if exsist
        cur.execute(f"""
        CREATE TABLE {filename}(
            "Date" TEXT,
            "Open" REAL,
            "HIGH" REAL,
            "LOW" REAL,
            "Close" REAL,
            "Adj_Close" REAL,
            "Volume" REAL
        )
        """)

        with open(f"{filename}.csv", "r") as csv_file:
            csv_reader = csv.reader(csv_file, delimiter=',')
            next(csv_reader) #to skip header
            for row in csv_reader:   #reading each row from csv
                Date = row[0]
                Open = row[1]
                HIGH = row[2]
                LOW = row[3]
                Close = row[4]
                Adj_Close = row[5]
                Volume = row[6]

                cur.execute(f"""INSERT INTO {filename}(Date,Open,HIGH,LOW,Close,Adj_Close,Volume)
                    VALUES (?,?,?,?,?,?,?)""", (Date,Open,HIGH,LOW,Close,Adj_Close,Volume))
                conn.commit()   #saving that read row from csv as a new field in table

        """DEV -- TEST"""
        # cur.execute(f"SELECT * FROM {filename} WHERE Date='2020-08-13'")
        # cur.execute(f"SELECT * FROM {filename} WHERE Open=8468.049805")

        # latest_date = cur.execute(f"SELECT MAX(Date) FROM {filename}").fetchone()[0]
        # print(latest_date)
        # cur.execute(f"SELECT * FROM {filename} WHERE Date='{latest_date}'")
        # print(list(cur.fetchone()))

        cur.execute(f"SELECT Date, Close FROM {filename}")
        datas = cur.fetchall()
        datas = [list(data) for data in datas]
        print(datas)

        # cur.execute(f"""
        # SELECT DISTINCT Date, Close FROM {filename}
        # WHERE Date < (SELECT MAX(Date) FROM {filename})
        # ORDER BY Date DESC
        # LIMIT 1
        # """)
        # # print(cur.fetchone()[0])
        # prev_date, prev_close = cur.fetchone()
        # print(prev_close)

        # close_values_in_a_year_back = cur.execute(f"""
        # SELECT DISTINCT Close FROM {filename}
        # WHERE Date < (SELECT MAX(Date) FROM {filename})
        # ORDER BY Date DESC
        # LIMIT 364
        # """).fetchall()
        # print(close_values_in_a_year_back)
        # print(max(close_values_in_a_year_back)[0])
        # print(min(close_values_in_a_year_back)[0])
        # print(len(close_values_in_a_year_back))
        # cur.execute(f"SELECT * FROM {filename} WHERE Close=7511.10")
        # print(cur.fetchone())