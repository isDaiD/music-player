// Toast Function
function toast({
    message = '',
    type = 'info',
    duration = 3000
}) {
    const main = document.getElementById('toast');
    if (main) {
        const toast = document.createElement('div');

        // Auto remove Toast
        const autoRemoveID = setTimeout(function() {
            main.removeChild(toast);
        }, duration + 1000);
        // Remove Toast when clicked
        toast.onclick = function (e) {
            if (e.target.closest('.toast__close')) {
                main.removeChild(toast);
                clearTimeout(autoRemoveID);
            }
        };

        const icons = {
            success: 'fa-solid fa-circle-check',
            info: 'fa-solid fa-info',
            warning: 'fa-solid fa-circle-exclamation',
            error: 'fa-solid fa-circle-exclamation'
        };
        const delay = (duration / 1000).toFixed(2);

        toast.classList.add('toast', `toast--${type}`);
        toast.style.animation = `slideInLeft ease 0.3s, fadeOut linear 1s ${delay}s forwards`;
        toast.innerHTML = `
            <div class="toast__icon">
                <i class="${icons[type]}"></i>
            </div>
            <div class="toast__body">
                <p class="toast__msg">${message}</p>
            </div>
            <div class="toast__close">
                <i class="fa-solid fa-xmark"></i>
            </div>
        `;
        main.appendChild(toast);
    }
}

function showLikeMessage() {
    toast({
        message: 'Đã thêm vào danh sách yêu thích!',
        type: 'success',
        duration: 3000
    });
}

function showUnlikeMessage() {
    toast({
        message: 'Đã xoá khỏi danh sách yêu thích!',
        type: 'error',
        duration: 3000
    });
}