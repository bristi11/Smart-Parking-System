const db = require("mysql");
const con= db.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"parking_system"
})
const {entry_car2}=require('./entry_car2');
const {entry_bike2}=require('./entry_bike2');
const {exit_car2}=require('./exit_car2');
const {exit_bike2}=require('./exit_bike2');
con.connect((err)=>{
    if(err) throw err
    else{console.log("connected")}
})
let data;
function setdata(pdata){
    data=pdata;
    console.log(data);
}

async function monthly2(card_no,card_type){    
    //var remtime=null; 
    await new Promise((resolve, reject) => {
        var query=`update monthly_checking set currentDate=curdate() where card_no='${card_no}';`;
        con.query(query,(err,resl)=>{
            if (err) throw err;
            resolve();
        })
    })
    const remtime = await new Promise((resolve, reject) => {
        // var query=`update monthly_checking set currentDate=curdate() where card_no='${card_no}';`;
        // con.query(query,(err,resl)=>{
        //     if (err) throw err;
        // })
        console.log("current date updated");
        var query=`select datediff(deadline,currentDate) as remtime from monthly_checking where card_no='${card_no}';`;
        con.query(query, (err, resl) => {
            if (err) reject(err);            
            var remt=null;
            resl.forEach(async element => {
                remt =element['remtime'];
            })
              console.log("remt:"+remt);
              
              resolve(remt);
             
          });
    })
        console.log(remtime);
        const data1=await new Promise((resolve, reject) => { 
            if(remtime<0){
                console.log("Please recharge your card");
                resolve(5);
            }
            else{
                const query=`select vehicle_type,entry from monthly_checking where card_no='${card_no}';`
                con.query(query,async (err,resl)=>{
                if (err) throw err;
                await resl.forEach(async element => {
                    var v_type=element['vehicle_type'];
                    var entry=element['entry'];
                    console.log(v_type);
                    if(v_type=='B'){
                        if(entry==0){                   
                            var data=await entry_bike2(card_no,card_type);
                            console.log("monthly entry bike:"+JSON.stringify(data));
                            resolve (JSON.stringify(data));
                        }
                        else{
                            var data=await exit_bike2(card_no,card_type);
                            console.log("monthly exit bike:"+JSON.stringify(data));
                            resolve (JSON.stringify(data));
                        }
                    }
                        
                    else{
                        if(entry==0){                 
                            var data=await entry_car2(card_no,card_type);
                            console.log("monthly entry car:"+JSON.stringify(data));
                            resolve (JSON.stringify(data));
                        }
                        else{
                            var data=await exit_car2(card_no,card_type);
                            console.log("monthly exit car:"+JSON.stringify(data));
                            resolve (JSON.stringify(data));
                        }
                    }
                });
            
                })
            }

        })
        setdata(data1);
        return(data);
}

module.exports={
    monthly2
}