const express = require("express");
const app = express();
const todo_m = require("./model/todo");
const bodyParser = require("body-parser");

todo_m.init()

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.get("/", function (req,res) {
    const todoList = todo_m.load({});
    res.render("index", {
        todoList
    });
});

app.post("/new", function(req,res){
    const head = req.body.head;
    const description = req.body.description;
    const state = "doing";
    if(todo_m.save({head, description, state})){
        res.redirect("/");
    }else{
        res.redirect("/error?" + new URLSearchParams({
            msg: "something is wrong"
        }));
    }
});

app.get("/delete/:id", function (req,res) {
    const id = req.params.id;
    todo_m.delete(id);
    return res.redirect("/");
});

app.get("/toggle/:id", function (req,res){
    const id = req.params.id;
    const todo = todo_m.load({id})[0];
    if(!todo){
        return res.redirect("/error?" + new URLSearchParams({
            msg: "todo not found"
        }));
    }
    const state = todo.state === "doing" ? "done" : "doing";
    if(todo_m.save({id,state})){
        res.redirect("/");
    }else{
        res.redirect("/error?" + new URLSearchParams({
            msg: "something is wrong"
        }));
    }
});

app.get("/error", function (req, res) {
    const errMsg = req.query.msg;
    res.send(errMsg);
})

app.listen(4000);