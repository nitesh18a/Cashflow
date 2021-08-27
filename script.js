
class BinaryHeap {

    constructor() {
        this.heap = [];
    }

    insert(value) {
        // console.log(value);
        this.heap.push(value);
        this.bubbleUp();
    }

    size() {
        return this.heap.length;
    }

    empty(){
        return ( this.size()===0 );
    }

    //using iterative approach
    bubbleUp() {
        let index = this.size() - 1;

        while (index > 0) {
            let element = this.heap[index],
                parentIndex = Math.floor((index - 1) / 2),
                parent = this.heap[parentIndex];

            if (parent[0] >= element[0]) break;
            this.heap[index] = parent;
            this.heap[parentIndex] = element;
            index = parentIndex
        }
    }

    extractMax() {
        const max = this.heap[0];
        const tmp = this.heap.pop();
        if(!this.empty()) {
            this.heap[0] = tmp;
            this.sinkDown(0);
        }
        return max;
    }

    sinkDown(index) {

        let left = 2 * index + 1,
            right = 2 * index + 2,
            largest = index;
        const length = this.size();

        // console.log(this.heap[left], left, length, this.heap[right], right, length, this.heap[largest]);

        if (left < length && this.heap[left][0] > this.heap[largest][0]) {
            largest = left
        }
        if (right < length && this.heap[right][0] > this.heap[largest][0]) {
            largest = right
        }
        // swap
        if (largest !== index) {
            let tmp = this.heap[largest];
            this.heap[largest] = this.heap[index];
            this.heap[index] = tmp;
            this.sinkDown(largest)
        }
    }
}

onload = function () {
    // create a network
    let curr_data;
    const container = document.getElementById('mynetwork');
    const container2 = document.getElementById('mynetwork2');
    const genNew = document.getElementById('generate-graph');
    const solve = document.getElementById('solve');
    const temptext = document.getElementById('temptext');
    // initialise graph options
    const options = {
        edges: {
            arrows: {
                to: true
            },
            labelHighlightBold: true,
            font: {
                size: 20
            }
        },
        nodes: {
            font: '12px arial red',
            scaling: {
                label: true
            },
            shape: 'icon',
            icon: {
                face: 'FontAwesome',
                code: '\uf183',
                size: 50,
                color: '#991133',
            }
        }
    };
    // initialize your network!
    let network = new vis.Network(container);
    network.setOptions(options);
    let network2 = new vis.Network(container2);
    network2.setOptions(options);

//creating the data

    var edges = [];
       

    const add_data = document.getElementById('add');
    add_data.onclick = function () {
            const data = createData();
            curr_data = data;
            network.setData(data);
        //getting new fields
        var div = document.getElementById("datas");
        var input1 = document.createElement("input");
        var input2 = document.createElement("input");
        var newlabel1 = document.createElement("label");
        var newlabel2 = document.createElement("label");
        var input3 = document.createElement("input");
        var newlabel3 = document.createElement("label");
        var btn = document.createElement("span");
        btn.classList.add('btn', 'btn-warning','m-2');
        btn.innerHTML = "addit";
        input1.type = "text";
        input2.type = "text";
        input3.type = "Number";
        newlabel1.innerHTML = "From";
        newlabel2.innerHTML = "To";
        newlabel3.innerHTML = "Amount";
        div.appendChild(newlabel1);
        div.appendChild(input1);
        div.appendChild(newlabel2);
        div.appendChild(input2);
        div.appendChild(newlabel3);
        div.appendChild(input3);
        div.appendChild(btn);
        div.appendChild(document.createElement("br"));
        
        //getting graph with currecnt values
        btn.onclick = function(){
            var f =true;
            for(let i=0;i<edges.length;i++){
                if(edges[i].from == input1.value && edges[i].to == input2.value){
                    f = false;
                    edges[i].label = String(parseInt(edges[i].label) +parseInt(input3.value) );
                }
            }
            if(f==true) edges.push({from: input1.value, to: input2.value, label: String(input3.value)});
            const data = createData();
            curr_data = data;
            network.setData(data);
        }
    }
    function createData(){
        const ppls = document.getElementById('ppls');
        const sz = ppls.value;
        let nodes = [];
        for(let i=1;i<=sz;i++){
            nodes.push({id:i, label:"Person "+i})
        }
        nodes = new vis.DataSet(nodes);
        const data = {
            nodes: nodes,
            edges: edges
        };
        return data;
    }
    //removing data while creating new problem
    function removedata(){
        var div = document.getElementById("datas");
        while (div.hasChildNodes()) {  
          div.removeChild(div.firstChild);
        }
        const ppls = document.getElementById('ppls');
        ppls.value = "";
    }
    genNew.onclick = function () {
        edges = [];
        nodes = [];
        removedata();
        const data = createData();
        curr_data = data;
        network.setData(data);
        temptext.style.display = "inline";
        container2.style.display = "none";
    };

    solve.onclick = function () {
        temptext.style.display  = "none";
        container2.style.display = "inline";
        const solvedData = solveData();
        network2.setData(solvedData);
        //removing form childs added
        var list = document.getElementById("datas");
        while (list.hasChildNodes()) {
        list.removeChild(list.firstChild);
  }
    };

    function solveData() {
        let data = curr_data;
        const sz = data['nodes'].length;
        const vals = Array(sz).fill(0);
        // Calculating net balance of each person
        for(let i=0;i<data['edges'].length;i++) {
            const edge = data['edges'][i];
            vals[edge['to'] - 1] += parseInt(edge['label']);
            vals[edge['from'] - 1] -= parseInt(edge['label']);
        }

        const pos_heap = new BinaryHeap();
        const neg_heap = new BinaryHeap();

        for(let i=0;i<sz;i++){
            if(vals[i]>0){
                pos_heap.insert([vals[i],i]);
            } else{
                neg_heap.insert(([-vals[i],i]));
                vals[i] *= -1;
            }
        }

        const new_edges = [];
        while(!pos_heap.empty() && !neg_heap.empty()){
            const mx = pos_heap.extractMax();
            const mn = neg_heap.extractMax();

            const amt = Math.min(mx[0],mn[0]);
            const to = mx[1];
            const from = mn[1];

            new_edges.push({from: from+1, to: to+1, label: String(Math.abs(amt))});
            vals[to] -= amt;
            vals[from] -= amt;

            if(mx[0] > mn[0]){
                pos_heap.insert([vals[to],to]);
            } else if(mx[0] < mn[0]){
                neg_heap.insert([vals[from],from]);
            }
        }

        data = {
            nodes: data['nodes'],
            edges: new_edges
        };
        return data;
    }

    genNew.click();

};