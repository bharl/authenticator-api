const bodyParser   = require('body-parser');
const express      = require('express');
const path         = require('path');
const exphbs       = require('express-handlebars');
const routes       = require('./routes/index');
const port         = process.env.PORT || 3000;
const cookieParser = require('cookie-parser');
const app          = express();

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'views')));

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
	res.render('home', {layout: false});
});

app.use('/api', routes);

app.listen(port, () => {
	console.log('Listening on port ' + port + '...');
});