import './style.css';
import { Map, View } from 'ol';
import GeoJSON from 'ol/format/GeoJSON';
import { Vector as VectorSource } from 'ol/source';
import { Fill, Style, Stroke, Text } from 'ol/style';
import { Vector as VectorLayer } from 'ol/layer';
import foodData from './hopeworld.min.json';
import iso_3166_1_alpha_2_codes from './hopeworld.min.json';
import name from './hopeworld.min.json';

//very bad code
let select = document.querySelector('select');
let textVisible = true;
const highestProdArray = {};
const foodArray = [];
let product;
const countryProductionList = [];




const vectorSource = new VectorSource({
  features: new GeoJSON().readFeatures(foodData, name, iso_3166_1_alpha_2_codes, { dataProjection: "EPSG:4326", featureProjection: "EPSG:3857" }),
  // eslint-disable-next-line no-dupe-keys
  features: new GeoJSON().readFeatures(iso_3166_1_alpha_2_codes, { dataProjection: "EPSG:4326", featureProjection: "EPSG:3857" }),
  // eslint-disable-next-line no-dupe-keys
  features: new GeoJSON().readFeatures(name, { dataProjection: "EPSG:4326", featureProjection: "EPSG:3857" }),

});
foodArray.push(['None']);

Object.keys(foodData.features[0].properties).forEach(key => {
  if (key.indexOf("project_hope") > -1 && key !== 'project_hope_Area' && key !== 'project_hope_Unit' && key !== 'project_hope_Summe Ergebnis') {

    const name = key.split('project_hope_')[1];
    const foodReadableName = key;
    foodArray.push([name, foodReadableName])

  }
});



foodData.features.forEach((feature) => {
  Object.keys(feature.properties).forEach(key => {
    if (key.indexOf("project_hope") > -1 && key !== 'project_hope_Area' && key !== 'project_hope_Unit' && key !== 'project_hope_Summe Ergebnis') {
      const foodRealName = key;

      if (feature.properties[key] > highestProdArray[foodRealName] || highestProdArray[foodRealName] == undefined) {

        highestProdArray[foodRealName] = feature.properties[key]

      }
    }
  });
});


document.getElementById("foodSelectField").onchange = function (event) {
  product = undefined;
  const value = event.target.value
  product = value
  vectorSource.changed(); 
  foodData.features.forEach((feature) => {
    Object.keys(feature.properties).forEach(key => {
      if (key.indexOf("project_hope_Area") > -1) {
        if (feature.properties[key] !== null && feature.properties[product] !== null && feature.properties[product] !== 0) {      
          countryProductionList.push([feature.properties[key], feature.properties[product]])
        }
      }
    });
  });
  
  for (let i = 0; i < countryProductionList.length; i++) {
    const mockTableBody = document.getElementById('mockTableBody')
    const newTr = document.createElement('tr');
    const newTd = document.createElement('td');
    const secondTd = document.createElement('td');
    newTd.appendChild(document.createTextNode(countryProductionList[i][0]));
    secondTd.appendChild(document.createTextNode(countryProductionList[i][1]));
    newTr.appendChild(newTd);
    newTr.appendChild(secondTd);
    mockTableBody.appendChild(newTr);
  }
}

foodArray.map(singleArray => select[singleArray] = select.add(new Option(singleArray[0], singleArray[1])))

document.getElementById("NumbersButton").onclick = function () {
  if (textVisible == true) {
    textVisible = false
  }
  else if (textVisible == false) {
    textVisible = true
  }
  vectorSource.changed();
}

function getTextStyle() {
  return (
    new Text({
      font: '13px Calibri,sans-serif',
      fill: new Fill({
        color: '#000',
      }),
      stroke: new Stroke({
        color: '#fff',
        width: 4,
      }),
    })
  );
}

function getProductStyle(fillColor, labelVisible) {
  return (
    new Style({
      text: labelVisible ? getTextStyle() : null,
      fill: new Fill({
        color: fillColor,
      }),
      stroke: new Stroke({
        color: 'Black',
        width: 1.5
      })
    })
  );
}


//styling
const myStyleFunction = function (feature) {  
  let style;
  const highestValue = highestProdArray[product]
  if (product === undefined || product === null) {
    style = getProductStyle('Grey', false)
  } else if (feature.get(product) == null || feature.get(product) == 0) {
    style = getProductStyle('Grey', null)
  } else if (feature.get(product) < highestValue / 85) {
    style = getProductStyle('rgba(239,243,255,1)', textVisible);
  } else if (feature.get(product) < highestValue / 60) {
    style = getProductStyle('rgba(189,215,231,1)', textVisible)
  } else if (feature.get(product) < highestValue / 40) {
    style = getProductStyle('rgba(107,174,214,1)', textVisible);
  } else if (feature.get(product) < highestValue / 20) {
    style = getProductStyle('rgba(49,130,189,1)', textVisible)
  } else if (feature.get(product) > highestValue / 20) {
    style = getProductStyle('rgba(8,81,156,1)', textVisible)
  } else {
    style = getProductStyle('Grey', false)
  }

  const textStyle = style.getText();
  if (textStyle !== null) {
    textStyle.setText(
      feature.get(product) + " " + feature.get('project_hope_Unit')
    );

  }


  return style;
}

const vectorLayer = new VectorLayer({
  style: myStyleFunction,
  source: vectorSource,
});

const map = new Map({
  layers: [vectorLayer],
  target: 'map',
  view: new View({
    center: [0, 3000000],
    zoom: 2,
  }),
})

document.getElementById("dismiss-popup-btn2").addEventListener("click", function () {
  document.getElementsByClassName("secondPopUp")[0].classList.remove("active");
});

document.getElementById("help").addEventListener("click", function () {
  document.getElementsByClassName("popup")[0].classList.add("active");
});

document.getElementById("dismiss-popup-btn").addEventListener("click", function () {
  document.getElementsByClassName("popup")[0].classList.remove("active");
});

  document.getElementById("contactB").addEventListener("click", function () {
    document.getElementsByClassName("secondPopUp")[0].classList.add("active");
  });

document.getElementById("listButton").addEventListener("click", function () {
  document.getElementsByClassName("listPopUp")[0].classList.add("active");
});

document.getElementById("dismiss-List").addEventListener("click", function () {
  document.getElementsByClassName("listPopUp")[0].classList.remove("active");
});