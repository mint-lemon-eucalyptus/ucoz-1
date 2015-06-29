//middleware working with localstorage
function Library(config) {
    this.config = config;
    this.items = JSON.parse(localStorage.getItem('books'));
    this.idx = JSON.parse(localStorage.getItem('books-idx'));
    if (this.items == null) {//there is not htable in LS
        this.items = {};
        this.idx = 0;
        localStorage.setItem('books', JSON.stringify(this.items));
        localStorage.setItem('books-idx', this.idx);//books index
    }
}

Library.prototype.put = function (item) {
     function _putToLS(key, v) {
        return localStorage.setItem(key, JSON.stringify(v));
    }

    //validate
    var v = this.validate(item);
    if (v) {
        throw v;
    } else {
        ++this.idx;
        this.items[this.idx] = item;

        _putToLS('books-idx', this.idx);
        _putToLS('books', this.items);
        return this.idx;
    }
}


//validation of book object passed if returned false
Library.prototype.validate = function (item) {
    function isInt(n) {
        return Number(n) === n && n % 1 === 0;
    }

    if (typeof item !== "object") {
        return 'item must be an object';
    }
    if (typeof item.title !== "string" || item.title.length <= 0) {
        return '"title" field must be a non-empty string'
    }
    if (typeof item.author !== "string" || item.author.length <= 0) {
        return '"author" field must be a non-empty string'
    }
    if (!/\d{4}-\d{2}-\d{2}/.test(item.date)) {
        return '"date" format is incorrect'
    }
    if (!isInt(item.pages) || item.pages <= 0) {
        return '"pages" field must be a number greater then 0'
    }
    return false;
}
Library.prototype.list = function () {
    return this.items;
}

Library.prototype.get = function (i) {
    return this.items[i];
}
Library.prototype.delete = function (i) {
    delete this.items[i];
    localStorage.setItem('books', JSON.stringify(this.items));
}

Library.prototype.save = function (item) {
    //validate
    var v = this.validate(item);
    if (v) {
        throw v;
    } else {
        this.items[item.id] = item;
        localStorage.setItem('books', JSON.stringify(this.items));
    }
}