function avoidCircularStructureInJSON(){
    //@from https://careerkarma.com/blog/converting-circular-structure-to-json/
    const visited = new WeakSet();
    return (key, value) => {
        if (typeof value === "object" && value !== null) {
            if (visited.has(value)) {
                return;
            }
            visited.add(value);
        }
        return value;
    };
}

const Hotlog = function(hotlogServerURL){
    const hotlogURL = hotlogServerURL || 'http://localhost:8090'
    let connected = false;
    let client = null;
    fetch(`${hotlogURL}/api/register`, {
        method: 'POST',
    }).then(async function(response){
        let data = await response.json()
        connected = true
        client = data
        document.body.style.border = `thick solid ${data.color}`
        console.log(`🌭 Hotlog UI name :  %c${data.name}`, `background: ${data.color}; padding:6px;`)
    })

    function send(data){
        if(!connected){
            setTimeout(()=> send(data), 1000)
        }else{
            fetch(`${hotlogURL}/api/logs`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({...data, client: client}, avoidCircularStructureInJSON())
            })
        }

    }
    return {
        log: function(){
            let args = Array.from(arguments);
            const data = {
                date: Date.now(), //timestamp
                log: [...args]
            }
            send(data)
        }
    }
}
export default {
    register: function(hotlogServerURL){
        window.hotlog = new Hotlog(hotlogServerURL)
    }
}
