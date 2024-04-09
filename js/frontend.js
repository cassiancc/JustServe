async function newStation() {
    const response = await fetch(`/api/newstation`, 
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: {addStations: 1}
    });

    if (response.ok) {        
        console.log("New station added")
        location.reload()
    }
}
async function rmStation() {
    const response = await fetch(`/api/rmstation`, 
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: {addStations: 1}
    });

    if (response.ok) {        
        console.log("Removed one station.")
        location.reload()
    }
}
let stations;
async function getStations() {
    try {
        const response = await fetch('/api/stations');
        stations = await response.json();
    } catch (error) {
        console.error('Failed to load station data!', error);
    }
}

async function loadCurrentStationContent() {
    await getStations()
    let arrayStations = Object.entries(stations)
    arrayStations.forEach(function(station) {
        let selected = document.querySelector(`#${station[0]} option[value="${station[1]}"]`)
        selected.defaultSelected = true
    })

}
loadCurrentStationContent()

function showNewContentModal(station) {
    console.log(station)

    document.getElementById("new-content-modal").className = "visible-drop";

    document.getElementById("new-content-modal").style.opacity = 0;
    let opacity = parseFloat(document.getElementById("new-content-modal").style.opacity)
    setInterval(function(){
        if (opacity <= 1) {
            opacity += 1
            document.getElementById("new-content-modal").style.opacity = opacity
        }
    }, 15)

    document.getElementById("new-content-modal").innerHTML = station
    
    
    

}