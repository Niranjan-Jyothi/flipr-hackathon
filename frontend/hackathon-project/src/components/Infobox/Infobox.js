import React from 'react'
import "./Infobox.css"
import { CardContent, Typography, Card} from "@material-ui/core"
import numeral from 'numeral';

function Infobox({ title, close, heading, prev_close}) {
    return (
        <Card className='infoBox' >
            <CardContent>
            <Typography className="infoBox__title" color="textPrimary">{title}</Typography>
                <Typography className="infoBox__title" color="textSecondary">{heading}</Typography>
                <h4 className='infoBox__close '>{close ? numeral(close[4]).format(",0.00") : 0}</h4>
                <Typography className="infoBox__prev_close" color="textSecondary">Prev Close - {prev_close ? numeral(prev_close.prev_close).format(",0.00") : 0}</Typography>
            </CardContent>
        </Card>
    )
}

export default Infobox
