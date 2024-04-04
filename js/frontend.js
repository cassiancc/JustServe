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