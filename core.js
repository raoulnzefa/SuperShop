var fs = require('fs');
var util = require('util');

var readFile = util.promisify(fs.readFile);
var writeFile = util.promisify(fs.writeFile);
var readDir = util.promisify(fs.readdir);
var access = util.promisify(fs.access);
var unlink = util.promisify(fs.unlink);

const itemsPath = 'items/';
const categoriesPath = './';
const categoriesFile = 'categories.json';
const usersPath = 'users/';
const ordersPath = './';
const ordersFile = 'orders.json';

function readJSON(path) { return readFile(path).then(data => JSON.parse(data)); }

// ITEMS

function getItems(category) {
    return new Promise((resolve, reject) => {
        Promise.all([getAllCategories(), readDir(itemsPath)])
        .then(res => {
            categories = res[0];
            data = res[1];
            promises = [];
            for (var i = 0; i < data.length; i++) {
                data[i] = data[i].slice(0, -5);
                promises[i] = getItem(data[i]);
            }
            Promise.all(promises)
            .then(details => {
                products = {};
                for (var [index, value] of details.entries()) {
                    var pre = categories[value.category].pre;
                    var from = categories[category].pre;
                    var to = categories[category].post;
                    if(pre >= from && pre <= to)
                        products[data[index]] = value;
                }
                resolve(products);
            })
            .catch(e => {
                reject(e);
            });
        })
        .catch(e => {
            console.log(e);
        })
    });
}

function getItem(key) {
    var path = itemsPath + key + '.json';
    return readJSON(path);
}

function getAllCategories() {
    var path = categoriesPath + categoriesFile;
    return readJSON(path);
}

function getCategories(parent) {
    return new Promise((resolve, reject) => {
        getAllCategories()
        .then(data => {
            var categories = [ {} ];
            for(var item of data) {
                if(item.id == parent) {
                    categories[0] = item;
                }
                if(item.parent == parent) {
                    delete item.parent;
                    categories.push(item);
                }
            }
            resolve(categories);
        })
        .catch(e => {
            reject(e);
        })
    });
}

// USERS

function getUserData(usr) {
    var path = usersPath + usr + '.json';
    return readJSON(path);
}

function setUserData(usr, data) {
    var path = usersPath + usr + '.json';
    var jsondata = JSON.stringify(data);
    return writeFile(path, jsondata, 'utf8');
}

function sumItemsCnt(items) {
    sum = 0;
    for(var item of items) {
        sum = sum + item.cnt;
    }
    return sum;
}

function login(usr, pswd) {
    return new Promise((resolve, reject) => {
        getUserData(usr)
        .then(data => {
            if(data.password == pswd) {
                resolve();
            } else {
                reject({ errorMsg: "Invalid username/password." });
            }
        })
        .catch(e => {
            reject({ errorMsg: "Invalid username/password." });
        });
    });
}

function register(data) {
    return new Promise((resolve, reject) => {
        checkUsername(data.username)
        .then(() => {
            data.items = [];
            data.admin = false;
            return setUserData(data.username, data);
        })
        .then(() => {
            resolve();
        })
        .catch(e => {
            reject(e);
        });
    });
}

function checkUsername(username) {
    return new Promise((resolve, reject) => {
        access(usersPath + username + '.json')
        .then(() => {
            reject({ errorMsg: "Username not available." });
        })
        .catch(() => {
            resolve();
        });
    });
}

function userinfo(usr) {
    return getUserData(usr)
    .then(data => {
        delete data.password;
        data.items = sumItemsCnt(data.items);
        return data;
    });
}

function countItemsInCart(usr) {
    return new Promise((resolve, reject) => {
        getUserData(usr)
        .then(data => {
            resolve(sumItemsCnt(data.items));
        })
        .catch(e => {
            reject(e);
        });
    });
}

function addToCart(usr, item, cnt = 1) {
    return new Promise((resolve, reject) => {
        getUserData(usr)
        .then(data => {
            ind = data.items.findIndex(cartItem => cartItem.key == item);
            if(ind == -1) {
                data.items.push({ key: item, cnt: cnt });
            } else {
                cartItem = data.items[ind];
                cartItem = {
                    key: item,
                    cnt: cartItem.cnt + cnt
                };
                data.items[ind] = cartItem;
            }
            var filtered = [];
            for(var dataItem of data.items) {
                if(dataItem.cnt > 0) {
                    filtered.push(dataItem);
                }
            }
            data.items = filtered;
            return setUserData(usr, data)
            .then(() => {
                resolve(sumItemsCnt(data.items));
            });
        })
        .catch(e => {
            reject(e);
        });
    });
}

function getCartContents(usr) {
    return new Promise((resolve, reject) => {
        getUserData(usr)
        .then(data => {
            items = data.items;
            promises = [];
            for(var item of items) {
                promises.push(getItem(item.key));
            }
            Promise.all(promises)
            .then(details => {
                cart = []
                for(var i = 0; i < items.length; i++) {
                    var cartItem = {
                        key: items[i].key,
                        name: details[i].name,
                        cnt: items[i].cnt
                    };
                    cart.push(cartItem);
                }
                resolve(cart);
            })
            .catch(e => {
                reject(e);
            });
        })
        .catch(e => {
            reject(e);
        });
    });
}

function getOrders() {
    var path = ordersPath + ordersFile;
    return readJSON(path);
}

function setOrders(data) {
    var path = ordersPath + ordersFile;
    var jsondata = JSON.stringify(data);
    return writeFile(path, jsondata, 'utf8');
}

function placeOrder(usr) {
    return new Promise((resolve, reject) => {
        getUserData(usr)
        .then(data => {
            if(data.items.length == 0) {
                reject({ errorMsg: 'You can\'t place empty orders.'});
            }
            getOrders()
            .then(orders => {
                id = 0;
                if(orders.length > 0) {
                    id = orders[orders.length - 1].id + 1;
                }
                order = {
                    id: id,
                    username: usr,
                    items: data.items
                };
                orders.push(order);
                return setOrders(orders);
            })
            .then(() => {
                data.items = [];
                setUserData(usr, data);
            })
            .then(() => {
                resolve();
            })
            .catch(e => reject(e));
        })
        .catch(e => reject(e));
    });
}

// ADMIN

function checkPermissions(usr) {
    return new Promise((resolve, reject) => {
        getUserData(usr)
        .then(data => {
            if(data.admin) {
                resolve();
            }
            else {
                reject({ errorStat: 401 });
            }
        })
        .catch(e => {
            reject(e);
        });
    });
}

function getAllItems() {
    return new Promise((resolve, reject) => {
        Promise.all([getAllCategories(), readDir(itemsPath)])
        .then(res => {
            categories = res[0];
            data = res[1];
            promises = [];
            for (var i = 0; i < data.length; i++) {
                data[i] = data[i].slice(0, -5);
                promises[i] = getItem(data[i]);
            }
            Promise.all(promises)
            .then(details => {
                products = [];
                for (var [index, value] of details.entries()) {
                    item = {
                        key: data[index],
                        category: categories[value.category].name,
                        name: value.name
                    };
                    products.push(item);
                }
                resolve(products);
            })
            .catch(e => {
                reject(e);
            });
        })
        .catch(e => {
            console.log(e);
        })
    });
}

function removeItem(key) {
    var path = itemsPath + key + '.json';
    return unlink(path);
}

function addItem(key, data) {
    var path = itemsPath + key + '.json';
    var jsondata = JSON.stringify(data);
    return writeFile(path, jsondata, 'utf8');
}

function getUsers() {
    return readDir(usersPath)
    .then(files => {
        promises = [];
        for(var f of files) {
            var user = f.slice(0, -5);
            promises.push(getUserData(user));
        }
        return Promise.all(promises);
    })
    .then(users => {
        for(var user of users) {
            delete user.items;
        }
        return users;
    });
}

function removeUser(user) {
    var path = usersPath + user + '.json';
    return unlink(path);
}

function editUserInfo(user, data) {
    return getUserData(user)
    .then(info => {
        info.fullname = data.fullname;
        info.admin = data.admin;
        return setUserData(user, info);
    });
}

function getAllOrders() {
    return new Promise((resolve, reject) => {
        Promise.all([getAllItems(), getOrders(), getUsers()])
        .then(res => {
            items = res[0];
            orders = res[1];
            users = res[2];

            var itemsObj = {};
            for(var item of items) {
                itemsObj[item.key] = item;
            }

            var usersObj = {};
            for(var user of users) {
                usersObj[user.username] = user;
            }

            var list = [];
            for(var order of orders) {
                if(!(order.username in usersObj && item.key in itemsObj)) {
                    continue;
                }

                fullname = usersObj[order.username].fullname;
                var newItems = [];
                var sum = 0;
                for(var item of order.items) {
                    sum = sum + item.cnt;
                    newItems.push({
                        key: item.key,
                        cnt: item.cnt,
                        name: itemsObj[item.key].name
                    });
                }

                var neworder = {
                    id: order.id,
                    user: {
                        username: order.username,
                        fullname: fullname,
                    },
                    items: newItems,
                    cnt: sum
                }
                list.push(neworder);
            }

            resolve(list);
        })
        .catch(e => reject(e));
    });
}

function closeOrder(id) {
    return getOrders()
    .then(orders => {
        var index = orders.findIndex(order => order.id == id);
        orders.splice(index, 1);
        return setOrders(orders);
    });
}

module.exports.getItems = getItems;
module.exports.getItem = getItem;
module.exports.getCategories = getCategories;
module.exports.getAllCategories = getAllCategories;
module.exports.login = login;
module.exports.userinfo = userinfo;
module.exports.register = register;
module.exports.countItemsInCart = countItemsInCart;
module.exports.addToCart = addToCart;
module.exports.getCartContents = getCartContents;
module.exports.getAllItems = getAllItems;
module.exports.checkPermissions = checkPermissions;
module.exports.removeItem = removeItem;
module.exports.addItem = addItem;
module.exports.getUsers = getUsers;
module.exports.removeUser = removeUser;
module.exports.editUserInfo = editUserInfo;
module.exports.placeOrder = placeOrder;
module.exports.getAllOrders = getAllOrders;
module.exports.closeOrder = closeOrder;
