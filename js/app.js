//this file used for interaction of storage middleware with html
var library = new Library({itemsContainer: '#list-container'});
var container = _gid('#list-container>tbody');
var currentElementId = null;

function _gid(sel) {
    return document.querySelector(sel);
}

function onSaveBtnClick() {
    var item = {
        title: _gid('#title').value,
        author: _gid('#author').value,
        date: _gid('#date').value,
        pages: parseInt(_gid('#pages').value)
    };
    try {
        if (currentElementId) {
            item.id = currentElementId;
            library.save(item);
            updateItem(item);
            alert('updated successful');
        } else {
            //add new book
            var id = library.put(item);
            addItem(id, item);
            alert('added successful');
        }
    } catch (e) {
        alert(e);
        return;
    }
    onClearBtnClick();
}
function onClearBtnClick() {
    _gid('#title').value = '';
    _gid('#author').value = '';
    _gid('#date').value = '';
    _gid('#pages').value = '';
    currentElementId = null;
}

function addItem(i, item) {
    var bookElem = document.createElement('tr');
    bookElem.setAttribute('data-id', i);
    var titleEl = document.createElement('td');
    titleEl.innerHTML = item.title;
    bookElem.appendChild(titleEl);
    var authorEl = document.createElement('td');
    authorEl.innerHTML = item.author;
    bookElem.appendChild(authorEl);
    var dateEl = document.createElement('td');
    dateEl.innerHTML = item.date;
    bookElem.appendChild(dateEl);
    var pagesEl = document.createElement('td');
    pagesEl.innerHTML = item.pages;
    bookElem.appendChild(pagesEl);

    var remEl = document.createElement('td');
    var remBtn = document.createElement('button');
    remBtn.innerHTML = 'Remove';
    remBtn.setAttribute('data-id', i);
    remBtn.className = 'btn btn-warning';
    remBtn.onclick = onRemoveClick;
    remEl.appendChild(remBtn);
    bookElem.appendChild(remEl);

    var editEl = document.createElement('td');
    var editBtn = document.createElement('button');
    editBtn.onclick = onEditClick;
    editBtn.innerHTML = 'Edit';
    editBtn.setAttribute('data-id', i);
    editBtn.className = 'btn btn-success';
    editEl.appendChild(editBtn);
    bookElem.appendChild(editEl);

    container.appendChild(bookElem);
}

function updateItem(item) {
    var bookElem = _gid('tr[data-id="' + item.id + '"]');
    var childs = bookElem.childNodes;
    childs[0].innerHTML = item.title;
    childs[1].innerHTML = item.author;
    childs[2].innerHTML = item.date;
    childs[3].innerHTML = item.pages;
}

function retrieveBooks() {
    var arr = library.list();
    if (Object.keys(arr).length == 0) {  //random seed
        random_data.forEach(function (i) {
            library.put(i);
        });
    }
    arr = library.list();
    for (var i in arr) {
        addItem(i, arr[i]);
    }
}


function onRemoveClick(e) {
    var dataId = e.target.getAttribute('data-id');
    container.removeChild(_gid('tr[data-id="' + dataId + '"]'));
    library.delete(dataId);
}
function onEditClick(e) {
    var dataId = e.target.getAttribute('data-id');
    var elem = library.get(dataId);
    _gid('#title').value = elem.title;
    _gid('#author').value = elem.author;
    _gid('#date').value = elem.date;
    _gid('#pages').value = elem.pages;
    currentElementId = dataId;
}