var NameArray = [];

async function ReadTextFile() {
    NameArray = await AsyncTextReader();
    GetTaggedAxies();
}

function AsyncTextReader() {
    return new Promise(function (resolve, reject) {
        var objXMLhttp = new XMLHttpRequest()
        objXMLhttp.open("GET", './Textfiles/Profile_Loom_Eth_Addresses.txt', true);
        objXMLhttp.send();
        objXMLhttp.onreadystatechange = function(){
        if (objXMLhttp.readyState == 4){
          if(objXMLhttp.status == 200) {
            var TestParse = objXMLhttp.responseText;
            TestParse = JSON.parse(TestParse);
            return resolve(TestParse);
          } else {
            return resolve("error");
          }
        }
      }
    });
}

async function GetTaggedAxies() {

  var TaggedArray = [];

  var url = "https://axieinfinity.com/graphql-server/graphql"

  await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    
    body: JSON.stringify({
      operationName:"GetAxieBriefList",
      variables:{
        "from":0,
        "size":6400,
        "sort":"IdAsc",
        "auctionType":"All",
        "owner":null,
        "region":null,
        "criteria":{
            "parts":null,
            "bodyShapes":null,
            "classes":null,
            "stages":null,
            "numMystic":null,
            "pureness":null,
            "title":["Origin","MEO Corp","MEO Corp II"],
            "breedable":null,
            "breedCount":null,
            "hp":[],"skill":[],"speed":[],"morale":[]
        }
      },
      query:"query GetAxieBriefList($auctionType: AxieAuctionType, $region: String, $criteria: AxieCriteria, $from: Int, $sort: SortBy, $size: Int, $owner: String) {\n  axies(auctionType: $auctionType, region: $region, criteria: $criteria, from: $from, sort: $sort, size: $size, owner: $owner) {\n    total\n    results {\n      ...AxieBrief\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment AxieBrief on Axie {\n  owner\n  class\n  title\n  __typename\n}\n"})
  })
    
  .then(function(response) { 
    return response.json(); 
  })

  .then(function(data) {
    TaggedArray = data;
    console.log(TaggedArray);
    ArrayConverter(TaggedArray);
  });
}

function ArrayConverter(Array) {

    Array.data.axies.results.sort((a,b) => b.owner - a.owner);

    var NonNestedTaggedArray = [];
    var UniqueOwnerArray = [];

    var RareClass = 0;
    var RareClassOrigin = 0;
    var Origin = 0;
    var RareClassMeo = 0;
    var Meo = 0;
    var RareClassMeoII = 0;
    var MeoII = 0;



    for(i = 0; i < Array.data.axies.results.length; i++) {
        Origin = 0;
        Meo = 0;
        MeoII = 0;
        RareClassOrigin = 0;
        RareClassMeo = 0;
        RareClassMeoII = 0;
        if(Array.data.axies.results[i].title == "Origin") {
            Origin = 1;
        } else if (Array.data.axies.results[i].title == "MEO") {
            Meo = 1;
        } else if (Array.data.axies.results[i].title == "MEO II") {
            MeoII = 1;
        }
        if(Array.data.axies.results[i].class == "Reptile" || Array.data.axies.results[i].class == "Bug" || Array.data.axies.results[i].class == "Bird") {
        RareClass = 1;
        } else {
        RareClass = 0;
        }
        if(RareClass == 1 && Origin == 1) {
            RareClassOrigin = 1;
        } else if(RareClass == 1 && Meo == 1) {
            RareClassMeo = 1;
        } else if(RareClass == 1 && MeoII == 1) {
            RareClassMeoII = 1;
        }
        NonNestedTaggedArray.push({EthOwner : Array.data.axies.results[i].owner, Origins : Origin, RareOrigins : RareClassOrigin, MEOs : Meo, RareMEOs : RareClassMeo, MEOIIs : MeoII, RareMEOIIs : RareClassMeoII});
    }

    for(i = 0; i < NonNestedTaggedArray.length; i++) {
        if(i > 0) {
        if(NonNestedTaggedArray[i].EthOwner == UniqueOwnerArray[UniqueOwnerArray.length-1].EthOwner) {
            UniqueOwnerArray[UniqueOwnerArray.length-1].Origins = UniqueOwnerArray[UniqueOwnerArray.length-1].Origins + NonNestedTaggedArray[i].Origins;
            UniqueOwnerArray[UniqueOwnerArray.length-1].RareOrigins = UniqueOwnerArray[UniqueOwnerArray.length-1].RareOrigins + NonNestedTaggedArray[i].RareOrigins;
            UniqueOwnerArray[UniqueOwnerArray.length-1].MEOs = UniqueOwnerArray[UniqueOwnerArray.length-1].MEOs + NonNestedTaggedArray[i].MEOs;
            UniqueOwnerArray[UniqueOwnerArray.length-1].RareMEOs = UniqueOwnerArray[UniqueOwnerArray.length-1].RareMEOs + NonNestedTaggedArray[i].RareMEOs;
            UniqueOwnerArray[UniqueOwnerArray.length-1].MEOIIs = UniqueOwnerArray[UniqueOwnerArray.length-1].MEOIIs + NonNestedTaggedArray[i].MEOIIs;
            UniqueOwnerArray[UniqueOwnerArray.length-1].RareMEOIIs = UniqueOwnerArray[UniqueOwnerArray.length-1].RareMEOIIs + NonNestedTaggedArray[i].RareMEOIIs;
        } else {
            UniqueOwnerArray.push({EthOwner : NonNestedTaggedArray[i].EthOwner, Origins : NonNestedTaggedArray[i].Origins, RareOrigins : NonNestedTaggedArray[i].RareOrigins, MEOs : NonNestedTaggedArray[i].MEOs, RareMEOs : NonNestedTaggedArray[i].RareMEOs, MEOIIs : NonNestedTaggedArray[i].MEOIIs, RareMEOIIs : NonNestedTaggedArray[i].RareMEOIIs});
        }
        } else {
        UniqueOwnerArray.push({EthOwner : NonNestedTaggedArray[i].EthOwner, Origins : NonNestedTaggedArray[i].Origins, RareOrigins : NonNestedTaggedArray[i].RareOrigins, MEOs : NonNestedTaggedArray[i].MEOs, RareMEOs : NonNestedTaggedArray[i].RareMEOs, MEOIIs : NonNestedTaggedArray[i].MEOIIs, RareMEOIIs : NonNestedTaggedArray[i].RareMEOIIs});
        }
    }
    console.log(UniqueOwnerArray);
    ProfileNamer(UniqueOwnerArray);
}


async function ProfileNamer(Array) {
  
    var url = "https://axieinfinity.com/graphql-server/graphql"
        
        for(z=0; Array.length > z; z++) {
        var ethAddy = Array[z].EthOwner;
        var FetchChecker = "NEIN";
        FetchChecker = "NEIN";
        
        for(n=0; NameArray.length > n; n++) {
            if(NameArray[n].Eth == Array[z].EthOwner) {
            Array[z].EthOwner = NameArray[n].Besitzer;
            FetchChecker = "JA";
            break;
            }
        }
        
        if(FetchChecker == "NEIN") {
            await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            
            body: JSON.stringify({
                operationName:"GetProfileNameByEthAddress",
                variables:{
                ethereumAddress:ethAddy
                },
                query:"query GetProfileNameByEthAddress($ethereumAddress: String!) {\n  publicProfileWithEthereumAddress(ethereumAddress: $ethereumAddress) {\n    name\n    __typename\n  }\n}\n"})
            })
            
            .then(function(response) { 
            return response.json(); 
            })
        
            .then(function(data) {
            var realName = "";
            try {
                realName = data.data.publicProfileWithEthereumAddress.name;
            }
            catch {
                realName = "No User Name";
            }
            Array[z].EthOwner = realName;
            });
        }
        
        }
    console.log(Array);
    ListMaker(Array);
}

function ListMaker(Array) {

    var TotalList = Array;
    var OriginList = [];
    var RareOriginList = [];
    var MEOList = [];
    var RareMEOList = [];
    var MEOIIList = [];
    var RareMEOIIList = [];

    var RareMysticList = [];

    //Array Key is called Origins every time because of the chartmaker function !!!
    for(i = 0; i < Array.length; i++) {
        if(Array[i].Origins != 0) {
            OriginList.push({EthOwner : Array[i].EthOwner, Origins : Array[i].Origins});
        }
        if(Array[i].RareOrigins != 0) {
            RareOriginList.push({EthOwner : Array[i].EthOwner, Origins : Array[i].RareOrigins});
        }
        if(Array[i].MEOs != 0) {
            MEOList.push({EthOwner : Array[i].EthOwner, Origins : Array[i].MEOs});
        }
        if(Array[i].RareMEOs != 0) {
            RareMEOList.push({EthOwner : Array[i].EthOwner, Origins : Array[i].RareMEOs});
        }
        if(Array[i].MEOIIs != 0) {
            MEOIIList.push({EthOwner : Array[i].EthOwner, Origins : Array[i].MEOIIs});
        }
        if(Array[i].RareMEOIIs != 0) {
            RareMEOIIList.push({EthOwner : Array[i].EthOwner, Origins : Array[i].RareMEOIIs});
        }
    }

    OriginList.sort((a,b) => b.Origins - a.Origins);
    RareOriginList.sort((a,b) => b.Origins - a.Origins);
    MEOList.sort((a,b) => b.Origins - a.Origins);
    RareMEOList.sort((a,b) => b.Origins - a.Origins);
    MEOIIList.sort((a,b) => b.Origins - a.Origins);
    RareMEOIIList.sort((a,b) => b.Origins - a.Origins);

    document.getElementById("OList").innerHTML = '<ol class="LL">' + OriginList.map(function (genesis) {
        return '<li>' + String(genesis["Origins"]) + " Origins owned by " + String(genesis["EthOwner"]) + '</li>';
    }).join('') + '</ol>';

    document.getElementById("MIList").innerHTML = '<ol class="LL">' + MEOList.map(function (genesis) {
        return '<li>' + String(genesis["Origins"]) + " MEO I's owned by " + String(genesis["EthOwner"]) + '</li>';
    }).join('') + '</ol>';

    document.getElementById("MIIList").innerHTML = '<ol class="LL">' + MEOIIList.map(function (genesis) {
        return '<li>' + String(genesis["Origins"]) + " MEO II's owned by " + String(genesis["EthOwner"]) + '</li>';
    }).join('') + '</ol>';

    document.getElementById("ROList").innerHTML = '<ol class="LL">' + RareOriginList.map(function (genesis) {
        return '<li>' + String(genesis["Origins"]) + " Rare Origins owned by " + String(genesis["EthOwner"]) + '</li>';
    }).join('') + '</ol>';

    document.getElementById("RMIList").innerHTML = '<ol class="LL">' + RareMEOList.map(function (genesis) {
        return '<li>' + String(genesis["Origins"]) + " Rare MEO I's owned by " + String(genesis["EthOwner"]) + '</li>';
    }).join('') + '</ol>';

    document.getElementById("RMIIList").innerHTML = '<ol class="LL">' + RareMEOIIList.map(function (genesis) {
        return '<li>' + String(genesis["Origins"]) + " Rare MEO II'S owned by " + String(genesis["EthOwner"]) + '</li>';
    }).join('') + '</ol>';

    ChartMaker(OriginList, "OChart");
    ChartMaker(MEOList, "MIChart");
    ChartMaker(MEOIIList, "MIIChart");
    ChartMaker(RareOriginList, "ROChart");
    ChartMaker(RareMEOList, "RMIChart");
    ChartMaker(RareMEOIIList, "RMIIChart");
}

function ChartMaker(Array, WhichChart) {

  var RestMenge = 0;
  for(i=9; Array.length > i; i++) {
    RestMenge = RestMenge + Array[i].Origins;
  }

  var GesamtMenge = 0;
  for(i=0; Array.length > i; i++) {
    GesamtMenge = GesamtMenge + Array[i].Origins;
  }

  var ctx = document.getElementById(WhichChart);

  var LandMenge = [Array[0].Origins, Array[1].Origins, Array[2].Origins, Array[3].Origins, Array[4].Origins, Array[5].Origins, Array[6].Origins, Array[7].Origins, Array[8].Origins, RestMenge];
  var LandBesitzer = [Array[0].EthOwner, Array[1].EthOwner, Array[2].EthOwner, Array[3].EthOwner, Array[4].EthOwner, Array[5].EthOwner, Array[6].EthOwner, Array[7].EthOwner, Array[8].EthOwner, "All other Players"];

  var myChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: LandBesitzer,
      datasets: [{
          label: 'Axie Land',
          data: LandMenge,
          backgroundColor: [
            'rgba(0,104,55, 0.25)',
            'rgba(165,0,38, 0.25)',
            'rgba(26,152,80, 0.25)',
            'rgba(215,48,39, 0.25)',
            'rgba(102,189,99, 0.25)',
            'rgba(244,109,67, 0.25)',
            'rgba(166,217,106, 0.25)',
            'rgba(253,174,97, 0.25)',
            'rgba(217,239,139, 0.25)',
            'rgba(254,224,139, 0.25)'
          ],
          borderColor: [
            'rgba(0,104,55, 1)',
            'rgba(165,0,38, 1)',
            'rgba(26,152,80, 1)',
            'rgba(215,48,39, 1)',
            'rgba(102,189,99, 1)',
            'rgba(244,109,67, 1)',
            'rgba(166,217,106, 1)',
            'rgba(253,174,97, 1)',
            'rgba(217,239,139, 1)',
            'rgba(254,224,139, 1)'
          ],
        borderWidth: 1
      }]
    },
    options: {
      tooltips: {
        displayColors: false,
        callbacks: {
          afterLabel: function(tooltipItem, data) {
            var dataset = data['datasets'][0];
            var percent = Math.round((dataset['data'][tooltipItem['index']] / GesamtMenge) * 100)
            return '(' + percent + '%)';
          }
        },
      },
      responsive: false,
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          fontColor: '#FFFFFF',
          boxWidth: 15,
          fontSize: 13
        }
      }
    }
  })
  var L = document.getElementById("lds-hourglass");
  L.style.display = "none";
}

function ScrollDownTOP() {
    var elmnt = document.getElementById("ScrollButtonBOTTOM");
    elmnt.scrollIntoView({behavior: "smooth"}); 
}

function ScrollDownBOTTOM() {
    var elmnt = document.getElementById("ScrollButtonTOP");
    elmnt.scrollIntoView({behavior: "smooth"}); 
}