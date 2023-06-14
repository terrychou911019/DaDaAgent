const { ccclass, property } = cc._decorator;

@ccclass
export class Background extends cc.Component {
    @property([cc.Prefab])
    private backgroundPrefabs: cc.Prefab[] = [];

    @property([cc.Prefab])
    private rarebackgroundPrefabs: cc.Prefab[] = [];

    @property(cc.Node)
    private targetNode: cc.Node;

    @property(cc.Vec2)
    private offset: cc.Vec2 = cc.Vec2.ZERO;

    private instancedBackgrounds: cc.Node[][] = [];

    private rows = 0;
    private columns = 0;
    private nodeSize = 0;

    private playerGridPosX = 0;
    private playerGridPosY = 0;

    onLoad () {
        // Get node size
        const backgroundNode = cc.instantiate(this.backgroundPrefabs[0]);
        this.nodeSize = backgroundNode.width;
        backgroundNode.destroy();
        
        // Calculate rows and columns
        this.rows = Math.ceil(cc.winSize.height / this.nodeSize) + 5;
        this.columns = Math.ceil(cc.winSize.width / this.nodeSize) + 5;
        
        // this.rows = 4;
        // this.columns = 6;

        console.log(this.rows, this.columns, this.nodeSize);

        this.init(this.targetNode);
    }

    update (dt) {
        this.gameTick();
    }

    public init(targetNode: cc.Node): void {
        //this.targetNode = targetNode;

        for (let i = 0; i < this.rows; i++) {
            const rowNodes: cc.Node[] = [];
            for (let u = 0; u < this.columns; u++) {
                //console.log(randomIndex);
                const backgroundNode = this.randomNode();
                backgroundNode.parent = this.node;

                const x = u * this.nodeSize - this.nodeSize + cc.winSize.width / 2 + this.offset.x;
                const y = i * this.nodeSize - this.nodeSize + cc.winSize.height / 2 + this.offset.y;
                backgroundNode.setPosition(cc.v3(x, y, 0));

                rowNodes.push(backgroundNode);
            }

            this.instancedBackgrounds.push(rowNodes);
        }
        //console.log(this.instancedBackgrounds);
    }

    public gameTick(): void {
        this.tryTileX();
        this.tryTileY();
    }

    private tryTileX(): void {
        const playerGridPosX = Math.round((this.targetNode.position.x - cc.winSize.width / 2 - this.offset.x) / this.nodeSize);

        //console.log(playerGridPosX, this.playerGridPosX);
        if (playerGridPosX < this.playerGridPosX) {
            // move the last column to the left
            const columnIndex = this.columns - 1;
            for (let i = 0; i < this.rows; i++) {
                const instancedNode = this.instancedBackgrounds[i][columnIndex];
                const newPosition = instancedNode.position.clone();
                newPosition.x -= this.columns * this.nodeSize;

                instancedNode.setPosition(newPosition);

                this.instancedBackgrounds[i].splice(columnIndex, 1);
                this.instancedBackgrounds[i].unshift(instancedNode);
            }
        } else if (this.playerGridPosX < playerGridPosX) {
            // move the first column to the right
            const columnIndex = 0;
            for (let i = 0; i < this.rows; i++) {
                const instancedNode = this.instancedBackgrounds[i][columnIndex];
                const newPosition = instancedNode.position.clone();
                newPosition.x += this.columns * this.nodeSize;

                instancedNode.setPosition(newPosition);

                this.instancedBackgrounds[i].splice(columnIndex, 1);
                this.instancedBackgrounds[i].push(instancedNode);
            }
        }

        this.playerGridPosX = playerGridPosX;
    }

    private tryTileY(): void {
        const playerGridPosY = Math.round((this.targetNode.position.y - cc.winSize.height / 2 - this.offset.y) / this.nodeSize);

        if (playerGridPosY < this.playerGridPosY) {
            // move the last row down
            const rowIndex = this.rows - 1;
            const nodesInRow = [];
            for (let i = 0; i < this.columns; i++) {
                const instancedNode = this.instancedBackgrounds[rowIndex][i];
                const newPosition = instancedNode.position.clone();
                newPosition.y -= this.rows * this.nodeSize;

                instancedNode.setPosition(newPosition);
                nodesInRow.push(instancedNode);
            }

            this.instancedBackgrounds.splice(rowIndex, 1);
            this.instancedBackgrounds.unshift(nodesInRow);
        } else if (this.playerGridPosY < playerGridPosY) {
            // move the first row up
            const rowIndex = 0;
            const nodesInRow = [];
            for (let i = 0; i < this.columns; i++) {
                const instancedNode = this.instancedBackgrounds[rowIndex][i];
                const newPosition = instancedNode.position.clone();
                newPosition.y += this.rows * this.nodeSize;

                instancedNode.setPosition(newPosition);
                nodesInRow.push(instancedNode);
            }

            this.instancedBackgrounds.splice(rowIndex, 1);
            this.instancedBackgrounds.push(nodesInRow);
        }

        this.playerGridPosY = playerGridPosY;
    }
    private randomNode():cc.Node {
        //the possibility of rare background is (1-0.9)
        let isRare: boolean = Math.random() > 0.8 ? true : false;
        let randomIndex: number;
        let randomPrefab: cc.Prefab;
        if (isRare) {
            randomIndex = this.randomRangeInt(0, this.rarebackgroundPrefabs.length);
            randomPrefab = this.rarebackgroundPrefabs[randomIndex];
        } else {
            randomIndex = this.randomRangeInt(0, this.backgroundPrefabs.length);
            randomPrefab = this.backgroundPrefabs[randomIndex];
        }
        const randomNode = cc.instantiate(randomPrefab);
        randomNode.scaleX = Math.random() > 0.5 ? 1 : -1;
        return randomNode;
    }

    private randomRangeInt(min: number, max: number): number {
        // max exclusive
        return Math.floor(Math.random() * (max - min)) + min;
    }
}
