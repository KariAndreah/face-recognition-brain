import React from 'react';
import './Logo.css';
import brain from './brain.png';

const Logo = () => {
    return (
        <div className='ma4 mt0'>
            <div className='Tilt'>
                <div className="pa3"><img src={brain} alt='logo' style={{ paddingTop: '5px' }}></img> </div>
            </div>
        </div >
    )
}

export default Logo;