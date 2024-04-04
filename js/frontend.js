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