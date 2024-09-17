'use client';

import { useContext } from 'react';
import { CarContext } from '../carcontext';

export function Summary() {
  const { car } = useContext(CarContext);

  let btnDisabled = false;
  let btnText = 'Submit';
  if (car.cartype === 'none' || car.engine === 'none' || car.color === 'none'){
      btnDisabled = true;
      btnText = 'Select all car specifications to submit';
  }

  return (<div className="col"><div className="container" id="featured-3">
    <h3 className="pb-2 border-bottom">Selected car specifications</h3>
    <div className="row g-4 py-5 row-cols-1 row-cols-lg-3">
      <div className="feature col">
        <div className="bg-primary bg-gradient" style={{height: '30px'}} />
        <h4>Type</h4>
        <p>{car.cartype}</p>
      </div>
      <div className="feature col">
        <div className="bg-primary bg-gradient" style={{height: '30px'}} />
        <h4>Engine</h4>
        <p>{car.engine}</p>
      </div>
      <div className="feature col">
        <div className="bg-primary bg-gradient" style={{height: '30px'}} />
        <h4>Color</h4>
        <p>{car.color}</p>
      </div>
    </div>
  </div><div className="mb-3" data-sf-role="submit-button-container"><button type="submit" className="btn btn-primary" disabled={btnDisabled}>{btnText}</button></div>
  </div>);
}
