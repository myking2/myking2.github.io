 $(function(){
    var name = $.cookie('name')
    if(name){
    $('.user-name').html('<span class="glyphicon glyphicon-user"></span>'+name).addClass('online'); 
    }else{
    $('.user-name').html('<span class="glyphicon glyphicon-user"></span>登录');    
    }
    //用户下拉
    $('body').on('click','.user-name',function(){
        if($(this).hasClass('online')){          
            $(".user-info").css({
              top: 50 + "px",
              right: -7 + "px"
            });
            $(".user-info").slideToggle();        
        }else{
          location.href = '/login.html'
        }
    })
    //下拉退出
    $(".user-info a:last-child").click(function(event) {
      $.cookie('name',name,{
       expires:-1
      });
      $.popup("退出成功",function(){
        location.href = '/index.html'
      })
    })
    //提问跳转
    $('.asksrc').click(function(){
     if(name){       
       location.href = '/ask.html'
     }else{
       location.href = '/login.html'
     }
    })  
    //点击进行回答
    $('.messages').on('click','.ask',function(e){
        //获取问题文件名
        var question = $(this).attr('data-time');
        //文件名写入cookie
        $.cookie('question',question);
        //跳转回答页面
        // location.href = '/answer.html';
        if(name){
          location.href = '/answer.html?question='+question;
        }else{
          location.href = '/login.html'
        }
        
      })   
      //问答列表
      $.getJSON('/questions',function(res,status){
        if(status == 'success'){
          //res.data所有问题的数据(包括回答)
          var allAsks = res.data;
          var html = '';
          allAsks.forEach(function(askObj){
            html=html +'<li class="ask" data-time="'+askObj.time+'">'
                      +'<img src="uploads/'+askObj.name+'.jpg" alt="" class="user-photo fl" width="64" height="64">'
                      +'<h2 class="h2-title">'+askObj.name+'</h2>'
                      +'<p class="ptext">'+formatContent(askObj.content)+'</p>'
                      +'<p class="ptime">'+formatTime(askObj.time)+'</p>'
                      +'</li>';
                      
             // if(askObj.answer != ''){
              if(askObj.answer){
              // console.log(askObj.answer[0])
              var answersObj = askObj.answer;
              answersObj.forEach(function(answerObj){
                 html = html + '<li class="answer" data-time="'+askObj.answer.time+'">'
                      +'<img src="uploads/'+answerObj.name+'.jpg" alt="" class="user-photo fl" width="64" height="64">'
                      +'<h2 class="h2-title">'+answerObj.name+'</h2>'
                      +'<p class="ptext">'+formatContent(answerObj.content)+'</p>'
                      +'<p class="ptime">'+formatTime(answerObj.time)+'</p>'
                      +'</li>'
              })            
            }                    
          })
          $('.messages').html(html);
        }
      })    
  })