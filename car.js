const db = require("mysql");
const con= db.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"parking_system"
})
const {entry_car}=require('./entry_car');
const {exit_car}=require('./exit_car');
con.connect((err)=>{
    if(err) throw err
    else{console.log("connected")}
})

let data;
function setdata(pdata){
    data=pdata;
}

async function car(card_no,card_type){
    console.log("this is car");
        const data1=await new Promise((resolve, reject) => { 
        const query=`select entry,balance from checking where card_no='${card_no}';`
        con.query(query,async (err,resl)=>{
            if (err) throw err;
            await resl.forEach(async element => {
                var entry=element['entry'];
                var balance=element['balance'];
                //console.log("the amount is:"+amount);
                if(entry==0){
                    if(balance>=300){
                        var fdata=await entry_car(card_no,card_type);
                        console.log("inside car.js:"+JSON.stringify(fdata));
                        resolve(JSON.stringify(fdata));
                    }
                    else
                        console.log("You have no sufficient balance.... please recharge");
                        resolve(2);
                }
                else{
                    var fdata=await exit_car(card_no,card_type);
                    console.log("inside car.js:"+JSON.stringify(fdata));
                    resolve(JSON.stringify(fdata));
                }

            })
        })

    })
    setdata(data1);
    console.log("pdata"+data);
    return data;
}

module.exports={
    car
}