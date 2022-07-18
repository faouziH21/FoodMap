import './style.css';
import { Feature, Map, View } from 'ol';
import MultiPoint from 'ol/geom/MultiPoint';
import GeoJSON from 'ol/format/GeoJSON';
import { OSM, Vector as VectorSource } from 'ol/source';
import { Fill, Style, Circle as CircleStyle, Stroke, Text } from 'ol/style';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import foodData from './hopeworld.min.json';
import iso_3166_1_alpha_2_codes from './hopeworld.min.json';
import { drawImageOrLabel } from 'ol/render/canvas';
import { containsCoordinate } from 'ol/extent';
import { ELEMENT_ARRAY_BUFFER } from 'ol/webgl';
import { preventDefault } from 'ol/events/Event';
let j, i
let select = document.querySelector('select');
console.log(foodData);

let textVisible = true;
let foodType = select;
let numbersArray = [];
const foodArray = [];
let product;
// for (i = 0; i < foodData; i++) {
//   foodArray[i] = [];
//   for (j = 0; j < foodData; i++) {

//       foodArray[i][j] = null; 
//     }
// }
console.log(numbersArray.length)

Object.keys(foodData.features[0].properties).forEach(key => {
  if (key.indexOf("project_hope") > -1 && key !== 'project_hope_Area' && key !== 'project_hope_Unit' && key !== 'project_hope_Summe Ergebnis') {

    const name = key.split('project_hope_')[1];
    const realName = key;
    foodArray.push([name, realName])
  }
});

// Object.keys(foodData.features[0].properties).forEach(key => {
//   if (key.indexOf("project_hope") > -1 && key !== 'project_hope_Area' && key !== 'project_hope_Unit' && key !== 'project_hope_Summe Ergebnis') {
//     const numbers = feature.get(key)  
//   }
// });


document.getElementById("field").onchange = function (event) {
  numbersArray = [];
  const value = event.target.value
  product = value
  vectorSource.changed();
  console.log(value)
}


foodArray.map(singleArray => select[singleArray] = select.add(new Option(singleArray[0], singleArray[1])))


const vectorSource = new VectorSource({
  features: new GeoJSON().readFeatures(foodData, { dataProjection: "EPSG:4326", featureProjection: "EPSG:3857" }),
  features: new GeoJSON().readFeatures(iso_3166_1_alpha_2_codes, { dataProjection: "EPSG:4326", featureProjection: "EPSG:3857" }),
});

document.getElementById("NumbersButton").onclick = function () {
  if (textVisible == true) {
    textVisible = false
  }
  else if (textVisible == false) {
    textVisible = true
  }
  vectorSource.changed();
}

const textStyle =
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


const myStyleFunction = function (feature, resolution) {
  if (document.getElementById("field").onchange) {
   
    numbersArray.push([feature.get(product)])

    document.getElementById("Test").onclick = function () {

      console.log(numbersArray)
    }
    numbersArray.sort((a, b) => b - a);
  }

  textStyle
    .setText(
      feature.get(product) + " " + feature.get('project_hope_Unit')
    )
  if (feature.get(product) == null || feature.get(product) == 0) {
    {
      return new Style({

        fill: new Fill({

          color: 'grey',

        }),
        stroke: new Stroke({

          color: 'black',
          width: 1.5
        }),

      })
    }
  }
  else if (feature.get(product) < 10000) {

    return new Style({

      text: textVisible ? textStyle : null,

      fill: new Fill({

        color: 'rgba(254,229,217,1)',

      }),
      stroke: new Stroke({

        color: 'black',
        width: 1.5
      })

    })

  }
  else if (feature.get(product) < 50000) {

    return new Style({
      text: textVisible ? textStyle : null,
      fill: new Fill({

        color: 'rgba(252,174,145,1)',

      }),
      stroke: new Stroke({

        color: 'black',
        width: 1.5
      })
    })

  }

  else if (feature.get(product) < 1000000) {

    return new Style({
      text: textVisible ? textStyle : null,
      fill: new Fill({

        color: 'rgba(251,106,74,1)',

      }),
      stroke: new Stroke({

        color: 'black',
        width: 1.5

      })
    })

  }
  else if (feature.get(product) > 1000000) {

    return new Style({
      text: textVisible ? textStyle : null,
      fill: new Fill({

        color: 'rgba(203,24,29,1)',

      }),
      stroke: new Stroke({

        color: 'black',
        width: 1.5
      })

    })

  }
  else {

    return new Style({
      text: textStyle,
      fill: new Fill({

        color: 'rgba(0,112,112,0.5)',

      }),
      stroke: new Stroke({

        color: 'black',

      })

    })
  }
  
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
});