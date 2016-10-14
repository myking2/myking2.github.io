    $(function(){
      $('form').submit(function(e){
        e.preventDefault();
        var data = $(this).serialize();
        $.post('/user/login',data,function(res,status,xhr){
          if(status == 'success'){
            console.log(res);
            if(res.code == 'success'){
              $.cookie('name',res.data.name);
              $.popup(res.content,function(){
                location.href = '/index.html'
              })
            }else{
              $.popup(res.content)
            }
          }
        })
      })
      $('.register').click(function(){
          location.href = '/register.html'
        })
    })