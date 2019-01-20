import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions';

function getFrame(obj) {
  if (obj.state === 'standing') {
    return 'url(/imgs/ork/standing/standing' +
      ((new Date()).getSeconds() + obj.id) % 8 +
      '.png)';
  }
  return 'url(/imgs/ork/moving/' + obj.direction + '/' + obj.frame + '.png)';
}

class MainComponent extends React.Component {
  constructor(props) {
    super(props);

    this.width = window.innerWidth - 100;
    this.height = window.innerHeight - 100;
    this.fieldLength = Math.min(this.height / this.props.length, this.width / this.props.length);

    this.s = {
      background: {
        display: 'flex',
        'flex-direction': 'row'
      },
      field: {
        height: this.fieldLength + 'px',
        width: this.fieldLength + 'px'
      }
    };

    window.onresize = function () {
      this.width = window.innerWidth - 100;
      this.height = window.innerHeight - 100;
    }.bind(this);
  }

  render() {
    this.props.socket.emit('update', this.props.length, this.props.length, this.props.corner);

    this.fieldLength = Math.min(this.height / this.props.length, this.width / this.props.length);
    this.s.field = {
      height: this.fieldLength + 'px',
      width: this.fieldLength + 'px'
    };

    return !this.props.ws ?
      (<div style = { this.s.background }>
        null
      </div>) :
      (<div style = { this.s.background }>
        <table>
          { this.props.ws.map(row => (
            <tr>
              { row.map((field) => (
                <td
                  style = { Object.assign({}, this.s.field, {
                    'backgroundImage': (field.object && field.object.id ?
                      getFrame(field.object) + ', url(/' +  field.type + '.png)' :
                      'url(/' +  field.type + '.png)')
                  }) }
                  onClick = { function () {
                    this.props.selectCurrentObject(field.object);
                  }.bind(this) }
                  onContextMenu = { function (e) {
                    e.preventDefault();

                    if (!this.props.obj) return;
                    const dx = -this.props.obj.x + field.x;
                    const dy = -this.props.obj.y + field.y;

                    this.props.socket.emit('move', this.props.obj, dx, dy);
                  }.bind(this) }
                />
              ))}
            </tr>
          ))}
        </table>

        <p> WASD for scrolling location, QE for +/- </p>
        <p> Mouse Left for selecting, Mouse Right for moving </p>
      </div>)
    ;
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
)(MainComponent);
