var express = require('express');
var morgan = require('morgan');
var core = require('./core.js');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var app = express();
app.use(morgan('combined'));
app.use('/dist', express.static('dist'));
app.use(bodyParser.json());
app.use(cookieParser('sgs90890s8g90as8rg90as8g9r8a0srg8'));

function handleError(res) {
    return (e => {
        if (e.errorMsg) {
            res.json({ errorMsg: e.errorMsg });
        } else if(e.errorStat) {
            res.sendStatus(e.errorStat);
        } else {
            res.sendStatus(400);
        }
    });
}

function attachCookie(req, res, next) {
    if (req.remember) {
        res.cookie('user', req.user, { signed: true, expires: new Date(Date.now() + 1000000) });
    } else {
        res.cookie('user', req.user, { signed: true });
    }
    next();
}

function authorize(req, res, next) {
    if (req.signedCookies.user) {
        req.user = req.signedCookies.user;
        next();
    } else {
        res.sendStatus(401);
    }
}

function checkPermissions(req, res, next) {
    core.checkPermissions(req.user)
    .then(() => {
        next();
    })
    .catch(handleError(res));
}

app.get('/', function (req, res) {
    res.sendFile('index.html', { root: __dirname });
});

app.get('/items/:category', function (req, res) {
    core.getItems(req.params.category)
    .then(items => {
        res.json(items);
    })
    .catch(handleError(res));
});

app.get('/items', authorize, checkPermissions, function(req, res) {
    core.getAllItems()
    .then(data => {
        res.json(data);
    })
    .catch(handleError(res));
})

app.get('/item/:key', function(req, res) {
    core.getItem(req.params.key)
    .then(data => {
        res.json(data);
    })
    .catch(handleError(res));
});

app.get('/item/:key/remove', authorize, checkPermissions, function(req, res) {
    core.removeItem(req.params.key)
    .then(() => {
        res.sendStatus(204);
    })
    .catch(handleError(res));
});

app.post('/item/add', authorize, checkPermissions, function(req, res) {
    var key = req.body.key;
    var data = req.body.data;
    core.addItem(key, data)
    .then(() => {
        res.sendStatus(204);
    })
    .catch(handleError(res));
})

app.get('/categories', authorize, checkPermissions, function (req, res) {
    core.getAllCategories()
    .then(data => {
        res.json(data);
    })
    .catch(handleError(res));
});

app.get('/categories/:parent', function(req, res) {
    var parent = req.params.parent;
    core.getCategories(parent)
    .then(data => {
        res.json(data);
    })
    .catch(handleError(res));
});

app.post('/login', function(req, res, next) {
    core.login(req.body.username, req.body.password)
    .then(() => {
        req.user = req.body.username;
        next();
    })
    .catch(handleError(res));
}, attachCookie, function(req, res) {
    res.json({ user: req.user });
});

app.get('/logout', function(req, res) {
    res.clearCookie('user');
    res.sendStatus(204);
});

app.post('/register', function(req, res, next) {
    var data = {
        username: req.body.username,
        fullname: req.body.fullname,
        password: req.body.password
    };
    core.register(data)
    .then(response => {
        req.user = data.username;
        next();
    })
    .catch(handleError(res));
}, attachCookie, function(req, res) {
    res.json({ user: req.user });
});

app.get('/user/info', authorize, function (req, res) {
    core.userinfo(req.user)
    .then(data => {
        res.json(data);
    })
    .catch(handleError(res));
});

app.get('/user/username', authorize, function (req, res) {
    res.json({ username: req.user });
});

app.get('/cart', authorize, function(req, res) {
    core.getCartContents(req.user)
    .then(data => {
        res.json(data);
    })
    .catch(handleError(res));
});

app.get('/cart/count', authorize, function(req, res) {
    core.countItemsInCart(req.user)
    .then(response => {
        res.json({ items: response });
    })
    .catch(handleError(res));
});

app.get('/cart/add/:item', authorize, function(req, res) {
    core.addToCart(req.user, req.params.item)
    .then(response => {
        res.json({ items: response });
    })
    .catch(handleError(res));
});

app.get('/cart/add/:item/:cnt', authorize, function (req, res) {
    var cnt = parseInt(req.params.cnt);
    core.addToCart(req.user, req.params.item, cnt)
    .then(response => {
        res.json({ items: response });
    })
    .catch(handleError(res));
});

app.get('/cart/placeorder', authorize, function(req, res) {
    core.placeOrder(req.user)
    .then(() => {
        res.sendStatus(204);
    })
    .catch(handleError(res));
});

app.get('/users', authorize, checkPermissions, function(req, res) {
    core.getUsers()
    .then(data => {
        res.json(data);
    })
    .catch(handleError(res));
});

app.get('/users/remove/:username', authorize, checkPermissions, function(req, res) {
    var username = req.params.username;
    core.removeUser(username)
    .then(() => {
        res.sendStatus(204);
    })
    .catch(handleError(res));
});

app.post('/users/edit/:username', authorize, checkPermissions, function(req, res) {
    var username = req.params.username;
    if(username == req.user) {
        res.sendStatus(400);
        return;
    }

    var data = req.body.data;
    core.editUserInfo(username, data)
    .then(() => {
        res.sendStatus(204);
    })
    .catch(handleError(res));
});

app.get('/orders', authorize, checkPermissions, function(req, res) {
    core.getAllOrders()
    .then(orders => {
        res.json(orders);
    })
    .catch(handleError(res));
});

app.get('/orders/close/:id', authorize, checkPermissions, function(req, res) {
    var id = req.params.id;
    core.closeOrder(id)
    .then(() => {
        res.sendStatus(204);
    })
    .catch(handleError(res));
})

app.listen(3000, () => console.log('Server running on port 3000!'));
