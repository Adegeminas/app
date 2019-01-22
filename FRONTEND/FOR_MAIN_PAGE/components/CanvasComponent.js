import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions';

class CanvasComponent extends React.Component {
  constructor(props) {
    super(props);

    this.s = {
      background: {
        // border: '1px solid black',
        width: '100%',
        height: '100%'
      },
      canvas: {
        border: '1px solid red',
        width: '100%',
        height: '100%'
      }
    };
  }

  componentDidMount() {
    const c = document.getElementById('myCanvas');
    const ctx = c.getContext('2d');

    this.c = c;
    this.ctx = ctx;

    this.canvasSize = Math.max(this.c.width, this.c.height);
    this.tileSize = Math.floor(this.canvasSize / this.props.length);
    this.lastLength = this.props.length;

    this.c.onclick = function (e) {
      const x = Math.floor(e.y / this.tileSize);
      const y = Math.floor(e.x / this.tileSize);

      this.props.selectCurrentObject(this.props.ws[x][y].object);
    }.bind(this);

    this.c.oncontextmenu = function (e) {
      e.preventDefault();

      const x = Math.floor(e.y / this.tileSize) + this.props.corner[0];
      const y = Math.floor(e.x / this.tileSize) + this.props.corner[1];

      if (!this.props.obj) return;
      const dx = -this.props.obj.x + x;
      const dy = -this.props.obj.y + y;

      this.props.socket.emit('move', this.props.obj, dx, dy);
    }.bind(this);

    this.fields = new Image(626, 659);
    this.fields.src = './fields.png';

    this.animations = new Image(512, 320);
    this.animations.src = './animations.png';

    this.drawWS();
  }

  // componentDidUpdate() {
  //   this.drawWS();
  // }

  drawWS() {
    requestAnimationFrame(this.drawWS.bind(this));

    console.log('Drawed');

    if (!this.props.ws) return;
    if (this.lastLength !== this.props.length) {
      this.lastLength = this.props.length;
      this.tileSize = Math.floor(this.canvasSize / this.props.length);
      this.lastLength = this.props.length;

      this.c.onclick = function (e) {
        const x = Math.floor(e.y / this.tileSize);
        const y = Math.floor(e.x / this.tileSize);

        this.props.selectCurrentObject(this.props.ws[x][y].object);
      }.bind(this);

      this.c.oncontextmenu = function (e) {
        e.preventDefault();

        const x = Math.floor(e.y / this.tileSize) + this.props.corner[0];
        const y = Math.floor(e.x / this.tileSize) + this.props.corner[1];

        if (!this.props.obj) return;
        const dx = -this.props.obj.x + x;
        const dy = -this.props.obj.y + y;

        this.props.socket.emit('move', this.props.obj, dx, dy);
      }.bind(this);
    }


    this.tileSize = Math.floor(this.canvasSize / this.props.length);

    this.ctx.clearRect(0, 0, this.c.width, this.c.height);

    this.props.ws.forEach((row, iX) => {
      row.forEach((field, iY) => {
        this.ctx.drawImage(this.fields,
          field.type ? 8 * 33 + 1 : 0 * 33 + 1,
          field.type ? 5 * 33 + 1 : 14 * 33 + 1,
          30.5, 30.5, this.tileSize * iY, this.tileSize * iX, this.tileSize, this.tileSize);
      });
    });
    this.props.ws.forEach((row, iX) => {
      row.forEach((field, iY) => {
        if (field.object) {
          const s = field.object;

          if (s.state === 'standing') {
            const frameNum = (new Date()).getSeconds() % 7;

            this.ctx.drawImage(this.animations, 64 * frameNum, 0, 64, 64,
              this.tileSize * (iY + s.dir[1] * s.frame / 4),
              this.tileSize * (iX + s.dir[0] * s.frame / 4),
              this.tileSize, this.tileSize);
          } else {
            const column = s.direction === 'n' ? 0 :
              s.direction === 'ne' ? 1 :
                s.direction === 'e' ? 2 :
                  s.direction === 'se' ? 3 :
                    s.direction === 's' ? 4 :
                      s.direction === 'nw' ? 5 :
                        s.direction === 'w' ? 6 : 7;

            let frame = Math.floor((s.frames - 1) * (Date.now() - this.props.lag - s.movingStartTime) / s.speed);

            if (frame > s.frames - 1) frame = s.frames - 1;

            this.ctx.drawImage(this.animations, 64 * column, 64 * frame, 64, 64,
              this.tileSize * (iY + s.dir[1] * frame / 4),
              this.tileSize * (iX + s.dir[0] * frame / 4),
              this.tileSize, this.tileSize);
          }
        }
      });
    });
  }

  render() {
    this.tileSize = Math.floor(this.canvasSize / this.props.length);

    return (
      <div style = { this.s.background }>
        <canvas id = 'myCanvas' width = '640' height = '640'/>
        <p> Lag = { Date.now() - this.props.ts } ms. ObjName: { this.props.obj && this.props.obj.name } </p>
        <p> WASD for scrolling location, QE for +/- </p>
        <p> Mouse Left for selecting, Mouse Right for moving </p>
      </div>
    );
  }
}

export default connect(
  state => {
    return {
      ws: JSON.parse(state.appState.worldState),
      ts: state.appState.timeStamp,
      lag: state.appState.serverLag,
      obj: state.appState.currentObj,
      length: state.appState.mapLength,
      corner: state.appState.mapCorner,
      MAX_RANGE: state.appState.MAX_RANGE
    };
  },
  dispatch => bindActionCreators(Actions, dispatch)
)(CanvasComponent);
