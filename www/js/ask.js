$(function(){
  $('form').submit(function(e){
    e.preventDefault();
    var data = $(this).serialize();
    $.post('/user/ask',data,function(res,status,xhr){
      if(status == 'success'){
        if(res.code = 'success'){
          $.popup(res.content,function(){
            location.href = '/index.html'
          })
        }else{
          $.popup(res.content)
        }
      }
    })
  })
})