function listPostsPage(now){
  let page=0;
  let postNum=15;
  $.ajax({
    url: '/blog/archives/postlist.txt',
    async: false,
    success: function(data){
      page = Math.ceil((data.split('\n').filter(line => line.trim() !== '').length) / postNum);
    }
  }); 
  if(now==undefined){
    now=0;
    listPostsBlock(0,postNum);
  }
  $('#pagenum').empty();
  if(page==0){
    return;
  }else if (now+1<=3){
    listPageNum(0,5,now,postNum,page);
  }else if(now+1>=page-2){
    listPageNum(page-5,page,now,postNum,page);
  }else{
    listPageNum(now-2,now+3,now,postNum,page);
  }
}

function listPageNum(start,end,now,postNum,page){
  for (let i=start; i<end; i++) {
    if(i<0 || i>=page){
      continue;
    }
    if (i==now){
      $('#pagenum').append(`<li class="nownum" onclick="$('#postlist').empty();listPostsBlock(${i*postNum}, ${(i+1)*postNum});listPostsPage(${i});">${i+1}</li>`);
    }else{
      $('#pagenum').append(`<li class="num" onclick="$('#postlist').empty();listPostsBlock(${i*postNum}, ${(i+1)*postNum});listPostsPage(${i});">${i+1}</li>`);
    }
  }
}
  
function listPostsBlock(startNum,endNum){
  let fileList = [];
  $.ajax({
    url: '/blog/archives/postlist.txt',
    async: false,
    success: function(data){
      fileList = data.split('\n').filter(line => line.trim() !== '');
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
    let post=fileList[i].split(' ');
    let postPath=post[0];
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