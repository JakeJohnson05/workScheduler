const express = require(`express`);
const app = express();
const port = 3000;

app.use(express.static(`appExpressScheduler`));
// app.use(express.static(`node_modules/materialize-css`));
app.get(`/`, (req, res) => res.sendFile(`home.html`, {root: __dirname+`/appExpressScheduler`}));


app.listen(port, () => console.log(`expressScheduler active on port ${port}`));