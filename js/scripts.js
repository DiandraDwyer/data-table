var menA = [];
var womenA = [];
var data = "";

$(document).ready(function() {
  console.log("ready!");
  
  loadData();
  
    $('#example').DataTable( {
        "ajax": 'data.json'
    } );
} );

function loadData(){
  
  //$.ajax{
  //  
  //}

  parseData(data);
}


function parseData(data){
  
  
  //do a loop through data and push to your arrays.
    menA = [0,2];
  womenA = [2,5];
  
  buildCharts();
  
}


//function hideTable() {
//    var x = document.getElementById("myDIV");
//    if (x.style.display === "none") {
//        x.style.display = "block";
//   } else {
//        x.style.display = "none";

//Chart 1

function buildCharts(){
  

Highcharts.chart('container', {
    chart: {
        type: 'bar'
    },
    title: {
        text: 'All Suspects Who Had Weapons Drawn on Them'
    },
    xAxis: {
        categories: ['Men', 'Women']
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Times a Weapon was Drawn'
        }
    },
    legend: {
        reversed: true
    },
    plotOptions: {
        series: {
            stacking: 'normal'
        }
    },
    series: [{
        name: 'Caucasian Non-Hispanic',
        data: menA
    }, {
        name: 'African-American Non-Hispanic',
        data: womenA
    }]
});

//Chart 2

var colors = Highcharts.getOptions().colors,
    categories = ['Weapons Drawn', 'Weapons Not Drawn'],
     data = [{
        y: 48.00,
        color: colors[0],
        drilldown: {
            name: 'version',
            categories: ['Normal', 'Intoxicated', 'Mentally Disturbed', 'Unknown'],
            data: [0.67, 0.27, 0.067, 0.067],
            color: colors[0]
        }
    }, {
        y: 52.00,
        color: colors[1],
        drilldown: {
            name: 'version',
            categories: ['Normal', 'Intoxicated', 'Mentally Disturbed', 'Unknown'],
            data: [0.25, 0.5, 0.19, 0.06],
            color: colors[1]
        }
    },
    ],
    browserData = [],
    versionsData = [],
    i,
    j,
    dataLen = data.length,
    drillDataLen,
    brightness;


// Build the data arrays
for (i = 0; i < dataLen; i += 1) {

    // add browser data
    browserData.push({
        name: categories[i],
        y: data[i].y,
        color: data[i].color
    });

    // add version data
    drillDataLen = data[i].drilldown.data.length;
    for (j = 0; j < drillDataLen; j += 1) {
        brightness = 0.2 - (j / drillDataLen) / 5;
        versionsData.push({
            name: data[i].drilldown.categories[j],
            y: data[i].drilldown.data[j],
            color: Highcharts.Color(data[i].color).brighten(brightness).get()
        });
    }
}

// Create the chart
Highcharts.chart('container2', {
    chart: {
        type: 'pie'
    },
    title: {
        text: 'Condition of All Male Suspects'
    },
    subtitle: {
        text: 'Source: <a href="http://netmarketshare.com/">data.gov</a>'
    },
    yAxis: {
        title: {
            text: 'Total percent market share'
        }
    },
    plotOptions: {
        pie: {
            shadow: false,
            center: ['50%', '50%']
        }
    },
    tooltip: {
        valueSuffix: '%'
    },
    series: [{
        name: 'Browsers',
        data: browserData,
        size: '60%',
        dataLabels: {
            formatter: function () {
                return this.y > 5 ? this.point.name : null;
            },
            color: '#ffffff',
            distance: -30
        }
    }, {
        name: 'Versions',
        data: versionsData,
        size: '80%',
        innerSize: '60%',
        dataLabels: {
            formatter: function () {
                // display only if larger than 1
                return this.y > 1 ? '<b>' + this.point.name + ':</b> ' +
                    this.y + '%' : null;
            }
        },
        id: 'versions'
    }],
    responsive: {
        rules: [{
            condition: {
                maxWidth: 400
            },
            chartOptions: {
                series: [{
                    id: 'versions',
                    dataLabels: {
                        enabled: false
                    }
                }]
            }
        }]
    }
});

}