const express = require('express');
const fs = require('fs');
const router = express.Router();
const numeral = require('numeral');

const errorMessages = {
  ERR_NO_DATA: 'veri gönderilmesi gerekli.'
}
// /api olarak yapılan çağrımlarda kullanılan get ve post metodları
router.get("/", (req,res) => {

    // data verisini json olarak göndermek için.
    res.json(data);
});

// post 
// curl -X POST -H "Content-Type: application/json" -d '{"username":"xyz","password":"xyz"}' http://localhost:5000/api
router.post("/", (req,res) => {
  
  // post kullanıyorsak 
  if(req.body)
  {
    res.json(req.body);
  }
  else
  {
    res.status(400).send(errorMessages.ERR_NO_DATA)
  }
});


router.post("/:imageID", (req,res) => {
  
  console.log("Image ID :",req.params.imageID);

  if(req.body)
  {      
      let img = req.body.image.replace(/^data:image\/(png|jpg);base64,/, "") ;
      let buffer = Buffer.from(img, 'base64');
      const num = numeral(req.params.imageID).format("0000");
      let imagePath = './data/image_'+num+'.png';
      fs.createWriteStream(imagePath).write(buffer);
      res.status(200).send("ok.");
  }
  else
  {
    res.status(400).send(errorMessages.ERR_NO_DATA)
  }
});

// urlencoded ile veri alma örneği:
// Örnek Çağrım: http://localhost:5000/api/querytest?param1=value1&param2=value2
router.get("/querytest", (req,res) => {
  
  console.log("Param 1 :",req.query.param1);
  console.log("Param 2 :",req.query.param2);
  
  res.json({"param1": req.query.param1, "param2": req.query.param2});
  
});

module.exports = router;
