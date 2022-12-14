const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'F8_PLAYER';

const player = $('.player');
const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const progress = $('#progress');
const time_start = $('.controls_time--left');
const time_count = $('.controls_time--right');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');
const option = $('.option');

const app = {
    currenIndex: 0,
    isPlaying: false,
    isRandom: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY))?.isRandom || false,
    isRepeat: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY))?.isRepeat || false,
    arrLike: [],
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    setConfig: function (key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    songsAPI: 'https://62ffaca034344b6431feff9e.mockapi.io/api/songs',
    songs: [],
    render: function () {
        const _this = this;
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currenIndex ? 'active' : ''}" data-index="${index}">
                    <div class="thumb"
                        style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="equalizer-container">
                        <ol class="equalizer-column">
                            <li class="colour-bar"></li>
                        </ol>
                        <ol class="equalizer-column">
                            <li class="colour-bar"></li>
                        </ol>
                        <ol class="equalizer-column">
                            <li class="colour-bar"></li>
                        </ol>
                        <ol class="equalizer-column">
                            <li class="colour-bar"></li>
                        </ol>
                        <ol class="equalizer-column">
                            <li class="colour-bar"></li>
                        </ol>
                </div>                
                    <div class="option">
                        <i class="option__like-icon-empty fa-regular fa-heart"></i> 
                        <i class="option__like-icon-fill fa-solid fa-heart"></i>
                    </div>
                </div>
            `
        });
        playlist.innerHTML = htmls.join('');
    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currenIndex];
            }
        });
    },
    handleEvents: function () {
        const _this = this;
        const cdwidth = cd.offsetWidth;
        // X??? l?? CD quay v?? d???ng
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000, // 10 seconds
            iterations: Infinity,
        })
        cdThumbAnimate.pause();
        // X??? l?? ph??ng to thu nh???
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newWidth = cdwidth - scrollTop;
            cd.style.width = newWidth > 0 ? newWidth + 'px' : 0;
            cd.style.opacity = newWidth / cdwidth;
        };
        // X??? l?? khi click n??t play
        playBtn.onclick = function () {
            if (!_this.isPlaying) {
                audio.play();
            }
            else {
                audio.pause();
            }
        };
        // Khi b??i h??t ???????c ph??t
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        };
        // Khi b??i h??t ???????c t???m d???ng
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }
        // Khi ti???n ????? b??i h??t thay ?????i
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
            }
            // Th???i l?????ng tr???c ti???p c???a b??i h??t
            var seconds = Math.floor(audio.currentTime);
            var d = seconds % 60;
            var b = Math.floor(seconds / 60); // number of minutes
            if (d < 10) {
                var c = 0;
            } else {
                c = "";
            }
            time_start.textContent = '0' + b + ":" + c + d;
            _this.loadTimeSong();
        }
        // X??? l?? khi tua b??i h??t
        progress.oninput = function (e) {
            const seekTime = e.target.value * audio.duration / 100;
            audio.currentTime = seekTime;
            progress.value = seekTime;
        };
        // X??? l?? khi click n??t Next
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            }
            else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
            _this.loadLocalStorage();
        }
        // X??? l?? khi click n??t Prev
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            }
            else {
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
            _this.loadLocalStorage();
        }
        // X??? l?? khi b???t / t???t Random Song
        randomBtn.onclick = function () {
            if (_this.isRepeat) {
                _this.isRepeat = !_this.isRepeat;
                repeatBtn.classList.toggle('active', _this.isRepeat);
            }
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRepeat', _this.isRepeat);
            _this.setConfig('isRandom', _this.isRandom);
            randomBtn.classList.toggle('active', _this.isRandom);
        }
        // X??? l?? khi b???t / t???t RepeatBtn
        repeatBtn.onclick = function () {
            if (_this.isRandom) {
                _this.isRandom = !_this.isRandom;
                randomBtn.classList.toggle('active', _this.isRandom);
            }
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRandom', _this.isRandom);
            _this.setConfig('isRepeat', _this.isRepeat);
            repeatBtn.classList.toggle('active', _this.isRepeat);
        }
        // X??? l?? Next Song khi b??i h??t k???t th??c
        audio.onended = function () {
            if (_this.isRepeat) {
                playBtn.click();
            }
            else {
                nextBtn.click();
            }
            _this.render();
            _this.scrollToActiveSong();
            _this.loadLocalStorage();
        };
        // L???ng nghe h??nh vi click v??o playlist
        playlist.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)');
            const optionNode = e.target.closest('.option');
            if (songNode || optionNode) {
                // X??? l?? khi click v??o song
                if (songNode && !optionNode) {
                    const index = Number(songNode.getAttribute('data-index'))
                    _this.currenIndex = index;
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                    _this.loadLocalStorage();
                }
                // X??? l?? khi th??ch b??i h??t
                else if (optionNode) {
                    const index = Number(e.target.closest('.song').getAttribute('data-index'))
                    // _this.arrLike.splice(index, 1, !_this.arrLike[index]);
                    _this.arrLike[index] = !_this.arrLike[index];
                    optionNode.classList.toggle('active', _this.arrLike[index]);
                    _this.setConfig('arrLike', _this.arrLike);
                    // Hi???n th??ng b??o
                    if (_this.arrLike[index]) {
                        showLikeMessage();
                    }
                    else {
                        showUnlikeMessage();
                    }
                }
            }
        }
    },
    loadTimeSong: function () {
        // Th???i l?????ng b??i h??t
        var timesSong = Math.floor(audio.duration);
        var dd = timesSong % 60; //number of second
        var bb = Math.floor(timesSong / 60); //number of minutes    
        if (dd < 10) {
            var cc = 0;
        } else {
            cc = "";
        }
        if (bb.toString() !== "NaN" || dd.toString() !== "NaN") {
            time_count.textContent = '0' + bb + ":" + cc + dd;
        }
    },
    scrollToActiveSong: function () {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'end',
            });
        }, 300)
    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong?.name;
        cdThumb.style.backgroundImage = `url(${this.currentSong?.image})`;
        audio.src = this.currentSong?.path;
    },
    loadConfig: function () {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
        // Object.assign(this, this.config)
    },
    nextSong: function () {
        this.currenIndex++;
        if (this.currenIndex >= this.songs.length) {
            this.currenIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function () {
        this.currenIndex--;
        if (this.currenIndex < 0) {
            this.currenIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    playRandomSong: function () {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        }
        while (newIndex === this.currenIndex);
        this.currenIndex = newIndex;
        this.loadCurrentSong();
    },
    arrLikeInit: function () {
        this.arrLike = JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY))?.arrLike || new Array(this.songs.length).fill(false);
    },
    loadLocalStorage: function () {
        const songs = $$('.playlist .song');
        _this = this;
        randomBtn.classList.toggle('active', this.isRandom);
        repeatBtn.classList.toggle('active', this.isRepeat);
        // optionNode.classList.toggle('active', _this.arrLike[index]);
        songs.forEach(function (song, index) {
            const optionNode = song.querySelector('.option');
            optionNode.classList.toggle('active', _this.arrLike[index]);
        });
    },
    getSongsAPI: async function () {
        let songs;
        // const res = await fetch(this.songsAPI)
        // songs = await res.json();
        // this.songs = await songs;
        await fetch(this.songsAPI)
            .then(async function (response) {
                return await response.json();
            })
            .then(async function(data) {
                songs = await data;
            })
        this.songs = await songs;
    },
    start: async function () {
        // Ch??? g???i xong API ????? l???y d??? li???u truy???n v??o this.songs (arr)
        await this.getSongsAPI();
        // Kh???i t???o danh s??ch y??u th??ch
        this.arrLikeInit();
        // G??n c???u h??nh t??? config v??o ???ng d???ng
        // this.loadConfig();
        // ?????nh ngh??a c??c thu???c t??nh cho Object
        this.defineProperties();
        // L???ng nghe / x??? l?? c??c s??? ki???n
        this.handleEvents();
        // T???i th??ng tin b??i h??t ?????u ti??n v??o UI khi ch???y ???ng d???ng
        this.loadCurrentSong();
        // Render playlist
        this.render();
        // Hi???n th??? tr???ng th??i ban ?????u c???a repeat, random, options ???????c active
        this.loadLocalStorage();
    }
}
app.start();