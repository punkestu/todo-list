const fs = require("fs");
const repo = __dirname + "/../repo/dummy.json";

exports.init = function (){
    try{
        fs.readFileSync(repo);
    }catch (e) {
        if(e.code === "ENOENT"){
            fs.writeFileSync(repo, "[]");
        }
    }
}

exports.save = function ({id, head, description, state}) {
    const data = JSON.parse(fs.readFileSync(repo).toString());
    if(id){
        const datum = data.find((datum)=>datum.id === parseInt(id));
        if(datum){
            if(head){
                datum.head = head;
            }
            if(description){
                datum.description = description;
            }
            if(state){
                datum.state = state;
            }
        }
    }else{
        id = data.length > 0 ? data[data.length-1].id + 1 : 1;
        data.push({
            id,head,description,state
        });
    }
    fs.writeFileSync(repo, JSON.stringify(data));
    return true;
}
exports.load = function ({id, state}){
    const data = JSON.parse(fs.readFileSync(__dirname + "/../repo/dummy.json").toString());
    if(!id && !state){
        return data;
    }else if(!id){
        return data.filter((datum)=> datum.state === state);
    }else if(!state){
        return data.filter((datum)=> datum.id === parseInt(id));
    }
}