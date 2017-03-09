var items = [];

function add(item) {
    items.push(item);
}

function all() {
    return items.slice();
}

function deleteAll(){
    items = [];
}

export default{add, all, deleteAll}