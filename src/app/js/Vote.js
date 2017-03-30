import React, { Component } from 'react';
import {
  Grid,
  Row,
  Col,
  Button
} from  'react-bootstrap';

class NumberList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ticket: null,
      desc: null,
      voted: null,
      points: null
    };
  }

  _clear() {
    this.setState({
      ticket: null,
      desc: null,
      voted: null,
      points: null
    });
  }

  _votePoints(number) {
    this.setState({
      voted: true,
      points: number
    });
  }

  _voteTicket(ticket) {
    this.setState({
      ticket: ticket.ticket,
      desc: ticket.desc
    });
  }

  render() {
    const state = this.state;
    const numbers = [
      {
        "ticket": "SRE-112",
        "desc": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus at est et erat varius convallis. Mauris eget tempor sapien. Quisque vel sapien sed lectus imperdiet egestas nec placerat dolor. Nam dapibus ligula ac placerat sollicitudin. Sed accumsan sollicitudin nisl, quis gravida ante facilisis eget. Nullam quis fermentum ante. Morbi auctor venenatis sem eget venenatis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; In ac molestie nulla. Vestibulum rhoncus interdum egestas. Duis semper, dolor sit amet aliquam viverra, orci justo rhoncus lacus, sed vehicula sem magna quis neque. Integer fringilla fringilla mollis. Fusce interdum libero dolor, ut porta nisi dignissim ut. Etiam tempus dolor eu velit sodales tristique. Mauris faucibus accumsan augue et fermentum. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        "title": "Fix the cider fridge"
      }, {
        "ticket": "SRE-156",
        "desc": "Duis a tellus at justo aliquam tristique. Proin ullamcorper dignissim sodales. Etiam pellentesque, purus at tristique convallis, sapien ipsum vestibulum tellus, a rutrum elit elit vel orci. In id euismod nisl, in dignissim orci. Nulla feugiat leo at lectus tincidunt, eu tincidunt odio congue. Sed ornare lobortis turpis, vitae tristique tellus dapibus luctus. Duis non ante rhoncus, mattis nisi bibendum, molestie eros. Vivamus sit amet gravida massa. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae;",
        "title": "Erik needs more beer"
      }, {
        "ticket": "SRE-114",
        "desc": "Curabitur tempus lobortis ligula quis fringilla. Duis pretium enim vel dui blandit molestie. Nullam efficitur faucibus lacus sit amet imperdiet. Vestibulum at felis volutpat, dictum dolor a, placerat turpis. Proin gravida urna et accumsan tristique. Nulla lorem velit, ornare quis volutpat pulvinar, varius ut risus. Aliquam in ex consectetur, commodo nisi vel, eleifend urna. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Fusce ut suscipit eros. Morbi egestas porttitor tortor, at molestie sem placerat nec. Vivamus tincidunt eleifend leo vel aliquet. Praesent quis ullamcorper diam, sed semper nibh. Quisque suscipit, enim at sagittis egestas, est urna venenatis eros, eget pulvinar augue ex sed quam. Pellentesque pulvinar tempor elit, ut consectetur est iaculis nec. Aliquam auctor rhoncus quam, sit amet tristique arcu gravida sit amet. Etiam ut ullamcorper magna, vel egestas ipsum.",
        "title": "Fridge is out of beer"
      }
    ];

    if(state.ticket === null && state.voted === null) {
      const listItems = numbers.map((number) => {
        return (
          <li key={number.ticket.toString()} style={{ padding: 5 }}>
            <Button bsStyle="info"
                    bsSize="large"
                    onClick={(e) => {
                      this._voteTicket(number)
                    }}>
              { number.ticket + " : " + number.title }
            </Button>
          </li>
        );
      });

      return (
        <ul style={{ listStyle: 'none' }}>
          {listItems}
        </ul>
      );
    } else if(state.ticket !== null && state.desc !== null && state.points === null) {
      const fib = [1, 2, 3, 5, 8, 13, 21];
      const listItems = fib.map((number) => {
        return (
          <Button key={ number }
                  bsStyle="info"
                  bsSize="large"
                  style={{ margin: 10 }}
                  onClick={(e) => {
                    this._votePoints(number)
                  }}>
            { number }
          </Button>
        );
      });

      return (
        <div>
          <h1>{this.state.ticket}</h1>
          <h2>{this.state.title}</h2>
          <p>{this.state.desc}</p>

          {listItems}

        </div>
      );
    } else if(state.voted === true) {
      return (
        <div>
          <h1>{this.state.ticket}</h1>
          <h2>{this.state.title}</h2>
          <p>{this.state.desc}</p>
          <h1>You voted {state.points}</h1>
          <h2>Waiting for everyone ...</h2>

          <Button bsStyle="info"
                  bsSize="large"
                  style={{ margin: 10 }}
                  onClick={(e) => {
                    this._clear()
                  }}>
            Go back
          </Button>
        </div>
      );
    }
  }
}

class Vote extends Component {
  render() {
    return (
      <div>
        <Grid>
          <Row className="show-grid">
            <Col xsOffset={3} xs={6} mdOffset={3} md={6}>
              <NumberList />
            </Col>
          </Row>
          <br/>
        </Grid>
      </div>
    );
  }
}

export default Vote;
