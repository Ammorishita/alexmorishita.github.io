import React from 'react';
import './App.scss';
import Interface from './components/interface/interface';
import Security from './components/security/security';
import Svg from './components/svgs/svg';
function App() {
  return (
    <div className="app">
      <Svg></Svg>
      {/* <Security></Security> */}
      <Interface></Interface>
      {/* <Dropdown></Dropdown> */}
    </div>
  );
}

export default App;
