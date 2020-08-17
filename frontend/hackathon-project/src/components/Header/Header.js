import React from 'react'
import "./Header.css"
import CallIcon from '@material-ui/icons/Call';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import {Link} from 'react-router-dom' 
function Header() {
    return (
    <nav className="header">
          <img className="header__logo" src="https://png.pngtree.com/png-clipart/20190604/original/pngtree-restaurant-waiter-male-suit-png-image_1267605.jpg" alt="navbar-logo-image"/>  
          <div className="header__heading">
            <h1>Welocome!</h1>
          </div>
          <div className="header__link">
            <Link to="/">
                <span className="headr__logout">Logout</span>
            </Link>
          </div>
{/*           
          <CallIcon className="header__callIcon" />
          <WhatsAppIcon className="header__whatsappIcon" /> */}
    </nav>
        );
    
}

export default Header
