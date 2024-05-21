const fs = require('fs').promises;
const { Worker } = require("node:worker_threads");

process.env.UV_THREADPOOL_SIZE=2;


const start = Date.now();

function generateRandomNumbers(){
    let arr=[];
    for(let i=0;i<100000;i++){
        arr.push(Math.floor(Math.random() * (100000 - 1 + 1)) + 1);
    }
    //console.log(Date.now()-start);
    return arr;
}


for ( let i=0;i< 3; i++)
{
    readAndWriteFile(`file${i}.txt`,i);
    
}


async function readAndWriteFile(fileName,i){
    let arr=generateRandomNumbers();

    mergeSort(arr)
    .then(async (res)=>{
        console.log('merged ', i, '->', Date.now() - start)
        await fs.writeFile(fileName, res.toString()).then((res, err) => {
            console.log('write ', i, '->', Date.now() - start)
        })

        fs.readFile(fileName).then((res, err) => {
            console.log('read ', i, '->', Date.now() - start);
            console.log(res.toString('utf8').split(',').map(Number).length);
        })
    })
    

}

function mergeSort(arr){
    return new Promise ((resolve,reject)=>{
        const worker = new Worker("./worker.js",{
            workerData: {arr : arr}
        })

        worker.on("message", (data)=>{
            resolve(data);
        });

        worker.on("error",(error)=>{
            reject(error);
        })
    })
}

console.log(Promise.toString());



