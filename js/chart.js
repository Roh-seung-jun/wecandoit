$(async ()=>{
    window.canvas = document.getElementById('canvas');
    window.ctx = window.canvas.getContext('2d');
    let data = await getData();
    window.select = [];
    window.label = data.labels;
    const list = data.labels.reduce((answer,item,idx)=>{
        return answer += `<p data-id="${idx}" class="text-center">${item}</p>`
    },'')

    const garden = data.data.reduce((answer,item,idx)=>{
        return answer += `<p><span style="background-color:${item.color};"></span>${item.garden}</p>`
    },'')

    $('.garden').html(garden);
    $('.labels').html(list);
    drawChart();
    setEvent();
})


function setEvent(){
    $(document)
        .on('click','.garden p',selectGarden)
        .on('click','.labels p',selectLabel)
}


function selectGarden(){
    $(this).hasClass('select') ? $(this).removeClass('select') : $(this).addClass('select');

    let data = [];
    $('.garden p').each((idx,item)=>{
        if($(item).hasClass('select'))
        data.push(idx);
    })
    if(data.length >= 4) {
        $(this).removeClass('select');
        return alert('3개까지만 가능하다 게이야');
    }
    window.select = data;
    drawChart();
}

async function selectLabel(){
    $(this).hasClass('none') ? $(this).removeClass('none') : $(this).addClass('none');

    let data = await getData();
    let arr = [];
    $('.labels p').each((idx,item)=>{
        if(!$(item).hasClass('none'))
            arr.push(data.labels[$(item).attr('data-id')]);
    })
    if(arr.length <= 2 ) {
        $(this).removeClass('none');
        return alert('3개 밑으로는 안 된다 게이야');
    }
    window.label = arr;
    drawChart();
}


async function getData(){
    return await fetch('./js/chart.json').then(res=>res.json());
}

async function drawChart(){
    const canvas = window.canvas,
          ctx = window.ctx;

    const total = window.label.length,
          c = {x : canvas.width/2 , y : canvas.height/2},
          angle = 2 * Math.PI / total;

    let r = 0,
        max_ratio = 300;

    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = '#fff';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.strokeStyle = 'lightgray';
    ctx.lineWidth = 1;
    ctx.font = '15px arial';
    ctx.textAlign = 'center';

    for(let i = 0; i <=5 ;i++){
        for (let a = 0; a< total;a++){
            ctx.beginPath();
            ctx.moveTo(xx(c.x,r,angle,a),yy(c.y,r,angle,a));
            ctx.lineTo(xx(c.x,r,angle,a+1),yy(c.y,r,angle,a+1));
            ctx.stroke();
        }
        r+=60
    }

    for(let i = 0; i< total;i++){
        ctx.beginPath();
        ctx.moveTo(c.x,c.y);
        ctx.lineTo(xx(c.x,max_ratio,angle,i),yy(c.y,max_ratio,angle,i));
        ctx.stroke();

        ctx.fillStyle = '#000';
        ctx.fillText(window.label[i],xx(c.x,330,angle,i),yy(c.y,330,angle,i));
    }
    let json = await getData();
    console.log(json);
    window.select.forEach((item,idx)=>{
        console.log(data.data[item].data);
        const obj = data.data[item];
        for (let i = 0; i < total; i++){
            const ratio = max_ratio * (data.data[i] / max_ratio);
            const next_ratio = max_ratio * (data.data[i+1===total?0:i+1] / max_ratio);

        }
    })

}

const xx =(x,r,a,i)=> x+r*Math.cos(a*i);
const yy =(x,r,a,i)=> x+r*Math.sin(a*i);