// 頁籤切換功能
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // 移除所有頁籤的 active 狀態
        tabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        // 設定被點擊的頁籤和對應內容為 active
        tab.classList.add('active');
        document.getElementById(tab.dataset.target).classList.add('active');
    });
});