$(function(){
      //拦截form提交事件
      $('form').submit(function(e){
        //阻止默认事件
        e.preventDefault();
        //可读取表单的内容使之形成串形字符串,用&连接
        // console.log($(this).serialize())
        //形成数组
        // console.dir($(this).serializeArray())

        //ajax发送请求
        var data = $(this).serialize();
        $.post('/user/register',data,function(res,status,xhr){
          if(status == 'success'){
            if(res.code == 'success'){
              $.popup(res.content,function(){
                location.href = '/login.html';
              });             
            }else{
              $.popup(res.content);
              console.log(res.content);
            }
          }
        })
      })
    })