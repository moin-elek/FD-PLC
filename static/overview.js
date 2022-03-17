const source = new EventSource("/chart-data");

const array = [];

source.onmessage = function(event) {
    const sentData = JSON.parse(event.data);
    array.push(sentData);

    flowrateSP.push(sentData.flowrateSP);
    flowrate.push(sentData.flowrate);
    pressure1.push(sentData.pressure1);
    pressure2.push(sentData.pressure2);
    humiditySP.push(sentData.humiditySP);
    humidity.push(sentData.humidity);

    flowrateSPData.push(sentData.flowrateSP);
    flowrateData.push(sentData.flowrate);
    pressure1Data.push(sentData.pressure1);
    pressure2Data.push(sentData.pressure2);
    humiditySPData.push(sentData.humiditySP);
    humidityData.push(sentData.humidity);

};

console.log(array);

exportToCsv = function () {
    var data = array;
        if(data == '')
            return;
        
        JSONToCSVConvertor(data, "Vehicle Report", true);
}

function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
    
    var CSV = 'sep=,' + '\r\n\n';

    //This condition will generate the Label/Header
    if (ShowLabel) {
        var row = "";
        
        //This loop will extract the label from 1st index of on array
        for (var index in arrData[0]) {
            
            //Now convert each value to string and comma-seprated
            row += index + ',';
        }

        row = row.slice(0, -1);
        
        //append Label row with line break
        CSV += row + '\r\n';
    }
    
    //1st loop is to extract each row
    for (var i = 0; i < arrData.length; i++) {
        var row = "";
        
        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
            row += '"' + arrData[i][index] + '",';
        }

        row.slice(0, row.length - 1);
        
        //add a line break after each row
        CSV += row + '\r\n';
    }

    if (CSV == '') {        
        alert("Invalid data");
        return;
    }   
    
    //Generate a file name
    var fileName = "MyReport_";
    //this will remove the blank-spaces from the title and replace it with an underscore
    fileName += ReportTitle.replace(/ /g,"_");   
    
    //Initialize file format you want csv or xls
    var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
    
    // Now the little tricky part.
    // you can use either>> window.open(uri);
    // but this will not work in some browsers
    // or you will not get the correct file extension    
    
    //this trick will generate a temp <a /> tag
    var link = document.createElement("a");    
    link.href = uri;
    
    //set the visibility hidden so it will not effect on your web-layout
    link.style = "visibility:hidden";
    link.download = fileName + ".csv";
    
    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

const flowrateSP = [];
const flowrate = [];
const pressure1 = [];
const pressure2 = [];
const humiditySP = [];
const humidity = [];

let flowrateSPData = [];
let flowrateData = [];
let pressure1Data = [];
let pressure2Data = [];
let humiditySPData = [];
let humidityData = [];



let intervalID; 

function displayData() {
  intervalID = setInterval(dataPull, 1500);
};

function dataPull() {
  const flowrateSPSplice = flowrateSPData.splice(-1)[0];
  const flowrateSPShort = Number.parseFloat(flowrateSPSplice).toPrecision(3)

  const flowrateSplice = flowrateData.splice(-1)[0];
  const flowrateShort = Number.parseFloat(flowrateSplice).toPrecision(3)

  const pressure1Splice = pressure1Data.splice(-1)[0];
  const pressure1Short = Number.parseFloat(pressure1Splice).toPrecision(3)

  const pressure2Splice = pressure2Data.splice(-1)[0];
  const pressure2Short = Number.parseFloat(pressure2Splice).toPrecision(3)

  const humiditySPSplice = humiditySPData.splice(-1)[0];
  const humiditySPShort = Number.parseFloat(humiditySPSplice).toPrecision(3)

  const humiditySplice = humidityData.splice(-1)[0];
  const humidityShort = Number.parseFloat(humiditySplice).toPrecision(3)

  


  document.getElementById('flowrateSP').innerHTML = flowrateSPShort;
  document.getElementById('flowrate').innerHTML = flowrateShort;
  document.getElementById('pressure1').innerHTML = pressure1Short;
  document.getElementById('pressure2').innerHTML = pressure2Short;
  document.getElementById('humiditySP').innerHTML = humiditySPShort;
  document.getElementById('humidity').innerHTML = humidityShort;

};

displayData();

function flowrateRefresh(chart) {
    var now = Date.now();
    chart.data.datasets[0].data.push({
        x: now,
        y: flowrateSP.splice(-1)[0]
    })
    chart.data.datasets[1].data.push({
        x: now,
        y:flowrate.splice(-1)[0]
    })
};


function pressureRefresh(chart) {
    var now = Date.now();
    chart.data.datasets[0].data.push({
        x: now,
        y: pressure1.splice(-1)[0]
    });
    chart.data.datasets[1].data.push({
        x: now,
        y: pressure2.splice(-1)[0]
    })
};


function humidityRefresh(chart) {
    var now = Date.now();
    chart.data.datasets[0].data.push({
        x: now,
        y: humiditySP.splice(-1)[0]
    })
    chart.data.datasets[1].data.push({
        x: now,
        y:humidity.splice(-1)[0]
    })
};



var color = Chart.helpers.color;

var flowrateConfig = {
    type: 'line',
    data: {
        datasets: [{
            label: 'setpoint Flowrate',
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            borderDash: [5,5],
            fill: false,
            data: []
        },{
        label: 'Air Flowrate ',
        backgroundColor: 'rgb(0,89,255)',
        borderColor: 'rgb(0,89,255)',
        fill: false,
        data: []
        }]
    },
    options: {
        responsive: true,
        spanGaps: true,
        maintainAspectRation: false, 
        elements: {
            point: {
                radius: 0
            }
        }, 
        scales: {
        x: {
            type: 'realtime',
            realtime: {
            duration: 300000,
            refresh: 1500,
            delay: 1000,
            onRefresh: flowrateRefresh 
            }
        },
        y: {
            title: {
            display: true,
            text: 'SLPM'
            }
        }
        },
        interaction: {
        intersect: false
        },
        plugins: {
        title: {
            display: false,
            text: 'Line chart (hotizontal scroll) sample'
        }
        }
    }
};


var pressureConfig = {
    type: 'line',
    data: {
        datasets: [{
        label: 'External Pressure ',
        backgroundColor: 'rgb(0,89,255)',
        borderColor: 'rgb(0,89,255)',
        fill: false,
        data: [],
        },
        {
        label: 'System Pressure',
        backgroundColor: 'rgb(39,45,56)',
        borderColor: 'rgb(39,45,56)',
        fill: false,
        data: [],   
        }]
    },
    options: {
        responsive: true,
        spanGaps: true,
        maintainAspectRation: false, 
        elements: {
            point: {
                radius: 0
            }
        }, 
        scales: {
        x: {
            type: 'realtime',
            realtime: {
            duration: 300000,
            refresh: 1500,
            delay: 1000,
            onRefresh: pressureRefresh 
            }
        },
        y: {
            title: {
            display: true,
            text: 'PSI'
            },
            ticks: {
                stepSize: 0.1
            }
        }
        },
        interaction: {
        intersect: false
        },
        plugins: {
        title: {
            display: false,
            text: 'Line chart (hotizontal scroll) sample'
        }
        }
    }
 };

var humidityConfig = {
    type: 'line',
    data: {
        datasets: [{
        label: 'setpoint humidity',
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132)',
        borderDash: [5,5],
        fill: false,
        data: []
        },
        {
            label: 'humidity',
            backgroundColor: 'rgb(0,89,255)',
            borderColor: 'rgb(0,89,255)',
            fill: false,
            data: []
        }]
    },
    options: {
        responsive: true,
        spanGaps: true,
        maintainAspectRation: false, 
        elements: {
            point: {
                radius: 0
            }
        }, 
        scales: {
        x: {
            type: 'realtime',
            realtime: {
            duration: 300000,
            refresh: 1500,
            delay: 1000,
            onRefresh: humidityRefresh 
            }
        },
        y: {
            title: {
            display: true,
            text: '% RH'
            }
        }
        },
        interaction: {
        intersect: false
        },
        plugins: {
        title: {
            display: false,
            text: 'Line chart (hotizontal scroll) sample'
        }
        }
    }
};


  
window.onload = function() {
    var flowratectx = document.getElementById('flowrateChart').getContext('2d');
    flowratectx.canvas.height = 60;
    window.flowrateChart = new Chart(flowratectx, flowrateConfig);

    var pressurectx = document.getElementById('pressureChart').getContext('2d');
    pressurectx.canvas.height = 60;
    window.pressureChart = new Chart(pressurectx, pressureConfig);

    var humidityctx = document.getElementById('humidityChart').getContext('2d');
    humidityctx.canvas.height = 60;
    window.humidityChart = new Chart(humidityctx, humidityConfig);

   
};