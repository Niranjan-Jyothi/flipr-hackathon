import requests

BACKEND_URL = "http://127.0.0.1:5000/"


res = (requests.put(BACKEND_URL + "Main-Receiver", {"pass-key": "CODE_IS_LUV_483238@!+", "file": "NSE_Nifty"})).json()
print(res)