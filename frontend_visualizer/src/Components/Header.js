import '../App.scss';
import '../Styles/Header.scss'
import React from 'react';

// Header over the interactive area of the application
function Header() {

    return (
        <header className="App-header">
            <div className='ImageHelper'><img src={"/ISV.svg"} alt="Implicit Surface Visualizer Logo" className='logo' />
                Implicit Surface Visualizer
            </div>
        </header>
    );
}

export default Header;
