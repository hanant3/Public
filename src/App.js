import * as d3 from 'd3';
import React, {useState,useEffect, useMemo,useRef} from 'react';
import GenderFilter from './GenderFilter';
import AgeFilter from './AgeFilter'; 
import 'bootstrap/dist/css/bootstrap.css';

import './App.css';

import Donut_visual1 from './donut_visual1';
import Donut_visual2 from './donut_visual2';
import Donut_visual3 from './donut_visual3';
import Donut_visual4 from './donut_visual4';
import Donut_visual5 from './donut_visual5';
import Donut_visual6 from './donut_visual6';
import Line_chart from './line_chart';
import Bar_chart from './bar_chart';
import Network_visual from './network_visual';
import Map_visual from './map_visual';

//const { Sider, Content, Footer } = Layout;

function App() {

  const [myData, setMyData] = useState(null);
  const [genderFilter, setGenderFilter] = useState('');
  const [ageFilter, setAgeFilter] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  //state deciding if we are looking at the blackhat or whitehat visualization
  const [viewToggle, setViewToggle] = useState('blackhat');

  //state for the data, since it loads asynchronously
  const [map, setMap] = useState();
  const [gunData, setGunData] = useState();

  //we put some states (brushing, zooming)
  //at the top level and pass setZoomedState etc to the map
  //so we can do brushing accross multiple components
  const [selectedStuff,setSelectedStuff] = useState();
  const [brushedState,setBrushedState] = useState();

  //load map contours
  //react looks into the '/public' folder by default
  async function fetchMap(){
    fetch('us-states.geojson').then(paths=>{
      paths.json().then(data=>{
        setMap(data);
      })
    })
  }

  async function fetchData() {
    try {
      const data = await d3.csv('Cleaned-Data.csv'); 
      setMyData(data);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }
  

  //fetch the dta 
  useEffect(()=>{
    fetchMap();
    fetchData();
  },[]);

  const handleGenderFilterChange = (selectedGender) => {
    setGenderFilter(selectedGender);
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const handleAgeFilterChange = (selectedAge) => {
    setAgeFilter(selectedAge);
    setRefreshKey((prevKey) => prevKey + 1);
  };

  console.log('all data',myData);
  //tabIndex is needed to put the keypress event on the div
  return (
    <div 
      tabIndex={0}
      className="App" 
      style={{ 'height': '100%', 'width': '100%', 'backgroundColor':'#7c99b6'}}

    >

      <div style={{'maxHeight': '7vh'}}>
        <h1 style={{ color: '#30416b' }}>
          {"Mental Illness Dashboard"}</h1>
      </div>

      {/* Filter Component */}
      <GenderFilter onFilterChange={handleGenderFilterChange} />

      {/* Age Filter Component */}
      <AgeFilter onFilterChange={handleAgeFilterChange} />

      


      <div
        className={'shadow'}
        style={{ 'height': '46vh', 'width': '49%', 'background': 'white', 'maxHeight': '80vh', 'display': 'inline-block', 'margin': '3px' }}
      >
       <div style={{ 'height': '2.5vh', 'width': '100%', 'display': 'flex', 'alignItems': 'center' }}>
          <div style={{'display': 'inline-block', 'width': '20px', 'height': '20px', 'background-color': '#30416b', 'margin-left': '15px'}}></div>
          <span style={{'margin-left': '5px'}}>Employed</span>

          <div style={{'display': 'inline-block', 'width': '20px', 'height': '20px', 'background-color': 'steelblue', 'margin-left': '5px'}}></div>
          <span style={{'margin-left': '5px'}}>Unemployed</span>
        </div>

        <div style={{ 'height': '20.5vh', 'width': '32%', 'display': 'inline-block', margin: '1px' }}>
          <Donut_visual1
              key={refreshKey} data={myData} genderFilter={genderFilter} ageFilter={ageFilter}
            />
        </div>

        <div style={{ 'height': '20.5vh', 'width': '32%','display': 'inline-block', margin: '1px' }}>
          <Donut_visual2
                key={refreshKey} data={myData} genderFilter={genderFilter} ageFilter={ageFilter}
              />
        </div>

        <div style={{ 'height': '20.5vh', 'width': '32%', 'display': 'inline-block', margin: '1px' }}>
          <Donut_visual3
              key={refreshKey} data={myData} genderFilter={genderFilter} ageFilter={ageFilter}
            />
        </div>

        <div style={{ 'height': '20.5vh', 'width': '32%', 'display': 'inline-block', margin: '1px' }}>
          <Donut_visual4
                key={refreshKey} data={myData} genderFilter={genderFilter} ageFilter={ageFilter}
              />
        </div>

        <div style={{ 'height': '20.5vh', 'width': '32%', 'display': 'inline-block', margin: '1px' }}>
          <Donut_visual5
              key={refreshKey} data={myData} genderFilter={genderFilter} ageFilter={ageFilter}
            />
        </div>

        <div style={{ 'height': '20.5vh', 'width': '32%', 'display': 'inline-block', margin: '1px' }}>
          <Donut_visual6
              key={refreshKey} data={myData} genderFilter={genderFilter} ageFilter={ageFilter}
            />
        </div>
      </div>

      <div
        className={'shadow'}
        style={{ 'height': '55vh', 'width': '49%', 'maxHeight': '80vh', 'background': 'white', 'display': 'inline-block', 'margin': '3px' }}
      >
        <Bar_chart
          key={refreshKey} data={myData} genderFilter={genderFilter} ageFilter={ageFilter}
         />
      </div>

      <div
        className={'shadow'}
        style={{ 'height': '45vh', 'width': '32%', 'maxHeight': '80vh', 'display': 'inline-block', 'margin': '3px' }}
      >
        <Line_chart
          key={refreshKey} data={myData} genderFilter={genderFilter} ageFilter={ageFilter}
         />
      </div>

      <div
        className={'shadow'}
        style={{ 'height': '45vh', 'width': '49%', 'maxHeight': '80vh', 'display': 'inline-block', 'margin': '3px' }}
      >
        <Map_visual
          map={map}
          raw_data={myData}
          ToolTip={ToolTip}
          setSelectedStuff={setSelectedStuff}
          brushedState={brushedState}
          setBrushedState={setBrushedState}
        />
      </div>

      <div
        className={'shadow'}
        style={{ 'height': '55vh', 'width': '49%', 'maxHeight': '80vh', 'background': 'white', 'display': 'inline-block', 'margin': '3px' }}
      >
        <Network_visual
          key={refreshKey} raw_data={myData} genderFilter={genderFilter} ageFilter={ageFilter}
         />
      </div>
    </div>
  );
}

class ToolTip {
  static moveTTip(tTip, tipX, tipY){
    var tipBBox = tTip.node().getBoundingClientRect();
    while(tipBBox.width + tipX > window.innerWidth){
        tipX = tipX - 10 ;
    }
    while(tipBBox.height + tipY > window.innerHeight){
        tipY = tipY - 10 ;
    }
    tTip.style('left', tipX + 'px')
        .style('top', tipY + 'px')
        .style('visibility', 'visible')
        .style('z-index', 1000);
  }

  static moveTTipEvent(tTip, event){
      var tipX = event.pageX + 30;
      var tipY = event.pageY -20;
      this.moveTTip(tTip,tipX,tipY);
  }


  static hideTTip(tTip){
      tTip.style('visibility', 'hidden')
  }

  static addTTipCanvas(tTip, className, width, height){
      tTip.selectAll('svg').selectAll('.'+className).remove();
      let canvas = tTip.append('svg').attr('class',className)
          .attr('height',height).attr('width',width)
          .style('background','white');
      return canvas
  }
}

export default App;
