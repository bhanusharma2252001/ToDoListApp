const express = require("express");
const bodyParser = require("body-parser");
const mongoose=require('mongoose');
const e = require("express");
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
var Items=[];


// Mongoose Connectivity and Database Work
mongoose.connect("mongodb+srv://Admin-BhavneSharma:bhanuSharma2233@cluster0.2x20k.mongodb.net/TodolistDB",{useNewUrlParser:true,useUnifiedTopology:true});
// mongoose.connect('mongodb://localhost:27017/TodoListDB',{useNewUrlParser: true,useUnifiedTopology:true});
const ItemsSchema=
{
  name:String
}
const listSchema=
{
  name:String,
  listItems:[ItemsSchema]
}
const List=mongoose.model("List",listSchema);
const Item=mongoose.model("Item",ItemsSchema);
const item1=new Item(
  {
    name:'Buy Food'
  }
)
const item2=new Item(
  {
    name:'Bring Food to home'
  }
)
const item3=new Item(
  {
    name:'Cook Food'
  }
)
defaultItems=[item1,item2,item3];

// Item.deleteMany({name:"Cook Food",name:"Bring Food to home",name:"Buy Food"},(err)=>
// {
//   if(err)
//   console.log(err);
//   else
//   console.log("Deleted Sucessfully!");
// });

 

app.get("/", function(req,res) {
  Item.find((err,Founditems)=>
  {
  if(Founditems.length===0)
  {
    Item.insertMany(defaultItems,(err)=>
  {
  if(err)
  console.log(err);
  else
  {
  console.log("Inserted Sucessfully");
  }});
  res.redirect("/");
}
  else{
  res.render("list", {listTitle:"Today", newListItems: Founditems});
  }
});
});


app.post("/", function(req, res){
const itemName = req.body.newItem;
const listName=req.body.list;
const item=new Item({
  name:itemName
}); 
if(listName=="Today")
{
item.save();
res.redirect("/");
}
else{
  List.findOne({name:listName},(err,Founditems)=>
  {
    Founditems.listItems.push(item);
    Founditems.save();
    res.redirect("/"+listName);
  })
}}

);


app.post("/delete",(req,res)=>
{
  const CheckedItemID=req.body.checkbox;
  const listName=req.body.listName;
  if(listName==="Today")
  {

    Item.findByIdAndRemove(CheckedItemID,(err)=>{
      if(err)
      console.log(err);
      else{
        console.log("Deletd sucessfully");
        res.redirect("/");
      }
    });
  }
  else{
    List.findOneAndUpdate({name:listName},{$pull:{listItems:{_id:CheckedItemID}}},(err,foundList)=>
    {
      if(!err)
      {
        res.redirect("/"+listName);
      }
    });
  }
  
 
})


app.get("/:listType",(req,res)=>
{
const customeListName=req.params.listType;
List.findOne({name:customeListName},(err,foundList)=>
{
  if(!err)
  {
    if(!foundList)
    {
      const list=new List(
        {
          name:customeListName,
          listItems:defaultItems
        });
        list.save();
        res.redirect("/"+customeListName);
    }
    else{
      res.render("list",{listTitle:foundList.name,newListItems:foundList.listItems})
    }
  }
});
});

 

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
