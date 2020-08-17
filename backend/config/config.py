import json

with open('config/config.json') as config_file:
    config = json.load(config_file)

class Config:
    PASSWORD = config.get("PASSWORD")