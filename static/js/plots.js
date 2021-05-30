

function init() {
    // select dropdown menu
    var selector = d3.select("#selDataset");
  
    // load the json data -> log the data
    d3.json("samples.json").then((data) => {
      console.log(data);

      // access names array from data object - names contains index and ID numebrs. [0: 123, 1: 456]
      var sampleNames = data.names;

      // loop through the names array using forEach
      sampleNames.forEach((sample) => {

        // apply function to all elements in the names array
        // selector = d3.select("#selDataset") - which is a drop down menu - so we are appending the text value from each element in the array to the drop down menu as an option. We also add the css selector value=
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  })}

// define optionChanged function
// function called in HTML - not call requirement in the .js file. newSample = this.value in HTML selDataset (dropdown menu)
function optionChanged(newSample) {
    // console.log(newSample);
    buildMetadata(newSample);
    buildCharts(newSample);
}

// define buildMetadata function
function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata

        // filter the metadata for only the value that matches the sample ID (selected from the dropdown menu)
        var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        
        // set the data that is returned to a variable which accesses the first value of the result array (thought this returned an object? so the whole object would be returned?) ANSWER - filter returns an array so you are basically getting back an array with one object in it location [0]

        // filter returns.... [{}]....
        // [{age: 49
        // bbtype: "I"
        // ethnicity: "Caucasian"
        // gender: "F"
        // id: 943
        // location: "Omaha/NE"
        // wfreq: 1}]

        var result = resultArray[0];

        // select the panel HTML element using d3.select
        var PANEL = d3.select("#sample-metadata");

        // clear the contents of the panel element if there are any
        PANEL.html("");

        // add a new header with the location datapoint from the filtered sample data object 
        // edit this with Object.entries and forEach to append all of the demographic information to the panel element
        Object.entries(result).forEach(([key, value]) =>
        PANEL.append("h6").text(`${key}.toUppperCase(): ${value}`));
    });
}


// define buildCharts function

  init();