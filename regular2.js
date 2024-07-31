const db = require("mysql");
const con= db.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"parking_system"
})
const {bike2}=require('./bike2');
const {car2}=require('./car2');
con.connect((err)=>{
    if(err) throw err
    else{console.log("connected")}
})

let data;
function setdata(pdata){
    data=pdata;
    console.log(data);
}


async function regular2(card_no,card_type){
    const query=`select vehicle_type from checking where card_no='${card_no}';`
    const data1=await new Promise((resolve, reject) => { 
        con.query(query,async (err,resl)=>{
            if (err) throw err;
            await resl.forEach(async element => {
                var v_type=element['vehicle_type'];
                console.log(v_type);
                if(v_type=='B'){
                    var fdata=await bike2(card_no,card_type);
                    console.log("regular:"+fdata);
                    resolve(fdata);
                }
                else{
                    var fdata=await car2(card_no,card_type);
                    console.log("regular:"+fdata);
                    resolve(fdata);
                }
            });
        })
    })
    setdata(data1);
    return data;
}

module.exports={
    regular2
}