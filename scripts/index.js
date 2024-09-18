function newPost(){
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
    }else if(fileList[0]==undefined){
        $('.content').prepend(`<p class="nopost">沒有更多文章了......</p>`);
        $(`#postblock`).css("display","none");
        return;
    }

    $(`#postblock`).css("display","table");
    fileList.reverse();

    for (let i=0; i<5 && i<fileList.length; i++) {
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

function scrollToContent() {
    let targetElement = document.getElementById('newpost');
    let targetPosition = targetElement.getBoundingClientRect().top;
    let currentScroll = window.scrollY;
    let offset = window.innerHeight * 0.09;

    window.scrollTo({
        top: currentScroll + targetPosition - offset,
        behavior: 'smooth'
    });
}

window.addEventListener("scroll", function() {
    let scrollPosition = window.scrollY;
    let viewportHeight = window.innerHeight;
  
    let header = document.getElementsByTagName("header")[0];
    let styleElement = document.getElementsByTagName("style")[0];
    let opacity = scrollPosition / (0.25 * viewportHeight);
    if (scrollPosition > 0.25 * viewportHeight) {
      opacity = 1;
    }

    header.style.backgroundColor = `rgba(0, 80, 72, ${opacity})`;
    styleElement.innerHTML = `.navb:hover{background-color: rgba(45, 114, 107, ${opacity});}`;
});