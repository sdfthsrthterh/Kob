import { AcGameObject } from "./AcGameObject";
import { Wall } from "./Wall";

export class GameMap extends AcGameObject {
    constructor(ctx, parent) {
        super();

        this.ctx = ctx;
        this.parent = parent;
        this.L = 0;  //格子的绝对长度

        this.rows = 13;
        this.cols = 13;
        
        this.inner_walls_count = parseInt(Math.random() * 90); //内部障碍物数量
        this.walls = [];
    }

    //洪水灌溉：从起点搜到终点
    check_connectivity(g, sx, sy, tx, ty) {
        if(sx == tx && sy == ty) return true;
        g[sx][sy] = true;

        let dx = [-1, 0, 1, 0], dy = [0, 1, 0, -1];
        for(let i = 0; i < 4; i++)
        {
            let x = sx + dx[i], y = sy + dy[i];
            if(!g[x][y] && this.check_connectivity(g, x, y, tx, ty))
                return true;
        }
        return false;
    }

    create_walls() {
        const g = []; //true为有墙
        for(let r = 0; r < this.rows; r++)
        {
            g[r] = [];
            for(let c = 0; c < this.cols; c++)
            {
                g[r][c] = false;
            }
        }

        //给四周加上障碍物
        for(let r = 0; r < this.rows; r++)
        {
            g[r][0] = g[r][this.cols - 1] = true;
        }

        for(let c = 0; c < this.cols; c++)
        {
            g[0][c] = g[this.rows - 1][c] = true;
        }



        //创建随机障碍物
        for(let i = 0; i < this.inner_walls_count / 2; i++)
        {
            for(let j = 0; j < 1000; j++)
            {
                let r = parseInt(Math.random() * this.rows);
                let c = parseInt(Math.random() * this.cols); //Math.random()随机一个[0,1)的数，乘上行数和列数就能随机行和列
                if(g[r][c] || g[c][r]) continue;
                //起始的两端不放
                if(c == 1 &&  r == this.rows - 2 || r == 1 && c == this.cols - 2) continue;
                //对称放置
                g[r][c] = g[c][r] = true; 
                break;
            }
        }
        const copy_g = JSON.parse(JSON.stringify(g)); //深拷贝,防止篡改原g数组值
        //如果发现无法搜索到合法路径就直接返回false
        if(!this.check_connectivity(copy_g, this.rows - 2, 1, 1, this.cols - 2)) return false;

        //根据g数组进行画墙
        for(let r = 0;  r < this.rows; r++)
        {
            for(let c = 0; c < this.cols; c++)
            {
                if(g[r][c]) {
                    this.walls.push(new Wall(r, c, this));
                }
            }
        }
        return true; //连通返回true


    }

    start() {
        for(let i = 0; i < 1000; i++) {
            if(this.create_walls()) {  //如果找到合法路径则直接break
                break;
            }
        }
    }

    update_size() {
        //parseInt取整像素点
        this.L = parseInt(Math.min(this.parent.clientWidth / this.cols, this.parent.clientHeight / this.rows));
        this.ctx.canvas.width = this.L * this.cols;
        this.ctx.canvas.height = this.L * this.rows;
    }

    update() {
        this.update_size();
        this.render();
    }

    render() {
        this.ctx.fillStyle = 'green';
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        const color_even = "#AAD751", color_odd = "#A2D149";
        for(let r = 0; r < this.rows; r++)
        {
            for(let c = 0; c < this.cols; c++)
            {
                if((c + r) % 2 == 0)
                {
                    this.ctx.fillStyle = color_even;
                } else {
                    this.ctx.fillStyle = color_odd;
                }
                this.ctx.fillRect(c * this.L, r * this.L, this.L, this.L);
            }
        }

    }


}