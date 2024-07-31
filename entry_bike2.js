const db = require("mysql");
const con= db.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"parking_system"
})

con.connect((err)=>{
    if(err) throw err
    else{console.log("connected")}
})
var data={};
function setdata(pdata){
    console.log("setdata:");
    data=pdata;
    console.log(data);
}
function getdata(){
    console.log("getdata:")
    console.log(data);
    return data;
}


async function work(card_no, card_type) {
    console.log(card_type);
    console.log("this is entry bike");
    
    try {
      const slot_b = await new Promise((resolve, reject) => {
        const query = `SELECT slot_no FROM slot_bike WHERE status=0 limit 1;`;
        var slot_no=null;
        con.query(query,async (err, resl) => {
          if (err) reject(err);
          await resl.forEach(element => {
            slot_no=element['slot_no'];
          })
            console.log(slot_no);
                    
            resolve(slot_no);          
        });
      });
      
      console.log("inside entry_bike: " + slot_b);
      
     
      if(slot_b===null){
        setdata(3);
      }
      else{
        
        setdata({
          slot: slot_b,
          card: card_no
        });
    }

      console.log("worked");
      console.log(getdata());
      return data;
    } catch (error) {
      console.error(error);
      return error.message;
    }
  }


async function entry_bike2(card_no,card_type){
    let value=await work(card_no,card_type);
    return value;
}
module.exports={
    entry_bike2
}


