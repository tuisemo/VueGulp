const UserModel = require('./lib/mongoModel').UserModel

module.exports = {
    findUser(data) {
        UserModel.findOne({ "name": data.name }).then(function(data) {
            // body...
        });
    },
    addUser(data) {
        UserModel.findOne({ "name": data.name }).then(function(data) {
            if (!data) {
                UserModel.findOne({ "mobile": data.mobile }).then(function(data) {
                    UserModel.create(data);
                });
            }
        });
    }
    /*,
        getBook(id) {
            return Book
                .findById(id)
                .exec()
        },
        findBook(data) {
            return Book.findOne(data);
        },
        editBook(id, data) {
            return Book
                .findByIdAndUpdate(id, data)
                .exec()
        },
        addBook(req, res) {
            return Book.create(req.body);
        },
        delBook(id) {
            return Book
                .findByIdAndRemove(id)
                .exec()
        }*/
}