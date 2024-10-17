function newPost() {
    let fileList = [];

    $.ajax({
        url: '/blog/archives/postlist.json',
        async: false,
        success: function (data) {
            fileList = data.posts;
        }
    });

    if (fileList.length === 0) {
        $('.content').prepend(`<p class="nopost">目前沒有文章......</p>`);
        $('#postblock, #pagenum').css("display", "none");
        return;
    }

    if (!fileList[0]) {
        $('.content').prepend(`<p class="nopost">沒有更多文章了......</p>`);
        $('#postblock').css("display", "none");
        return;
    }

    $('#postblock').css("display", "table");

    // 反轉順序以顯示最新的文章在最上面
    fileList.reverse();

    for (let i = 0; i < 5 && i < fileList.length; i++) {
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