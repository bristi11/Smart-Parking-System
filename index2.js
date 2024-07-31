const mysql=require("mysql");
const express=require("express");
const app=express();

app.use('/public',express.static('public'));
app.set('view engine','ejs')
const {regular2}=require('./regular2');
const {monthly2}=require('./monthly2');
const {regular}=require('./regular');
const {monthly}=require('./monthly');
const con=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"parking_system"
})
const db=con.connect((err)=>{
    if(err)throw err;    
});
app.use( express.static( "public" ) );
app.get('/amount',(req,res)=>{
    res.render('amount',{})
})
app.get('/index',(req,res)=>{
    res.render('index',{})
})
app.get('/loginpage',(req,res)=>{
    res.render('loginpage',{})
})
app.get('/regular_register',(req,res)=>{
    if(req.query.regular_submit){
        const body=req.query;
        console.log(body);
        query=`update checking set balance=balance+${body.amount} where card_no='${body.card_no}';`;
        con.query(query,(err,resl)=>{
            if(err) throw err;
        })
    }
    res.render('regular_register',{})
})
app.get('/balance',(req,res)=>{
    res.render('balance',{})
})
app.get('/monthly_register',(req,res)=>{
    if(req.query.recharge_submit){
        const body=req.query;
        console.log(body);
        var query=`update monthly_checking set rechargeDate=curdate() where card_no='${body.card_no}';`;
        con.query(query,(err,resl)=>{
            if(err) throw err;
        })
        var query=`update monthly_checking set deadline=date_add(rechargeDate,interval 30 day) where card_no='${body.card_no}';`;
        con.query(query,(err,resl)=>{
            if(err) throw err;
        })
    }
    res.render('monthly_register',{})
})


app.get('/monthly_register_counter',(req,res)=>{
    if(req.query.recharge_submit_counter){
        const body=req.query;
        console.log(body);
        var query=`insert into monthly_checking(card_no,rechargeDate,vehicle_type,transaction_id,entry) values('${body.card_no}',curdate(),'${body.vehicle_type}','${body.transaction_id}',0);`;
        con.query(query,(err,resl)=>{
            if(err) throw err;
        })
        var query=`update monthly_checking set deadline=date_add(rechargeDate,interval 30 day) where card_no='${body.card_no}';`;
        con.query(query,(err,resl)=>{
            if(err) throw err;
        })
    }
    res.render('monthly_register_counter',{})
})

app.get('/regular_register_counter',(req,res)=>{
    if(req.query.regular_submit_counter){
        const body=req.query;
        console.log(body);
        query=`insert into checking values('${body.card_no}','${body.vehicle_type}',0,${body.amount});`;
        con.query(query,(err,resl)=>{
            if(err) throw err;
        })
    }
    res.render('regular_register_counter',{})
})
let gdata=null;
function setdata(pdata){
    gdata=pdata;
    console.log("pdata:"+pdata);
}
let arduinoData=null;
function setarduinodata(pdata){
    arduinoData=pdata;
    console.log("arduino data inside get:"+arduinoData);
}

console.log("data:"+gdata);
app.use(express.urlencoded({ extended: "false" })); // decryption of content-type : "application/x-www-form-urlencoded"
app.use(express.json());
app.get("/postdata",(req,res)=>{
    if(gdata!==null){
        res.json(
            {approve:true}
        )
    }
    else{
        res.json(
            {approve:false}
        )
    }

})
app.post("/postdata",async(req,res)=>{
    
    console.log(req.body);
    const reqdata = req.body;
    var element= 0;
    for (const key in reqdata) {
        if (Object.hasOwnProperty.call(reqdata, key)) {
            element = reqdata[key];
            console.log(element + " " + key)
            setdata(element);
        }
    }
    
  console.log("arduinodata:"+arduinoData);

  console.log("inside post block");
  console.log("data is:"+gdata);

  const card_no=gdata;
  //const card_no="2dfv345";
  
  console.log("card no. is:"+card_no);

  
  // var card_type1=null;
  var data=null;

  const card_type = await new Promise((resolve, reject) => {
    const query = `SELECT card_type FROM card_type WHERE card_no='${card_no}'`;
  
    con.query(query, async (err, resl) => {
      if (err) reject(err);
  
      let card_type1;
      for (const element of resl) {
        console.log("print");
        card_type1 = element['card_type'];
        console.log("if: " + card_type1);
      }
  
      console.log("before resolve card_type: " + card_type1);
      resolve(card_type1);
    });
  });
  
//   const card_type=await new Promise((resolve, reject) => {
//       var query=`select card_type from card_type where card_no='${card_no}'`;
//     //console.log("print")
//       con.query(query,async(err,resl)=>{
        
//           if (err) throw err;
//           let card_type1;
//           await resl.forEach(element => {
//             console.log("print")
//             card_type1=element['card_type'];
            
//             console.log("if :"+card_type1);  
//            //console.log("before resolve card_type : "+card_type1);
//       })  
//       console.log("before resolve card_type : "+card_type1);
//       resolve(card_type1);
//   })
//   })  


  console.log("index card_type:"+card_type);  
      if(card_type=='regular'){
          console.log("inside index.js");
          var data1=await regular2(card_no,card_type);            
          if (data1==2){
              console.log("index:You have no sufficient balance.... please recharge");
              setarduinodata("0");
              res.send("0");
          }
          else if(data1==3){
              console.log("index:slot is not available");
              setarduinodata("0");
              res.send("0");
          }
          else if(data1==4){
              console.log("index:you have exceeded 12 hours");
              setarduinodata("0");
              res.send("0");
          }
          else{
              var data=JSON.parse(data1);
              //console.log("data="+data.slot+" data1="+data1);
              if(data.amount){
                  console.log("index: this is exit block");
                  setarduinodata("1");
                  res.send("1");
              }
              else{
                  console.log("index: this is entry block"+data.slot+data.card);
                  setarduinodata("1");
                  res.send("1");
              }
          }
      }
      else{
          console.log("it is monthly");
          var data1=await monthly2(card_no,card_type);
          
          if(data1==3){
              console.log("index: slot is not available");
              setarduinodata("0");
              res.send("0");
          }
          else if(data1==5){
              console.log("index:monthly recharge sesh");
              setarduinodata("0");
              res.send("0");
          }
          else{
              var data=JSON.parse(data1);
              //console.log("data="+data.slot+" data1="+data1);
              if(data.amount==0){
                  console.log("index: this is exit block");
                  setarduinodata("1");
                  
                  res.send("1");
              }
              else{
                  console.log("index: this is entry block"+data.slot+data.card);
                  setarduinodata("1");
                  res.send("1");
              }
          }
      }
  




    
})
app.get('/scancard',(req,res)=>{
    res.send("granted");
})
app.get('/display',async (req,res)=>{
    
    console.log("gdata is:"+gdata);

    const card_no=gdata;
    //const card_no="2dfv345";
    
    gdata=null;
    console.log("card no. is:"+card_no);

    console.log("inside get block");
    // var card_type1=null;
    var data=null;
    const card_type=await new Promise((resolve, reject) => {
        var query=`select card_type from card_type where card_no='${card_no}'`;
        con.query(query,async (err,resl)=>{
            if (err) throw err;
            var card_type1 = null;
            resl.forEach(element => {
             card_type1=element['card_type'];
             console.log(card_type1);  
            
        })  
        resolve(card_type1);
    })
    })  
    console.log("index card_type:"+card_type);  
        if(card_type=='regular'){
            console.log("inside index.js");
            var data1=await regular(card_no,card_type);            
            if (data1==2){
                console.log("index:You have no sufficient balance.... please recharge");
                setarduinodata("0");
                res.render('balance',{
                    data:"You have no sufficient balance.... please recharge"
                })
            }
            else if(data1==3){
                console.log("index:slot is not available");
                setarduinodata("0");
                res.render('balance',{
                    data:"slot is not available"
                })
            }
            else if(data1==4){
                console.log("index:you have exceeded 12 hours");
                setarduinodata("0");
                res.render('balance',{
                    data:"You have exceeded 12 hours"
                })
            }
            else{
                var data=JSON.parse(data1);
                //console.log("data="+data.slot+" data1="+data1);
                if(data.amount){
                    console.log("index: this is exit block");
                    setarduinodata("1");
                    res.render('amount',{
                        card:data.card,
                        slot:data.slot,
                        amount:data.amount,
                        title:"amount"
                    })
                }
                else{
                    console.log("index: this is entry block"+data.slot+data.card);
                    setarduinodata("1");
                    res.render('display',{
                        card:data.card,
                        slot:data.slot,
                        title:"display"
                    })
                }
            }
        }
        else{
            console.log("it is monthly");
            var data1=await monthly(card_no,card_type);
            
            if(data1==3){
                console.log("index: slot is not available");
                setarduinodata("0");
                res.render('balance',{
                    data:"slot is not available"
                })
            }
            else if(data1==5){
                console.log("index:monthly recharge sesh");
                setarduinodata("0");
                res.render('balance',{
                    data:"you monthly recharge validity has ended.... please recharge"
                })
            }
            else{
                var data=JSON.parse(data1);
                //console.log("data="+data.slot+" data1="+data1);
                if(data.amount==0){
                    console.log("index: this is exit block");
                    setarduinodata("1");
                    
                    res.render('amount',{
                        card:data.card,
                        slot:data.slot,
                        amount:data.amount,
                        title:"amount"
                    })
                }
                else{
                    console.log("index: this is entry block"+data.slot+data.card);
                    setarduinodata("1");
                    res.render('display',{
                        card:data.card,
                        slot:data.slot,
                        title:"display"
                    })
                }
            }
        }

})

app.listen(3000,()=>{
    console.log("http://localhost:3000");
})
