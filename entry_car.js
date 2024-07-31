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
//     console.log(card_type);
//     console.log("this is entry bike");
//     var query=`select slot_no from slot_bike where status=0 limit 1;`
//     var slot_b;
//     con.query(query,async (err,resl)=>{
//         if (err) throw err;
//         await resl.forEach(element => {
//             slot_b=element['slot_no'];  //  B1
//             console.log(slot_b);
//         })
//         console.log("inside entry_bike:"+slot_b);
//         // data={
//         //     slot:slot_b,
//         //     card:card_no
//         // }
//         await setdata({
//             slot:slot_b,
//             card:card_no
//         })
//         if(!slot_b){
//             console.log("Slot is not available");
//             // data={
//             //     slot:'slot is not available',
//             //     card:card_no
//             // }
//             data="Slot is not available";
//         }
//         else{
//                 var query=`update slot_bike set status=1 where slot_no='${slot_b}';`
                
//                 con.query(query,(err,resl)=>{
//                         if (err) throw err;
//                         console.log("bike slot updated");
//                     })
                    
//                     console.log("worked");
//                     if(card_type=='regular'){
//                         var query=`insert into booking_bike(card_no,slot_no,amount) values('${card_no}','${slot_b}',50);`
//                         con.query(query,(err,resl)=>{
//                             if (err) throw err;
//                                 console.log("booking is done");
//                         })
//                         var query=`update checking set entry=1 where card_no='${card_no}';`
//                         con.query(query,(err,resl)=>{
//                             if (err) throw err;
//                                 console.log("the bike is entried");
//                         })
//                     }
//                     else{
//                         var query=`insert into booking_bike(card_no,slot_no,amount) values('${card_no}','${slot_b}',0);`
//                         con.query(query,async(err,resl)=>{
//                             if (err) throw err;
//                                 console.log("booking is done");
//                         })
//                         console.log("worked");
//                         var query=`update monthly_checking set entry=1 where card_no='${card_no}';`
//                         con.query(query,async(err,resl)=>{
//                             if (err) throw err;
//                                 console.log("the bike is entried");
//                         })
//                     }                   
//         }
        
//     }).then(()=>{
//         console.log(getdata());
//     })
//     console.log(getdata());
//     return data;
// }


async function work(card_no, card_type) {
    console.log(card_type);
    console.log("this is entry car");
    
    try {
        const slot_c = await new Promise((resolve, reject) => {
            const query = "SELECT slot_no FROM slot_car WHERE status = 0 LIMIT 1;";
            var slot_no=null;
            con.query(query,async (err, resl) => {
              if (err) reject(err);
              await resl.forEach(element => {
                slot_no=element['slot_no'];
              })
                console.log(slot_no);
                var query=`update slot_car set status=1 where slot_no='${slot_no}';`        
                    con.query(query,(err,resl)=>{
                            if (err) throw err;
                            console.log("car slot updated");
                        })
                
                resolve(slot_no);
              
            });
          });
      
      console.log("inside entry_car: " + slot_c);
      
      // await setdata({          
      //   slot: slot_c,
      //   card: card_no
      // });
      if(slot_c===null){
        setdata(3);
      }
      else{
        if (card_type === 'regular') {
        
            const query = `INSERT INTO booking_car(card_no, slot_no, amount) VALUES ('${card_no}', '${slot_c}', 100);`;
            await new Promise((resolve, reject) => {
            con.query(query, (err, resl) => {
                if (err) reject(err);
                console.log("booking is done");
                resolve();
            });
            });
    
            const updateQuery = `UPDATE checking SET entry = 1 WHERE card_no = '${card_no}';`;
            await new Promise((resolve, reject) => {
            con.query(updateQuery, (err, resl) => {
                if (err) reject(err);
                console.log("the car is entried");
                resolve();
            });
            });
        
      } 
      else {
        const query = `INSERT INTO booking_car(card_no, slot_no, amount) VALUES ('${card_no}', '${slot_c}', 0);`;
        await new Promise((resolve, reject) => {
          con.query(query, (err, resl) => {
            if (err) reject(err);
            console.log("booking is done");
            resolve();
          });
        });
  
        const updateQuery = `UPDATE monthly_checking SET entry = 1 WHERE card_no = '${card_no}';`;
        await new Promise((resolve, reject) => {
          con.query(updateQuery, (err, resl) => {
            if (err) reject(err);
            console.log("the car is entried");
            resolve();
          });
        });
      }
      setdata({          
        slot: slot_c,
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


async function entry_car(card_no,card_type){
    let value=await work(card_no,card_type);
    return value;
}
module.exports={
    entry_car
}






// const db = require("mysql");
// const con = db.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "parking_system"
// });

// con.connect((err) => {
//   if (err) throw err;
//   else {
//     console.log("connected");
//   }
// });

// async function entry_bike(card_no, card_type) {
//   console.log(card_type);
//   console.log("this is entry bike");

//   try {
//     const slot_b = await new Promise((resolve, reject) => {
//       const query = "SELECT slot_no FROM slot_bike WHERE status = 0 LIMIT 1;";
//       con.query(query, (err, resl) => {
//         if (err) reject(err);
//         if (resl.length > 0) {
//           const slot_no = resl[0]['slot_no'];
//           console.log(slot_no);
//           resolve(slot_no);
//         } else {
//           console.log("Slot is not available");
//           reject(new Error("Slot is not available"));
//         }
//       });
//     });

//     console.log("inside entry_bike: " + slot_b);

//     console.log("bike slot updated");

//     if (card_type === 'regular') {
//       const query = `INSERT INTO booking_bike(card_no, slot_no, amount) VALUES ('${card_no}', '${slot_b}', 50);`;
//       await new Promise((resolve, reject) => {
//         con.query(query, (err, resl) => {
//           if (err) reject(err);
//           console.log("booking is done");
//           resolve();
//         });
//       });

//       const updateQuery = `UPDATE checking SET entry = 1 WHERE card_no = '${card_no}';`;
//       await new Promise((resolve, reject) => {
//         con.query(updateQuery, (err, resl) => {
//           if (err) reject(err);
//           console.log("the bike is entried");
//           resolve();
//         });
//       });
//     } else {
//       const query = `INSERT INTO booking_bike(card_no, slot_no, amount) VALUES ('${card_no}', '${slot_b}', 0);`;
//       await new Promise((resolve, reject) => {
//         con.query(query, (err, resl) => {
//           if (err) reject(err);
//           console.log("booking is done");
//           resolve();
//         });
//       });

//       const updateQuery = `UPDATE monthly_checking SET entry = 1 WHERE card_no = '${card_no}';`;
//       await new Promise((resolve, reject) => {
//         con.query(updateQuery, (err, resl) => {
//           if (err) reject(err);
//           console.log("the bike is entried");
//           resolve();
//         });
//       });
//     }

//     console.log("worked");
//     return slot_b;
//   } catch (error) {
//     console.error(error);
//     return "Slot is not available";
//   }
// }

// module.exports = {
//   entry_bike
// };