function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("static/js/samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
        // console.log(selector.text(sample))
        // console.log(selector.property("value", sample))
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("static/js/samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("static/js/samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;

    // create variable that holds the metadata array
    let metadata = data.metadata;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var filteredSample = samples.filter(sampleObj => sampleObj.id == sample)[0];
    console.log(filteredSample);
 
    //  5. Create a variable that holds the first sample in the array.
    // set variable to the first item in the filrtered samples because filter returns an array so we should get back an array with one item, an object, containing the sample information for the sample ID # that was passed to the function. 
    // var returnedSample = filteredSamples[0];
    // console.log(returnedSample)

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = filteredSample.otu_ids
    var otu_labels = filteredSample.otu_labels
    var sample_values = filteredSample.sample_values

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order so the otu_ids with the most bacteria are last. This will put them at the top of the horizontal bar chart.
    var top10BacteriaIDs = otu_ids.slice(0,10).reverse().map(id => "OTC " + id);
    // console.log(top10BacteriaIDs);
    // get top to values
    var top10BacteriaValues = sample_values.slice(0,10).reverse();
    // console.log(top10BacteriaValues);
    // get top 10 labels
    var top10Labels = otu_labels.slice(0,10).reverse();
    // console.log(top10BacteriaValues);
    // set ticks to ID values
    var yticks = top10BacteriaIDs;

    // 8. Create the trace for the bar chart. 
    var barData = [{
        x: top10BacteriaValues,
        y: yticks,
        hovertemplate: '<i>Bacteria Count</i>' +
                        '<br>%{x}<br>' +
                        '%{text}' +
                        '<extra></extra>',
        text: top10Labels,
        type: "bar",
        orientation: 'h'
    }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
        title: "<b>"+"Top 10 Bacteria Cultures Found"+"</b>",
        margin: {pad: 12}
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout)

    // create bubble chart
    // x-axis = otu_ids

    // y-axis = sample_values - marker size based on sample_values

    // otu_ids = marker colors

    // otu_labels = hover-text

    var bubbleData = [{
      x: otu_ids,
      y: sample_values,
      hovertemplate: '(%{x}, %{y})' +
                      '<br>%{text}<br>' +
                      '<extra></extra>',
      text: otu_labels,
      mode: 'markers',
      marker: {size: sample_values,
                color: otu_ids,
              sizeref: 1.2,}
    }];

    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      showlegend: false,
      xaxis: {title: "OTU ID"},
      // height: 600,
      // width: 1000
    };

    Plotly.newPlot("bubble", bubbleData, bubbleLayout)


    // create gauge chart
    // get information from metadata
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample)[0];
    // console.log(resultArray)

    // variable for wash frequency - wfreq
    var washFrequency = parseFloat(resultArray.wfreq);
    // console.log(washFrequency)
    var gaugeData = [{
      value: washFrequency,
      type: "indicator",
      mode: "gauge+number",
      title: {text: "<b>"+"Belly Button Washing Frequency"+"</b>" + "<br>Scrubs Per Week<br>"},
      gauge: {axis: {
        range: [null, 10]},
        bar: {color: "black"},
        steps: [
          {range: [0, 2], color: "red"},
          {range: [2, 4], color: "orange"},
          {range: [4, 6], color: "yellow"},
          {range: [6, 8], color: "lawngreen"},
          {range: [8, 10], color: "green"}
        ]}
    }];

    var gaugeLayout = {
      width: 500,
      height: 400,
      margin: {l: 15, b: 50}
    };

    Plotly.newPlot("gauge", gaugeData, gaugeLayout)
  });
}


