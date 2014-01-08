// Load the Visualization API and the piechart package.
google.load('visualization', '1.0', {'packages':['corechart']});

// Set a callback to run when the Google Visualization API is loaded.
google.setOnLoadCallback(drawVisualization);
var dataTable;
var lineChart;
var dataOptions = {curveType: "function",
                  width: 500, height: 400,
                  vAxis: {maxValue: 10}};
function drawVisualization() {
  // Create and populate the data table.
      dataTable = new google.visualization.DataTable();
      dataTable.addColumn('date', 'Date');
      dataTable.addColumn('number', 'Current (mA.)');
      dataTable.addRows([
        [new Date(), 1]
      ]);

  // Create and draw the visualization.
  lineChart = new google.visualization.LineChart(document.getElementById('chart_div'));
  lineChart.draw(dataTable,dataOptions);
}

function onButtonClick(){
  dataTable.addRows([[new Date(),Math.round(Math.random()*30)]]);
  lineChart.draw(dataTable,dataOptions);
}