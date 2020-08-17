import React,{useState, useEffect} from 'react';
import "./Graph.css";
import {Select, FormControl, MenuItem, Button} from "@material-ui/core";
import {Line} from "react-chartjs-2";
import numeral from 'numeral';


const options = {
    legend: {
        display: false,
    },
    elements: {
        point: {
            radius: 0,
        },
    },
    maintainsAspectRatio: false,
    tooltips: {
        mode: "index",
        intersect: false,
        callbacks: {
            label: function (tooltipItem, data){
                return numeral(tooltipItem.value).format("0,0");
            },
        },
    },
    scales: {
        xAxes: [
            {
                type: "time",
                time: {
                   
                    format: "YYYY/MM/DD",
                    tooltipFormat: "ll",
                },
            },
        ],
        yAxes: [
            {
                gridLines: {
                    display: false,
                },
                ticks:{
                    //include a dollar sign in the ticks
                    callback: function (value, index, values){
                        return numeral(value).format("0a");
                    },

                },
            },
        ],
    },

} //end of option----to be passed to the line grpah attribute





function Graph() {
    const BACKEND_URL = "http://127.0.0.1:5000/Main-Receiver"
    const [graphData, setGraphData] = useState([]);
    const [savedGraphData, setSavedGraphData] = useState([]);  //we addi. save the current companies entire graph data, to reuse it again  in case of view change and not fetch the entire thing all over again(which we havce to do because we manipilate and change the 'graphData' variable) ; hence this var only chnage initially while loading and when a new comany s loaded
    const [selected, setSelected] = useState("RELIANCE_NS");
    const [date, setDate] = useState();
    const [open, setOpen] = useState();
    const [dayHigh, setDayHigh] = useState();
    const [dayLow, setyDayLow] = useState();
    const [close, setClose] = useState(); 
    const [volume, setVolume] = useState();
    

    async function fetch_data(filename){
        // console.log("Fetcjhimng from backendd.....");
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
    
    function change_values(passed_data){   //helper fn to dynamically change state variables 
        
        setDate(passed_data[0])
        setOpen(passed_data[1])
        setDayHigh(passed_data[2])
        setyDayLow(passed_data[3])
        setClose(passed_data[4])
        setVolume(passed_data[6])
    }
    // console.log("GRPAH_DATA : ", graphData);
    // console.log("date : ", date);
    // console.log("open : ", open);
    // console.log("dayHigh : ", dayHigh);
    // console.log("dayLow : ", dayLow);
    // console.log("close : ", close);
    // console.log("volume : ", volume);

    const buildChartData = (passed_data) => {  //build the obtained data from api in the format the chart.js needs
        const ChartData = [];
        
        passed_data.forEach(point => {  //for each point give as arr from api
            const modified_point = {
                x : point[0],         //modify that point in obj with x,y form for chart.js
                y : point[1]
            };
            ChartData.push(modified_point)  //append the modified point to the chartdata list 
        });
        
        return ChartData;  //finally return that blist -- which is our required format for chart.js
    };

    useEffect(() =>{

        const my_async_fn_to_get_initial_details = async () =>{
            const data = await fetch_data("RELIANCE_NS") //getting default value as nse
            const ChartData = buildChartData(data.graph_data) //passing in api graph data to make it into chart.js graph data format
            setGraphData([...ChartData]); //setting graphdata as the modified and required dat for chartjs
            setSavedGraphData([...ChartData]); //saving the entire graph data for in case of view chamge
            change_values(data.present_day_data) //change the present values of that day instant
            // console.log("USEEFFECT OCCURING>>>>>>>>>>>")  
        }

        my_async_fn_to_get_initial_details(); //for usijg async fn inside useeffect..
        

    }, []);

    const changeGraphView =(event, limit) =>{
        
        if (limit ==="ALL"){                                       //user came back from some other view to the widerst view hence 
            setGraphData(savedGraphData)  //simly copy the whole graph data back to the view as the user clicked ALL
        
        }else{
            setGraphData(savedGraphData.slice(savedGraphData.length-limit));
        }

        // console.log("SAVED ASRRAY  AFTER. AFTER...= ", savedGraphData)
        setTimeout(()=>{
            console.log("SAVED ASRRAY  AFTER. AFTER...= ", savedGraphData)
        }, 1000 );
    }
 
    const onSelectionChange = async (event) =>{   //company chn ge occured...
        let filename = event.target.value;  //obtain file to fetch
        // console.log(file);
        setSelected(filename)  //to change the actaul value of that dropdown option
        const data = await fetch_data(filename)
        const ChartData = buildChartData(data.graph_data) //passing in api graph data to make it into chart.js graph data format
        setGraphData(ChartData) //setting graphdata as the modified and required dat for chartjs
        setSavedGraphData(ChartData); //saving the entire graph data for in case of view chamge
        change_values(data.present_day_data)  //change the present values of that day instant
    }
    // console.log("GRPAH_DATA : ", graphData);
    return (
        <div className="graph">
            <FormControl className="graph__dropdown">
                <Select variant="outlined" value={selected} onChange={onSelectionChange}>
                 <MenuItem value="RELIANCE_NS">Reliance</MenuItem> 
                 <MenuItem value="TATASTEEL_NS">Tata Steel</MenuItem>
                 <MenuItem value="EICHERMOT_NS">Eichermot</MenuItem>
                 <MenuItem value="CIPLA_NS">Cipla</MenuItem>
                 <MenuItem value="ASHOKLEY_NS">Ashokley</MenuItem>
                 </Select>
                 <h2>CHARTS</h2>
            </FormControl>
            
            <div className="graph__details">
                <div className="graph__details___buttons">
                <Button variant="outlined" color="primary" onClick={(e)=> changeGraphView(e,"ALL")} >ALL</Button>  
                <Button variant="outlined" color="primary" onClick={(e)=> changeGraphView(e, 728)} >2Y</Button>
                <Button variant="outlined" color="primary" onClick={(e)=> changeGraphView(e, 364)} >1Y</Button>
                <Button variant="outlined" color="primary" onClick={(e)=> changeGraphView(e, 186)} >6M</Button>
                <Button variant="outlined" color="primary" onClick={(e)=> changeGraphView(e, 93)} >3M</Button>
                <Button variant="outlined" color="primary" onClick={(e)=> changeGraphView(e, 31)} >1M</Button>
                <Button variant="outlined" color="primary" onClick={(e)=> changeGraphView(e, 7)} >1W</Button>
                </div>

                <div className="graph__details___info">
                   
                    <h3>{date}</h3>
                    <p>Open </p>      <h3>{numeral(open).format(",0.00")}</h3>
                    <p>Day High </p> <h3>{numeral(dayHigh).format(",0.00")}</h3>
                    <p>Day Low </p> <h3>{numeral(dayLow).format(",0.00")}</h3>
                    <p>Close </p> <h3>{numeral(close).format(",0.00")}</h3>
                    <p>Volume  </p> <h3>{numeral(volume).format(",0.00")}</h3>
                </div>
            </div>

            <div className="graph__view">
                
                {graphData?.length > 0 && (  //have to check if data gets loaded intially, in the very begining data wud not be populated
                    // console.log("Enterimng line graph space  : ", graphData),    
                    // console.log("GRAPH DATA LENFTH ", graphData.length),
                    <Line
                        options = {options}
                
                        data ={{
                            datasets: [
                                {
                                    backgroundColor: "rgba(204, 16, 52, 0.5)",
                                    borderColor: "#CC1034",
                                    data : graphData  //our state vairable data
                                    
                                }
                            ]
                        }}
                   />
                )}
            </div>

        </div>
    )
}

export default Graph
