import '../App.scss';
import '../Styles/Loading.scss'
import React from 'react';


// Used to blur everything except the header while waiting for a response from the backend and loading a model
function Loading(props) {

    return (
        <div>
            {props.isLoading && <div className='blur' />}
        </div>
    );
}

export default Loading;
