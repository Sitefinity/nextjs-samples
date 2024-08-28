'use client';

import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CarContext } from '../carcontext';

export function Home() {
    const {
        car
    } = useContext(CarContext);

    let message = 'Start';
    let btnClass = 'primary';
    if (car.cartype !== 'none' || car.engine !== 'none' || car.color !== 'none'){
        message = 'Continue';
        btnClass = 'success';
    }

    return (<div className="container">
      <div className="row">
        <div className="col text-center">
          <h1 className="mb-3" style={{textAlign: 'center'}}>Car configurator</h1>
          <Link to="/cartype" className={`btn btn-outline-${btnClass}`}>{message} configuration</Link>
        </div>
      </div>
    </div>);
}
