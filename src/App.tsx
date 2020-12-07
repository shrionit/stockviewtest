import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import { Container, Content, Header, Nav, Navbar, Icon, Button, IconButton, Avatar, Dropdown, Modal } from 'rsuite';
import { createBrowserHistory } from 'history';
import firebase, { signInWithGoogle, auth } from './firebase';
import AppFooter from './components/Footer';
import Home from './components/Home';
import Watchlist from './components/Watchlist';
import { Component } from 'react';
import api from './api';
import { Text } from 'grommet';
import { Sign } from 'grommet-icons';

const contentStyle = {
  minHeight: '100%',
  marginTop: '40px',
  overflow: 'auto',
}

const containerStyle = {
  minHeight: '90vh',
}

const SignInModal = ({ close, show, login }) => {
  return (
    <Modal size="xs" show={show} onHide={close}>
      <Modal.Header>
        <Modal.Title>One More Step</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        You need to be logged in to use watchlist<br />
        To Continue with google <br /><IconButton className="signinBtn" onClick={() => { close(); login(); }} icon={<Icon icon="google" />} color="blue" placement="left">Sign In</IconButton>
        <Button onClick={close} appearance="subtle">
          Cancel
            </Button>
      </Modal.Body>
    </Modal>
  );
}

const CustomNav = ({ active, onSelect, logoutHandler, user, open, ...props }) => {
  return (
    <>
      <Navbar>
        <Navbar.Body>
          <Nav {...props} activeKey={active} onSelect={onSelect}>
            <Link to="/"><Nav.Item eventKey="home" icon={<Icon icon="home" />}>Home</Nav.Item></Link>
            {
              !user
                ? <Nav.Item eventKey="watchlist" onClick={open}>Watchlist</Nav.Item>
                : <Link to="/watchlist"><Nav.Item eventKey="watchlist">Watchlist</Nav.Item></Link>
            }
          </Nav>
          <Nav pullRight>
            {
              user ?
                <Dropdown renderTitle={() => {
                  return (
                    <Button appearance="link" className="avatar">
                      <Avatar src={user.photoURL} alt="udp" />
                    </Button>
                  );
                }}>
                  <Dropdown.Item onSelect={logoutHandler}>Logout</Dropdown.Item>
                </Dropdown>
                :
                <IconButton className="signinBtn" onClick={signInWithGoogle} icon={<Icon icon="google" />} color="blue" placement="left">Sign In</IconButton>
            }
          </Nav>
        </Navbar.Body>
      </Navbar>
    </>
  );
};

class App extends Component<any, any>{
  constructor(props: any) {
    super(props);
    this.state = {
      activeKey: "1",
      currentUser: null,
      showModal: false,
    };
    this.handleSelect = this.handleSelect.bind(this);
    this.onLogout = this.onLogout.bind(this);
    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
  }

  close() {
    this.setState({
      showModal: false
    });
  }
  open(size) {
    this.setState({
      size,
      showModal: true
    });
  }

  unsubscribeFromAuth: any = null;

  handleSelect(eventKey: any) {
    this.setState({
      activeKey: eventKey
    });
  }

  componentDidMount() {
    this.unsubscribeFromAuth = auth.onAuthStateChanged((user: any) => {
      if (user) {
        this.setState({ currentUser: user });
      } else {
        console.log("No User");
      }
    }, err => console.log(err));
  }

  onLogout() {
    firebase.auth().signOut().then(() => this.setState({ currentUser: null })).catch(e => console.log(e));
  }

  componentWillUnmount() {
    this.unsubscribeFromAuth();
  }

  render() {
    const history = createBrowserHistory();
    return (
      <Container className="App">
        <Router history={history}>
          <Header>
            <CustomNav open={this.open} logoutHandler={this.onLogout} onSelect={this.handleSelect} user={this.state.currentUser} active={this.state.activeKey} />
          </Header>
          <Container style={containerStyle}>
            <Content style={contentStyle}>
              <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/watchlist" component={Watchlist} />
              </Switch>
              <SignInModal show={this.state.showModal} close={this.close} login={signInWithGoogle} />
            </Content>
          </Container>
          <AppFooter />
        </Router>
      </Container>
    );
  }
}

export default App;
