// create function for the demographic info
function demo(sample) {
 
  d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      console.log(metadata);

      // filter demo info by id
      var demoData = metadata.filter(m => m.id.toString() === sample)[0];

      // select panel and empty html
      var demoInfo = d3.select("#sample-metadata");
      demoInfo.html("");

      // grab the data into panel
      Object.entries(demoData).forEach((key) => {   
          demoInfo.append("h6").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
          });
      });
  }


// creat function for the plots
function plots(sample) {
    d3.json("samples.json").then((data) => {
      var sampledata = data.samples;
      console.log(sampledata);

      // filter data by id 
      var otuData = sampledata.filter(m => m.id.toString() === sample)[0];

      // get top 10 otu ids, values and labels
      var otuids =  otuData.otu_ids.slice(0,10).reverse();
      var otuvalues = otuData.sample_values.slice(0,10).reverse();
      var otulabels = otuData.otu_labels.slice(0,10).reverse();
      
      // renew y label
      var otunewids = otuids.map(m => "OTU " + m);

      // create trace, plotdata and layout for bar plot
      var trace = {
        x: otuvalues,
        y: otunewids,
        text: otulabels,
        marker: {
        color: 'light blue'},
        type:"bar",
        orientation: "h",
      };
      
      var plotData = [trace];

      var layout = {
          yaxis:{
              tickmode:"linear",
          },
          margin: {
              l: 100,
              r: 100,
              t: 100,
              b: 100
          }
      };

      // create the bar plot
      Plotly.newPlot("bar", plotData, layout);

      // create trace, plotData and layout for the bubble chart
      var trace1 = {
          x: otuData.otu_ids,
          y: otuData.sample_values,
          mode: "markers",
          marker: {
              size: otuData.sample_values,
              color: otuData.otu_ids
          },
          text: otuData.otu_labels,
          
        };
      
      var plotData1 = [trace1];

      var layout1 = {
        xaxis:{title: "OTU ID"},
        height: 500,
        width: 1200
      }

      // create the bubble plot
      Plotly.newPlot("bubble", plotData1, layout1)
    }    
    )
}


// create the function for the change event
function optionChanged(sample) {
    plots(sample);
    demo(sample);
}
  

// create the init function
function init() {
    
    var dropdown = d3.select("#selDataset");

    d3.json("samples.json").then((data)=> {
        console.log(data)

        data.names.forEach(function(name) {
            dropdown.append("option").text(name).property("value");
        });

        plots(data.names[0]);
        demo(data.names[0]);
    });
}

init();