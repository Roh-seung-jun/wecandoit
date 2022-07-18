class View {
    constructor(){
        this.garden = decodeURIComponent(window.location.search).replace('?','');

        this.down = false;
        this.size = { width : $('.wrapper').width(), height : $('.wrapper').height()};
        this.start = {x:0,y:0};
        this.now = {x:0,y:0};
        this.prev = {x:0,y:0};
        this.setView();
        this.setEvent();
    }

    setView(){
        let text =`
                        <img src="./garden/${this.garden}/top.png" alt="" class="scene top">
                        <img src="./garden/${this.garden}/left.png" alt="" class="scene left">
                        <img src="./garden/${this.garden}/bottom.png" alt="" class="scene bottom">
                        <img src="./garden/${this.garden}/front.png" alt="" class="scene front">
                        <img src="./garden/${this.garden}/back.png" alt="" class="scene back">
                        <img src="./garden/${this.garden}/right.png" alt="" class="scene right">`
        $('.view_box').html(text);
    }

    setEvent(){
        $(document)
            .on('mousedown','.wrapper',e => {
                this.down = true;
                this.start.x = e.pageX;
                this.start.y = e.pageY;
            })
            .on('mousemove','.wrapper',e=>{
                if(!this.down) return;
                $('.wrapper').css('cursor','grabbing');
                const moveX = this.start.x - e.pageX; //기준점에서의 세로 좌표 차이 계산
                const moveY = -(this.start.y - e.pageY); //기준점에서의 가로 좌표 차이 계산

                this.now.x = (360 / this.size.width * moveX) /2;
                this.now.y = (360 / this.size.height * moveY) /2;

                let rotateX = this.prev.y + this.now.y; // 처음 중앙의 가로기준이 처음 기준이 되지 않게
                rotateX = rotateX >= 90 ? 90 : rotateX;
                rotateX = rotateX <= -90 ? -90 : rotateX;

                let rotateY = this.prev.x + this.now.x; // 처음 중아의 세로기준이 처음 기준이 되지 않게
                $('.view_box').css('transform',`translateZ(var(--center)) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
            })
            .on('mouseup mouseleave','.wrapper',e=>{
                $('.wrapper').css('cursor','grab');
                this.down = false;
                this.prev.x += this.now.x;
                this.prev.y += this.now.y;
                this.prev.y = this.prev.y >= 90 ? 90 : this.prev.y <= -90 ? -90 : this.prev.y;
            })
    }
}

$(()=>{
    new View();
})

