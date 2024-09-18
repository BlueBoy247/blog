function countPosts(name){
  let num=0;
  $.ajax({
    url: `/blog/archives/postlist.txt`,
    async: false,
    success: function(data){
      num = data.replaceAll('\r\n', '\n')
                .split('\n')
                .filter(line => line.trim() !== '')
                .map(line => line.split(' '))
                .filter(line => line[1] === name)
                .length;
    }
  });
  document.getElementById(name).innerHTML = num;
}

function listPostsPageByTag(name,now){
    let page=0;
    let postNum=15;
    $.ajax({
      url: `/blog/archives/postlist.txt`,
      async: false,
      success: function(data){
        page = Math.ceil((data.replaceAll('\r\n', '\n')
                              .split('\n')
                              .filter(line => line.trim() !== '')
                              .map(line => line.split(' '))
                              .filter(line => line[1] === name)
                              .length) / postNum);
      }
    }); 
    if(now==undefined){
      now=0;
      listPostsBlockByTag(name,0,postNum);
    }
    $('#pagenum').empty();
    if(page==0){
      return;
    }else if (now+1<=3){
      listPostNumByTag(name,0,5,now,postNum,page);
    }else if(now+1>=page-2){
      listPostNumByTag(name,page-5,page,now,postNum,page);
    }else{
      listPostNumByTag(name,now-2,now+3,now,postNum,page);
    }
  }
  
  function listPostNumByTag(name,start,end,now,postNum,page){
    for (let i=start; i<end; i++) {
      if(i<0 || i>=page){
        continue;
      }
      if (i==now){
        $('#pagenum').append(`<li class="nownum" onclick="$('#postlist').empty();listPostsBlockByTag(${name}, ${i*postNum}, ${(i+1)*postNum});listPostsPageByTag(${i});">${i+1}</li>`);
      }else{
        $('#pagenum').append(`<li class="num" onclick="$('#postlist').empty();listPostsBlockByTag(${name}, ${i*postNum}, ${(i+1)*postNum});listPostsPageByTag(${i});">${i+1}</li>`);
      }
    }
  }
    
  function listPostsBlockByTag(name,startNum,endNum){
    let fileList = [];
    $.ajax({
      url: `/blog/archives/postlist.txt`,
      async: false,
      success: function(data){
        fileList = data.replaceAll('\r\n', '\n')
                      .split('\n')
                      .filter(line => line.trim() !== '');
                      fileList=fileList.map(line => line.split(' '))
                      fileList=fileList
                      .filter(line => line[1] === name);
      }
    });

    if (fileList==[] || fileList==""){
      $('.content').prepend(`<p class="nopost">目前沒有文章......</p>`);
      $(`#postblock`).css("display","none");
      $(`#pagenum`).css("display","none");
      return;
    }else if(fileList[startNum]==undefined){
      $('.content').prepend(`<p class="nopost">沒有更多文章了......</p>`);
      $(`#postblock`).css("display","none");
      return;
    }

    $(`#postblock`).css("display","table");
    fileList.reverse();

    for (let i=startNum; i<endNum && i<fileList.length; i++) {
      let postPath=fileList[i][0];
      let postUrl=`/blog/archives/${postPath}`;
      $.ajax({
        url: `/blog/archives/${postPath}/index.html`,
        async: false,
        success: function(post){
          post = new DOMParser().parseFromString(post,'text/html');
          let time = post.getElementById('posttime').innerText;
          let posttitle = post.getElementById('posttitle').innerText;
          $('#postlist').append(`<tr><td class="time enw3">${time}</td><td class="posttitle"><a href="${postUrl}" class="zhwb" title="${posttitle}">${posttitle}</a><td></tr>`);
        }
      });
    }
  }