var items = []
var itemsRaw = []


function populateBookList(){
  let display = document.getElementById('display')
  fetch('/api/books')
    .then(res => res.json())
    .then(data => {
      itemsRaw = data
      data.forEach((val, i) => {
        items.push('<li class="bookItem" id="' + i + '">' + val.title + ' - ' + val.commentcount + ' comments</li>')
        return ( i !== 14 )
      })
      if (items.length >= 15)
        items.push('<p>...and ' + (data.length - 15) + ' more!</p>')

      let ul = document.createElement('ul')
      ul.classList.add('listWrapper')
      ul.innerHTML = items.join('')

      // Empty the display first
      items = itemsRaw = []
      while (display.firstChild){
        console.log(display.firstChild)
        display.removeChild(display.firstChild)
      }
      display.appendChild(ul)
    })
}

var comments = []
var display = document.getElementById('display')

display.addEventListener('click', function(e) {
  if(e.target && e.target.nodeName == "LI") {
    var that = e.target
    // console.log(this)
    console.log('On LI')
    document.querySelector("#detailTitle").innerHTML = '<b>'+itemsRaw[that.id].title+'</b> (id: '+itemsRaw[that.id]._id+')'
    fetch('/api/books/' + itemsRaw[that.id]._id)
    .then(resp => resp.json())
    .then(function(data) {
      comments = []
      data.comments.forEach((val, i) => comments.push('<li>' + val + '</li>'))
      comments.push('<br><form id="newCommentForm"><input style="width:300px" type="text" class="form-control" id="commentToAdd" name="comment" placeholder="New Comment"></form>')
      comments.push('<br><button class="btn btn-info addComment" id="'+ data._id+'">Add Comment</button>')
      comments.push('<button class="btn btn-danger deleteBook" id="'+ data._id+'">Delete Book</button>')
      document.querySelector('#detailComments').innerHTML = comments.join('')
    })

  }
  // $("#detailTitle").html('<b>'+itemsRaw[this.id].title+'</b> (id: '+itemsRaw[this.id]._id+')')
  // $.getJSON('/api/books/'+itemsRaw[this.id]._id, function(data) {
  //   comments = [];
  //   $.each(data.comments, function(i, val) {
  //     comments.push('<li>' +val+ '</li>');
  //   });
  //   comments.push('<br><form id="newCommentForm"><input style="width:300px" type="text" class="form-control" id="commentToAdd" name="comment" placeholder="New Comment"></form>');
  //   comments.push('<br><button class="btn btn-info addComment" id="'+ data._id+'">Add Comment</button>');
  //   comments.push('<button class="btn btn-danger deleteBook" id="'+ data._id+'">Delete Book</button>');
  //   $('#detailComments').html(comments.join(''));
  // });
})

// document.getElementById('bookDetail').addEventListener('click','button.deleteBook',function() {
document.getElementById('bookDetail').addEventListener('click', function(e){

  if(e.target && e.target.className == 'deleteBook'){
    fetch('/api/books/' + this.id, {
      method: 'DELETE'
    })
    .then(resp => resp.json())
    .then(data => {
      document.querySelector('#detailComments').innerHTML = '<p style="color: red;">' + data.message + '</p><p>Refresh the page</p>'
    })
  }
  else if(e.target && e.target.className.includes('addComment')){
    var newComment = document.querySelector('#commentToAdd').value
    fetch('/api/books/' + e.target.id, {
      method: 'POST',
      body: new URLSearchParams(new FormData(document.querySelector('#newCommentForm'))),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(resp => resp.json())
    .then(data => {
      comments.unshift(newComment); //adds new comment to top of list
      $('#detailComments').html(comments.join(''))
    })

  }

})  

// $('#bookDetail').on('click','button.addComment',function() {
//   var newComment = $('#commentToAdd').val();
//   $.ajax({
//     url: '/api/books/'+this.id,
//     type: 'post',
//     dataType: 'json',
//     data: $('#newCommentForm').serialize(),
//     success: function(data) {
//       comments.unshift(newComment); //adds new comment to top of list
//       $('#detailComments').html(comments.join(''));
//     }
//   });
// });

// document.getElementById('newBook').addEventListener('click', function() {
document.getElementById('newBookForm').addEventListener('submit', function(e){
  // console.log(new FormData(document.getElementById('newBookForm')))
  fetch('/api/books', {
    method: 'POST',
    body: new URLSearchParams(new FormData(this))
  })
  .then(data => {
    console.log('Got back', data)
    populateBookList()
    this.reset()
  })
    // method: 'POST',
    // dataType: 'json',
    // data: $('#newBookForm').serialize(),
    // success: function(data) {
    //   //update list
    // }
  e.preventDefault()
})

document.querySelector('#deleteAllBooks').addEventListener('click', function() {
  fetch('/api/books',{
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(data => populateBookList())
})
  
populateBookList()