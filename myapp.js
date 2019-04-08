const express = require(`express`);
const APP = express();
const PORT = process.env.PORT || 5000;

APP.use(express.static(`appExpressScheduler`));

APP.get(`/`, (req, res) => res.sendFile(`startWorkScheduler.html`, {root: __dirname +'/appExpressScheduler'}));

APP.listen(PORT, () => console.log(`expressScheduler active on port: ${ PORT }`));
