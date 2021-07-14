const defaultCharmap = ['⬜','1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','💣'];

function getNeighboursCells(grid,x,y,width,height){
    const ret = [];
    for(let neighbourX=Math.max(0,x-1); neighbourX<Math.min(x+2,width); neighbourX++){
        for(let neighbourY=Math.max(0,y-1); neighbourY<Math.min(y+2,height); neighbourY++){
            if(neighbourX!=x || neighbourY!=y) ret.push(grid[neighbourY][neighbourX]);
        }
    }
    return ret;
}
function countNeighboursMines(grid,x,y,width,height){
    return getNeighboursCells(grid,x,y,width,height).filter(c=>c.mine).length;
}
function countClearNeighbours(grid,x,y,width,height){
    return getNeighboursCells(grid,x,y,width,height).filter(c=>c.visible && c.neighbours==0).length;
}
function uncover(grid, width, height){
    let found=true;
    while (found==true) {
        found = false;
        for(let x=0; x<width; x++){
            for(let y=0; y<height; y++){
                const cell = grid[y][x];

                if(!cell.visible && !cell.mine){
                    if(countClearNeighbours(grid,x,y,height,width)) {
                        console.log('found')
                        found = true;
                        cell.visible = true;
                    }
                }
            }
        }
    }
}

export default function generateGrid(width, height, mines, generateSafePatch, charmap){
    const grid = Array(height).fill().map(()=>Array(width).fill().map(()=>({mine:false,generated:false,visible:false,neighbours:0})));
    let mineCount = mines;

    if(generateSafePatch){
        const x = Math.floor(Math.random() * width)
        const y = Math.floor(Math.random() * height)
        for(let clearx=Math.max(0,x-1); clearx<Math.min(x+2,width); clearx++){
            for(let cleary=Math.max(0,y-1); cleary<Math.min(y+2,height); cleary++){
                grid[cleary][clearx].mine=false;
                grid[cleary][clearx].generated=true;
                grid[cleary][clearx].visible=true;
            }
        }
    }

    while(mineCount) {
        const x = Math.floor(Math.random() * width)
        const y = Math.floor(Math.random() * height)
        if (!grid[y][x].generated) {
            grid[y][x].mine=true;
            grid[y][x].generated=true;
            mineCount--;
        }
    }
    
    grid.forEach((row,y)=> row.forEach( (cell,x) => { cell.neighbours = cell.mine ? 9 : countNeighboursMines(grid,x,y,width,height); }));

    uncover(grid, width, height);

    if (!charmap) charmap=defaultCharmap;
    const charGrid = grid.map((row,y)=>
        row.map( (cell,x) => {
            let char = charmap[cell.neighbours];
            return cell.visible ? char : `||${char}||`
        })
    );

    return charGrid.map(row=>row.join('')).join('\n');
}