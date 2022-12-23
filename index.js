const Cronchy = require("./src/Cronchy").default;
let a = new Cronchy("ysewell15235@yahoo.com", "H@wkeye1", true);
a.login().then((data) => {
    console.log(data);
}).catch((err) => {
    console.error(err);
});