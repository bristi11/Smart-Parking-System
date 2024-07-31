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
// async function work(card_no,card_type){
//     console.log("this is exit bike");
//     var query=`select slot_no from booking_bike where card_no='${card_no}'`;
//     con.query(query,(err,resl)=>{
//         if (err) throw err;
//         resl.forEach(element => {
//             slot_b=element['slot_no'];
//             console.log(slot_b);
//         })
//         var query=`update slot_bike set status=0 where slot_no='${slot_b}'`;
//         con.query(query,(err,resl)=>{
//             if (err) throw err;
//             // resl.forEach(element => {
//             //     slot_b=element['slot_no'];
//             //     console.log(slot_b);
//             // })
//         })
//         var query=`update booking_bike set departure_time=current_timestamp where card_no='${card_no}'`;
//         con.query(query,(err,resl)=>{
//             if (err) throw err;
//             // resl.forEach(element => {
//             //     slot_b=element['slot_no'];
//             //     console.log(slot_b);
//             // })
//         })     
//         if(card_type=='regular'){    
//             query=`select timediff(departure_time,arrival_time) as timedifference from booking_bike where card_no='${card_no}'` ;
//             var timediff=0;
//             con.query(query,(err,resl)=>{
//                 if (err) throw err;
//                 resl.forEach(element => {
//                     timediff=element['timedifference'];
//                     console.log(timediff);
//                 })
//                 var time= timediff[0]+timediff[1];
//                 console.log(time);
                             
//                     if(time<1){
//                         console.log("less than 1 hour");
//                         query=`update checking set balance=balance-50 where card_no='${card_no}';`;
//                         con.query(query,(err,resl)=>{
//                             if (err) throw err;
//                         })
//                         var data={
//                             card:card_no,
//                             amount:50,
//                             slot:slot_b
//                         }
//                         console.log(data);
//                         return data;
//                     }
//                     else if(time>12){
//                         console.log("you have spent more than 12 hrs");
//                         return("you have spent more than 12 hrs");
//                     }
//                     else{
//                         console.log("more than 1 hour");
//                         var amount=50+(30*time);
//                         query=`update booking_bike set amount=${amount} where card_no='${card_no}';`;
//                         con.query(query,(err,resl)=>{
//                             if (err) throw err;
//                         })
//                         query=`update checking set balance=balance-${amount} where card_no='${card_no}';`;
//                         con.query(query,(err,resl)=>{
//                             if (err) throw err;
//                         })
//                         var data={
//                             card:card_no,
//                             amount:amount,
//                             slot:slot_b
//                         }
//                         return data;
//                     }
                
                
//             })
        
//             query=`update checking set entry=0 where card_no='${card_no}';`;
//             con.query(query,(err,resl)=>{
//                 if (err) throw err;
//             })
//         }
//         else{
//             query=`update monthly_checking set entry=0 where card_no='${card_no}';`;
//             con.query(query,(err,resl)=>{
//                 if (err) throw err;
//             })
//             var data={
//                 card:card_no,
//                 amount:0,
//                 slot:slot_b
//             }
//             console.log(data);
//             return data;
//         }
//     })
// }




async function work(card_no,card_type){
    console.log("this is exit bike");
    try{
        const slot_c = await new Promise((resolve, reject) => {
            const query = `SELECT slot_no FROM booking_car WHERE card_no='${card_no}';`;
            con.query(query, (err, resl) => {
            if (err) reject(err);
            if (resl.length > 0) {
                const slot_no = resl[0]['slot_no'];
                console.log(slot_no);
                var query=`update slot_car set status=0 where slot_no='${slot_no}';`        
                con.query(query,(err,resl)=>{
                        if (err) throw err;
                        console.log("car slot updated");
                    })
                // var query=`update booking_car set departure_time=current_timestamp where card_no='${card_no}';`;
                // con.query(query,(err,resl)=>{
                //     if (err) throw err;
                // })
                resolve(slot_no);

            }});
        });

        // setdata({
        //     slot: slot_b,
        //     card: card_no
        //   });
        
          if (card_type === 'regular') {
            let query=`select timediff(departure_time,arrival_time) as timedifference from booking_car where card_no='${card_no}'` ;
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
              await new Promise((resolve, reject) => {  
                query=`update checking set entry=0 where card_no='${card_no}';`;
                con.query(query,(err,resl)=>{
                    if (err) throw err;
                    resolve();
                });
            });

              if(time<1){
                console.log("less than 1 hour");
                query=`update checking set balance=balance-100 where card_no='${card_no}';`;
                await new Promise((resolve, reject) => {      
                con.query(query,(err,resl)=>{
                    if (err) throw err;
                    resolve(); 
                });
                });
                setdata({
                        slot: slot_c,
                        card: card_no,
                        amount:100
                      });
              }
              else if(time>12){
                setdata(4);
              }
              else{
                console.log("more than 1 hour");
                var amount=100+(50*time);
                
                await new Promise((resolve, reject) => {  
                    query=`update booking_car set amount=${amount} where card_no='${card_no}';`;
                    con.query(query,(err,resl)=>{
                        if (err) throw err;
                        resolve();
                    });
                });
                
                await new Promise((resolve, reject) => {  
                    query=`update checking set balance=balance-${amount} where card_no='${card_no}';`;
                    con.query(query,(err,resl)=>{
                        if (err) throw err;
                        resolve();
                    });
                });
                
                setdata({
                    slot: slot_c,
                    card: card_no,
                    amount:amount
                    });
            }
          }
          else{
            await new Promise((resolve, reject) => {  
                query=`update monthly_checking set entry=0 where card_no='${card_no}';`;
                con.query(query,(err,resl)=>{
                    if (err) throw err;
                    resolve();
                });
            });
            setdata({
                slot: slot_c,
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

async function exit_car(card_no,card_type){
    let value=await work(card_no,card_type);
    return value;
}
module.exports={
    exit_car
}