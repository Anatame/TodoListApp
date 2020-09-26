const express = require("express");
const bodyParser = require("body-parser")
const date = require(__dirname + "/date.js")
const mongoose = require("mongoose");
const e = require("express");
const _ = require("lodash")

const app = express();

// list of items to add to the list


// sending static files folder
app.use(express.static("public"));

app.use(bodyParser.urlencoded({
    extended: true
}));

// setting up EJS
app.set('view engine', 'ejs');

//connecting to mongodb
mongoose.connect("mongodb+srv://admin-sam:test123@cluster0.cpgna.mongodb.net/todolistDB?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//collection Schema for DB
const itemsSchema = {
    name: String
};

// setting up schema into model
const Item = mongoose.model('item', itemsSchema);

//creating items
const item1 = new Item({
    name: 'Sam'
});

const item2 = new Item({
    name: "Duplar"
});

const item3 = new Item({
    name: "Hyker"
})

//setting up items into an array
const defaultItems = [item1, item2, item3];

//dynamic lists

const listSchema = {
    name: String,
    items: [itemsSchema]

}

const List = mongoose.model('list', listSchema);






app.get("/", function (req, res) {

    //finding data from the db

    Item.find({}, function (err, result) {

        if (result.length === 0) {

            //inserting data into db
            Item.insertMany(defaultItems, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Saved to DB successfully!")
                }
            })

            res.redirect("/");

        } else {


            res.render("list", {
                title: "Today",
                newlistItems: result
            });


            console.log(result[0].name)

        };


    });


});

app.get("/work", function (req, res) {

    res.render("list", {
        title: "workList",
        newlistItems: wItems
    });

})


app.get("/about", function (req, res) {

    res.render("about");

})





app.post('/', function (req, res) {


    var itemName = req.body.newItem;
    const listName = req.body.button

    const item = new Item({
        name: itemName
    })


    if(listName === "Today"){

  
        item.save();
    
        res.redirect("/")

    } else{

        List.findOne({name: listName}, function(err, list) {
            list.items.push(item);
            list.save();
            res.redirect("/" + listName)
        })

    }



    // if(req.body.button === "workList"){
    //     wItems.push(item);

    //     res.redirect("/work");



    // } else{
    //     items.push(item);

    //     res.redirect("/");
    // }


});


app.post('/delete', function (req, res) {

    const checkedItemID = req.body.checkbox;
    const listName = req.body.listName;

    if(listName === "Today") {

        
    Item.findByIdAndRemove(checkedItemID, function (err) {
        if (err) {
            console.log(err)
        } else {

            console.log("Checked item has been removed.")
            res.redirect("/")
        }
    })

    } else{

        List.findOneAndUpdate({name:listName},{$pull: {items:{_id:checkedItemID}}}, function (err){

            if(!err){
                res.redirect("/" + listName)
            }

        })

    }


});


app.get("/:customListName", function (req, res) {
    const customListName = _.capitalize(req.params.customListName);
    console.log(customListName)

    List.findOne({
        name: customListName},
        function (err, foundItems) {
            if (!err) {
                if (!foundItems) {
                    console.log("Doesn't exist.")

                    const list = new List({
                        name: customListName,
                        items: defaultItems

                    })

                    list.save();

                    res.redirect("/" + customListName)

                } else {

                    res.render("list", {
                        title: foundItems.name,
                        newlistItems: foundItems.items
                    })

                }
            }

        })
    });



//     let port = process.env.PORT;
// if (port == null || port == "") {
//   port = 3000;
// }
// app.listen(port);

app.listen(process.env.PORT, function () {
    console.log("Server has started successfully!");
});