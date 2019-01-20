import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions';

function debounce(f, ms) {
  let timer = null;

  return function (...args) {
    const onComplete = () => {
      f.apply(this, args);
      timer = null;
    };

    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(onComplete, ms);
  };
}

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

    // setInterval(function () {
    this.props.socket.emit('update', this.props.length, this.props.length, this.props.corner);
    // }.bind(this), 16);
  }

  componentDidMount() {
    const c = document.getElementById('myCanvas');
    const ctx = c.getContext('2d');

    this.c = c;
    this.ctx = ctx;
  }

  drawWS() {
    if (!this.props.ws) return;

    const canvasSize = Math.max(this.c.width, this.c.height);
    const tileSize = Math.floor(canvasSize / this.props.length);

    this.c.onclick = function (e) {
      const x = Math.floor(e.y / tileSize);
      const y = Math.floor(e.x / tileSize);

      this.props.selectCurrentObject(this.props.ws[x][y].object);
    }.bind(this);

    this.c.oncontextmenu = function (e) {
      e.preventDefault();

      const x = Math.floor(e.y / tileSize) + this.props.corner[0];
      const y = Math.floor(e.x / tileSize) + this.props.corner[1];

      if (!this.props.obj) return;
      const dx = -this.props.obj.x + x;
      const dy = -this.props.obj.y + y;

      this.props.socket.emit('move', this.props.obj, dx, dy);
    }.bind(this);

    const fields = new Image(626, 659);
    const animations = new Image(512, 320);

    fields.src = './fields.png';
    animations.src = './animations.png';

    animations.onload = function () {
      this.ctx.clearRect(0, 0, this.c.width, this.c.height);
      this.props.ws.forEach((row, iX) => {
        row.forEach((field, iY) => {
          this.ctx.drawImage(fields,
            field.type ? 8 * 33 + 1 : 0 * 33 + 1,
            field.type ? 5 * 33 + 1 : 14 * 33 + 1,
            30.5, 30.5, tileSize * iY, tileSize * iX, tileSize, tileSize);
        });
      });
      this.props.ws.forEach((row, iX) => {
        row.forEach((field, iY) => {
          if (field.object) {
            const s = field.object;

            if (s.state === 'standing') {
              const frameNum = (new Date()).getSeconds() % 7;

              this.ctx.drawImage(animations, 64 * frameNum, 0, 64, 64,
                tileSize * (iY + s.dir[1] * s.frame / 4),
                tileSize * (iX + s.dir[0] * s.frame / 4),
                tileSize, tileSize);
            } else {
              const column = s.direction === 'n' ? 0 :
                s.direction === 'ne' ? 1 :
                  s.direction === 'e' ? 2 :
                    s.direction === 'se' ? 3 :
                      s.direction === 's' ? 4 :
                        s.direction === 'nw' ? 5 :
                          s.direction === 'w' ? 6 : 7;

              this.ctx.drawImage(animations, 64 * column, 64 * s.frame, 64, 64,
                tileSize * (iY + s.dir[1] * s.frame / 4),
                tileSize * (iX + s.dir[0] * s.frame / 4),
                tileSize, tileSize);
            }
          }
        });
      });

      // setTimeout(function () {
      this.props.socket.emit('update', this.props.length, this.props.length, this.props.corner);
      // }.bind(this), 33);
    }.bind(this);
  }

  render() {
    this.drawWS();

    return (
      <div style = { this.s.background }>
        <canvas id = 'myCanvas' width = '640' height = '640'/>
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
      obj: state.appState.currentObj,
      length: state.appState.mapLength,
      corner: state.appState.mapCorner,
      MAX_RANGE: state.appState.MAX_RANGE
    };
  },
  dispatch => bindActionCreators(Actions, dispatch)
)(CanvasComponent);
