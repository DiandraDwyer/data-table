$(document).ready(function() {
  console.log("ready!");
  var total_male_cauc_nonhisp_drawn;
var total_male_aa_nonhisp_drawn;

  loadData();

    $('#example').DataTable( {
        "ajax": "datatables.json"
    } );
} );

function loadData(){

  $.ajax({
    type: 'GET',
    url: "data.json",
    dataType: "json",
    success: getTotals
});
}


function getTotals(data){

//filters
var male_cauc_nonhisp_drawn = data.filter(function(incident){
  return incident["suspect_gender_male"] !== null && incident["cauc_nonhisp"] !== null && incident["draw_weapon"] == "YES";
});

var male_aa_nonhisp_drawn = data.filter(function(incident){
  return incident["suspect_gender_male"] !== null && incident["aa_nonhisp"] !== null && incident["draw_weapon"] == "YES";
});


var female_aa_nonhisp_drawn = data.filter(function(incident){
  return incident["suspect_gender_female"] !== null && incident["aa_nonhisp"] !== null && incident["draw_weapon"] == "YES";
});

//function to get sum of a column in filtered data
function getSum(filteredData, getSumOf){
  var thisTotal = 0;
  for (i in filteredData){
    thisTotal += parseInt(filteredData[i][getSumOf]);
  }
  return thisTotal;
}

//function to create arrays out of totals
function arrayify(total){
  var arr = [];
  arr.push(total);
  return arr;
}

//get sums of female and male
total_male_cauc_nonhisp_drawn = getSum(male_cauc_nonhisp_drawn, "suspect_gender_male");
total_female_aa_nonhisp_drawn = getSum(female_aa_nonhisp_drawn, "suspect_gender_female");

total_male_aa_nonhisp_drawn = getSum(male_aa_nonhisp_drawn, "suspect_gender_male");

//make totals into arrays for highcharts
total_male_cauc_nonhisp_drawn = arrayify(total_male_cauc_nonhisp_drawn);

total_male_aa_nonhisp_drawn = arrayify(total_male_aa_nonhisp_drawn);

total_female_aa_nonhisp_drawn = arrayify(total_female_aa_nonhisp_drawn);



  var total_drawn_female;
  var total_drawn_male;
  var total_not_drawn_female;
  var total_not_drawn_male;

  for (var i = 0; i < data.length; i++) {

    if (data[i]["draw_weapon"] =="YES") {
      var thisFemaleSuspect = data[i]["suspect_gender_female"];
      var thisMaleSuspect = data[i]["suspect_gender_male"];
       if (thisFemaleSuspect !== null) {
           total_drawn_female += thisFemaleSuspect;
             }
       if (thisMaleSuspect !== null) {
           total_drawn_male +=  thisMaleSuspect;

             }

  }

   if (data[i]["draw_weapon"] =="NO") {
      var thisFemaleSuspect = data[i]["suspect_gender_female"];
      var thisMaleSuspect = data[i]["suspect_gender_male"];
       if (thisFemaleSuspect !== null) {
           total_not_drawn_female += thisFemaleSuspect;
             }
       if (thisMaleSuspect !== null) {
           total_not_drawn_female +=  thisMaleSuspect;
             }

  }



    }

  buildCharts();
   //dataLen = data.length,
  }
  //do a loop through data and push to your arrays.
  //for (i = 0; i < dataLen; i += 1) {
  //
  //  // add browser data
  //  browserData.push({
  //      name: categories[i],
  //      y: data[i].y,
  //      color: data[i].color
  //  });

    menBar = [0,2];
  womenBar = [2,5];

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
        data: total_male_cauc_nonhisp_drawn
    }, {
        name: 'African-American Non-Hispanic',
        data: total_male_aa_nonhisp_drawn
    },
    ]
    
    
    
    
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