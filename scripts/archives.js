function listPostsPage(now) {
    let page = 0;
    let postNum = 15;
    if (now === undefined) {
        now = 0;
        listPostsBlock(0, postNum);
    }

    $('#pagenum').empty();

    $.ajax({
        url: '/blog/archives/postlist.json',
        async: false,
        success: function (data) {
            const posts = data.posts;
            page = Math.ceil(posts.length / postNum);
        }
    });

    if (page === 0) return;

    if (now + 1 <= 3) {
        listPageNum(0, 5, now, postNum, page);
    } else if (now + 1 >= page - 2) {
        listPageNum(page - 5, page, now, postNum, page);
    } else {
        listPageNum(now - 2, now + 3, now, postNum, page);
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

function listPostsBlock(startNum, endNum) {
    let fileList = [];

    $.ajax({
        url: '/blog/archives/postlist.json',
        async: false,
        success: function (data) {
            fileList = data.posts;
        }
    });

    if (fileList.length === 0) {
        $('.content').prepend(`<h3 class="nopost">目前沒有文章......</h3>`);
        $('#postblock, #pagenum').css("display", "none");
        return;
    }

    if (startNum >= fileList.length) {
        $('.content').prepend(`<h3 class="nopost">沒有更多文章了......</h3>`);
        $('#postblock').css("display", "none");
        return;
    }

    $('#postblock').css("display", "table");
    fileList.reverse();

    for (let i = startNum; i < endNum && i < fileList.length; i++) {
        const post = fileList[i];
        const postUrl = `/blog/archives/${post.id}`;

        $.ajax({
            url: `${postUrl}/index.html`,
            async: false,
            success: function (postContent) {
                const doc = new DOMParser().parseFromString(postContent, 'text/html');
                const time = doc.getElementById('posttime').innerText;
                const posttitle = doc.getElementById('posttitle').innerText;
                const element = `
                    <tr>
                        <td class="time enw3">${time}</td>
                        <td class="posttitle">
                            <a href="${postUrl}" class="zhwb" title="${posttitle}">${posttitle}</a>
                        </td>
                    </tr>`;
                $('#postlist').append(element);
            }
        });
    }
}
