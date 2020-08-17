# flipr-hackathon

- Clone to your local Repo ;

****BACKEND****
in console;
  1) $ cd backend                             --- goto the backend working dir
  2) $ virtualenv venv                        --- setup a virtual env of your choice
  3) $ source venv/Scripts/Activate           --- activating virtualenv 
    ** iF you are using linux, then step 3) $ source venv/bin/Activate 
  4) pip3 install -r requirements.txt         --- install the python packages required for the backend api to run
  5) python3 backend.py                       --- run the backend app 
  
  -- Now the backend  app woukd be running locally on port 5000 
  -- the backend api send data to frontend acting as a database api system
  
  ****FRONTEND***  (after running backend)
  goto main directory(flipr-hackathon/)
  in console,
    1)$ cd frontend/hackathon-project/        --- goto the frontend working dir
    2)$ npm install                           --- install the required dependies
    3)$ npm start                              --- RUN the App locally
    
