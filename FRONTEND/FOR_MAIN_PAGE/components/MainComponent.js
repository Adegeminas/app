import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions';

class MainComponent extends React.Component {
  constructor(props) {
    super(props);

    const { socket } = props;

    socket
      .on('connect', function () {
        // ...
      })
      .on('worldUpdate', function (worldState) {
        this.props.updateWorldState(worldState);
      }.bind(this));
  }
  render() {
    return !this.props.ws ?
      (<div style = { s.background }>
        null
      </div>) :
      (<div style = { s.background }>
        <b> { this.props.obj ? this.props.obj.id : 'null' } </b>
        <br />

        <table>
          { this.props.ws.map(row => (
            <tr>
              { row.map(field => (
                <td
                  style = { s.field }
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
                >
                  { field.object && field.object.id }
                </td>
              ))}
            </tr>
          ))}
        </table>
      </div>)
    ;
  }
}

export default connect(
  (state) => {
    return {
      ws: JSON.parse(state.appState.worldState),
      obj: state.appState.currentObj
    };
  },
  (dispatch) => bindActionCreators(Actions, dispatch)
)(MainComponent);

const s = {
  background: {
    display: 'flex',
    'flex-direction': 'column'
  },
  flexbox: {
    display: 'flex',
    flex: 1
  },
  button: {
    background: 'green'
  },
  field: {
    height: '50px',
    width: '50px',
    border: '1px dotted gray'
  }
};
