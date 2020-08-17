import React, {useState, useEffect} from 'react';
import "./Middle.css";
import {Select, FormControl, MenuItem, Card, CardContent} from "@material-ui/core";
import numeral from 'numeral';

function Middle() {
    const BACKEND_URL = "http://127.0.0.1:5000/Main-Receiver"
    const [selected, setSelected] = useState("NSE_Nifty");
    const [open, setOpen] = useState();
    const [prevClose, setPrevClose]= useState();
    const [dayHigh, setDayHigh] = useState();
    const [dayLow, setyDayLow] = useState();
    const [yearHigh, setYearHigh] = useState();
    const [yearLow, setYearLow] = useState();
    const [mainFigure, setMainFigure] = useState(); //close value of that day itself
    const [percentInc, setPercentInc] = useState();
    const [date, setDate] = useState();

    async function fetch_data(filename){
        return(
        fetch( BACKEND_URL, {
            method: 'PUT',
            headers:{
                'Accept' : 'application/json',
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({'pass-key' : "CODE_IS_LUV_483238@!+", 
                    'file' : filename})
        })
        .then((res) => res.json() )
        );
    }
    
    function change_values(data){                //helper fn to dynamically change state variables 
            setDate(data.present_day_data[0])
            setOpen(data.present_day_data[1])
            setDayHigh(data.present_day_data[2])
            setyDayLow(data.present_day_data[3])
            setMainFigure(data.present_day_data[4])

            setYearHigh(data.add_info.close_high_in_a_year)
            setYearLow(data.add_info.close_low_in_a_year)
            setPrevClose(data.add_info.prev_close)

            // let inc = ((mainFigure-open)/open)*100   ---why not this working???
            //    OR

            let inc = ((data.present_day_data[4] - data.present_day_data[1])/ data.present_day_data[1] ) * 100
            
            setPercentInc(inc)
        }
    
    
    useEffect(() =>{

        const my_async_fn_to_get_initial_details = async () =>{
            const data = await fetch_data("NSE_Nifty") //getting default value as nse
            change_values(data)
            
        }

        my_async_fn_to_get_initial_details();
        

    }, [])
    
    
    const onSelectionChange = async (event) =>{
        let filename = event.target.value;  //obtain file to fetch
        // console.log(file);
        setSelected(filename)  //to change the actaul value of that dropdown option
        
        let data = await fetch_data(filename)
        change_values(data)
    }

    
    return (
        <div className="middle">
            <div className = "middle_container">
                <FormControl className="middle__dropdown">
                    <Select variant="outlined" value={selected} onChange={onSelectionChange}>
                    <MenuItem value="NSE_Nifty">NSE</MenuItem> 
                    <MenuItem value="BSE_Sensex">BSE</MenuItem>
                    </Select>
                </FormControl>

                <div className="middle__mainBlock">
                    <div className="middle__mainBlock__top">
                        <h2>{selected==="NSE_Nifty" ? "NIFTY 50" : "BSE (SENSEX)"}</h2>
                        <div className="middle__mainBlock__top__curr">
                            <h1>{numeral(mainFigure).format(",0.00")}</h1>
                            <h4 className={percentInc>0? 'green' : 'red'}>{numeral(mainFigure-open).format("0.00")}({numeral(percentInc).format("0.00")}%)</h4>
                            <p>As on -  {date}</p>
                        </div>
                        
                    </div>
                    <p className="overview">Overwiew</p>  
                    <div className="middle__mainBlock__bottom">
                       
                        <div className="mddleC1">
                            <div className="mywrapper"><p>Open</p><h5>{numeral(open).format(",")}</h5></div>
                            <div className="mywrapper"><p>Previous Close</p> <h5>{numeral(prevClose).format(",")}</h5></div>
                            <div className="mywrapper"><p>Day High</p> <h5>{numeral(dayHigh).format(",")}</h5></div>
                        </div>
                        <div className="mddleC1">
                            <div className="mywrapper"><p>Day Low</p> <h5>{numeral(dayLow).format(",")}</h5></div>
                            <div className="mywrapper"><p>52 Week High</p> <h5>{numeral(yearHigh).format(",")}</h5></div>
                            <div className="mywrapper"><p>52 Week Low</p> <h5>{numeral(yearLow).format(",")}</h5></div>
                        </div>
          
                    </div>
                </div>
            </div>
        </div>
       
    )
}

export default Middle
