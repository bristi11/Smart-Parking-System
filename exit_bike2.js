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

async function work(card_no,card_type){
    console.log("this is exit bike");
    try{
        const slot_b = await new Promise((resolve, reject) => {
            const query = `SELECT slot_no FROM booking_bike WHERE card_no='${card_no}';`;
            con.query(query, (err, resl) => {
            if (err) reject(err);
            if (resl.length > 0) {
                const slot_no = resl[0]['slot_no'];
                console.log(slot_no);
               
                resolve(slot_no);

            }});
        });

        
          if (card_type === 'regular') {
            var query=`update booking_bike set departure_time=current_timestamp where card_no='${card_no}';`;
                con.query(query,(err,resl)=>{
                    if (err) throw err;
                })
            query=`select timediff(departure_time,arrival_time) as timedifference from booking_bike where card_no='${card_no}'` ;
            const timediff=await new Promise((resolve, reject) => {
                let timedifference;
                con.query(query, (err, resl) => {
                  if (err) reject(err);
                  resl.forEach(element => {
                  timedifference=element['timedifference'];
                  })
                  resolve(timedifference);
                });
              });
              var time= timediff[0]+timediff[1];
              console.log(time);


              if(time<1){
                console.log("less than 1 hour");
           
                setdata({
                        slot: slot_b,
                        card: card_no,
                        amount:50
                      });
              }
              else if(time>12){
                setdata(4);
              }
              else{
                console.log("more than 1 hour");
               
                
                setdata({
                    slot: slot_b,
                    card: card_no,
                    amount:amount
                    });
            }
          }
          else{
           
            setdata({
                slot: slot_b,
                card: card_no,
                amount:0
              });
          }

          console.log(getdata());
        return data;
    }catch(error){
        console.error(error);
      return error.message;
    }
}

async function exit_bike2(card_no,card_type){
    let value=await work(card_no,card_type);
    return value;
}
module.exports={
    exit_bike2
}