import React, {useEffect, useState} from 'react';
import "./MainPage.css";
import Infobox from "./components/Infobox/Infobox";
import Middle from "./components/Middle/Middle";
import Graph from "./components/Graph/Graph";

const BACKEND_URL = "http://127.0.0.1:5000/Main-Receiver"

function MainPage() {
    const [NSEpopupData, setNSEPopupData] = useState({});
    const [BSEpopupData, setBSEPopupData] = useState({});

    useEffect(() =>{

        const getPopupData = (filename) =>{
            fetch( BACKEND_URL, {
                method: 'PUT',
                headers:{
                    'Accept' : 'application/json',
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({'pass-key' : "CODE_IS_LUV_483238@!+", 
                        'file' : filename})
            })
            .then((res) => res.json())
            .then((data) => {
                // console.log(data);
                filename==="NSE_Nifty" ? setNSEPopupData(data) : setBSEPopupData(data);
                //filename==="NSE_Nifty" ? console.log("Data in nse if ", data) : console.log("Data in bse else ",data);
            });

        }; 

        getPopupData( "NSE_Nifty" );
        getPopupData( "BSE_Sensex" );

    }, []);
    // console.log("NSE DATA is ", NSEpopupData);
    // console.log("BSE DATA is ", BSEpopupData)

    return (
        <div className="MainPage">
            <div className="infobox_comntainer">
                <Infobox 
                
                title="NSE"
                heading="NIFTY 50"
                close={NSEpopupData.present_day_data}
                prev_close={NSEpopupData.add_info}/>

                <Infobox 
                title="BSE"
                heading="SENSEX"
                close={BSEpopupData.present_day_data}
                prev_close={BSEpopupData.add_info}/>

            </div>

            <Middle />

            <Graph />
        </div>
    );
}

export default MainPage
